from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from modules.admin.constants import FeatureFlagState, ActionType, ResourceType

# --- Audit Logs ---

class AuditLogEntry(BaseModel):
    action: ActionType
    actorId: str
    actorRole: str
    resourceType: Optional[ResourceType] = None
    resourceId: Optional[str] = None
    oldValue: Optional[Dict[str, Any]] = None
    newValue: Optional[Dict[str, Any]] = None
    reason: Optional[str] = None
    ipAddress: Optional[str] = None
    createdAt: datetime

# --- Feature Flags ---

class FeatureFlagCreate(BaseModel):
    flagKey: str # e.g. "AI_PLANT_DOCTOR_ENABLED"
    state: FeatureFlagState
    description: str
    rolloutPercentage: int = 100
    regions: List[str] = []

class FeatureFlagResponse(FeatureFlagCreate):
    id: str
    updatedAt: datetime
    updatedBy: str

# --- Platform Settings ---

class PlatformSettingCreate(BaseModel):
    key: str # e.g. "COMMISSION_RATE_MARKETPLACE"
    value: Any
    description: str
    category: str # e.g. "COMMISSION", "SECURITY"

class PlatformSettingResponse(PlatformSettingCreate):
    id: str
    version: int
    updatedAt: datetime
    updatedBy: str

# --- Approval Commands ---

class ApprovalCommandPayload(BaseModel):
    resourceId: str
    resourceType: ResourceType
    approve: bool
    reason: Optional[str] = None

class BroadcastCommandPayload(BaseModel):
    title: str
    body: str
    targetRoles: List[str] = [] # Empty means global
    targetRegions: List[str] = []
