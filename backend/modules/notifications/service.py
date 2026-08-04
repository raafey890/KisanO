import logging
from typing import Dict, Any, List
from datetime import datetime

from core.exceptions import NotFoundException
from modules.notifications.repository import notification_repo, preference_repo, audit_repo
from modules.notifications.constants import NotificationChannel, NotificationType, NotificationStatus
from modules.notifications.queue import notification_queue
from modules.notifications.dispatcher import dispatcher

from modules.users.repository import user_repository

logger = logging.getLogger(__name__)

class NotificationService:
    @staticmethod
    async def initialize():
        """
        Bootstraps the internal JobQueue by binding it to the Dispatcher.
        Called on application startup.
        """
        notification_queue.set_worker(dispatcher.process_job)
        logger.info("Notification Queue Worker initialized.")

    @staticmethod
    async def create_notification(
        user_id: str,
        channel: NotificationChannel,
        notif_type: NotificationType,
        template_id: str,
        payload: Dict[str, Any]
    ) -> str:
        """
        Entry point to fire a notification. 
        Creates the document and pushes to the asynchronous JobQueue.
        """
        # Fetch user details
        user = await user_repository.get_by_id(user_id)
        if not user:
            raise NotFoundException("User not found for notification.")
            
        user_snapshot = {
            "userId": str(user["_id"]),
            "userName": user.get("fullName", "Unknown"),
            "userRole": user.get("role", "Unknown"),
            "contactEmail": user.get("email"),
            "contactPhone": user.get("phone")
        }

        # Build raw document
        notif_doc = {
            "userSnapshot": user_snapshot,
            "channel": channel.value,
            "type": notif_type.value,
            "templateId": template_id,
            "payload": payload,
            "status": NotificationStatus.QUEUED.value
        }
        
        # Save to DB
        notif_id = await notification_repo.create_notification(notif_doc)
        notif_doc["_id"] = notif_id # Hydrate for Queue
        
        await audit_repo.log({"notificationId": notif_id, "action": "QUEUED"})
        
        # Enqueue for Background Processing
        await notification_queue.enqueue(notif_doc)
        
        return notif_id

    @staticmethod
    async def mark_read(notification_id: str) -> None:
        await notification_repo.mark_as_read(notification_id)
        
    @staticmethod
    async def update_preferences(user_id: str, data: Dict[str, Any]) -> None:
        data["userId"] = user_id
        data["updatedAt"] = datetime.utcnow()
        await preference_repo.collection.update_one(
            {"userId": user_id},
            {"$set": data},
            upsert=True
        )
