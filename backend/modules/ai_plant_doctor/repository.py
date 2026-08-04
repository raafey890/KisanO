from typing import Optional, Dict, Any, List
from shared.base_repository import BaseRepository
from datetime import datetime, timezone
from bson import ObjectId
import pymongo

class DiagnosisRepository(BaseRepository):
    def __init__(self):
        super().__init__("diagnoses")

    async def setup_indexes(self):
        await self.collection.create_index("diagnosisNumber", unique=True)
        await self.collection.create_index("farmerSnapshot.farmerId")
        await self.collection.create_index("cropSnapshot.cropName")
        await self.collection.create_index("detectedDisease")
        await self.collection.create_index("status")
        await self.collection.create_index("createdAt")

    async def generate_number(self) -> str:
        """Generates sequential number e.g. DIA-2026-000001"""
        year = datetime.now(timezone.utc).year
        count = await self.collection.count_documents({
            "createdAt": {
                "$gte": datetime(year, 1, 1, tzinfo=timezone.utc),
                "$lt": datetime(year + 1, 1, 1, tzinfo=timezone.utc)
            }
        })
        sequence = str(count + 1).zfill(6)
        return f"DIA-{year}-{sequence}"

    async def create_diagnosis(self, data: Dict[str, Any]) -> str:
        data["diagnosisNumber"] = await self.generate_number()
        data["version"] = 1
        data["isDeleted"] = False
        data["createdAt"] = datetime.now(timezone.utc)
        data["updatedAt"] = datetime.now(timezone.utc)
        
        res = await self.create(data)
        return str(res["_id"])

    async def update_status(self, diagnosis_id: str, status: str) -> bool:
        result = await self.collection.update_one(
            {"_id": ObjectId(diagnosis_id)},
            {"$set": {"status": status, "updatedAt": datetime.now(timezone.utc)}}
        )
        return result.modified_count > 0

    async def search_diagnoses(self, filters: Dict[str, Any], skip: int = 0, limit: int = 20) -> tuple[List[Dict[str, Any]], int]:
        query = {"isDeleted": False}
        
        if "farmerId" in filters:
            query["farmerSnapshot.farmerId"] = filters["farmerId"]
        if "disease" in filters:
            query["detectedDisease"] = {"$regex": filters["disease"], "$options": "i"}
        if "crop" in filters:
            query["cropSnapshot.cropName"] = filters["crop"]
        if "status" in filters:
            query["status"] = filters["status"]
            
        cursor = self.collection.find(query)
        
        sort_by = filters.get("sort", "newest")
        if sort_by == "newest":
            cursor = cursor.sort("createdAt", -1)
        elif sort_by == "oldest":
            cursor = cursor.sort("createdAt", 1)
        elif sort_by == "highest_confidence":
            cursor = cursor.sort("confidenceSummary.rawScore", -1)
            
        cursor = cursor.skip(skip).limit(limit)
        items = await cursor.to_list(length=limit)
        total = await self.collection.count_documents(query)
        return items, total

class AIFeedbackRepository(BaseRepository):
    def __init__(self):
        super().__init__("ai_feedback")

    async def create_feedback(self, data: Dict[str, Any]) -> str:
        data["createdAt"] = datetime.now(timezone.utc)
        res = await self.create(data)
        return str(res["_id"])

class AuditLogRepository(BaseRepository):
    def __init__(self):
        super().__init__("ai_audit_logs")

    async def log_action(self, entity_id: str, action: str, details: Optional[Dict[str, Any]] = None):
        await self.create({
            "entityId": entity_id,
            "action": action,
            "details": details or {},
            "createdAt": datetime.now(timezone.utc)
        })

diagnosis_repository = DiagnosisRepository()
feedback_repository = AIFeedbackRepository()
audit_repository = AuditLogRepository()
