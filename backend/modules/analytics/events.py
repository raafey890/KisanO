import logging
from typing import Dict, Any
from modules.shared.event_bus import global_event_bus, DomainEvents
from modules.analytics.constants import MetricType
from modules.analytics.engines.snapshot_engine import snapshot_engine

logger = logging.getLogger(__name__)

async def handle_payment_succeeded(payload: Dict[str, Any]):
    """
    Updates the Revenue snapshot safely.
    """
    amount = payload.get("amount", 0)
    await snapshot_engine.record_event(MetricType.REVENUE, float(amount))

async def handle_user_registered(payload: Dict[str, Any]):
    await snapshot_engine.record_event(MetricType.USER_GROWTH, 1)

def register_analytics_listeners():
    global_event_bus.subscribe(DomainEvents.PAYMENT_SUCCEEDED, handle_payment_succeeded)
    # Note: UserRegistered is assumed to be defined in User module events
    global_event_bus.subscribe("UserRegistered", handle_user_registered)
