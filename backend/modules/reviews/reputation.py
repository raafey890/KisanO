from typing import Dict, Any
from modules.reviews.repository import review_repository, reputation_repository
from modules.reviews.constants import ModerationStatus

class ReputationEngine:
    @staticmethod
    async def recalculate_reputation(target_id: str, target_type: str) -> None:
        """
        Runs an aggregation pipeline to calculate the total reputation score
        for a specific target, and updates the materialized `reputations` collection.
        This is called asynchronously by the domain event listener.
        """
        pipeline = [
            {
                "$match": {
                    "targetSnapshot.targetId": target_id,
                    "targetSnapshot.targetType": target_type,
                    "moderationStatus": ModerationStatus.APPROVED.value,
                    "isDeleted": False
                }
            },
            {
                "$group": {
                    "_id": "$targetSnapshot.targetId",
                    "averageRating": {"$avg": "$ratingSnapshot.rating"},
                    "totalReviews": {"$sum": 1},
                    # Ratings distribution
                    "rating_1": {"$sum": {"$cond": [{"$eq": ["$ratingSnapshot.rating", 1.0]}, 1, 0]}},
                    "rating_2": {"$sum": {"$cond": [{"$eq": ["$ratingSnapshot.rating", 2.0]}, 1, 0]}},
                    "rating_3": {"$sum": {"$cond": [{"$eq": ["$ratingSnapshot.rating", 3.0]}, 1, 0]}},
                    "rating_4": {"$sum": {"$cond": [{"$eq": ["$ratingSnapshot.rating", 4.0]}, 1, 0]}},
                    "rating_5": {"$sum": {"$cond": [{"$eq": ["$ratingSnapshot.rating", 5.0]}, 1, 0]}}
                }
            }
        ]
        
        cursor = review_repository.collection.aggregate(pipeline)
        results = await cursor.to_list(length=1)
        
        if not results:
            # No approved reviews exist, reset reputation
            await reputation_repository.upsert_reputation(target_id, target_type, {
                "averageRating": 0.0,
                "totalReviews": 0,
                "verifiedReviews": 0,
                "responseRate": 0.0,
                "trustScore": 0.0,
                "ratingDistribution": {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}
            })
            return
            
        data = results[0]
        
        # Calculate Trust Score (Mock algorithm: weight average rating by total reviews)
        # In a real system, you'd factor in helpful votes, verified purchase flag, age of reviews, etc.
        base_score = data["averageRating"] * 20 # 0-100 scale
        volume_bonus = min(data["totalReviews"] * 2, 20) # Max 20 bonus points for volume
        trust_score = min(base_score + volume_bonus, 100.0)
        
        reputation_doc = {
            "averageRating": round(data["averageRating"], 1),
            "totalReviews": data["totalReviews"],
            "verifiedReviews": data["totalReviews"], # Assuming all are verified via transaction validation
            "responseRate": 0.0, # Would be calculated from review_replies collection
            "trustScore": round(trust_score, 1),
            "ratingDistribution": {
                "1": data["rating_1"],
                "2": data["rating_2"],
                "3": data["rating_3"],
                "4": data["rating_4"],
                "5": data["rating_5"]
            }
        }
        
        await reputation_repository.upsert_reputation(target_id, target_type, reputation_doc)

reputation_engine = ReputationEngine()
