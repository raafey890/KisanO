import logging
import asyncio
from typing import Dict, Any, List
from core.exceptions import NotFoundException, AppException, UnauthorizedException

from modules.reviews.schemas import ReviewCreate
from modules.reviews.repository import review_repository, reputation_repository, audit_repository, votes_repository
from modules.reviews.constants import ModerationStatus, ReviewType
from modules.reviews.moderation import moderation_engine
from modules.reviews.reputation import reputation_engine
from modules.reviews.events import review_events, ReviewDomainEvents
from modules.reviews.facades import TransactionReadFacade

from modules.users.repository import user_repository

logger = logging.getLogger(__name__)

class ReviewService:
    @staticmethod
    async def create_review(reviewer_id: str, data: ReviewCreate) -> str:
        """
        Validates transaction, moderates text, creates review, and triggers reputation calc.
        """
        # 1. Fetch Reviewer Snapshot
        user = await user_repository.get_by_id(reviewer_id)
        if not user:
            raise NotFoundException("Reviewer profile not found")
            
        reviewer_snapshot = {
            "reviewerId": str(user["_id"]),
            "reviewerName": user.get("fullName", "Unknown"),
            "reviewerRole": user.get("role", "Unknown")
        }
        
        # 2. Transaction Validation (via Facade)
        # Prevents unauthorized users from leaving reviews for things they didn't buy/use.
        await TransactionReadFacade.validate_transaction(data.transactionId, data.transactionType, reviewer_id)
        
        # 3. Duplicate Prevention
        if await review_repository.check_duplicate(reviewer_id, data.transactionId):
            raise AppException("You have already submitted a review for this transaction.", 409)

        # 4. Target Snapshot Generation (Mocked for brevity, would fetch from specific repos based on targetType)
        target_snapshot = {
            "targetId": data.targetId,
            "targetName": "Mock Target Name",
            "targetType": data.reviewType.value,
            "ownerId": "mock_owner_id"
        }
        
        transaction_snapshot = {
            "transactionId": data.transactionId,
            "transactionType": data.transactionType
        }
        
        rating_snapshot = {
            "rating": float(data.rating)
        }
        
        # 5. Auto-Moderation Engine
        mod_status = moderation_engine.auto_moderate(data.title, data.comment)
        
        # 6. Create Review Document
        review_doc = {
            "reviewerSnapshot": reviewer_snapshot,
            "targetSnapshot": target_snapshot,
            "transactionSnapshot": transaction_snapshot,
            "ratingSnapshot": rating_snapshot,
            
            "title": data.title,
            "comment": data.comment,
            "pros": data.pros,
            "cons": data.cons,
            "tags": data.tags,
            "imageUrls": data.imageUrls,
            
            "moderationStatus": mod_status.value,
            "helpfulVotes": 0,
            "reportedCount": 0
        }
        
        review_id = await review_repository.create_review(review_doc)
        await audit_repository.log_action(review_id, "REVIEW_CREATED")
        
        # 7. Publish Domain Event
        await review_events.publish(ReviewDomainEvents.REVIEW_CREATED, {
            "reviewId": review_id,
            "targetId": data.targetId,
            "targetType": data.reviewType.value,
            "moderationStatus": mod_status.value
        })
        
        return review_id

    @staticmethod
    async def vote_helpful(review_id: str, user_id: str) -> None:
        """
        Increments the helpful vote count. 
        In production, a review_votes collection would prevent duplicate voting.
        """
        review = await review_repository.get_by_id(review_id)
        if not review or review.get("isDeleted"):
            raise NotFoundException("Review not found")
            
        if review["reviewerSnapshot"]["reviewerId"] == user_id:
            raise AppException("You cannot vote on your own review.", 400)
            
        await review_repository.increment_helpful(review_id)
        await audit_repository.log_action(review_id, "HELPFUL_VOTE_ADDED", {"userId": user_id})
        await review_events.publish(ReviewDomainEvents.HELPFUL_VOTE_ADDED, {"reviewId": review_id})

    @staticmethod
    async def get_reputation(target_id: str, target_type: str) -> Dict[str, Any]:
        """
        Fetches the materialized reputation snapshot. It does not calculate on the fly.
        """
        doc = await reputation_repository.collection.find_one({"targetId": target_id, "targetType": target_type})
        if not doc:
            return {
                "targetId": target_id,
                "targetType": target_type,
                "averageRating": 0.0,
                "totalReviews": 0,
                "verifiedReviews": 0,
                "responseRate": 0.0,
                "trustScore": 0.0,
                "ratingDistribution": {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}
            }
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        return doc


# Internal Event Listener Setup
async def handle_review_created(payload: Dict[str, Any]):
    if payload.get("moderationStatus") == ModerationStatus.APPROVED.value:
        # Calculate in the background so API returns instantly
        asyncio.create_task(reputation_engine.recalculate_reputation(payload["targetId"], payload["targetType"]))

review_events.subscribe(ReviewDomainEvents.REVIEW_CREATED, handle_review_created)
