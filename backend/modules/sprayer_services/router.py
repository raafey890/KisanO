from fastapi import APIRouter, Depends, Query
from typing import Optional

from shared.responses import success_response, SuccessResponse
from modules.auth.dependencies import get_current_user, RequireRole
from modules.auth.constants import UserRole

router = APIRouter()


@router.get("/query/search")
async def search_sprayer_services(
    service_type: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
):
    """Public endpoint to search sprayer services."""
    return success_response(
        message="Sprayer services retrieved", data={"items": [], "total": 0}
    )


@router.post("/", dependencies=[Depends(RequireRole([UserRole.SPRAYER_OPERATOR]))])
async def create_sprayer_service(
    current_user: dict = Depends(get_current_user)
):
    return success_response(
        message="Sprayer service created", data={}
    )


@router.get("/{service_id}")
async def get_sprayer_service(service_id: str):
    return success_response(message="Sprayer service details", data={})


@router.put("/{service_id}", dependencies=[Depends(RequireRole([UserRole.SPRAYER_OPERATOR]))])
async def update_sprayer_service(
    service_id: str,
    current_user: dict = Depends(get_current_user)
):
    return success_response(message="Service updated", data={})
