from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from shared.booking_core.constants import BookingStatus, PaymentStatus, CompletionStatus
from shared.booking_core.schemas import PricingSnapshot, BookingTimelineEvent

# --- Immutable Snapshots ---

class FarmerSnapshot(BaseModel):
    farmerId: str
    farmerName: str
    farmerPhone: str

class OperatorSnapshot(BaseModel):
    operatorId: str
    operatorName: str
    businessName: Optional[str] = None
    phone: str

class ServiceSnapshot(BaseModel):
    serviceId: str
    serviceCode: str
    serviceType: str
    serviceCategory: str
    equipmentUsed: List[str]

class FarmSnapshot(BaseModel):
    farmId: Optional[str] = None # Ties to embedded farm in User Profile if it exists
    district: str
    village: str
    latitude: float
    longitude: float

# --- Request / Response Models ---

class SprayerBookingCreate(BaseModel):
    serviceId: str
    farmId: Optional[str] = None
    district: str
    village: str
    latitude: float
    longitude: float
    
    bookingDate: datetime
    preferredTime: Optional[str] = None # e.g. "Morning", "14:00"
    
    cropName: str
    cropStage: str
    areaSize: float = Field(..., gt=0)
    areaUnit: str = "Acre"
    chemicalUsed: Optional[str] = None
    
    weatherNotes: Optional[str] = None
    instructions: Optional[str] = None
    requiresEmergency: bool = False

class SprayerBookingResponse(BaseModel):
    id: str
    bookingNumber: str
    
    farmerSnapshot: FarmerSnapshot
    operatorSnapshot: OperatorSnapshot
    serviceSnapshot: ServiceSnapshot
    farmSnapshot: FarmSnapshot
    
    bookingDate: datetime
    preferredTime: Optional[str]
    scheduledStart: Optional[datetime] = None
    scheduledEnd: Optional[datetime] = None
    actualStart: Optional[datetime] = None
    actualEnd: Optional[datetime] = None
    
    cropName: str
    cropStage: str
    areaSize: float
    areaUnit: str
    chemicalUsed: Optional[str]
    weatherNotes: Optional[str]
    instructions: Optional[str]
    
    pricingSnapshot: PricingSnapshot
    
    bookingStatus: BookingStatus
    paymentStatus: PaymentStatus
    completionStatus: CompletionStatus
    
    cancellationReason: Optional[str] = None
    
    version: int
    createdAt: datetime
    updatedAt: datetime

class PaginatedSprayerBookingResponse(BaseModel):
    items: List[SprayerBookingResponse]
    total: int
    skip: int
    limit: int
