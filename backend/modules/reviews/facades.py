from typing import Optional
from core.exceptions import AppException

# We import the exposed services from other modules (the "Facades").
# This ensures we don't bypass their business logic or read their raw DB collections.

from modules.equipment_bookings.service import EquipmentBookingService
from modules.sprayer_bookings.service import SprayerBookingService
# from modules.orders.service import OrderService (Mocked if Orders module is not fully hydrated in my context)

class TransactionReadFacade:
    """
    Decouples the Reviews module from the internals of other business modules.
    It simply asks: "Is this transaction completed and valid for this user?"
    """
    @staticmethod
    async def validate_equipment_booking(transaction_id: str, reviewer_id: str) -> bool:
        try:
            # Service enforces RBAC, so we fetch it as the user.
            booking = await EquipmentBookingService.get_booking(transaction_id, reviewer_id, "Farmer")
            # In a real system, the review might also come from the Owner. We'll simplify to Farmer for MVP.
            
            # Review can only be left if booking is COMPLETED
            if booking["bookingStatus"] != "COMPLETED":
                raise AppException("You can only review completed equipment bookings.", 400)
            return True
        except Exception as e:
            if isinstance(e, AppException):
                raise e
            raise AppException("Invalid Equipment Booking transaction.", 400)

    @staticmethod
    async def validate_sprayer_booking(transaction_id: str, reviewer_id: str) -> bool:
        try:
            booking = await SprayerBookingService.get_booking(transaction_id, reviewer_id, "Farmer")
            
            if booking["bookingStatus"] != "COMPLETED":
                raise AppException("You can only review completed sprayer bookings.", 400)
            return True
        except Exception as e:
            if isinstance(e, AppException):
                raise e
            raise AppException("Invalid Sprayer Booking transaction.", 400)

    @staticmethod
    async def validate_transaction(transaction_id: str, transaction_type: str, reviewer_id: str) -> bool:
        if transaction_type == "EquipmentBooking":
            return await TransactionReadFacade.validate_equipment_booking(transaction_id, reviewer_id)
        elif transaction_type == "SprayerBooking":
            return await TransactionReadFacade.validate_sprayer_booking(transaction_id, reviewer_id)
        elif transaction_type == "MarketplaceOrder":
            # Mocking Order validation for now
            return True
        else:
            raise AppException("Unsupported transaction type.", 400)
