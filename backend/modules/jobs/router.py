from fastapi import APIRouter, Depends, Query, Path
from typing import Dict, Any, List
from modules.auth.dependencies import get_current_user_role
from modules.jobs.schemas import JobStats
from modules.jobs.service import JobService
from core.exceptions import UnauthorizedException

router = APIRouter(prefix="/api/v1/jobs", tags=["Background Jobs & Scheduler"])

def require_sysadmin(role: str = Depends(get_current_user_role)):
    if role not in ["SUPER_ADMIN", "ADMIN"]:
        raise UnauthorizedException("System Admin access required.")
    return role

@router.get("/health", response_model=Dict[str, str])
async def get_health(role: str = Depends(require_sysadmin)):
    return {"status": "HEALTHY", "provider": "AsyncJobProvider"}

@router.get("/stats", response_model=JobStats)
async def get_stats(role: str = Depends(require_sysadmin)):
    return await JobService.get_stats()

@router.get("", response_model=Dict[str, Any])
async def get_active_jobs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    role: str = Depends(require_sysadmin)
):
    items, total = await JobService.get_active_jobs(skip, limit)
    return {"items": items, "total": total, "skip": skip, "limit": limit}
    
@router.get("/dlq", response_model=Dict[str, Any])
async def get_dlq_jobs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    role: str = Depends(require_sysadmin)
):
    items, total = await JobService.get_dlq_jobs(skip, limit)
    return {"items": items, "total": total, "skip": skip, "limit": limit}

@router.post("/{job_id}/replay", response_model=Dict[str, str])
async def replay_job(
    job_id: str = Path(...),
    role: str = Depends(require_sysadmin)
):
    """
    Pulls a failed job out of the DLQ and re-queues it.
    """
    await JobService.replay_dlq_job(job_id)
    return {"message": f"Job {job_id} successfully re-queued from DLQ"}
