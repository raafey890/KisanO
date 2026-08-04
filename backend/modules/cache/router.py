from fastapi import APIRouter, Depends, Query, Body
from typing import Dict, Any, List
from modules.auth.dependencies import get_current_user_role
from modules.cache.schemas import CacheHealthResponse, CacheStats
from modules.cache.service import CacheService
from core.exceptions import UnauthorizedException

router = APIRouter(prefix="/api/v1/cache", tags=["Distributed Cache"])

def require_sysadmin(role: str = Depends(get_current_user_role)):
    if role not in ["SUPER_ADMIN", "ADMIN"]:
        raise UnauthorizedException("System Admin access required.")
    return role

@router.get("/health", response_model=CacheHealthResponse)
async def get_health(role: str = Depends(require_sysadmin)):
    """
    Returns the L1 and L2 cache cluster health.
    """
    return CacheService.get_health()

@router.get("/stats", response_model=CacheStats)
async def get_stats(role: str = Depends(require_sysadmin)):
    """
    Returns hit/miss ratios and eviction metrics.
    """
    return CacheService.get_stats()

@router.post("/invalidate", response_model=Dict[str, str])
async def invalidate_cache(
    pattern: str = Body(..., embed=True),
    role: str = Depends(require_sysadmin)
):
    """
    Force clears a cache pattern (e.g. `equipment:*`).
    """
    await CacheService.invalidate(pattern)
    return {"message": f"Cache invalidated for pattern: {pattern}"}

@router.post("/warmup", response_model=Dict[str, str])
async def trigger_warmup(role: str = Depends(require_sysadmin)):
    """
    Manually triggers heavy dashboard pre-computation.
    """
    await CacheService.warmup()
    return {"message": "Cache warming triggered asynchronously"}
