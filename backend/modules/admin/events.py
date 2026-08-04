import logging
from typing import Dict, Any, Callable, List
from modules.shared.event_bus import global_event_bus, DomainEvents

logger = logging.getLogger(__name__)

class AdminDomainEvents:
    ADMIN_APPROVED_RESOURCE = "AdminApprovedResource"
    ADMIN_REJECTED_RESOURCE = "AdminRejectedResource"
    FEATURE_FLAG_UPDATED = "FeatureFlagUpdated"
    PLATFORM_SETTINGS_UPDATED = "PlatformSettingsUpdated"
    MAINTENANCE_MODE_ENABLED = "MaintenanceModeEnabled"
    BROADCAST_CREATED = "AdminBroadcastCreated"
    FRAUD_DETECTED = "FraudDetected"

class PlatformEventPublisher:
    async def publish(self, event_type: str, payload: Dict[str, Any]):
        # Broadcasts it globally so other modules (like Notifications) can react
        await global_event_bus.publish(event_type, payload)

admin_events = PlatformEventPublisher()

# Admin Module can also listen to global events for Fraud/Audit purposes
async def handle_suspicious_global_event(payload: Dict[str, Any]):
    from modules.admin.engines.fraud_detection_engine import fraud_engine
    await fraud_engine.analyze_suspicious_activity("GLOBAL_SUSPICIOUS_EVENT", payload)

def register_admin_listeners():
    # If a booking fails repeatedly, we could hook it here for fraud
    # global_event_bus.subscribe(DomainEvents.PAYMENT_FAILED, handle_suspicious_global_event)
    pass
