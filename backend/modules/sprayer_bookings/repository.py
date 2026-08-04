from typing import Optional, Dict, Any, List
from shared.booking_core.repository import BaseBookingRepository, BaseTimelineRepository
import pymongo

class SprayerBookingRepository(BaseBookingRepository):
    def __init__(self):
        super().__init__("sprayer_bookings", prefix="SPB")

    async def setup_indexes(self):
        """Creates indexes for search and atomic locks."""
        await self.collection.create_index("bookingNumber", unique=True)
        await self.collection.create_index("farmerSnapshot.farmerId")
        await self.collection.create_index("operatorSnapshot.operatorId")
        await self.collection.create_index("serviceSnapshot.serviceId")
        await self.collection.create_index("bookingStatus")
        await self.collection.create_index("paymentStatus")
        
        await self.collection.create_index([("bookingDate", pymongo.ASCENDING)])

    async def search_bookings(self, filters: Dict[str, Any], skip: int = 0, limit: int = 20) -> tuple[List[Dict[str, Any]], int]:
        query = {}
        
        if "farmerId" in filters:
            query["farmerSnapshot.farmerId"] = filters["farmerId"]
        if "operatorId" in filters:
            query["operatorSnapshot.operatorId"] = filters["operatorId"]
        if "serviceId" in filters:
            query["serviceSnapshot.serviceId"] = filters["serviceId"]
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
        elif sort_by == "scheduledDate":
            cursor = cursor.sort("bookingDate", 1)
            
        cursor = cursor.skip(skip).limit(limit)
        items = await cursor.to_list(length=limit)
        total = await self.collection.count_documents(query)
        return items, total


class BookingTimelineRepository(BaseTimelineRepository):
    def __init__(self):
        super().__init__("sprayer_booking_timelines")

sprayer_booking_repository = SprayerBookingRepository()
timeline_repository = BookingTimelineRepository()
