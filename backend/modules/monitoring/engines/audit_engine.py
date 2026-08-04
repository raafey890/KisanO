from typing import Dict, Any
from modules.monitoring.repository import audit_repo
from modules.monitoring.context import get_request_id, get_correlation_id, get_user_id

class AuditEngine:
    @staticmethod
    async def log_audit_event(action: str, resource_type: str, resource_id: str, payload: Dict[str, Any]):
        """
        Critical business events that must be persisted to MongoDB securely.
        """
        doc = {
            "action": action,
            "resourceType": resource_type,
            "resourceId": resource_id,
            "payload": payload,
            "requestId": get_request_id(),
            "correlationId": get_correlation_id(),
            "userId": get_user_id()
        }
        await audit_repo.log_event(doc)

audit_engine = AuditEngine()
