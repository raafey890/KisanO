from sqlalchemy.orm import Session
from datetime import datetime
from app.crud.booking import check_overlap, create_booking, update_booking_status
from app.crud.equipment import get_equipment_by_id
from app.crud.user import create_activity_log
from app.models.booking import Booking
from app.models.notification import Notification
from app.schemas.booking import BookingCreate
from app.core.exceptions import KisanOException, OverlappingBookingException, NotFoundException

def create_booking_service(db: Session, booking_data: BookingCreate, farmer_id: int):
    # 1. Fetch equipment details
    equipment = get_equipment_by_id(db, booking_data.equipmentId)
    if not equipment:
        raise NotFoundException("Equipment not found")
        
    if equipment.equipmentStatus == "Maintenance":
        raise KisanOException("Equipment is currently under maintenance")

    # 2. Check dates validity
    if booking_data.rentalStartDate >= booking_data.rentalEndDate:
        raise KisanOException("Rental start date must be before end date")
    if booking_data.rentalStartDate < datetime.utcnow():
        raise KisanOException("Rental start date cannot be in the past")

    # 3. Check for overlaps
    overlap_exists = check_overlap(db, equipment.id, booking_data.rentalStartDate, booking_data.rentalEndDate)
    if overlap_exists:
        raise OverlappingBookingException()

    # 4. Calculate Duration & Price
    duration = booking_data.rentalEndDate - booking_data.rentalStartDate
    hours = duration.total_seconds() / 3600.0
    days = duration.days
    
    if hours <= 24:
        # Hourly booking
        rate = equipment.hourlyRate
        amount = hours * rate
        total_days = 1
        total_hours = hours
    else:
        # Daily booking
        rate = equipment.dailyRate
        total_days = max(1, days)
        amount = total_days * rate
        total_hours = total_days * 24.0

    # 5. Save booking
    booking = create_booking(
        db=db,
        booking=booking_data,
        farmer_id=farmer_id,
        owner_id=equipment.ownerId,
        total_hours=total_hours,
        total_days=total_days,
        rate=rate,
        amount=amount
    )

    # 6. Log activity and generate notification
    create_activity_log(db, farmer_id, "BOOKING_CREATED", f"Booked equipment ID {equipment.id}")
    
    # Notify owner
    notif = Notification(
        userId=equipment.ownerId,
        title="New Booking Request",
        message=f"Farmer requested booking for your {equipment.equipmentName}."
    )
    db.add(notif)
    db.commit()

    return booking

def update_booking_status_service(db: Session, booking_id: int, status: str, current_user_id: int, reason: str = None, note: str = None):
    # Verify booking exists
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise NotFoundException("Booking not found")

    # Role validation (only owner can Approve/Reject, only farmer or owner can Cancel)
    if status in ["Approved", "Rejected"] and booking.ownerId != current_user_id:
        raise KisanOException("Only the equipment owner can approve or reject this booking", status_code=403)
    if status == "Cancelled" and booking.farmerId != current_user_id and booking.ownerId != current_user_id:
        raise KisanOException("You do not have permission to cancel this booking", status_code=403)

    # Update status
    updated = update_booking_status(db, booking_id, status, reason, note)
    
    # Log and Notify
    create_activity_log(db, current_user_id, f"BOOKING_{status.upper()}", f"Booking ID {booking_id} status changed to {status}")
    
    # Send notification to the opposite user
    target_user_id = booking.farmerId if current_user_id == booking.ownerId else booking.ownerId
    notif = Notification(
        userId=target_user_id,
        title=f"Booking {status}",
        message=f"Booking for equipment ID {booking.equipmentId} has been {status.lower()}."
    )
    db.add(notif)
    db.commit()

    return updated
