import logging
from typing import Dict, Any, Optional

from modules.admin.schemas import ApprovalCommandPayload, BroadcastCommandPayload, PlatformSettingCreate, FeatureFlagCreate
from modules.admin.engines.approval_engine import approval_engine
from modules.admin.engines.moderation_engine import moderation_engine
from modules.admin.engines.settings_engine import settings_engine
from modules.admin.engines.feature_flag_engine import feature_flag_engine
from modules.admin.engines.broadcast_engine import broadcast_engine
from modules.admin.engines.system_health_engine import system_health_engine
from modules.admin.engines.analytics_engine import analytics_engine
from modules.admin.engines.security_engine import security_engine
from modules.admin.events import admin_events, AdminDomainEvents
from modules.admin.constants import ResourceType
from core.exceptions import UnauthorizedException

logger = logging.getLogger(__name__)

class PlatformEngine:
    """
    Unified Orchestrator for the Admin Module.
    Routes requests to the specialized sub-engines.
    """

    @staticmethod
    async def process_approval(actor_id: str, actor_role: str, payload: ApprovalCommandPayload, ip_address: Optional[str] = None):
        if not security_engine.validate_permission(actor_role, "APPROVE_RESOURCES"):
            raise UnauthorizedException("Insufficient permissions to approve resources.")
            
        success = await approval_engine.process_approval(actor_id, actor_role, payload, ip_address)
        if success:
            event = AdminDomainEvents.ADMIN_APPROVED_RESOURCE if payload.approve else AdminDomainEvents.ADMIN_REJECTED_RESOURCE
            await admin_events.publish(event, {"resourceId": payload.resourceId, "resourceType": payload.resourceType.value})
        return success

    @staticmethod
    async def process_moderation(actor_id: str, actor_role: str, resource_id: str, resource_type: ResourceType, action: str, reason: str, ip_address: Optional[str] = None):
        if not security_engine.validate_permission(actor_role, "MODERATE_RESOURCES"):
            raise UnauthorizedException("Insufficient permissions to moderate resources.")
        return await moderation_engine.process_moderation(actor_id, actor_role, resource_id, resource_type, action, reason, ip_address)

    @staticmethod
    async def update_setting(actor_id: str, actor_role: str, data: PlatformSettingCreate, ip_address: Optional[str] = None):
        if not security_engine.validate_permission(actor_role, "MANAGE_SETTINGS"):
            raise UnauthorizedException("Insufficient permissions to update settings.")
        
        key = await settings_engine.update_setting(actor_id, actor_role, data, ip_address)
        await admin_events.publish(AdminDomainEvents.PLATFORM_SETTINGS_UPDATED, {"key": key})
        return key

    @staticmethod
    async def update_feature_flag(actor_id: str, actor_role: str, data: FeatureFlagCreate, ip_address: Optional[str] = None):
        if not security_engine.validate_permission(actor_role, "MANAGE_FLAGS"):
            raise UnauthorizedException("Insufficient permissions to manage feature flags.")
            
        flag_key = await feature_flag_engine.update_flag(actor_id, actor_role, data, ip_address)
        await admin_events.publish(AdminDomainEvents.FEATURE_FLAG_UPDATED, {"flagKey": flag_key})
        return flag_key

    @staticmethod
    async def create_broadcast(actor_id: str, actor_role: str, payload: BroadcastCommandPayload, ip_address: Optional[str] = None):
        if not security_engine.validate_permission(actor_role, "CREATE_BROADCAST"):
            raise UnauthorizedException("Insufficient permissions to broadcast.")
            
        await broadcast_engine.create_broadcast(actor_id, actor_role, payload, ip_address)
        await admin_events.publish(AdminDomainEvents.BROADCAST_CREATED, {"title": payload.title, "roles": payload.targetRoles})

    @staticmethod
    async def get_dashboard():
        return await analytics_engine.get_dashboard_metrics()

    @staticmethod
    async def get_system_health():
        return await system_health_engine.get_health_report()

platform_engine = PlatformEngine()
