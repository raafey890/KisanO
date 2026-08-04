from typing import Optional, Dict, Any, List
from shared.base_repository import BaseRepository
from datetime import datetime, timezone
from bson import ObjectId

class EquipmentRepository(BaseRepository):
    def __init__(self):
        super().__init__("equipment")

    async def setup_indexes(self):
        """Creates indexes for search optimization."""
        import pymongo
        await self.collection.create_index([
            ("equipmentName", pymongo.TEXT),
            ("brand", pymongo.TEXT),
            ("model", pymongo.TEXT),
            ("category", pymongo.TEXT)
        ])
        await self.collection.create_index([("location.coordinates", pymongo.GEOSPHERE)])
        await self.collection.create_index("ownerSnapshot.ownerId")
        await self.collection.create_index("status")

    async def create_equipment(self, equipment_data: Dict[str, Any]) -> str:
        # Initialize embedded arrays and fields
        equipment_data.update({
            "status": "DRAFT",
            "images": [],
            "analytics": {
                "views": 0, "bookings": 0, "revenue": 0.0,
                "averageRating": 0.0, "reviewCount": 0, "lastBookingDate": None
            },
            "version": 1,
            "isDeleted": False,
            "createdAt": datetime.now(timezone.utc),
            "updatedAt": datetime.now(timezone.utc)
        })
        res = await self.create(equipment_data)
        return str(res["_id"])

    async def update_equipment_optimistic(self, eq_id: str, current_version: int, update_data: Dict[str, Any]) -> bool:
        """Applies update only if version matches to prevent lost updates."""
        update_data["updatedAt"] = datetime.now(timezone.utc)
        
        result = await self.collection.update_one(
            {"_id": ObjectId(eq_id), "version": current_version, "isDeleted": False},
            {
                "$set": update_data,
                "$inc": {"version": 1}
            }
        )
        return result.modified_count > 0

    async def push_image(self, eq_id: str, image_data: Dict[str, Any]):
        await self.collection.update_one(
            {"_id": ObjectId(eq_id)},
            {
                "$push": {"images": image_data},
                "$inc": {"version": 1},
                "$set": {"updatedAt": datetime.now(timezone.utc)}
            }
        )

    async def pull_image(self, eq_id: str, image_id: str):
        await self.collection.update_one(
            {"_id": ObjectId(eq_id)},
            {
                "$pull": {"images": {"imageId": image_id}},
                "$inc": {"version": 1},
                "$set": {"updatedAt": datetime.now(timezone.utc)}
            }
        )

    async def update_status(self, eq_id: str, new_status: str, current_version: int) -> bool:
        return await self.update_equipment_optimistic(eq_id, current_version, {"status": new_status})

    async def search_equipment(self, filters: Dict[str, Any], skip: int = 0, limit: int = 20) -> tuple[List[Dict[str, Any]], int]:
        query = {"isDeleted": False}
        
        if "text" in filters:
            query["$text"] = {"$search": filters["text"]}
        if "category" in filters:
            query["category"] = filters["category"]
        if "status" in filters:
            query["status"] = filters["status"]
        if "ownerId" in filters:
            query["ownerSnapshot.ownerId"] = filters["ownerId"]
            
        cursor = self.collection.find(query)
        
        # Sorting
        sort_by = filters.get("sort", "newest")
        if sort_by == "newest":
            cursor = cursor.sort("createdAt", -1)
        elif sort_by == "price_low":
            cursor = cursor.sort("pricing.dailyRate", 1)
        elif sort_by == "price_high":
            cursor = cursor.sort("pricing.dailyRate", -1)
        elif sort_by == "rating":
            cursor = cursor.sort("analytics.averageRating", -1)
            
        cursor = cursor.skip(skip).limit(limit)
        items = await cursor.to_list(length=limit)
        total = await self.collection.count_documents(query)
        return items, total


class AvailabilityRepository(BaseRepository):
    def __init__(self):
        super().__init__("equipment_availability")

    async def check_overlap(self, eq_id: str, start: datetime, end: datetime) -> bool:
        """Returns True if there is an overlapping availability block."""
        count = await self.collection.count_documents({
            "equipmentId": eq_id,
            "status": "ACTIVE",
            "$or": [
                {"startTime": {"$lt": end}, "endTime": {"$gt": start}}
            ]
        })
        return count > 0

    async def get_upcoming_blocks(self, eq_id: str) -> List[Dict[str, Any]]:
        cursor = self.collection.find({
            "equipmentId": eq_id,
            "status": "ACTIVE",
            "endTime": {"$gt": datetime.now(timezone.utc)}
        }).sort("startTime", 1)
        return await cursor.to_list(length=100)


class MaintenanceRepository(BaseRepository):
    def __init__(self):
        super().__init__("equipment_maintenance")

    async def get_history(self, eq_id: str) -> List[Dict[str, Any]]:
        cursor = self.collection.find({"equipmentId": eq_id}).sort("serviceDate", -1)
        return await cursor.to_list(length=50)

equipment_repository = EquipmentRepository()
availability_repository = AvailabilityRepository()
maintenance_repository = MaintenanceRepository()
