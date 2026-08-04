from fastapi import APIRouter, Depends, Query
from typing import Dict, Any, List
from modules.auth.dependencies import get_current_user_role
from modules.monitoring.schemas import SystemHealthResponse
from modules.monitoring.service import MonitoringService
from core.exceptions import UnauthorizedException

router = APIRouter(prefix="/api/v1/monitoring", tags=["Observability & Monitoring"])

def require_sysadmin(role: str = Depends(get_current_user_role)):
    if role not in ["SUPER_ADMIN", "ADMIN"]:
        raise UnauthorizedException("System Admin access required.")
    return role

@router.get("/health", response_model=SystemHealthResponse)
async def get_health():
    """
    Public readiness/liveness probe for K8s / Load Balancers.
    """
    return await MonitoringService.get_health()

@router.get("/metrics", response_model=Dict[str, float])
async def get_metrics():
    """
    Prometheus scrape target placeholder.
    In production, this would return text/plain Prometheus format.
    """
    return MonitoringService.get_metrics()

@router.get("/logs/audit", response_model=Dict[str, Any])
async def get_audit_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    role: str = Depends(require_sysadmin)
):
    """
    Fetch immutable business audit logs from MongoDB.
    """
    items, total = await MonitoringService.get_audit_logs(skip, limit)
    return {"items": items, "total": total, "skip": skip, "limit": limit}
