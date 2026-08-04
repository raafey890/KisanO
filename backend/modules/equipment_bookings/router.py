from fastapi import APIRouter, Depends, status, Query
from typing import Dict, Any, List, Optional
from shared.responses import success_response, SuccessResponse
from modules.equipment_bookings.schemas import (
    BookingCreate, BookingResponse, PaginatedBookingResponse, BookingTimelineEvent
)
from modules.equipment_bookings.service import BookingService
from modules.equipment_bookings.constants import BookingStatus, PaymentStatus
from modules.auth.dependencies import get_current_user, RequireRole
from modules.auth.constants import UserRole
from modules.equipment_bookings.repository import timeline_repository

router = APIRouter()

@router.post(
    "",
    response_model=SuccessResponse[Dict[str, str]],
    status_code=status.HTTP_201_CREATED,
    summary="Create a new booking request"
)
async def create_booking(
    data: BookingCreate,
    current_user: Dict[str, Any] = Depends(RequireRole([UserRole.FARMER]))
):
    """
    Creates a new booking request. Verifies availability, creates immutable snapshots of Equipment and Profiles, 
    generates pricing, and places a SYSTEM block on the equipment availability calendar.
    """
    booking_id = await BookingService.create_booking(str(current_user["_id"]), data)
    return success_response(message="Booking requested successfully", data={"id": booking_id})


@router.get(
    "/{booking_id}",
    response_model=SuccessResponse[BookingResponse],
    summary="Get booking details"
)
async def get_booking(
    booking_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Fetch a complete booking snapshot. Enforces RBAC so only the Owner, Farmer, or Admin can view.
    """
    booking = await BookingService.get_booking(booking_id, str(current_user["_id"]), current_user["role"])
    return success_response(message="Booking retrieved", data=booking)


@router.patch(
    "/{booking_id}/status",
    response_model=SuccessResponse[None],
    summary="Update booking status"
)
async def update_status(
    booking_id: str,
    new_status: BookingStatus,
    current_version: int = Query(...),
    notes: Optional[str] = Query(None),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Transition booking status (e.g. ACCEPTED, REJECTED, CANCELLED).
    Enforces the strict FSM. Owners can Accept/Reject. Farmers can Cancel.
    """
    await BookingService.change_status(
        booking_id, 
        str(current_user["_id"]), 
        current_user["role"], 
        new_status, 
        current_version, 
        notes
    )
    return success_response(message=f"Booking status updated to {new_status.value}")


@router.get(
    "/{booking_id}/timeline",
    response_model=SuccessResponse[List[BookingTimelineEvent]],
    summary="Get booking timeline"
)
async def get_booking_timeline(
    booking_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Returns the chronologically ordered event history of the booking.
    """
    # Enforce auth via get_booking
    await BookingService.get_booking(booking_id, str(current_user["_id"]), current_user["role"])
    
    events = await timeline_repository.get_timeline(booking_id)
    for e in events: e["id"] = str(e["_id"])
    return success_response(message="Timeline retrieved", data=events)


@router.get(
    "/query/search",
    response_model=SuccessResponse[PaginatedBookingResponse],
    summary="Search and filter bookings"
)
async def search_bookings(
    status: Optional[BookingStatus] = Query(None),
    payment_status: Optional[PaymentStatus] = Query(None),
    sort: Optional[str] = Query("newest"),
    skip: int = 0,
    limit: int = 20,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Search bookings. 
    - Admins see all. 
    - Owners see bookings where they are the owner snapshot. 
    - Farmers see bookings where they are the farmer snapshot.
    """
    filters = {}
    if status: filters["status"] = status.value
    if payment_status: filters["paymentStatus"] = payment_status.value
    if sort: filters["sort"] = sort
    
    role = current_user["role"]
    if role == UserRole.FARMER:
        filters["farmerId"] = str(current_user["_id"])
    elif role == UserRole.EQUIPMENT_OWNER:
        filters["ownerId"] = str(current_user["_id"])
    elif role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SUPPORT_AGENT]:
        filters["farmerId"] = str(current_user["_id"]) # Fallback restrict

    items, total = await BookingService.search(filters, skip, limit)
    return success_response(message="Bookings found", data={"items": items, "total": total, "skip": skip, "limit": limit})
