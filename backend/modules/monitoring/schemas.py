from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from datetime import datetime
from modules.monitoring.constants import LogLevel, ComponentStatus

class StructuredLog(BaseModel):
    timestamp: datetime
    level: LogLevel
    service: str = "kisano-backend"
    module: str
    message: str
    requestId: Optional[str] = None
    correlationId: Optional[str] = None
    userId: Optional[str] = None
    role: Optional[str] = None
    endpoint: Optional[str] = None
    method: Optional[str] = None
    statusCode: Optional[int] = None
    executionTimeMs: Optional[float] = None
    ipAddress: Optional[str] = None
    payload: Optional[Dict[str, Any]] = None

class ComponentHealth(BaseModel):
    name: str
    status: ComponentStatus
    latencyMs: Optional[float] = None
    error: Optional[str] = None

class SystemHealthResponse(BaseModel):
    status: ComponentStatus
    timestamp: datetime
    version: str = "1.0.0"
    components: List[ComponentHealth]

class MetricPayload(BaseModel):
    name: str
    value: float
    labels: Dict[str, str] = {}
