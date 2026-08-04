import logging
from typing import Dict, Any
from .base_provider import INotificationProvider

logger = logging.getLogger(__name__)

class FCMProvider(INotificationProvider):
    """
    Mocked implementation for Firebase Cloud Messaging (FCM).
    In production, this would use firebase-admin SDK.
    """
    
    async def send(self, recipient_id: str, title: str, message: str, data: Dict[str, Any] = None) -> bool:
        logger.info(f"FCM PUSH to {recipient_id}: [{title}] {message}")
        # Mock successful delivery
        return True

class EmailProvider(INotificationProvider):
    """Mocked implementation for SMTP Email."""
    
    async def send(self, recipient_id: str, title: str, message: str, data: Dict[str, Any] = None) -> bool:
        logger.info(f"EMAIL to {recipient_id}: [{title}] {message}")
        return True

class InAppProvider(INotificationProvider):
    """In-App notifications are simply saved to DB (which happens centrally), but this provider can trigger WebSockets if needed."""
    
    async def send(self, recipient_id: str, title: str, message: str, data: Dict[str, Any] = None) -> bool:
        logger.info(f"IN-APP for {recipient_id} (Websocket Broadcast Placeholder)")
        return True
