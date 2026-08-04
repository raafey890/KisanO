from typing import Dict, Any, List
from shared.base_repository import BaseRepository
from datetime import datetime, timezone

class AuditRepository(BaseRepository):
    def __init__(self):
        super().__init__("system_audit_logs")
        
    async def log_event(self, log_data: Dict[str, Any]):
        log_data["createdAt"] = datetime.now(timezone.utc)
        await self.create(log_data)

audit_repo = AuditRepository()
