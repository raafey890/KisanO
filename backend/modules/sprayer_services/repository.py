from typing import Optional, Dict, Any, List
from shared.base_repository import BaseRepository
from datetime import datetime, timezone
from bson import ObjectId
import pymongo

class SprayerServiceRepository(BaseRepository):
    def __init__(self):
        super().__init__("sprayer_services")

    async def setup_indexes(self):
        """Creates indexes for search and geospatial queries."""
        await self.collection.create_index("serviceCode", unique=True)
        await self.collection.create_index([
            ("businessName", pymongo.TEXT),
            ("serviceCategory", pymongo.TEXT),
            ("serviceType", pymongo.TEXT)
        ])
        await self.collection.create_index("operatorSnapshot.operatorId")
        await self.collection.create_index("status")
        
        # 2dsphere index for GeoSpatial search
        await self.collection.create_index([("coverageAreas.location", pymongo.GEOSPHERE)])

    async def generate_service_code(self, service_type: str) -> str:
        """Generates a unique Service Code e.g. SPR-DRN-000001"""
        prefix = "DRN" if "Drone" in service_type else "MAN"
        
        count = await self.collection.count_documents({
            "serviceType": service_type
        })
        sequence = str(count + 1).zfill(6)
        return f"SPR-{prefix}-{sequence}"

    async def create_service(self, service_data: Dict[str, Any]) -> str:
        service_data["serviceCode"] = await self.generate_service_code(service_data["serviceType"])
        service_data["status"] = "DRAFT"
        service_data["images"] = []
        service_data["analytics"] = {
            "views": 0, "serviceRequests": 0, "completedJobs": 0, 
            "revenue": 0.0, "averageRating": 0.0, "reviewCount": 0, "repeatCustomers": 0
        }
        service_data["version"] = 1
        service_data["isDeleted"] = False
        service_data["createdAt"] = datetime.now(timezone.utc)
        service_data["updatedAt"] = datetime.now(timezone.utc)
            
        res = await self.create(service_data)
        return str(res["_id"])

    async def update_service_optimistic(self, service_id: str, current_version: int, update_data: Dict[str, Any]) -> bool:
        """Applies update only if version matches."""
        update_data["updatedAt"] = datetime.now(timezone.utc)
        result = await self.collection.update_one(
            {"_id": ObjectId(service_id), "version": current_version, "isDeleted": False},
            {
                "$set": update_data,
                "$inc": {"version": 1}
            }
        )
        return result.modified_count > 0

    async def push_image(self, service_id: str, image_data: Dict[str, Any]):
        await self.collection.update_one(
            {"_id": ObjectId(service_id)},
            {
                "$push": {"images": image_data},
                "$inc": {"version": 1},
                "$set": {"updatedAt": datetime.now(timezone.utc)}
            }
        )

    async def search_services(self, filters: Dict[str, Any], skip: int = 0, limit: int = 20) -> tuple[List[Dict[str, Any]], int]:
        query = {"isDeleted": False}
        
        if "text" in filters:
            query["$text"] = {"$search": filters["text"]}
        if "serviceType" in filters:
            query["serviceType"] = filters["serviceType"]
        if "operatorId" in filters:
            query["operatorSnapshot.operatorId"] = filters["operatorId"]
        if "status" in filters:
            query["status"] = filters["status"]
            
        # GeoSpatial Search
        if "lng" in filters and "lat" in filters and "radiusKm" in filters:
            query["coverageAreas.location"] = {
                "$nearSphere": {
                    "$geometry": {
                        "type": "Point",
                        "coordinates": [filters["lng"], filters["lat"]]
                    },
                    "$maxDistance": filters["radiusKm"] * 1000 # Convert km to meters
                }
            }
            
        cursor = self.collection.find(query)
        
        sort_by = filters.get("sort", "newest")
        if sort_by == "newest":
            cursor = cursor.sort("createdAt", -1)
        elif sort_by == "rating":
            cursor = cursor.sort("analytics.averageRating", -1)
            
        cursor = cursor.skip(skip).limit(limit)
        items = await cursor.to_list(length=limit)
        total = await self.collection.count_documents(query)
        return items, total


class AvailabilityRepository(BaseRepository):
    def __init__(self):
        super().__init__("service_availability")

    async def check_overlap(self, service_id: str, start: datetime, end: datetime) -> bool:
        """Checks if a requested time slot overlaps with an existing block."""
        count = await self.collection.count_documents({
            "serviceId": service_id,
            "status": "ACTIVE",
            "$or": [
                {"startTime": {"$lt": end, "$gte": start}},
                {"endTime": {"$gt": start, "$lte": end}},
                {"startTime": {"$lte": start}, "endTime": {"$gte": end}}
            ]
        })
        return count > 0

class PricingHistoryRepository(BaseRepository):
    def __init__(self):
        super().__init__("pricing_history")

    async def log_price_change(self, service_id: str, old_pricing: Dict[str, Any], new_pricing: Dict[str, Any], user_id: str, reason: Optional[str] = None):
        await self.create({
            "serviceId": service_id,
            "oldPricing": old_pricing,
            "newPricing": new_pricing,
            "userId": user_id,
            "reason": reason,
            "createdAt": datetime.now(timezone.utc)
        })

class CertificationRepository(BaseRepository):
    def __init__(self):
        super().__init__("service_certifications")


sprayer_repository = SprayerServiceRepository()
availability_repository = AvailabilityRepository()
pricing_history_repository = PricingHistoryRepository()
certification_repository = CertificationRepository()
