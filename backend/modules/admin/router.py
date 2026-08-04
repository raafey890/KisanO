from fastapi import APIRouter, Depends, Query, Body, Request
from typing import Dict, Any, List
from modules.auth.dependencies import get_current_user_id, get_current_user_role
from modules.admin.schemas import ApprovalCommandPayload, BroadcastCommandPayload, PlatformSettingCreate, FeatureFlagCreate, ResourceType
from modules.admin.service import AdminService
from core.exceptions import UnauthorizedException

router = APIRouter(prefix="/api/v1/admin", tags=["Admin & Platform Management"])

def require_admin(role: str = Depends(get_current_user_role)):
    if role not in ["SUPER_ADMIN", "ADMIN", "SUPPORT_MANAGER", "MODERATOR"]:
        raise UnauthorizedException("Admin access required.")
    return role

@router.get("/dashboard", response_model=Dict[str, Any])
async def get_dashboard(role: str = Depends(require_admin)):
    return await AdminService.get_dashboard(role)

@router.get("/system-health", response_model=Dict[str, Any])
async def get_system_health(role: str = Depends(require_admin)):
    return await AdminService.get_system_health(role)

@router.get("/audit-logs", response_model=Dict[str, Any])
async def get_audit_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    role: str = Depends(require_admin)
):
    items, total = await AdminService.get_audit_logs(skip, limit)
    return {"items": items, "total": total, "skip": skip, "limit": limit}

@router.patch("/approve", response_model=Dict[str, str])
async def process_approval(
    request: Request,
    payload: ApprovalCommandPayload,
    user_id: str = Depends(get_current_user_id),
    role: str = Depends(require_admin)
):
    ip = request.client.host if request.client else None
    await AdminService.process_approval(user_id, role, payload, ip)
    return {"message": "Approval processed successfully"}

@router.patch("/moderate", response_model=Dict[str, str])
async def process_moderation(
    request: Request,
    resource_id: str = Body(...),
    resource_type: ResourceType = Body(...),
    action: str = Body(...),
    reason: str = Body(...),
    user_id: str = Depends(get_current_user_id),
    role: str = Depends(require_admin)
):
    ip = request.client.host if request.client else None
    await AdminService.process_moderation(user_id, role, resource_id, resource_type, action, reason, ip)
    return {"message": "Moderation processed successfully"}

@router.get("/settings", response_model=List[Dict[str, Any]])
async def get_settings(role: str = Depends(require_admin)):
    return await AdminService.get_settings()

@router.patch("/settings", response_model=Dict[str, str])
async def update_setting(
    request: Request,
    payload: PlatformSettingCreate,
    user_id: str = Depends(get_current_user_id),
    role: str = Depends(require_admin)
):
    ip = request.client.host if request.client else None
    await AdminService.update_setting(user_id, role, payload, ip)
    return {"message": "Setting updated successfully"}

@router.get("/feature-flags", response_model=List[Dict[str, Any]])
async def get_feature_flags(role: str = Depends(require_admin)):
    return await AdminService.get_feature_flags()

@router.patch("/feature-flags", response_model=Dict[str, str])
async def update_feature_flag(
    request: Request,
    payload: FeatureFlagCreate,
    user_id: str = Depends(get_current_user_id),
    role: str = Depends(require_admin)
):
    ip = request.client.host if request.client else None
    await AdminService.update_feature_flag(user_id, role, payload, ip)
    return {"message": "Feature flag updated successfully"}

@router.post("/broadcast", response_model=Dict[str, str])
async def create_broadcast(
    request: Request,
    payload: BroadcastCommandPayload,
    user_id: str = Depends(get_current_user_id),
    role: str = Depends(require_admin)
):
    ip = request.client.host if request.client else None
    await AdminService.create_broadcast(user_id, role, payload, ip)
    return {"message": "Broadcast created successfully"}
