from fastapi import APIRouter, Depends, Query, Body, Request
from typing import Dict, Any, List
from modules.auth.dependencies import get_current_user, RequireRole
from modules.admin.schemas import ApprovalCommandPayload, BroadcastCommandPayload, PlatformSettingCreate, FeatureFlagCreate, ResourceType
from modules.admin.service import AdminService
from core.exceptions import UnauthorizedException
from shared.responses import success_response, SuccessResponse
from modules.auth.constants import UserRole

router = APIRouter(tags=["Admin & Platform Management"])

require_admin = RequireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUPPORT_AGENT])

@router.get("/dashboard", response_model=SuccessResponse[Dict[str, Any]])
async def get_dashboard(user: Dict[str, Any] = Depends(require_admin)):
    data = await AdminService.get_dashboard(user.get("role"))
    return success_response(message="Success", data=data)

@router.get("/system-health", response_model=SuccessResponse[Dict[str, Any]])
async def get_system_health(user: Dict[str, Any] = Depends(require_admin)):
    data = await AdminService.get_system_health(user.get("role"))
    return success_response(message="Success", data=data)

@router.get("/audit-logs", response_model=SuccessResponse[Dict[str, Any]])
async def get_audit_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    user: Dict[str, Any] = Depends(require_admin)
):
    items, total = await AdminService.get_audit_logs(skip, limit)
    return success_response(message="Success", data={"items": items, "total": total, "skip": skip, "limit": limit})

@router.patch("/approve", response_model=SuccessResponse[Dict[str, str]])
async def process_approval(
    request: Request,
    payload: ApprovalCommandPayload,
    user: Dict[str, Any] = Depends(require_admin)
):
    ip = request.client.host if request.client else None
    await AdminService.process_approval(str(user["_id"]), user.get("role"), payload, ip)
    return success_response(message="Approval processed successfully")

@router.patch("/moderate", response_model=SuccessResponse[Dict[str, str]])
async def process_moderation(
    request: Request,
    resource_id: str = Body(...),
    resource_type: ResourceType = Body(...),
    action: str = Body(...),
    reason: str = Body(...),
    user: Dict[str, Any] = Depends(require_admin)
):
    ip = request.client.host if request.client else None
    await AdminService.process_moderation(str(user["_id"]), user.get("role"), resource_id, resource_type, action, reason, ip)
    return success_response(message="Moderation processed successfully")

@router.get("/settings", response_model=SuccessResponse[List[Dict[str, Any]]])
async def get_settings(user: Dict[str, Any] = Depends(require_admin)):
    data = await AdminService.get_settings()
    return success_response(message="Success", data=data)

@router.patch("/settings", response_model=SuccessResponse[Dict[str, str]])
async def update_setting(
    request: Request,
    payload: PlatformSettingCreate,
    user: Dict[str, Any] = Depends(require_admin)
):
    ip = request.client.host if request.client else None
    await AdminService.update_setting(str(user["_id"]), user.get("role"), payload, ip)
    return success_response(message="Setting updated successfully")

@router.get("/feature-flags", response_model=SuccessResponse[List[Dict[str, Any]]])
async def get_feature_flags(user: Dict[str, Any] = Depends(require_admin)):
    data = await AdminService.get_feature_flags()
    return success_response(message="Success", data=data)

@router.patch("/feature-flags", response_model=SuccessResponse[Dict[str, str]])
async def update_feature_flag(
    request: Request,
    payload: FeatureFlagCreate,
    user: Dict[str, Any] = Depends(require_admin)
):
    ip = request.client.host if request.client else None
    await AdminService.update_feature_flag(str(user["_id"]), user.get("role"), payload, ip)
    return success_response(message="Feature flag updated successfully")

@router.post("/broadcast", response_model=SuccessResponse[Dict[str, str]])
async def create_broadcast(
    request: Request,
    payload: BroadcastCommandPayload,
    user: Dict[str, Any] = Depends(require_admin)
):
    ip = request.client.host if request.client else None
    await AdminService.create_broadcast(str(user["_id"]), user.get("role"), payload, ip)
    return success_response(message="Broadcast created successfully")
