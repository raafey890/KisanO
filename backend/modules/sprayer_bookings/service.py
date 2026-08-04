import logging
from typing import Dict, Any, List
from datetime import datetime, timezone, timedelta
from core.exceptions import NotFoundException, AppException, UnauthorizedException

from modules.sprayer_bookings.repository import sprayer_booking_repository, timeline_repository
from modules.sprayer_bookings.schemas import SprayerBookingCreate
from shared.booking_core.constants import BookingStatus, PaymentStatus, CompletionStatus
from shared.booking_core.workflow import BookingWorkflow
from shared.booking_core.pricing import BookingPricing

# External Module Dependencies
from modules.sprayer_services.repository import sprayer_repository, availability_repository
from modules.users.repository import user_repository

logger = logging.getLogger(__name__)

workflow = BookingWorkflow()

class SprayerBookingService:
    @staticmethod
    async def create_booking(farmer_id: str, data: SprayerBookingCreate) -> str:
        # 1. Fetch Farmer
        farmer = await user_repository.get_by_id(farmer_id)
        if not farmer:
            raise UnauthorizedException("Farmer profile not found.")
            
        farmer_snapshot = {
            "farmerId": str(farmer["_id"]),
            "farmerName": farmer.get("fullName", "Unknown"),
            "farmerPhone": farmer.get("phone", "")
        }

        # 2. Fetch Service
        service = await sprayer_repository.get_by_id(data.serviceId)
        if not service or service.get("isDeleted"):
            raise NotFoundException("Sprayer service not found.")
            
        if service["status"] != "AVAILABLE":
            raise AppException(f"Service is currently not available. Current status: {service['status']}", 400)
            
        # Prevent self-booking
        if service["operatorSnapshot"]["operatorId"] == farmer_id:
            raise AppException("You cannot book your own service.", 400)

        # 3. Check Overlap
        start_time = data.bookingDate
        end_time = start_time + timedelta(hours=4) 
        
        has_overlap = await availability_repository.check_overlap(data.serviceId, start_time, end_time)
        if has_overlap:
            raise AppException("The selected time slot overlaps with an existing booking or maintenance block.", 409)

        # 4. Generate Snapshots
        service_snapshot = {
            "serviceId": str(service["_id"]),
            "serviceCode": service["serviceCode"],
            "serviceType": service["serviceType"],
            "serviceCategory": service["serviceCategory"],
            "equipmentUsed": service.get("equipmentUsed", [])
        }
        
        farm_snapshot = {
            "farmId": data.farmId,
            "district": data.district,
            "village": data.village,
            "latitude": data.latitude,
            "longitude": data.longitude
        }
        
        # 5. Pricing Engine
        pricing = service["pricing"]
        base_rate = pricing.get("perAcre", 0.0)
        
        # Apply minimum charge logic
        base_amount = base_rate * data.areaSize
        if pricing.get("minimumCharge", 0.0) > base_amount:
            base_rate = pricing["minimumCharge"]
            data.areaSize = 1.0 # normalize for minimum charge calc
            
        travel_charge = pricing.get("travelChargePerKm", 0.0) * 10 
        emergency_charge = pricing.get("emergencyCharge", 0.0) if data.requiresEmergency else 0.0
        
        pricing_snapshot = BookingPricing.generate_snapshot(
            base_rate=base_rate,
            rate_type="PER_ACRE",
            units=data.areaSize,
            travel_charges=travel_charge,
            emergency_charges=emergency_charge
        )

        # 6. Create Booking Document
        booking_doc = {
            "farmerSnapshot": farmer_snapshot,
            "operatorSnapshot": service["operatorSnapshot"],
            "serviceSnapshot": service_snapshot,
            "farmSnapshot": farm_snapshot,
            
            "bookingDate": data.bookingDate,
            "preferredTime": data.preferredTime,
            
            "cropName": data.cropName,
            "cropStage": data.cropStage,
            "areaSize": data.areaSize,
            "areaUnit": data.areaUnit,
            "chemicalUsed": data.chemicalUsed,
            "weatherNotes": data.weatherNotes,
            "instructions": data.instructions,
            
            "pricingSnapshot": pricing_snapshot,
            
            "bookingStatus": BookingStatus.REQUESTED.value,
            "paymentStatus": PaymentStatus.PENDING.value,
            "completionStatus": CompletionStatus.PENDING.value
        }
        
        booking_id = await sprayer_booking_repository.create_booking(booking_doc)
        
        # 7. Log Timeline
        await timeline_repository.log_event(
            booking_id, BookingStatus.REQUESTED.value, farmer_id, "FARMER", "Booking requested"
        )
        
        # 8. Add to Sprayer Availability Calendar
        await availability_repository.create({
            "serviceId": data.serviceId,
            "startTime": start_time,
            "endTime": end_time,
            "reason": "Booking Request",
            "blockedBy": "SYSTEM",
            "bookingId": booking_id,
            "status": "ACTIVE",
            "createdAt": datetime.now(timezone.utc)
        })

        return booking_id

    @staticmethod
    async def get_booking(booking_id: str, user_id: str, user_role: str) -> Dict[str, Any]:
        booking = await sprayer_booking_repository.get_by_id(booking_id)
        if not booking:
            raise NotFoundException("Booking not found")
            
        is_admin = user_role in ["Admin", "SuperAdmin"]
        is_operator = booking["operatorSnapshot"]["operatorId"] == user_id
        is_farmer = booking["farmerSnapshot"]["farmerId"] == user_id
        
        if not (is_admin or is_operator or is_farmer):
            raise UnauthorizedException("You do not have permission to view this booking.")
            
        booking["id"] = str(booking["_id"])
        return booking

    @staticmethod
    async def change_status(booking_id: str, user_id: str, user_role: str, new_status: BookingStatus, current_version: int, notes: str = None) -> None:
        booking = await SprayerBookingService.get_booking(booking_id, user_id, user_role)
        current_status = BookingStatus(booking["bookingStatus"])
        
        is_admin = user_role in ["Admin", "SuperAdmin"]
        is_operator = booking["operatorSnapshot"]["operatorId"] == user_id
        is_farmer = booking["farmerSnapshot"]["farmerId"] == user_id
        
        # 1. Use Core Workflow Engine
        workflow.validate_transition(current_status, new_status, is_admin)
            
        # Role-based validation
        if new_status in [BookingStatus.ACCEPTED, BookingStatus.REJECTED, BookingStatus.TRAVELING, BookingStatus.WORK_STARTED, BookingStatus.WORK_COMPLETED] and not (is_operator or is_admin):
            raise UnauthorizedException("Only the operator can perform this action.")
            
        if new_status == BookingStatus.COMPLETED and not (is_farmer or is_admin):
            raise UnauthorizedException("Only the farmer can confirm final completion.")
            
        # 2. Perform Optimistic Update
        update_data = {"bookingStatus": new_status.value}
        
        # Timestamp injections
        if new_status == BookingStatus.WORK_STARTED:
            update_data["actualStart"] = datetime.now(timezone.utc)
        elif new_status == BookingStatus.WORK_COMPLETED:
            update_data["actualEnd"] = datetime.now(timezone.utc)
            update_data["completionStatus"] = CompletionStatus.OPERATOR_MARKED.value
        elif new_status == BookingStatus.COMPLETED:
            update_data["completionStatus"] = CompletionStatus.FARMER_CONFIRMED.value
            
        success = await sprayer_booking_repository.update_booking_optimistic(booking_id, current_version, update_data)
        if not success:
            raise AppException("Status change failed due to version conflict.", status_code=409)
            
        # Free up the calendar block in Sprayer Services if rejected or cancelled
        if new_status in [BookingStatus.REJECTED, BookingStatus.CANCELLED, BookingStatus.EXPIRED]:
            await availability_repository.collection.update_many(
                {"bookingId": booking_id},
                {"$set": {"status": "CANCELLED"}}
            )
            
        # 3. Log Timeline
        actor_type = "ADMIN" if is_admin else ("OPERATOR" if is_operator else "FARMER")
        await timeline_repository.log_event(booking_id, new_status.value, user_id, actor_type, notes)

    @staticmethod
    async def search(filters: Dict[str, Any], skip: int, limit: int) -> tuple[List[Dict[str, Any]], int]:
        items, total = await sprayer_booking_repository.search_bookings(filters, skip, limit)
        for i in items:
            i["id"] = str(i["_id"])
        return items, total
