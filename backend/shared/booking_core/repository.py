from typing import Optional, Dict, Any, List
from shared.base_repository import BaseRepository
from datetime import datetime, timezone
from bson import ObjectId

class BaseBookingRepository(BaseRepository):
    def __init__(self, collection_name: str, prefix: str):
        super().__init__(collection_name)
        self.prefix = prefix

    async def generate_booking_number(self) -> str:
        """Generates a sequential booking number e.g. PRX-2026-000001"""
        year = datetime.now(timezone.utc).year
        count = await self.collection.count_documents({
            "createdAt": {
                "$gte": datetime(year, 1, 1, tzinfo=timezone.utc),
                "$lt": datetime(year + 1, 1, 1, tzinfo=timezone.utc)
            }
        })
        sequence = str(count + 1).zfill(6)
        return f"{self.prefix}-{year}-{sequence}"

    async def create_booking(self, booking_data: Dict[str, Any]) -> str:
        """Helper to create a booking with automatic number generation and timestamps."""
        booking_data["bookingNumber"] = await self.generate_booking_number()
        booking_data["version"] = 1
        booking_data["isDeleted"] = False
        booking_data["createdAt"] = datetime.now(timezone.utc)
        booking_data["updatedAt"] = datetime.now(timezone.utc)
        
        res = await self.create(booking_data)
        return str(res["_id"])

    async def update_booking_optimistic(self, booking_id: str, current_version: int, update_data: Dict[str, Any]) -> bool:
        """Applies update only if version matches to prevent lost updates and race conditions."""
        update_data["updatedAt"] = datetime.now(timezone.utc)
        
        result = await self.collection.update_one(
            {"_id": ObjectId(booking_id), "version": current_version, "isDeleted": False},
            {
                "$set": update_data,
                "$inc": {"version": 1}
            }
        )
        return result.modified_count > 0

    async def soft_delete(self, booking_id: str) -> bool:
        """Soft deletes a booking."""
        result = await self.collection.update_one(
            {"_id": ObjectId(booking_id)},
            {"$set": {"isDeleted": True, "updatedAt": datetime.now(timezone.utc)}}
        )
        return result.modified_count > 0

class BaseTimelineRepository(BaseRepository):
    def __init__(self, collection_name: str):
        super().__init__(collection_name)

    async def log_event(self, booking_id: str, status: str, actor_id: str, actor_role: str, notes: Optional[str] = None):
        """Standardized timeline event logger."""
        data = {
            "bookingId": booking_id,
            "status": status,
            "actorId": actor_id,
            "actorRole": actor_role,
            "notes": notes,
            "createdAt": datetime.now(timezone.utc)
        }
        await self.create(data)

    async def get_timeline(self, booking_id: str) -> List[Dict[str, Any]]:
        cursor = self.collection.find({"bookingId": booking_id}).sort("createdAt", 1)
        return await cursor.to_list(length=100)
