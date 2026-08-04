from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from modules.security.constants import SecurityEventType, ThreatLevel

class SecurityEventPayload(BaseModel):
    event_type: SecurityEventType
    user_id: Optional[str] = None
    ip_address: Optional[str] = None
    endpoint: Optional[str] = None
    details: Dict[str, Any] = Field(default_factory=dict)
    threat_level: ThreatLevel = ThreatLevel.LOW

class SecurityEventResponse(SecurityEventPayload):
    id: str
    timestamp: datetime
