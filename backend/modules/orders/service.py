import logging
from typing import Dict, Any, List
from datetime import datetime, timezone
from core.exceptions import NotFoundException, AppException, UnauthorizedException

from modules.orders.repository import order_repository, timeline_repository
from modules.orders.schemas import OrderCreate
from modules.orders.constants import OrderStatus, DeliveryStatus, PaymentStatus, VALID_ORDER_TRANSITIONS

# External Module Dependencies
from modules.marketplace.repository import product_repository, inventory_history_repository
from modules.users.repository import user_repository

logger = logging.getLogger(__name__)

class OrderService:

    @staticmethod
    async def create_order(buyer_id: str, data: OrderCreate) -> str:
        # 1. Fetch Buyer
        buyer = await user_repository.get_by_id(buyer_id)
        if not buyer:
            raise UnauthorizedException("Buyer profile not found.")
            
        buyer_snapshot = {
            "buyerId": str(buyer["_id"]),
            "buyerName": buyer.get("fullName", "Unknown"),
            "buyerPhone": buyer.get("phone", "")
        }

        # We will assume a single seller for the MVP (Single Cart Order)
        # 2. Process Items & Verify Stock
        order_items = []
        subtotal = 0.0
        seller_snapshot = None
        
        for item in data.items:
            product = await product_repository.get_by_id(item.productId)
            if not product or product.get("isDeleted"):
                raise NotFoundException(f"Product {item.productId} not found.")
                
            if product["status"] not in ["APPROVED"]:
                raise AppException(f"Product {product['productName']} is not available for purchase.", 400)
                
            if product["inventory"]["currentStock"] < item.quantity:
                raise AppException(f"Insufficient stock for {product['productName']}. Available: {product['inventory']['currentStock']}", 400)
                
            # Extract First Seller (assuming single seller for MVP)
            if not seller_snapshot:
                seller_snapshot = product["sellerSnapshot"]
            elif seller_snapshot["sellerId"] != product["sellerSnapshot"]["sellerId"]:
                raise AppException("Multi-seller orders must be split at checkout.", 400)
                
            # Prevent seller from buying their own product
            if seller_snapshot["sellerId"] == buyer_id:
                raise AppException("You cannot purchase your own product.", 400)

            # Deduct Stock (Atomic, Optimistic)
            success = await product_repository.update_inventory(item.productId, product["version"], -item.quantity)
            if not success:
                raise AppException(f"Stock update failed for {product['productName']}. Please try again.", 409)
                 
            await inventory_history_repository.log_movement(
                item.productId, -item.quantity, buyer_id, "Order Placed"
            )

            # Snapshots
            product_snap = {
                "productId": str(product["_id"]),
                "sku": product["sku"],
                "productName": product["productName"],
                "brand": product["brand"],
                "category": product["category"],
                "weight": product["weight"],
                "unit": product["unit"],
                "coverImageUrl": next((img["cloudinaryUrl"] for img in product.get("images", []) if img.get("isCover")), None)
            }
            
            pricing_snap = {
                "mrp": product["pricing"]["mrp"],
                "sellingPrice": product["pricing"]["sellingPrice"],
                "discountPercentage": product["pricing"]["discountPercentage"]
            }
            
            line_total = pricing_snap["sellingPrice"] * item.quantity
            subtotal += line_total
            
            order_items.append({
                "productSnapshot": product_snap,
                "pricingSnapshot": pricing_snap,
                "quantity": item.quantity,
                "lineTotal": line_total,
                "lineTax": line_total * 0.18 # Mock 18% Tax
            })

        # 3. Calculate Totals
        tax = subtotal * 0.18
        delivery = 50.0 # Mock flat fee
        final_amount = subtotal + tax + delivery

        # 4. Create Order Document
        order_doc = {
            "buyerSnapshot": buyer_snapshot,
            "sellerSnapshot": seller_snapshot,
            "shippingAddress": data.shippingAddress.model_dump(),
            "billingAddress": data.billingAddress.model_dump(),
            "items": order_items,
            
            "subtotal": subtotal,
            "discount": 0.0,
            "couponCode": data.couponCode,
            "tax": tax,
            "deliveryCharges": delivery,
            "finalAmount": final_amount,
            
            "paymentStatus": PaymentStatus.PENDING.value,
            "orderStatus": OrderStatus.CREATED.value,
            "deliveryStatus": DeliveryStatus.PENDING.value,
            
            "notes": data.notes
        }
        
        order_id = await order_repository.create_order(order_doc)
        
        # 5. Log Timeline
        await timeline_repository.log_event(
            order_id, OrderStatus.CREATED.value, buyer_id, "FARMER", "Order created"
        )

        return order_id

    @staticmethod
    async def get_order(order_id: str, user_id: str, user_role: str) -> Dict[str, Any]:
        order = await order_repository.get_by_id(order_id)
        if not order:
            raise NotFoundException("Order not found")
            
        is_admin = user_role in ["Admin", "SuperAdmin"]
        is_seller = order["sellerSnapshot"]["sellerId"] == user_id
        is_buyer = order["buyerSnapshot"]["buyerId"] == user_id
        
        if not (is_admin or is_seller or is_buyer):
            raise UnauthorizedException("You do not have permission to view this order.")
            
        order["id"] = str(order["_id"])
        return order

    @staticmethod
    async def change_status(order_id: str, user_id: str, user_role: str, new_status: OrderStatus, current_version: int, notes: str = None) -> None:
        order = await OrderService.get_order(order_id, user_id, user_role)
        current_status = OrderStatus(order["orderStatus"])
        
        is_admin = user_role in ["Admin", "SuperAdmin"]
        
        # Validate FSM Transition
        if new_status not in VALID_ORDER_TRANSITIONS.get(current_status, []):
            if not is_admin:
                raise AppException(f"Invalid transition from {current_status} to {new_status}", status_code=400)
            logger.warning(f"Admin override FSM: {current_status} -> {new_status} on {order_id}")
            
        update_data = {"orderStatus": new_status.value}
        
        # Delivery Status Mappings
        if new_status == OrderStatus.PACKED:
            update_data["deliveryStatus"] = DeliveryStatus.PENDING.value
        elif new_status == OrderStatus.SHIPPED:
            update_data["deliveryStatus"] = DeliveryStatus.DISPATCHED.value
        elif new_status == OrderStatus.OUT_FOR_DELIVERY:
            update_data["deliveryStatus"] = DeliveryStatus.IN_TRANSIT.value
        elif new_status == OrderStatus.DELIVERED:
            update_data["deliveryStatus"] = DeliveryStatus.DELIVERED.value
        elif new_status == OrderStatus.RETURNED:
            update_data["deliveryStatus"] = DeliveryStatus.RETURNED_TO_SENDER.value
             
        # Perform Optimistic Update
        success = await order_repository.update_order_optimistic(order_id, current_version, update_data)
        if not success:
            raise AppException("Status change failed due to version conflict.", status_code=409)
            
        # If rejected or cancelled, restore inventory
        if new_status in [OrderStatus.REJECTED, OrderStatus.CANCELLED]:
            for item in order["items"]:
                # Fetch product again to get current version
                product = await product_repository.get_by_id(item["productSnapshot"]["productId"])
                if product:
                    await product_repository.update_inventory(
                        item["productSnapshot"]["productId"], 
                        product["version"], 
                        item["quantity"]
                    )
                    await inventory_history_repository.log_movement(
                        item["productSnapshot"]["productId"], item["quantity"], user_id, f"Order {new_status.value}"
                    )
            
        # Log Timeline
        is_seller = order["sellerSnapshot"]["sellerId"] == user_id
        actor_type = "ADMIN" if is_admin else ("SELLER" if is_seller else "FARMER")
        await timeline_repository.log_event(order_id, new_status.value, user_id, actor_type, notes)

    @staticmethod
    async def search(filters: Dict[str, Any], skip: int, limit: int) -> tuple[List[Dict[str, Any]], int]:
        items, total = await order_repository.search_orders(filters, skip, limit)
        for i in items:
            i["id"] = str(i["_id"])
        return items, total
