from pydantic import BaseModel
from typing import Dict, Any, Optional

class RequestMetadata(BaseModel):
    version: str
    tenant_id: Optional[str] = None
    correlation_id: str
    client_ip: str

class GatewayResponseEnvelope(BaseModel):
    success: bool
    data: Optional[Any] = None
    error: Optional[Dict[str, Any]] = None
    meta: RequestMetadata
