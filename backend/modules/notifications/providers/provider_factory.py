from .base_provider import INotificationProvider
from .implementations import FCMProvider, EmailProvider, InAppProvider
from modules.notifications.constants import NotificationChannel

def get_notification_provider(channel: str) -> INotificationProvider:
    if channel == NotificationChannel.PUSH:
        return FCMProvider()
    elif channel == NotificationChannel.EMAIL:
        return EmailProvider()
    elif channel == NotificationChannel.IN_APP:
        return InAppProvider()
    # future: SMSProvider(), WhatsAppProvider()
    
    # Fallback to In-App if channel unknown
    return InAppProvider()
