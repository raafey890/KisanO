from fastapi import APIRouter, Depends, Query
from typing import Dict, Any
from modules.auth.dependencies import get_current_user_role
from core.exceptions import UnauthorizedException
from modules.security.service import SecurityService

router = APIRouter(prefix="/api/v1/security", tags=["Security & Hardening"])

def require_super_admin(role: str = Depends(get_current_user_role)):
    if role != "SUPER_ADMIN":
        raise UnauthorizedException("Super Admin access required for Security Operations.")
    return role

@router.get("/health", response_model=Dict[str, str])
async def get_health():
    return {"status": "HEALTHY", "subsystem": "Zero Trust Security Platform"}

@router.get("/status", response_model=Dict[str, Any])
async def get_status(role: str = Depends(require_super_admin)):
    return SecurityService.get_security_status()

@router.get("/audit", response_model=Dict[str, Any])
async def get_audit_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    role: str = Depends(require_super_admin)
):
    items, total = await SecurityService.get_audit_logs(skip, limit)
    return {"items": items, "total": total, "skip": skip, "limit": limit}
