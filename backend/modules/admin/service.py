from typing import Dict, Any, List, Optional
from core.exceptions import UnauthorizedException
from modules.admin.schemas import ApprovalCommandPayload, BroadcastCommandPayload, PlatformSettingCreate, FeatureFlagCreate, ResourceType
from modules.admin.platform_engine import platform_engine
from modules.admin.repository import audit_repo, feature_flag_repo, settings_repo
from modules.admin.cache import config_cache

class AdminService:
    @staticmethod
    async def initialize():
        """
        Bootstraps caches.
        """
        await config_cache.initialize()

    @staticmethod
    async def get_dashboard(user_role: str) -> Dict[str, Any]:
        return await platform_engine.get_dashboard()

    @staticmethod
    async def get_system_health(user_role: str) -> Dict[str, Any]:
        return await platform_engine.get_system_health()

    @staticmethod
    async def get_audit_logs(skip: int, limit: int) -> tuple[List[Dict[str, Any]], int]:
        cursor = audit_repo.collection.find().sort("createdAt", -1).skip(skip).limit(limit)
        items = await cursor.to_list(length=limit)
        for i in items: i["id"] = str(i["_id"])
        total = await audit_repo.collection.count_documents({})
        return items, total

    @staticmethod
    async def process_approval(actor_id: str, actor_role: str, payload: ApprovalCommandPayload, ip: Optional[str] = None):
        return await platform_engine.process_approval(actor_id, actor_role, payload, ip)

    @staticmethod
    async def process_moderation(actor_id: str, actor_role: str, resource_id: str, resource_type: ResourceType, action: str, reason: str, ip: Optional[str] = None):
        return await platform_engine.process_moderation(actor_id, actor_role, resource_id, resource_type, action, reason, ip)

    @staticmethod
    async def update_setting(actor_id: str, actor_role: str, payload: PlatformSettingCreate, ip: Optional[str] = None):
        return await platform_engine.update_setting(actor_id, actor_role, payload, ip)

    @staticmethod
    async def get_settings() -> List[Dict[str, Any]]:
        settings = await settings_repo.get_all_settings()
        for s in settings: s["id"] = str(s["_id"])
        return settings

    @staticmethod
    async def update_feature_flag(actor_id: str, actor_role: str, payload: FeatureFlagCreate, ip: Optional[str] = None):
        return await platform_engine.update_feature_flag(actor_id, actor_role, payload, ip)

    @staticmethod
    async def get_feature_flags() -> List[Dict[str, Any]]:
        flags = await feature_flag_repo.get_all_flags()
        for f in flags: f["id"] = str(f["_id"])
        return flags

    @staticmethod
    async def create_broadcast(actor_id: str, actor_role: str, payload: BroadcastCommandPayload, ip: Optional[str] = None):
        return await platform_engine.create_broadcast(actor_id, actor_role, payload, ip)
