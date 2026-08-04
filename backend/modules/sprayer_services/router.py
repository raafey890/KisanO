from fastapi import APIRouter, Depends, status, UploadFile, File, Query
from typing import Dict, Any, List, Optional
from shared.responses import success_response, SuccessResponse
from modules.sprayer_services.schemas import (
    ServiceCreate, ServiceUpdate, ServiceResponse, PaginatedServiceResponse,
    PricingUpdate, AvailabilityCreate
)
from modules.sprayer_services.service import SprayerServiceManagement
from modules.sprayer_services.constants import ServiceStatus, ServiceType
from modules.auth.dependencies import get_current_user, RequireRole
from modules.auth.constants import UserRole

router = APIRouter()

@router.post(
    "",
    response_model=SuccessResponse[Dict[str, str]],
    status_code=status.HTTP_201_CREATED,
    summary="Create a new sprayer service"
)
async def create_service(
    data: ServiceCreate,
    current_user: Dict[str, Any] = Depends(RequireRole([UserRole.SPRAYER_OPERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]))
):
    """
    Register a new sprayer service (e.g. Drone Spraying). 
    Automatically embeds an immutable Operator Snapshot.
    Initial status is set to DRAFT.
    """
    service_id = await SprayerServiceManagement.create_service(str(current_user["_id"]), data)
    return success_response(message="Service created successfully in DRAFT mode", data={"id": service_id})


@router.get(
    "/{service_id}",
    response_model=SuccessResponse[ServiceResponse],
    summary="Get service details"
)
async def get_service(service_id: str):
    """
    Fetch the complete embedded service document including pricing, availability, and coverage.
    """
    service = await SprayerServiceManagement.get_service(service_id)
    return success_response(message="Service retrieved", data=service)


@router.put(
    "/{service_id}",
    response_model=SuccessResponse[ServiceResponse],
    summary="Update service details"
)
async def update_service(
    service_id: str,
    data: ServiceUpdate,
    current_version: int = Query(..., description="Current version for optimistic locking"),
    current_user: Dict[str, Any] = Depends(RequireRole([UserRole.SPRAYER_OPERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]))
):
    """
    Updates the base service document. MUST provide the `current_version` to prevent Lost Updates.
    """
    service = await SprayerServiceManagement.update_service(service_id, str(current_user["_id"]), current_version, data)
    return success_response(message="Service updated successfully", data=service)


@router.patch(
    "/{service_id}/status",
    response_model=SuccessResponse[None],
    summary="Change service status (FSM)"
)
async def change_status(
    service_id: str,
    new_status: ServiceStatus,
    current_version: int = Query(...),
    current_user: Dict[str, Any] = Depends(RequireRole([UserRole.SPRAYER_OPERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]))
):
    """
    Transitions the service through the Finite State Machine (e.g., DRAFT -> PENDING_APPROVAL).
    Admins can force transitions.
    """
    await SprayerServiceManagement.change_status(service_id, str(current_user["_id"]), current_user["role"], new_status, current_version)
    return success_response(message=f"Status changed to {new_status.value}")


@router.patch(
    "/{service_id}/pricing",
    response_model=SuccessResponse[None],
    summary="Update service pricing"
)
async def update_pricing(
    service_id: str,
    data: PricingUpdate,
    current_version: int = Query(...),
    current_user: Dict[str, Any] = Depends(RequireRole([UserRole.SPRAYER_OPERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]))
):
    """
    Updates the pricing block and logs the change to the separated `pricing_history` collection.
    """
    await SprayerServiceManagement.update_pricing(service_id, str(current_user["_id"]), current_version, data)
    return success_response(message="Pricing updated successfully")


@router.post(
    "/{service_id}/availability",
    response_model=SuccessResponse[Dict[str, str]],
    summary="Block availability calendar"
)
async def add_availability(
    service_id: str,
    data: AvailabilityCreate,
    current_user: Dict[str, Any] = Depends(RequireRole([UserRole.SPRAYER_OPERATOR]))
):
    """
    Adds a block to the calendar. Validates that the requested time slot does not overlap with existing blocks.
    """
    block_id = await SprayerServiceManagement.add_availability_block(service_id, str(current_user["_id"]), data)
    return success_response(message="Calendar blocked successfully", data={"id": block_id})


@router.post(
    "/{service_id}/upload-images",
    response_model=SuccessResponse[Dict[str, str]],
    summary="Upload service image"
)
async def upload_image(
    service_id: str,
    file: UploadFile = File(...),
    is_cover: bool = Query(False),
    current_user: Dict[str, Any] = Depends(RequireRole([UserRole.SPRAYER_OPERATOR]))
):
    """
    Uploads an image via MediaService and pushes it into the embedded images array.
    """
    contents = await file.read()
    url = await SprayerServiceManagement.upload_image(service_id, str(current_user["_id"]), contents, file.filename, is_cover)
    return success_response(message="Image uploaded successfully", data={"url": url})


@router.get(
    "/query/search",
    response_model=SuccessResponse[PaginatedServiceResponse],
    summary="Search sprayer services"
)
async def search_services(
    text: Optional[str] = Query(None),
    service_type: Optional[ServiceType] = Query(None),
    operator_id: Optional[str] = Query(None),
    status: Optional[ServiceStatus] = Query(ServiceStatus.APPROVED),
    lng: Optional[float] = Query(None, description="Longitude for spatial search"),
    lat: Optional[float] = Query(None, description="Latitude for spatial search"),
    radius_km: Optional[float] = Query(50.0, description="Search radius in KM"),
    sort: Optional[str] = Query("newest"),
    skip: int = 0,
    limit: int = 20
):
    """
    Search sprayer services globally. 
    Supports GeoSpatial (2dsphere) search if lng/lat are provided.
    Uses MongoDB Text Indexes on businessName and serviceType.
    """
    filters = {}
    if text: filters["text"] = text
    if service_type: filters["serviceType"] = service_type.value
    if operator_id: filters["operatorId"] = operator_id
    if status: filters["status"] = status.value
    
    if lng is not None and lat is not None:
        filters["lng"] = lng
        filters["lat"] = lat
        filters["radiusKm"] = radius_km
        
    if sort: filters["sort"] = sort

    items, total = await SprayerServiceManagement.search(filters, skip, limit)
    return success_response(message="Services found", data={"items": items, "total": total, "skip": skip, "limit": limit})
