import logging
from typing import Dict, Any

from modules.shared.event_bus import global_event_bus, DomainEvents
from modules.notifications.constants import NotificationChannel, NotificationType
from modules.notifications.service import NotificationService

logger = logging.getLogger(__name__)

async def handle_booking_confirmed(payload: Dict[str, Any]):
    """
    Listens for BookingConfirmed events and generates a notification.
    Expected payload: {"userId": "...", "bookingId": "..."}
    """
    logger.info("Notification Module intercepted BookingConfirmed event")
    await NotificationService.create_notification(
        user_id=payload["userId"],
        channel=NotificationChannel.PUSH,
        notif_type=NotificationType.EQUIPMENT_BOOKING,
        template_id="BOOKING_CONFIRMED",
        payload={"bookingId": payload["bookingId"]}
    )

async def handle_payment_succeeded(payload: Dict[str, Any]):
    """
    Listens for PaymentSucceeded events and generates a notification.
    """
    logger.info("Notification Module intercepted PaymentSucceeded event")
    await NotificationService.create_notification(
        user_id=payload["userId"],
        channel=NotificationChannel.EMAIL, # Usually send receipts via email
        notif_type=NotificationType.PAYMENT,
        template_id="PAYMENT_SUCCESS",
        payload={"amount": payload["amount"], "reference": payload["reference"]}
    )

def register_notification_listeners():
    global_event_bus.subscribe(DomainEvents.BOOKING_CONFIRMED, handle_booking_confirmed)
    global_event_bus.subscribe(DomainEvents.PAYMENT_SUCCEEDED, handle_payment_succeeded)
