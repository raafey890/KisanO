from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.routers.deps import get_current_user
from app.models.review import Review
from app.models.equipment import Equipment
from app.schemas.review import ReviewCreate, ReviewResponse
from app.core.responses import standard_response
from app.core.exceptions import NotFoundException

router = APIRouter(prefix="/api/reviews", tags=["Reviews"])

@router.post("", status_code=status.HTTP_201_CREATED)
def post_equipment_review(
    payload: ReviewCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Verify equipment exists
    equipment = db.query(Equipment).filter(Equipment.id == payload.equipmentId).first()
    if not equipment:
        raise NotFoundException("Equipment not found")
        
    db_review = Review(
        userId=current_user.id,
        equipmentId=payload.equipmentId,
        rating=payload.rating,
        review=payload.review
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    # Recalculate average equipment rating
    avg_rating = db.query(func.avg(Review.rating)).filter(Review.equipmentId == payload.equipmentId).scalar()
    if avg_rating:
        # Save average rating statistics (we can use rating metadata directly)
        pass # Avg ratings will dynamically compute in dashboard, or we can store on Equipment (Equipment doesn't have an avgRating field yet, but we calculated it in the dashboard services dynamically).
        
    response_data = ReviewResponse.from_orm(db_review)
    return standard_response(
        success=True,
        message="Review submitted successfully",
        data=response_data.dict(),
        status_code=201
    )
