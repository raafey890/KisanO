from typing import Dict, Any, Optional
from datetime import datetime, timezone
from modules.admin.schemas import PlatformSettingCreate, ActionType
from modules.admin.repository import settings_repo
from modules.admin.cache import config_cache
from modules.admin.engines.audit_engine import audit_engine

class SettingsEngine:
    @staticmethod
    async def update_setting(actor_id: str, actor_role: str, data: PlatformSettingCreate, ip_address: Optional[str] = None) -> str:
        # Check if exists to get old value
        existing = await settings_repo.collection.find_one({"key": data.key})
        old_value = existing.get("value") if existing else None
        new_version = existing.get("version", 0) + 1 if existing else 1
        
        doc = {
            "key": data.key,
            "value": data.value,
            "description": data.description,
            "category": data.category,
            "version": new_version,
            "updatedAt": datetime.now(timezone.utc),
            "updatedBy": actor_id
        }
        
        # Upsert
        await settings_repo.collection.update_one(
            {"key": data.key},
            {"$set": doc},
            upsert=True
        )
        
        # Hot reload cache
        config_cache.update_setting_cache(data.key, data.value)
        
        # Audit
        await audit_engine.log_action(
            actor_id=actor_id,
            actor_role=actor_role,
            action=ActionType.UPDATE_SETTING,
            old_value={"value": old_value},
            new_value={"value": data.value},
            ip_address=ip_address
        )
        
        return data.key

settings_engine = SettingsEngine()
