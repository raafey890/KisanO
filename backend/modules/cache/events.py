import logging
from typing import Dict, Any
from modules.shared.event_bus import global_event_bus, DomainEvents
from modules.cache.cache_engine import cache_engine

logger = logging.getLogger(__name__)

async def handle_user_updated(payload: Dict[str, Any]):
    user_id = payload.get("id")
    if user_id:
        await cache_engine.invalidate_domain_entity("user", user_id)

async def handle_equipment_updated(payload: Dict[str, Any]):
    eq_id = payload.get("id")
    if eq_id:
        await cache_engine.invalidate_domain_entity("equipment", eq_id)

async def handle_feature_flag_updated(payload: Dict[str, Any]):
    # Invalidate all feature flags
    await cache_engine.invalidate_domain_entity("feature_flags")

async def handle_settings_updated(payload: Dict[str, Any]):
    # Invalidate all settings
    await cache_engine.invalidate_domain_entity("settings")

def register_cache_listeners():
    # User module is assumed to publish this
    global_event_bus.subscribe("UserUpdated", handle_user_updated)
    # Equipment module is assumed to publish this
    global_event_bus.subscribe("EquipmentUpdated", handle_equipment_updated)
    
    # Hooks back to Admin module
    from modules.admin.events import AdminDomainEvents
    global_event_bus.subscribe(AdminDomainEvents.FEATURE_FLAG_UPDATED, handle_feature_flag_updated)
    global_event_bus.subscribe(AdminDomainEvents.PLATFORM_SETTINGS_UPDATED, handle_settings_updated)
