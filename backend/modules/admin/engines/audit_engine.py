from typing import Dict, Any, Optional
from datetime import datetime
from modules.admin.schemas import ActionType, ResourceType
from modules.admin.repository import audit_repo

class AuditEngine:
    @staticmethod
    async def log_action(
        actor_id: str,
        actor_role: str,
        action: ActionType,
        resource_type: Optional[ResourceType] = None,
        resource_id: Optional[str] = None,
        old_value: Optional[Dict[str, Any]] = None,
        new_value: Optional[Dict[str, Any]] = None,
        reason: Optional[str] = None,
        ip_address: Optional[str] = None
    ) -> None:
        """
        Creates an immutable audit record.
        """
        doc = {
            "actorId": actor_id,
            "actorRole": actor_role,
            "action": action.value,
            "resourceType": resource_type.value if resource_type else None,
            "resourceId": resource_id,
            "oldValue": old_value,
            "newValue": new_value,
            "reason": reason,
            "ipAddress": ip_address
        }
        await audit_repo.log(doc)

audit_engine = AuditEngine()
