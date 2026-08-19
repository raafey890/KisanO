from abc import ABC, abstractmethod
from typing import Dict, Any, Tuple
import logging

logger = logging.getLogger(__name__)

class BaseNotificationProvider(ABC):
    @abstractmethod
    async def send(self, recipient: str, title: str, body: str, payload: Dict[str, Any]) -> Tuple[bool, str]:
        """
        Sends the notification. 
        Returns (Success: bool, Message/ProviderID: str)
        """
        pass
        
    @property
    @abstractmethod
    def provider_name(self) -> str:
        pass


class MockNotificationProvider(BaseNotificationProvider):
    async def send(self, recipient: str, title: str, body: str, payload: Dict[str, Any]) -> Tuple[bool, str]:
        import asyncio
        logger.info(f"[MOCK NOTIFICATION] To: {recipient} | Title: {title} | Body: {body}")
        # Simulate network delay
        await asyncio.sleep(0.5)
        return True, "mock-delivery-id-12345"
        
    @property
    def provider_name(self) -> str:
        return "MockProvider"


class FCMProvider(BaseNotificationProvider):
    async def send(self, recipient: str, title: str, body: str, payload: Dict[str, Any]) -> Tuple[bool, str]:
        # firebase_admin.messaging.send(...)
        raise NotImplementedError("FCM requires initialization with service account credentials.")
        
    @property
    def provider_name(self) -> str:
        return "FirebaseCloudMessaging"


class EmailProvider(BaseNotificationProvider):
    async def send(self, recipient: str, title: str, body: str, payload: Dict[str, Any]) -> Tuple[bool, str]:
        # SendGrid / AWS SES client call
        raise NotImplementedError("Email provider requires SMTP/API credentials.")
        
    @property
    def provider_name(self) -> str:
        return "EmailProvider"


class SMSProvider(BaseNotificationProvider):
    async def send(self, recipient: str, title: str, body: str, payload: Dict[str, Any]) -> Tuple[bool, str]:
        # Twilio / MSG91 client call
        raise NotImplementedError("SMS provider requires API credentials.")
        
    @property
    def provider_name(self) -> str:
        return "SMSProvider"


def get_provider(channel: str) -> BaseNotificationProvider:
    """
    In a real app, this might inspect env vars to decide if it should return Mock or Real providers.
    For this implementation, we return the Mock provider to prevent crashes during tests.
    """
    # if env == "production":
    #     if channel == "PUSH": return FCMProvider()
    #     ...
    return MockNotificationProvider()
