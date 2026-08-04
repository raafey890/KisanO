from typing import Optional, Dict, Any, List
from shared.base_repository import BaseRepository
from datetime import datetime, timezone
from bson import ObjectId

class ProductRepository(BaseRepository):
    def __init__(self):
        super().__init__("marketplace_products")

    async def setup_indexes(self):
        """Creates indexes for search and uniqueness."""
        import pymongo
        await self.collection.create_index("sku", unique=True)
        await self.collection.create_index([
            ("productName", pymongo.TEXT),
            ("brand", pymongo.TEXT),
            ("category", pymongo.TEXT)
        ])
        await self.collection.create_index("sellerSnapshot.sellerId")
        await self.collection.create_index("status")
        await self.collection.create_index("inventory.currentStock")

    async def generate_sku(self, category: str, brand: str) -> str:
        """Generates a unique SKU e.g. SD-TATA-000001"""
        cat_prefix = category[:2].upper()
        brand_prefix = brand[:4].upper().replace(" ", "")
        
        count = await self.collection.count_documents({
            "category": category,
            "brand": brand
        })
        sequence = str(count + 1).zfill(6)
        return f"{cat_prefix}-{brand_prefix}-{sequence}"

    async def create_product(self, product_data: Dict[str, Any]) -> str:
        product_data["sku"] = await self.generate_sku(product_data["category"], product_data["brand"])
        product_data["status"] = "DRAFT"
        product_data["images"] = []
        product_data["analytics"] = {
            "views": 0, "searchCount": 0, "orderCount": 0, 
            "revenue": 0.0, "averageRating": 0.0, "reviewCount": 0
        }
        product_data["version"] = 1
        product_data["isDeleted"] = False
        product_data["createdAt"] = datetime.now(timezone.utc)
        product_data["updatedAt"] = datetime.now(timezone.utc)
        
        # Calculate derived discount
        if product_data["pricing"]["mrp"] > 0:
            diff = product_data["pricing"]["mrp"] - product_data["pricing"]["sellingPrice"]
            product_data["pricing"]["discountPercentage"] = (diff / product_data["pricing"]["mrp"]) * 100
        else:
            product_data["pricing"]["discountPercentage"] = 0.0
            
        res = await self.create(product_data)
        return str(res["_id"])

    async def update_product_optimistic(self, product_id: str, current_version: int, update_data: Dict[str, Any]) -> bool:
        """Applies update only if version matches."""
        update_data["updatedAt"] = datetime.now(timezone.utc)
        result = await self.collection.update_one(
            {"_id": ObjectId(product_id), "version": current_version, "isDeleted": False},
            {
                "$set": update_data,
                "$inc": {"version": 1}
            }
        )
        return result.modified_count > 0

    async def update_inventory(self, product_id: str, current_version: int, quantity_added: int) -> bool:
        """Atomically increment inventory."""
        result = await self.collection.update_one(
            {"_id": ObjectId(product_id), "version": current_version, "isDeleted": False},
            {
                "$inc": {
                    "inventory.currentStock": quantity_added,
                    "version": 1
                },
                "$set": {"updatedAt": datetime.now(timezone.utc)}
            }
        )
        return result.modified_count > 0

    async def push_image(self, product_id: str, image_data: Dict[str, Any]):
        await self.collection.update_one(
            {"_id": ObjectId(product_id)},
            {
                "$push": {"images": image_data},
                "$inc": {"version": 1},
                "$set": {"updatedAt": datetime.now(timezone.utc)}
            }
        )

    async def search_products(self, filters: Dict[str, Any], skip: int = 0, limit: int = 20) -> tuple[List[Dict[str, Any]], int]:
        query = {"isDeleted": False}
        
        if "text" in filters:
            query["$text"] = {"$search": filters["text"]}
        if "category" in filters:
            query["category"] = filters["category"]
        if "brand" in filters:
            query["brand"] = filters["brand"]
        if "sellerId" in filters:
            query["sellerSnapshot.sellerId"] = filters["sellerId"]
        if "status" in filters:
            query["status"] = filters["status"]
            
        # Pricing Bounds
        if "minPrice" in filters or "maxPrice" in filters:
            query["pricing.sellingPrice"] = {}
            if "minPrice" in filters: query["pricing.sellingPrice"]["$gte"] = filters["minPrice"]
            if "maxPrice" in filters: query["pricing.sellingPrice"]["$lte"] = filters["maxPrice"]
            
        cursor = self.collection.find(query)
        
        sort_by = filters.get("sort", "newest")
        if sort_by == "newest":
            cursor = cursor.sort("createdAt", -1)
        elif sort_by == "price_low":
            cursor = cursor.sort("pricing.sellingPrice", 1)
        elif sort_by == "price_high":
            cursor = cursor.sort("pricing.sellingPrice", -1)
        elif sort_by == "rating":
            cursor = cursor.sort("analytics.averageRating", -1)
            
        cursor = cursor.skip(skip).limit(limit)
        items = await cursor.to_list(length=limit)
        total = await self.collection.count_documents(query)
        return items, total


class InventoryHistoryRepository(BaseRepository):
    def __init__(self):
        super().__init__("inventory_history")

    async def log_movement(self, product_id: str, quantity_added: int, user_id: str, notes: Optional[str] = None):
        await self.create({
            "productId": product_id,
            "quantityAdded": quantity_added,
            "userId": user_id,
            "notes": notes,
            "createdAt": datetime.now(timezone.utc)
        })

class PriceHistoryRepository(BaseRepository):
    def __init__(self):
        super().__init__("price_history")

    async def log_price_change(self, product_id: str, old_pricing: Dict[str, Any], new_pricing: Dict[str, Any], user_id: str, reason: Optional[str] = None):
        await self.create({
            "productId": product_id,
            "oldPricing": old_pricing,
            "newPricing": new_pricing,
            "userId": user_id,
            "reason": reason,
            "createdAt": datetime.now(timezone.utc)
        })


product_repository = ProductRepository()
inventory_history_repository = InventoryHistoryRepository()
price_history_repository = PriceHistoryRepository()
