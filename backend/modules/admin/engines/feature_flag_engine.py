from typing import Dict, Any, Optional
from datetime import datetime, timezone
from modules.admin.schemas import FeatureFlagCreate, ActionType
from modules.admin.repository import feature_flag_repo
from modules.admin.cache import config_cache
from modules.admin.engines.audit_engine import audit_engine

class FeatureFlagEngine:
    @staticmethod
    async def update_flag(actor_id: str, actor_role: str, data: FeatureFlagCreate, ip_address: Optional[str] = None) -> str:
        existing = await feature_flag_repo.collection.find_one({"flagKey": data.flagKey})
        old_value = existing.get("state") if existing else None
        
        doc = {
            "flagKey": data.flagKey,
            "state": data.state.value,
            "description": data.description,
            "rolloutPercentage": data.rolloutPercentage,
            "regions": data.regions,
            "updatedAt": datetime.now(timezone.utc),
            "updatedBy": actor_id
        }
        
        # Upsert
        await feature_flag_repo.collection.update_one(
            {"flagKey": data.flagKey},
            {"$set": doc},
            upsert=True
        )
        
        # Hot reload cache
        config_cache.update_flag_cache(data.flagKey, doc)
        
        # Audit
        await audit_engine.log_action(
            actor_id=actor_id,
            actor_role=actor_role,
            action=ActionType.UPDATE_FLAG,
            old_value={"state": old_value},
            new_value={"state": data.state.value},
            ip_address=ip_address
        )
        
        return data.flagKey

    @staticmethod
    def is_enabled(flag_key: str, user_id: str = None, region: str = None) -> bool:
        """
        Determines if a feature is enabled. Uses the cache for sub-millisecond response.
        """
        flag = config_cache.get_flag(flag_key)
        if not flag:
            return False # Default secure
            
        state = flag.get("state")
        if state == "DISABLED": return False
        if state == "ENABLED": return True
        if state == "MAINTENANCE": return False
        
        if state == "REGIONAL" and region:
            if region not in flag.get("regions", []):
                return False
                
        # Rollout percentage logic could hash user_id to determine inclusion
        return True

feature_flag_engine = FeatureFlagEngine()
