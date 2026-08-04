from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime
from modules.cache.constants import CacheStatus

class CacheStats(BaseModel):
    hits: int
    misses: int
    hitRatio: float
    evictions: int
    l1Items: int
    l2Status: CacheStatus
    uptimeSeconds: float

class CacheHealthResponse(BaseModel):
    status: CacheStatus
    timestamp: datetime
    l1Status: str = "UP"
    l2Status: str
    lastL2Error: Optional[str] = None
