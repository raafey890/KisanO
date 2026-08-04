from typing import Optional, Dict, Any, List
from shared.base_repository import BaseRepository
from datetime import datetime, timezone
from bson import ObjectId
import pymongo

class ReviewRepository(BaseRepository):
    def __init__(self):
        super().__init__("reviews")

    async def setup_indexes(self):
        await self.collection.create_index("reviewNumber", unique=True)
        await self.collection.create_index("reviewerSnapshot.reviewerId")
        await self.collection.create_index("targetSnapshot.targetId")
        await self.collection.create_index("transactionSnapshot.transactionId")
        await self.collection.create_index("ratingSnapshot.rating")
        await self.collection.create_index("moderationStatus")
        await self.collection.create_index("createdAt")

    async def generate_number(self) -> str:
        """Generates sequential number e.g. REV-2026-000001"""
        year = datetime.now(timezone.utc).year
        count = await self.collection.count_documents({
            "createdAt": {
                "$gte": datetime(year, 1, 1, tzinfo=timezone.utc),
                "$lt": datetime(year + 1, 1, 1, tzinfo=timezone.utc)
            }
        })
        sequence = str(count + 1).zfill(6)
        return f"REV-{year}-{sequence}"

    async def create_review(self, data: Dict[str, Any]) -> str:
        data["reviewNumber"] = await self.generate_number()
        data["isDeleted"] = False
        data["createdAt"] = datetime.now(timezone.utc)
        data["updatedAt"] = datetime.now(timezone.utc)
        
        res = await self.create(data)
        return str(res["_id"])

    async def update_status(self, review_id: str, status: str) -> bool:
        result = await self.collection.update_one(
            {"_id": ObjectId(review_id)},
            {"$set": {"moderationStatus": status, "updatedAt": datetime.now(timezone.utc)}}
        )
        return result.modified_count > 0

    async def increment_helpful(self, review_id: str, increment: int = 1) -> bool:
        result = await self.collection.update_one(
            {"_id": ObjectId(review_id)},
            {"$inc": {"helpfulVotes": increment}, "$set": {"updatedAt": datetime.now(timezone.utc)}}
        )
        return result.modified_count > 0
        
    async def increment_reported(self, review_id: str) -> bool:
        result = await self.collection.update_one(
            {"_id": ObjectId(review_id)},
            {"$inc": {"reportedCount": 1}, "$set": {"updatedAt": datetime.now(timezone.utc)}}
        )
        return result.modified_count > 0

    async def check_duplicate(self, reviewer_id: str, transaction_id: str) -> bool:
        """Checks if a reviewer has already reviewed a specific transaction."""
        count = await self.collection.count_documents({
            "reviewerSnapshot.reviewerId": reviewer_id,
            "transactionSnapshot.transactionId": transaction_id,
            "isDeleted": False
        })
        return count > 0

    async def search_reviews(self, filters: Dict[str, Any], skip: int = 0, limit: int = 20) -> tuple[List[Dict[str, Any]], int]:
        query = {"isDeleted": False}
        
        if "reviewerId" in filters:
            query["reviewerSnapshot.reviewerId"] = filters["reviewerId"]
        if "targetId" in filters:
            query["targetSnapshot.targetId"] = filters["targetId"]
        if "rating" in filters:
            query["ratingSnapshot.rating"] = filters["rating"]
        if "status" in filters:
            query["moderationStatus"] = filters["status"]
            
        cursor = self.collection.find(query)
        
        sort_by = filters.get("sort", "newest")
        if sort_by == "newest":
            cursor = cursor.sort("createdAt", -1)
        elif sort_by == "highest_rated":
            cursor = cursor.sort([("ratingSnapshot.rating", -1), ("createdAt", -1)])
        elif sort_by == "most_helpful":
            cursor = cursor.sort([("helpfulVotes", -1), ("createdAt", -1)])
            
        cursor = cursor.skip(skip).limit(limit)
        items = await cursor.to_list(length=limit)
        total = await self.collection.count_documents(query)
        return items, total


class ReputationRepository(BaseRepository):
    def __init__(self):
        super().__init__("reputations")

    async def upsert_reputation(self, target_id: str, target_type: str, data: Dict[str, Any]) -> None:
        """Updates or creates a reputation summary for a target."""
        data["lastUpdated"] = datetime.now(timezone.utc)
        await self.collection.update_one(
            {"targetId": target_id, "targetType": target_type},
            {"$set": data},
            upsert=True
        )


class ReviewAuxRepository(BaseRepository):
    def __init__(self, collection_name: str):
        super().__init__(collection_name)

    async def create_record(self, data: Dict[str, Any]) -> str:
        data["createdAt"] = datetime.now(timezone.utc)
        res = await self.create(data)
        return str(res["_id"])

class AuditLogRepository(BaseRepository):
    def __init__(self):
        super().__init__("review_audit_logs")

    async def log_action(self, entity_id: str, action: str, details: Optional[Dict[str, Any]] = None):
        await self.create({
            "entityId": entity_id,
            "action": action,
            "details": details or {},
            "createdAt": datetime.now(timezone.utc)
        })

review_repository = ReviewRepository()
reputation_repository = ReputationRepository()
reports_repository = ReviewAuxRepository("review_reports")
replies_repository = ReviewAuxRepository("review_replies")
votes_repository = ReviewAuxRepository("review_votes")
audit_repository = AuditLogRepository()
