from fastapi import APIRouter, Depends, Query
from typing import Dict, Any, List
from modules.auth.dependencies import get_current_user_id
from modules.notifications.schemas import UserPreferences
from modules.notifications.service import NotificationService
from modules.notifications.repository import preference_repo, notification_repo

router = APIRouter(prefix="/api/v1/notifications", tags=["Notifications"])

@router.get("", response_model=Dict[str, Any])
async def get_my_notifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    user_id: str = Depends(get_current_user_id)
):
    """
    Fetches the current user's notifications.
    """
    cursor = notification_repo.collection.find({"userSnapshot.userId": user_id, "isDeleted": False}).sort("createdAt", -1).skip(skip).limit(limit)
    items = await cursor.to_list(length=limit)
    total = await notification_repo.collection.count_documents({"userSnapshot.userId": user_id, "isDeleted": False})
    
    for i in items:
        i["id"] = str(i["_id"])
        
    return {"items": items, "total": total}

@router.patch("/{notification_id}/read", response_model=Dict[str, str])
async def mark_notification_read(
    notification_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """
    Marks a notification as read.
    """
    await NotificationService.mark_read(notification_id)
    return {"message": "Marked as read"}

@router.get("/preferences", response_model=UserPreferences)
async def get_preferences(user_id: str = Depends(get_current_user_id)):
    """
    Returns the user's notification opt-ins (Push, Email, SMS, etc).
    """
    prefs = await preference_repo.get_preferences(user_id)
    return UserPreferences(**prefs)

@router.patch("/preferences", response_model=Dict[str, str])
async def update_preferences(
    data: Dict[str, Any],
    user_id: str = Depends(get_current_user_id)
):
    """
    Updates the user's notification preferences.
    """
    await NotificationService.update_preferences(user_id, data)
    return {"message": "Preferences updated successfully"}
