from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from shared.booking_core.constants import BookingStatus

class PricingSnapshot(BaseModel):
    """
    Common pricing snapshot for both Sprayer and Equipment bookings.
    Modules can extend this if needed.
    """
    baseRate: float
    rateType: str # PER_ACRE, PER_HOUR, PER_DAY
    units: float # Area size, Hours, or Days
    baseAmount: float
    travelCharges: float = 0.0
    emergencyCharges: float = 0.0
    fuelCharges: float = 0.0
    discountAmount: float = 0.0
    taxAmount: float = 0.0
    finalAmount: float

class BookingTimelineEvent(BaseModel):
    id: str
    bookingId: str
    status: BookingStatus
    actorId: str
    actorRole: str
    notes: Optional[str] = None
    createdAt: datetime
