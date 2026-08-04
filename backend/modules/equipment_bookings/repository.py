from typing import Optional, Dict, Any, List
from shared.booking_core.repository import BaseBookingRepository, BaseTimelineRepository
import pymongo
from datetime import datetime

class EquipmentBookingRepository(BaseBookingRepository):
    def __init__(self):
        super().__init__("equipment_bookings", prefix="EQB")

    async def setup_indexes(self):
        """Creates indexes for search and atomic locks."""
        await self.collection.create_index("bookingNumber", unique=True)
        await self.collection.create_index("farmerSnapshot.farmerId")
        await self.collection.create_index("ownerSnapshot.ownerId")
        await self.collection.create_index("equipmentSnapshot.equipmentId")
        await self.collection.create_index("bookingStatus")
        await self.collection.create_index("paymentStatus")
        
        # Index for chronological queries and overlap prevention
        await self.collection.create_index([("startDate", pymongo.ASCENDING), ("endDate", pymongo.ASCENDING)])

    async def check_overlap(self, equipment_id: str, start: datetime, end: datetime) -> bool:
        """Checks if the equipment is already booked for the given time slot."""
        count = await self.collection.count_documents({
            "equipmentSnapshot.equipmentId": equipment_id,
            "bookingStatus": {"$in": ["ACCEPTED", "CONFIRMED", "IN_PROGRESS"]},
            "$or": [
                {"startDate": {"$lt": end, "$gte": start}},
                {"endDate": {"$gt": start, "$lte": end}},
                {"startDate": {"$lte": start}, "endDate": {"$gte": end}}
            ]
        })
        return count > 0

    async def search_bookings(self, filters: Dict[str, Any], skip: int = 0, limit: int = 20) -> tuple[List[Dict[str, Any]], int]:
        query = {}
        
        if "farmerId" in filters:
            query["farmerSnapshot.farmerId"] = filters["farmerId"]
        if "ownerId" in filters:
            query["ownerSnapshot.ownerId"] = filters["ownerId"]
        if "equipmentId" in filters:
            query["equipmentSnapshot.equipmentId"] = filters["equipmentId"]
        if "status" in filters:
            query["bookingStatus"] = filters["status"]
        if "paymentStatus" in filters:
            query["paymentStatus"] = filters["paymentStatus"]
        if "bookingNumber" in filters:
            query["bookingNumber"] = {"$regex": filters["bookingNumber"], "$options": "i"}
            
        cursor = self.collection.find(query)
        
        sort_by = filters.get("sort", "newest")
        if sort_by == "newest":
            cursor = cursor.sort("createdAt", -1)
        elif sort_by == "oldest":
            cursor = cursor.sort("createdAt", 1)
        elif sort_by == "startDate":
            cursor = cursor.sort("startDate", 1)
            
        cursor = cursor.skip(skip).limit(limit)
        items = await cursor.to_list(length=limit)
        total = await self.collection.count_documents(query)
        return items, total

class TimelineRepository(BaseTimelineRepository):
    def __init__(self):
        super().__init__("equipment_booking_timelines")


equipment_booking_repository = EquipmentBookingRepository()
timeline_repository = TimelineRepository()
