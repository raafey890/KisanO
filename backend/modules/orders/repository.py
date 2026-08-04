from typing import Optional, Dict, Any, List
from shared.base_repository import BaseRepository
from datetime import datetime, timezone
from bson import ObjectId

class OrderRepository(BaseRepository):
    def __init__(self):
        super().__init__("orders")

    async def setup_indexes(self):
        """Creates indexes for search and atomic locks."""
        import pymongo
        await self.collection.create_index("orderNumber", unique=True)
        await self.collection.create_index("buyerSnapshot.buyerId")
        await self.collection.create_index("sellerSnapshot.sellerId")
        await self.collection.create_index("orderStatus")
        await self.collection.create_index("paymentStatus")
        await self.collection.create_index("deliveryStatus")
        await self.collection.create_index("trackingNumber")

    async def generate_order_number(self) -> str:
        """Generates a sequential order number e.g. ORD-2026-000001"""
        year = datetime.now(timezone.utc).year
        count = await self.collection.count_documents({
            "createdAt": {
                "$gte": datetime(year, 1, 1, tzinfo=timezone.utc),
                "$lt": datetime(year + 1, 1, 1, tzinfo=timezone.utc)
            }
        })
        sequence = str(count + 1).zfill(6)
        return f"ORD-{year}-{sequence}"

    async def create_order(self, order_data: Dict[str, Any]) -> str:
        order_data["orderNumber"] = await self.generate_order_number()
        order_data["version"] = 1
        order_data["createdAt"] = datetime.now(timezone.utc)
        order_data["updatedAt"] = datetime.now(timezone.utc)
        
        res = await self.create(order_data)
        return str(res["_id"])

    async def update_order_optimistic(self, order_id: str, current_version: int, update_data: Dict[str, Any]) -> bool:
        """Applies update only if version matches to prevent lost updates and race conditions."""
        update_data["updatedAt"] = datetime.now(timezone.utc)
        
        result = await self.collection.update_one(
            {"_id": ObjectId(order_id), "version": current_version},
            {
                "$set": update_data,
                "$inc": {"version": 1}
            }
        )
        return result.modified_count > 0

    async def search_orders(self, filters: Dict[str, Any], skip: int = 0, limit: int = 20) -> tuple[List[Dict[str, Any]], int]:
        query = {}
        
        if "buyerId" in filters:
            query["buyerSnapshot.buyerId"] = filters["buyerId"]
        if "sellerId" in filters:
            query["sellerSnapshot.sellerId"] = filters["sellerId"]
        if "orderStatus" in filters:
            query["orderStatus"] = filters["orderStatus"]
        if "paymentStatus" in filters:
            query["paymentStatus"] = filters["paymentStatus"]
        if "deliveryStatus" in filters:
            query["deliveryStatus"] = filters["deliveryStatus"]
        if "orderNumber" in filters:
            query["orderNumber"] = {"$regex": filters["orderNumber"], "$options": "i"}
            
        cursor = self.collection.find(query)
        
        sort_by = filters.get("sort", "newest")
        if sort_by == "newest":
            cursor = cursor.sort("createdAt", -1)
        elif sort_by == "oldest":
            cursor = cursor.sort("createdAt", 1)
            
        cursor = cursor.skip(skip).limit(limit)
        items = await cursor.to_list(length=limit)
        total = await self.collection.count_documents(query)
        return items, total


class OrderTimelineRepository(BaseRepository):
    def __init__(self):
        super().__init__("order_timelines")

    async def log_event(self, order_id: str, status: str, actor_id: str, actor_role: str, notes: Optional[str] = None):
        data = {
            "orderId": order_id,
            "status": status,
            "actorId": actor_id,
            "actorRole": actor_role,
            "notes": notes,
            "createdAt": datetime.now(timezone.utc)
        }
        await self.create(data)

    async def get_timeline(self, order_id: str) -> List[Dict[str, Any]]:
        cursor = self.collection.find({"orderId": order_id}).sort("createdAt", 1)
        return await cursor.to_list(length=100)


order_repository = OrderRepository()
timeline_repository = OrderTimelineRepository()
