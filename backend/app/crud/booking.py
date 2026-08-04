from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from datetime import datetime
from app.models.booking import Booking
from app.schemas.booking import BookingCreate

def get_booking_by_id(db: Session, booking_id: int):
    return db.query(Booking).filter(Booking.id == booking_id).first()

def list_bookings(
    db: Session,
    skip: int = 0,
    limit: int = 10,
    farmer_id: int = None,
    owner_id: int = None,
    status: str = None
):
    query = db.query(Booking)
    if farmer_id:
        query = query.filter(Booking.farmerId == farmer_id)
    if owner_id:
        query = query.filter(Booking.ownerId == owner_id)
    if status:
        query = query.filter(Booking.bookingStatus == status)
        
    return query.order_by(Booking.id.desc()).offset(skip).limit(limit).all()

def check_overlap(db: Session, equipment_id: int, start_date: datetime, end_date: datetime) -> bool:
    # An overlap exists if:
    # Existing Start is less than New End AND Existing End is greater than New Start
    overlap_query = db.query(Booking).filter(
        Booking.equipmentId == equipment_id,
        Booking.bookingStatus.in_(["Pending", "Approved"]),
        Booking.rentalStartDate < end_date,
        Booking.rentalEndDate > start_date
    )
    return overlap_query.count() > 0

def create_booking(db: Session, booking: BookingCreate, farmer_id: int, owner_id: int, total_hours: float, total_days: int, rate: float, amount: float):
    db_booking = Booking(
        farmerId=farmer_id,
        equipmentId=booking.equipmentId,
        ownerId=owner_id,
        rentalStartDate=booking.rentalStartDate,
        rentalEndDate=booking.rentalEndDate,
        totalHours=total_hours,
        totalDays=total_days,
        rateApplied=rate,
        totalAmount=amount,
        farmerNote=booking.farmerNote
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def update_booking_status(db: Session, booking_id: int, status: str, reason: str = None, note: str = None):
    db_booking = get_booking_by_id(db, booking_id)
    if not db_booking:
        return None
    
    db_booking.bookingStatus = status
    if status == "Approved":
        db_booking.acceptedAt = datetime.utcnow()
        if note:
            db_booking.ownerNote = note
    elif status == "Rejected":
        db_booking.rejectedAt = datetime.utcnow()
        if reason:
            db_booking.rejectionReason = reason
    elif status == "Cancelled":
        db_booking.cancelledAt = datetime.utcnow()
        if reason:
            db_booking.cancellationReason = reason
    elif status == "Completed":
        db_booking.completedAt = datetime.utcnow()

    db.commit()
    db.refresh(db_booking)
    return db_booking
