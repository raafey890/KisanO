from fastapi import APIRouter, Depends, status, UploadFile, File, Query
from typing import Dict, Any, List, Optional
from shared.responses import success_response, SuccessResponse
from modules.equipment.schemas import (
    EquipmentCreate, EquipmentUpdate, EquipmentResponse, PaginatedEquipmentResponse,
    AvailabilityCreate, AvailabilityResponse, MaintenanceCreate, MaintenanceResponse
)
from modules.equipment.service import EquipmentService
from modules.equipment.constants import EquipmentStatus
from modules.auth.dependencies import get_current_user, RequireRole
from modules.auth.constants import UserRole

router = APIRouter()

@router.post(
    "",
    response_model=SuccessResponse[Dict[str, str]],
    status_code=status.HTTP_201_CREATED,
    summary="Register new equipment"
)
async def create_equipment(
    data: EquipmentCreate,
    current_user: Dict[str, Any] = Depends(RequireRole([UserRole.EQUIPMENT_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN]))
):
    """
    Register a new piece of equipment. Automatically pulls Owner Snapshot from the Users Module.
    Initial status is set to DRAFT.
    """
    eq_id = await EquipmentService.create_equipment(str(current_user["_id"]), data)
    return success_response(message="Equipment registered successfully in DRAFT mode", data={"id": eq_id})


@router.get(
    "/{equipment_id}",
    response_model=SuccessResponse[EquipmentResponse],
    summary="Get equipment details"
)
async def get_equipment(equipment_id: str):
    """
    Fetch the complete embedded equipment document.
    """
    eq = await EquipmentService.get_equipment(equipment_id)
    return success_response(message="Equipment retrieved", data=eq)


@router.put(
    "/{equipment_id}",
    response_model=SuccessResponse[EquipmentResponse],
    summary="Update equipment with Optimistic Locking"
)
async def update_equipment(
    equipment_id: str,
    data: EquipmentUpdate,
    current_version: int = Query(..., description="Current document version for optimistic locking"),
    current_user: Dict[str, Any] = Depends(RequireRole([UserRole.EQUIPMENT_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN]))
):
    """
    Updates the equipment document. MUST provide the `current_version` to prevent Lost Updates.
    """
    eq = await EquipmentService.update_equipment(equipment_id, str(current_user["_id"]), current_version, data)
    return success_response(message="Equipment updated successfully", data=eq)


@router.patch(
    "/{equipment_id}/status",
    response_model=SuccessResponse[None],
    summary="Change equipment status (FSM)"
)
async def change_status(
    equipment_id: str,
    new_status: EquipmentStatus,
    current_version: int = Query(...),
    current_user: Dict[str, Any] = Depends(RequireRole([UserRole.EQUIPMENT_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN]))
):
    """
    Transitions the equipment through the Finite State Machine (e.g., DRAFT -> PENDING_APPROVAL).
    Admins can force transitions.
    """
    await EquipmentService.change_status(equipment_id, str(current_user["_id"]), current_user["role"], new_status, current_version)
    return success_response(message=f"Status changed to {new_status.value}")


@router.post(
    "/{equipment_id}/upload-images",
    response_model=SuccessResponse[Dict[str, str]],
    summary="Upload equipment image"
)
async def upload_image(
    equipment_id: str,
    file: UploadFile = File(...),
    is_cover: bool = Query(False),
    current_user: Dict[str, Any] = Depends(RequireRole([UserRole.EQUIPMENT_OWNER]))
):
    """
    Uploads an image via MediaService and pushes it into the embedded images array.
    """
    contents = await file.read()
    url = await EquipmentService.upload_image(equipment_id, str(current_user["_id"]), contents, file.filename, is_cover)
    return success_response(message="Image uploaded successfully", data={"url": url})


@router.post(
    "/{equipment_id}/availability",
    response_model=SuccessResponse[Dict[str, str]],
    summary="Block availability calendar"
)
async def add_availability(
    equipment_id: str,
    data: AvailabilityCreate,
    current_user: Dict[str, Any] = Depends(RequireRole([UserRole.EQUIPMENT_OWNER]))
):
    """
    Adds a block to the calendar. Validates that the requested time slot does not overlap with existing blocks.
    """
    block_id = await EquipmentService.add_availability_block(equipment_id, str(current_user["_id"]), data)
    return success_response(message="Calendar blocked successfully", data={"id": block_id})


@router.post(
    "/{equipment_id}/maintenance",
    response_model=SuccessResponse[Dict[str, str]],
    summary="Log maintenance record"
)
async def log_maintenance(
    equipment_id: str,
    data: MaintenanceCreate,
    current_user: Dict[str, Any] = Depends(RequireRole([UserRole.EQUIPMENT_OWNER]))
):
    """
    Logs a maintenance service ticket to the separate maintenance collection.
    """
    m_id = await EquipmentService.log_maintenance(equipment_id, str(current_user["_id"]), data)
    return success_response(message="Maintenance logged successfully", data={"id": m_id})


@router.get(
    "/query/search",
    response_model=SuccessResponse[PaginatedEquipmentResponse],
    summary="Search equipment"
)
async def search_equipment(
    text: Optional[str] = Query(None),
    category: Optional[EquipmentCategory] = Query(None),
    status: Optional[EquipmentStatus] = Query(EquipmentStatus.AVAILABLE),
    owner_id: Optional[str] = Query(None),
    sort: Optional[str] = Query("newest", description="newest, price_low, price_high, rating"),
    skip: int = 0,
    limit: int = 20
):
    """
    Search equipment globally. Uses MongoDB Text Indexes.
    """
    filters = {}
    if text: filters["text"] = text
    if category: filters["category"] = category.value
    if status: filters["status"] = status.value
    if owner_id: filters["ownerId"] = owner_id
    if sort: filters["sort"] = sort

    items, total = await EquipmentService.search(filters, skip, limit)
    return success_response(message="Equipment found", data={"items": items, "total": total, "skip": skip, "limit": limit})
