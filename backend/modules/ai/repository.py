from typing import Optional, Dict, Any, List
from bson import ObjectId
from db.mongodb import get_db
from datetime import datetime, timezone

class AIConsultationRepository:
    @property
    def collection(self):
        return get_db()["ai_consultations"]

    async def get_by_id(self, consultation_id: str) -> Optional[Dict[str, Any]]:
        return await self.collection.find_one({"_id": ObjectId(consultation_id)})

    async def create_consultation(self, data: Dict[str, Any]) -> Dict[str, Any]:
        result = await self.collection.insert_one(data)
        data["_id"] = result.inserted_id
        return data

    async def update_consultation(self, consultation_id: str, update_data: Dict[str, Any]) -> bool:
        update_data["updatedAt"] = datetime.now(timezone.utc)
        result = await self.collection.update_one(
            {"_id": ObjectId(consultation_id)},
            {"$set": update_data}
        )
        return result.modified_count > 0

    async def toggle_favourite(self, consultation_id: str, is_favourite: bool) -> bool:
        result = await self.collection.update_one(
            {"_id": ObjectId(consultation_id)},
            {"$set": {"isFavourite": is_favourite, "updatedAt": datetime.now(timezone.utc)}}
        )
        return result.modified_count > 0

    async def search_consultations(
        self,
        farmer_id: str = None,
        crop_name: str = None,
        disease_name: str = None,
        status: str = None,
        consultation_type: str = None,
        is_favourite: bool = None,
        date_range_start: str = None,
        date_range_end: str = None,
        sort_by: str = "newest",
        skip: int = 0,
        limit: int = 20
    ) -> tuple[List[Dict[str, Any]], int]:
        
        filter_q: Dict[str, Any] = {}
        
        if farmer_id:
            filter_q["farmerId"] = ObjectId(farmer_id)
        if status:
            filter_q["status"] = status
        if consultation_type:
            filter_q["consultationType"] = consultation_type
        if is_favourite is not None:
            filter_q["isFavourite"] = is_favourite
            
        if crop_name:
            filter_q["cropName"] = {"$regex": crop_name, "$options": "i"}
        if disease_name:
            filter_q["diseaseReport.diseaseName"] = {"$regex": disease_name, "$options": "i"}
            
        if date_range_start or date_range_end:
            filter_q["createdAt"] = {}
            if date_range_start:
                filter_q["createdAt"]["$gte"] = datetime.fromisoformat(date_range_start)
            if date_range_end:
                filter_q["createdAt"]["$lte"] = datetime.fromisoformat(date_range_end)

        cursor = self.collection.find(filter_q)
        
        if sort_by == "newest":
            cursor = cursor.sort("createdAt", -1)
        elif sort_by == "oldest":
            cursor = cursor.sort("createdAt", 1)
        elif sort_by == "highest_confidence":
            cursor = cursor.sort("diseaseReport.confidenceScore", -1)

        cursor = cursor.skip(skip).limit(limit)
        items = await cursor.to_list(length=limit)
        total = await self.collection.count_documents(filter_q)
        
        return items, total

    async def get_analytics(self) -> Dict[str, Any]:
        pipeline = [
            {"$group": {
                "_id": "$consultationType",
                "count": {"$sum": 1},
                "failed": {"$sum": {"$cond": [{"$eq": ["$status", "FAILED"]}, 1, 0]}}
            }}
        ]
        
        cursor = self.collection.aggregate(pipeline)
        results = await cursor.to_list(length=None)
        
        total = 0
        failed = 0
        disease_count = 0
        advisory_count = 0
        qa_count = 0
        
        for r in results:
            t = r["_id"]
            c = r["count"]
            f = r["failed"]
            total += c
            failed += f
            if t == "DISEASE_DETECTION": disease_count = c
            elif t == "CROP_ADVISORY": advisory_count = c
            elif t == "GENERAL_QA": qa_count = c
            
        return {
            "totalConsultations": total,
            "diseaseDetections": disease_count,
            "advisoryRequests": advisory_count,
            "generalQaRequests": qa_count,
            "failedRequests": failed,
            "providerUsage": {"OPENAI": total} # Mocked provider usage
        }

ai_consultation_repository = AIConsultationRepository()
