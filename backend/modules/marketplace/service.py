import logging
import uuid
from typing import Dict, Any, List
from datetime import datetime, timezone
from core.exceptions import NotFoundException, AppException, UnauthorizedException

from modules.marketplace.repository import product_repository, inventory_history_repository, price_history_repository
from modules.marketplace.schemas import ProductCreate, ProductUpdate, PricingUpdate, InventoryUpdate
from modules.marketplace.constants import ProductStatus, VALID_PRODUCT_TRANSITIONS
from integrations.media import media_service
from modules.users.repository import user_repository

logger = logging.getLogger(__name__)

class MarketplaceService:

    @staticmethod
    async def create_product(seller_id: str, data: ProductCreate) -> str:
        # 1. Fetch Seller Snapshot from Users Module
        user = await user_repository.get_by_id(seller_id)
        if not user:
            raise UnauthorizedException("Seller profile not found.")
            
        seller_snapshot = {
            "sellerId": str(user["_id"]),
            "sellerName": user.get("fullName", "Unknown"),
            "businessName": user.get("profile", {}).get("firstName"), # Fallback or actual business name logic
            "sellerRating": user.get("analytics", {}).get("averageRating", 0.0),
            "verificationStatus": user.get("kyc", {}).get("status", "PENDING"),
            "district": user.get("profile", {}).get("district"),
            "state": user.get("profile", {}).get("state")
        }

        # 2. Build Document
        product_doc = data.model_dump()
        product_doc["sellerSnapshot"] = seller_snapshot
        
        # 3. Save to DB
        product_id = await product_repository.create_product(product_doc)
        
        # 4. Log initial inventory
        if data.inventory.currentStock > 0:
            await inventory_history_repository.log_movement(
                product_id, data.inventory.currentStock, seller_id, "Initial Stock"
            )
            
        logger.info(f"Created new product {product_id} by seller {seller_id}")
        return product_id

    @staticmethod
    async def get_product(product_id: str) -> Dict[str, Any]:
        product = await product_repository.get_by_id(product_id)
        if not product or product.get("isDeleted"):
            raise NotFoundException("Product not found")
        product["id"] = str(product["_id"])
        return product

    @staticmethod
    async def update_product(product_id: str, seller_id: str, current_version: int, data: ProductUpdate) -> Dict[str, Any]:
        product = await MarketplaceService.get_product(product_id)
        if product["sellerSnapshot"]["sellerId"] != seller_id:
            raise UnauthorizedException("You do not own this product.")
            
        update_doc = data.model_dump(exclude_unset=True)
        success = await product_repository.update_product_optimistic(product_id, current_version, update_doc)
        if not success:
            raise AppException("Update failed due to version conflict.", status_code=409)
            
        return await MarketplaceService.get_product(product_id)

    @staticmethod
    async def change_status(product_id: str, user_id: str, user_role: str, new_status: ProductStatus, current_version: int) -> None:
        product = await MarketplaceService.get_product(product_id)
        current_status = ProductStatus(product["status"])
        
        is_admin = user_role in ["Admin", "SuperAdmin"]
        if not is_admin and product["sellerSnapshot"]["sellerId"] != user_id:
            raise UnauthorizedException("Not authorized to change status.")
            
        # Validate FSM Transition
        if new_status not in VALID_PRODUCT_TRANSITIONS.get(current_status, []):
            if not is_admin: 
                raise AppException(f"Invalid transition from {current_status} to {new_status}", status_code=400)
            logger.warning(f"Admin override FSM: {current_status} -> {new_status} on {product_id}")

        update_doc = {"status": new_status.value}
        success = await product_repository.update_product_optimistic(product_id, current_version, update_doc)
        if not success:
            raise AppException("Status change failed due to version conflict.", status_code=409)

    @staticmethod
    async def update_pricing(product_id: str, seller_id: str, current_version: int, data: PricingUpdate) -> None:
        product = await MarketplaceService.get_product(product_id)
        if product["sellerSnapshot"]["sellerId"] != seller_id:
            raise UnauthorizedException("You do not own this product.")
            
        new_pricing = data.pricing.model_dump()
        
        # Calculate derived discount
        if new_pricing["mrp"] > 0:
            diff = new_pricing["mrp"] - new_pricing["sellingPrice"]
            new_pricing["discountPercentage"] = (diff / new_pricing["mrp"]) * 100
        else:
            new_pricing["discountPercentage"] = 0.0
            
        success = await product_repository.update_product_optimistic(product_id, current_version, {"pricing": new_pricing})
        if not success:
            raise AppException("Update failed due to version conflict.", status_code=409)
            
        await price_history_repository.log_price_change(
            product_id, product["pricing"], new_pricing, seller_id, data.reason
        )

    @staticmethod
    async def update_inventory(product_id: str, seller_id: str, current_version: int, data: InventoryUpdate) -> None:
        product = await MarketplaceService.get_product(product_id)
        if product["sellerSnapshot"]["sellerId"] != seller_id:
            raise UnauthorizedException("You do not own this product.")
            
        success = await product_repository.update_inventory(product_id, current_version, data.quantityAdded)
        if not success:
            raise AppException("Inventory update failed due to version conflict.", status_code=409)
            
        # If stock hits 0, auto-transition to OUT_OF_STOCK
        new_stock = product["inventory"]["currentStock"] + data.quantityAdded
        if new_stock <= 0:
            # We don't fail if optimistic lock fails on this secondary update, just let it be.
            # But normally we'd chain them or use a transaction.
            await product_repository.update_product_optimistic(product_id, current_version + 1, {"status": "OUT_OF_STOCK"})
            
        await inventory_history_repository.log_movement(
            product_id, data.quantityAdded, seller_id, data.notes
        )

    # --- Media Management ---
    
    @staticmethod
    async def upload_image(product_id: str, seller_id: str, file_bytes: bytes, filename: str, is_cover: bool = False) -> str:
        product = await MarketplaceService.get_product(product_id)
        if product["sellerSnapshot"]["sellerId"] != seller_id:
            raise UnauthorizedException("You do not own this product.")
            
        url = await media_service.upload_image(file_bytes, filename, folder="marketplace")
        
        image_doc = {
            "imageId": str(uuid.uuid4()),
            "cloudinaryUrl": url,
            "thumbnailUrl": url,
            "displayOrder": len(product.get("images", [])),
            "isCover": is_cover,
            "uploadedAt": datetime.now(timezone.utc)
        }
        await product_repository.push_image(product_id, image_doc)
        return url

    # --- Search ---
    
    @staticmethod
    async def search(filters: Dict[str, Any], skip: int, limit: int) -> tuple[List[Dict[str, Any]], int]:
        items, total = await product_repository.search_products(filters, skip, limit)
        for i in items:
            i["id"] = str(i["_id"])
        return items, total
