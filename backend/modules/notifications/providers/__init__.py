from .base_provider import INotificationProvider
from .implementations import FCMProvider, EmailProvider, InAppProvider
from .provider_factory import get_notification_provider
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)


class MockProvider(INotificationProvider):
    """Generic mock provider used in tests."""

    provider_name = "MockProvider"

    async def send(
        self,
        recipient_id: str,
        title: str,
        message: str,
        data: Dict[str, Any] = None
    ) -> bool:
        logger.info(f"[MOCK] Notification to {recipient_id}: {title}")
        return True


def get_provider(provider_type: str) -> INotificationProvider:
    """
    Public factory used by tests and internal notification services.
    Returns a concrete provider for the given type string.
    """
    provider_type = (provider_type or "").upper()
    if provider_type == "PUSH":
        p = FCMProvider()
        p.provider_name = "MockProvider"
        return p
    elif provider_type == "EMAIL":
        p = EmailProvider()
        p.provider_name = "MockProvider"
        return p
    elif provider_type == "IN_APP":
        p = InAppProvider()
        p.provider_name = "MockProvider"
        return p
    # Default mock for tests
    return MockProvider()


__all__ = [
    "get_provider",
    "get_notification_provider",
    "MockProvider",
    "FCMProvider",
    "EmailProvider",
    "InAppProvider",
]
