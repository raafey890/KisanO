from fastapi import APIRouter, Depends, status, Query
from typing import Dict, Any, List, Optional
from shared.responses import success_response, SuccessResponse
from modules.sprayer_bookings.schemas import (
    SprayerBookingCreate, SprayerBookingResponse, PaginatedSprayerBookingResponse, BookingTimelineEvent
)
from modules.sprayer_bookings.service import SprayerBookingService
from modules.sprayer_bookings.constants import BookingStatus, PaymentStatus, CompletionStatus
from modules.auth.dependencies import get_current_user, RequireRole
from modules.auth.constants import UserRole
from modules.sprayer_bookings.repository import timeline_repository

router = APIRouter()

@router.post(
    "",
    response_model=SuccessResponse[Dict[str, str]],
    status_code=status.HTTP_201_CREATED,
    summary="Create a new sprayer booking request"
)
async def create_booking(
    data: SprayerBookingCreate,
    current_user: Dict[str, Any] = Depends(RequireRole([UserRole.FARMER]))
):
    """
    Creates a new booking request for a sprayer service. 
    Verifies availability, creates immutable snapshots of Service and Profiles, 
    generates pricing, and places a SYSTEM block on the sprayer availability calendar.
    """
    booking_id = await SprayerBookingService.create_booking(str(current_user["_id"]), data)
    return success_response(message="Sprayer booking requested successfully", data={"id": booking_id})


@router.get(
    "/{booking_id}",
    response_model=SuccessResponse[SprayerBookingResponse],
    summary="Get booking details"
)
async def get_booking(
    booking_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Fetch a complete booking snapshot. Enforces RBAC so only the Operator, Farmer, or Admin can view.
    """
    booking = await SprayerBookingService.get_booking(booking_id, str(current_user["_id"]), current_user["role"])
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
    Transition booking status (e.g. ACCEPTED, REJECTED, TRAVELING, WORK_STARTED).
    Enforces the strict FSM. Operators can Accept/Reject/Start. Farmers can Cancel/Confirm Completion.
    """
    await SprayerBookingService.change_status(
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
    await SprayerBookingService.get_booking(booking_id, str(current_user["_id"]), current_user["role"])
    
    events = await timeline_repository.get_timeline(booking_id)
    for e in events: e["id"] = str(e["_id"])
    return success_response(message="Timeline retrieved", data=events)


@router.get(
    "/query/search",
    response_model=SuccessResponse[PaginatedSprayerBookingResponse],
    summary="Search and filter bookings"
)
async def search_bookings(
    booking_number: Optional[str] = Query(None),
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
    - Operators see bookings where they are the operator snapshot. 
    - Farmers see bookings where they are the farmer snapshot.
    """
    filters = {}
    if booking_number: filters["bookingNumber"] = booking_number
    if status: filters["status"] = status.value
    if payment_status: filters["paymentStatus"] = payment_status.value
    if sort: filters["sort"] = sort
    
    role = current_user["role"]
    if role == UserRole.FARMER:
        filters["farmerId"] = str(current_user["_id"])
    elif role == UserRole.SPRAYER_OPERATOR:
        filters["operatorId"] = str(current_user["_id"])
    elif role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SUPPORT_AGENT]:
        filters["farmerId"] = str(current_user["_id"]) # Fallback restrict

    items, total = await SprayerBookingService.search(filters, skip, limit)
    return success_response(message="Bookings found", data={"items": items, "total": total, "skip": skip, "limit": limit})
