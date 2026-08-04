from fastapi import APIRouter, Depends
from typing import Dict, Any
from modules.auth.dependencies import get_current_user_role
from core.exceptions import UnauthorizedException
from modules.gateway.service import GatewayService

router = APIRouter(prefix="/api/v1/gateway", tags=["API Gateway & Traffic Management"])

def require_super_admin(role: str = Depends(get_current_user_role)):
    if role != "SUPER_ADMIN":
        raise UnauthorizedException("Super Admin access required for Gateway Operations.")
    return role

@router.get("/health", response_model=Dict[str, str])
async def get_health():
    return {"status": "HEALTHY", "subsystem": "API Gateway Platform"}

@router.get("/status", response_model=Dict[str, Any])
async def get_status(role: str = Depends(require_super_admin)):
    return GatewayService.get_gateway_status()

@router.get("/routes", response_model=Dict[str, Any])
async def get_routes(role: str = Depends(require_super_admin)):
    # MVP static route reporting. In a microservices mesh, this polls the registry.
    return {
        "routes": [
            "/api/v1/auth",
            "/api/v1/users",
            "/api/v1/equipment",
            "/api/v1/orders",
            "/api/v1/gateway"
        ]
    }
