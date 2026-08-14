import logging
from typing import Dict, Any, List
from datetime import datetime, timezone
from core.exceptions import NotFoundException, AppException, UnauthorizedException

from modules.equipment_bookings.repository import equipment_booking_repository, timeline_repository
from modules.equipment_bookings.schemas import EquipmentBookingCreate
from shared.booking_core.constants import BookingStatus, PaymentStatus, CompletionStatus
from shared.booking_core.workflow import BookingWorkflow
from shared.booking_core.pricing import BookingPricing

# External dependencies (assumed available)
from modules.equipment.repository import equipment_repository
from modules.users.repository import user_repository

logger = logging.getLogger(__name__)

# Initialize the shared FSM
workflow = BookingWorkflow()

class EquipmentBookingService:
    @staticmethod
    async def create_booking(farmer_id: str, data: EquipmentBookingCreate) -> str:
        # 1. Fetch Farmer
        farmer = await user_repository.get_by_id(farmer_id)
        if not farmer:
            raise UnauthorizedException("Farmer profile not found.")
            
        farmer_snapshot = {
            "farmerId": str(farmer["_id"]),
            "farmerName": farmer.get("fullName", "Unknown"),
            "farmerPhone": farmer.get("phone", "")
        }

        # 2. Fetch Equipment
        equipment = await equipment_repository.get_by_id(data.equipmentId)
        if not equipment or equipment.get("isDeleted"):
            raise NotFoundException("Equipment not found.")
            
        if equipment["status"] != "AVAILABLE":
            raise AppException(f"Equipment is currently not available. Status: {equipment['status']}", 400)
            
        # Prevent self-booking
        if equipment["ownerSnapshot"]["ownerId"] == farmer_id:
            raise AppException("You cannot book your own equipment.", 400)

        # 3. Check Overlap
        has_overlap = await equipment_booking_repository.check_overlap(data.equipmentId, data.startDate, data.endDate)
        if has_overlap:
            raise AppException("The equipment is already booked during this time slot.", 409)

        # 4. Generate Snapshots
        equipment_snapshot = {
            "equipmentId": str(equipment["_id"]),
            "equipmentName": equipment["equipmentName"],
            "brand": equipment["specifications"]["brand"],
            "model": equipment["specifications"]["model"],
            "category": equipment["category"],
            "serialNumber": equipment["specifications"].get("serialNumber")
        }
        
        # 5. Pricing Engine (Using Core Helper)
        days = (data.endDate - data.startDate).days
        if days <= 0:
            days = 1 # Minimum 1 day charge
            
        base_rate = equipment["pricing"]["perDay"]
        delivery_charge = 50.0 if data.deliveryRequired else 0.0 # Mock delivery logic
        
        pricing_snapshot = BookingPricing.generate_snapshot(
            base_rate=base_rate,
            rate_type="PER_DAY",
            units=days,
            travel_charges=delivery_charge
        )

        # 6. Create Booking Document
        booking_doc = {
            "farmerSnapshot": farmer_snapshot,
            "ownerSnapshot": equipment["ownerSnapshot"],
            "equipmentSnapshot": equipment_snapshot,
            
            "startDate": data.startDate,
            "endDate": data.endDate,
            
            "deliveryRequired": data.deliveryRequired,
            "deliveryAddress": data.deliveryAddress,
            "notes": data.notes,
            
            "pricingSnapshot": pricing_snapshot,
            
            "bookingStatus": BookingStatus.REQUESTED.value,
            "paymentStatus": PaymentStatus.PENDING.value
        }
        
        # BaseBookingRepository handles the bookingNumber and creation
        booking_id = await equipment_booking_repository.create_booking(booking_doc)
        
        # 7. Log Timeline
        await timeline_repository.log_event(
            booking_id, BookingStatus.REQUESTED.value, farmer_id, "FARMER", "Booking requested"
        )

        return booking_id

    @staticmethod
    async def get_booking(booking_id: str, user_id: str, user_role: str) -> Dict[str, Any]:
        booking = await equipment_booking_repository.get_by_id(booking_id)
        if not booking:
            raise NotFoundException("Booking not found")
            
        is_admin = user_role in ["Admin", "SuperAdmin"]
        is_owner = booking["ownerSnapshot"]["ownerId"] == user_id
        is_farmer = booking["farmerSnapshot"]["farmerId"] == user_id
        
        if not (is_admin or is_owner or is_farmer):
            raise UnauthorizedException("You do not have permission to view this booking.")
            
        booking["id"] = str(booking["_id"])
        return booking

    @staticmethod
    async def change_status(booking_id: str, user_id: str, user_role: str, new_status: BookingStatus, current_version: int, notes: str = None) -> None:
        booking = await EquipmentBookingService.get_booking(booking_id, user_id, user_role)
        current_status = BookingStatus(booking["bookingStatus"])
        
        is_admin = user_role in ["Admin", "SuperAdmin"]
        is_owner = booking["ownerSnapshot"]["ownerId"] == user_id
        
        # 1. Use Core Workflow Engine to validate FSM
        workflow.validate_transition(current_status, new_status, is_admin)
            
        # Role-based validation
        if new_status in [BookingStatus.ACCEPTED, BookingStatus.REJECTED] and not (is_owner or is_admin):
            raise UnauthorizedException("Only the equipment owner can accept or reject.")
            
        if new_status in [BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED] and not (is_owner or is_admin):
            raise UnauthorizedException("Only the equipment owner can update working progress.")
            
        # 2. Perform Optimistic Update using BaseRepository
        update_data = {"bookingStatus": new_status.value}
        
        if new_status == BookingStatus.COMPLETED:
            update_data["actualReturnDate"] = datetime.now(timezone.utc)
            
        success = await equipment_booking_repository.update_booking_optimistic(booking_id, current_version, update_data)
        if not success:
            raise AppException("Status change failed due to version conflict.", status_code=409)
            
        # 3. Log Timeline using BaseTimelineRepository
        actor_type = "ADMIN" if is_admin else ("OWNER" if is_owner else "FARMER")
        await timeline_repository.log_event(booking_id, new_status.value, user_id, actor_type, notes)

    @staticmethod
    async def search(filters: Dict[str, Any], skip: int, limit: int) -> tuple[List[Dict[str, Any]], int]:
        items, total = await equipment_booking_repository.search_bookings(filters, skip, limit)
        for i in items:
            i["id"] = str(i["_id"])
        return items, total
