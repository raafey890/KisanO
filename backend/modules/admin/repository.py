from typing import Optional, Dict, Any, List
from shared.base_repository import BaseRepository
from datetime import datetime, timezone

class SettingsRepository(BaseRepository):
    def __init__(self):
        super().__init__("platform_settings")
        
    async def get_all_settings(self) -> List[Dict[str, Any]]:
        cursor = self.collection.find({"isDeleted": {"$ne": True}})
        return await cursor.to_list(length=1000)

class FeatureFlagRepository(BaseRepository):
    def __init__(self):
        super().__init__("feature_flags")
        
    async def get_all_flags(self) -> List[Dict[str, Any]]:
        cursor = self.collection.find({"isDeleted": {"$ne": True}})
        return await cursor.to_list(length=1000)

class AdminAuxRepository(BaseRepository):
    def __init__(self, collection_name: str):
        super().__init__(collection_name)

    async def log(self, data: Dict[str, Any]):
        data["createdAt"] = datetime.now(timezone.utc)
        await self.create(data)

settings_repo = SettingsRepository()
feature_flag_repo = FeatureFlagRepository()

audit_repo = AdminAuxRepository("admin_audit_logs")
fraud_repo = AdminAuxRepository("fraud_reports")
health_repo = AdminAuxRepository("system_health")
broadcast_repo = AdminAuxRepository("broadcast_history")
