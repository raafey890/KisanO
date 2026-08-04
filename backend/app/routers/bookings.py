from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.routers.deps import get_current_user
from app.schemas.booking import BookingCreate, BookingUpdateStatus, BookingResponse
from app.services.booking import create_booking_service, update_booking_status_service
from app.crud.booking import list_bookings
from app.core.responses import standard_response

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])

@router.post("", status_code=status.HTTP_201_CREATED)
def request_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    booking = create_booking_service(db, booking_data, farmer_id=current_user.id)
    response_data = BookingResponse.from_orm(booking)
    return standard_response(
        success=True,
        message="Booking requested successfully",
        data=response_data.dict(),
        status_code=201
    )

@router.get("")
def get_user_bookings(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    skip = (page - 1) * limit
    farmer_id = current_user.id if current_user.role == "FARMER" else None
    owner_id = current_user.id if current_user.role == "EQUIPMENT_OWNER" else None
    
    bookings = list_bookings(
        db=db,
        skip=skip,
        limit=limit,
        farmer_id=farmer_id,
        owner_id=owner_id,
        status=status
    )
    
    results = [BookingResponse.from_orm(b).dict() for b in bookings]
    return standard_response(
        success=True,
        message="Bookings retrieved successfully",
        data={
            "page": page,
            "limit": limit,
            "items": results
        }
    )

@router.put("/{booking_id}/status")
def update_booking_status_endpoint(
    booking_id: int,
    payload: BookingUpdateStatus,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    updated_booking = update_booking_status_service(
        db=db,
        booking_id=booking_id,
        status=payload.status,
        current_user_id=current_user.id,
        reason=payload.reason
    )
    response_data = BookingResponse.from_orm(updated_booking)
    return standard_response(
        success=True,
        message=f"Booking status updated to {payload.status} successfully",
        data=response_data.dict()
    )
