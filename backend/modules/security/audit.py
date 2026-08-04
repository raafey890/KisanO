import logging
from datetime import datetime, timezone
from modules.security.repository import security_audit_repo
from modules.security.schemas import SecurityEventPayload

logger = logging.getLogger(__name__)

class SecurityAuditEngine:
    @staticmethod
    async def log_event(event: SecurityEventPayload):
        doc = event.model_dump()
        doc["timestamp"] = datetime.now(timezone.utc)
        
        # Write to immutable audit collection
        try:
            await security_audit_repo.create(doc)
        except Exception as e:
            # Fallback to standard logging if DB fails to ensure we never lose security events
            logger.critical(f"Failed to write Security Audit to DB. Event: {doc}. Error: {e}")
            
audit_engine = SecurityAuditEngine()
