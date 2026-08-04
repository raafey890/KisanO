from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.routers.deps import get_current_user
from app.models.notification import Notification
from app.schemas.notification import NotificationResponse
from app.core.responses import standard_response
from app.core.exceptions import NotFoundException, ForbiddenException

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("")
def get_user_notifications(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    skip = (page - 1) * limit
    notifications = db.query(Notification).filter(
        Notification.userId == current_user.id
    ).order_by(Notification.id.desc()).offset(skip).limit(limit).all()
    
    results = [NotificationResponse.from_orm(n).dict() for n in notifications]
    return standard_response(
        success=True,
        message="Notifications retrieved successfully",
        data={
            "page": page,
            "limit": limit,
            "items": results
        }
    )

@router.put("/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        raise NotFoundException("Notification not found")
        
    if notification.userId != current_user.id:
        raise ForbiddenException("You cannot access this notification")
        
    notification.isRead = True
    db.commit()
    
    return standard_response(
        success=True,
        message="Notification marked as read"
    )
