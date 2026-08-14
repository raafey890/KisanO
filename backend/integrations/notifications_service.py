import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class NotificationService:
    async def send_email(self, to_email: str, subject: str, template_name: str, context: Dict[str, Any]) -> bool:
        """
        Abstracted Email Service (SMTP).
        Currently returns mock success for Phase 9 integration testing.
        """
        logger.info(f"[MOCK] Sending Email to {to_email} with subject '{subject}'")
        return True

    async def send_sms(self, phone: str, template_name: str, context: Dict[str, Any]) -> bool:
        """
        Abstracted SMS Service (Twilio/AWS SNS).
        Currently returns mock success for Phase 9 integration testing.
        """
        logger.info(f"[MOCK] Sending SMS to {phone} using template {template_name}")
        return True
        
    async def send_push_notification(self, user_id: str, title: str, body: str, data: Dict[str, Any] = None) -> bool:
        """
        Abstracted Push Notification Service (FCM).
        """
        logger.info(f"[MOCK] Sending Push to user {user_id}: {title}")
        return True

notification_service = NotificationService()
