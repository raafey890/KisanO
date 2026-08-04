from fastapi import APIRouter, Depends, Query
from typing import Dict, Any, List
from modules.auth.dependencies import get_current_user_id, get_current_user_role
from modules.reviews.schemas import ReviewCreate, ReviewResponse, ReputationSummary
from modules.reviews.service import ReviewService
from modules.reviews.repository import review_repository

router = APIRouter(prefix="/api/v1/reviews", tags=["Reviews & Ratings"])

@router.post("", response_model=Dict[str, str])
async def create_review(
    data: ReviewCreate,
    user_id: str = Depends(get_current_user_id)
):
    """
    Submits a review for a completed transaction.
    """
    review_id = await ReviewService.create_review(user_id, data)
    return {"reviewId": review_id}

@router.post("/{review_id}/helpful", response_model=Dict[str, str])
async def vote_helpful(
    review_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """
    Marks a review as helpful.
    """
    await ReviewService.vote_helpful(review_id, user_id)
    return {"message": "Helpful vote recorded"}

@router.get("/reputation/{target_id}", response_model=ReputationSummary)
async def get_reputation(
    target_id: str,
    targetType: str = Query(...)
):
    """
    Fetches the aggregated reputation summary (Trust Score, Average Rating) for a target.
    """
    return await ReviewService.get_reputation(target_id, targetType)

@router.get("", response_model=Dict[str, Any])
async def search_reviews(
    targetId: str = None,
    reviewerId: str = None,
    rating: float = None,
    status: str = "APPROVED",
    sort: str = "newest",
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100)
):
    """
    Searches published reviews. Default filters to APPROVED reviews only.
    """
    filters = {"status": status}
    if targetId: filters["targetId"] = targetId
    if reviewerId: filters["reviewerId"] = reviewerId
    if rating: filters["rating"] = rating
    filters["sort"] = sort
        
    items, total = await review_repository.search_reviews(filters, skip, limit)
    for i in items:
        i["id"] = str(i["_id"])
        
    return {"items": items, "total": total, "skip": skip, "limit": limit}

@router.patch("/admin/{review_id}/status", response_model=Dict[str, str])
async def moderate_review(
    review_id: str,
    status: str,
    user_id: str = Depends(get_current_user_id),
    user_role: str = Depends(get_current_user_role)
):
    """
    Admin endpoint to override moderation status (e.g. Reject or Hide a review).
    """
    if user_role not in ["Admin", "SuperAdmin"]:
        from core.exceptions import UnauthorizedException
        raise UnauthorizedException("Admin access required")
        
    await review_repository.update_status(review_id, status)
    
    # In a full system, you would trigger reputation_engine.recalculate_reputation here as well
    # so that if a 1-star review is HIDDEN by admin, the trust score goes back up.
    
    return {"message": f"Review status updated to {status}"}
