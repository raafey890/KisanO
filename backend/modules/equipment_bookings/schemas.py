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

class OwnerSnapshot(BaseModel):
    ownerId: str
    ownerName: str
    phone: str

class EquipmentSnapshot(BaseModel):
    equipmentId: str
    equipmentName: str
    brand: str
    model: str
    category: str
    serialNumber: Optional[str] = None

# --- Request / Response Models ---

class EquipmentBookingCreate(BaseModel):
    equipmentId: str
    startDate: datetime
    endDate: datetime
    deliveryRequired: bool = False
    deliveryAddress: Optional[Dict[str, str]] = None
    notes: Optional[str] = None

class EquipmentBookingResponse(BaseModel):
    id: str
    bookingNumber: str
    
    farmerSnapshot: FarmerSnapshot
    ownerSnapshot: OwnerSnapshot
    equipmentSnapshot: EquipmentSnapshot
    
    startDate: datetime
    endDate: datetime
    actualReturnDate: Optional[datetime] = None
    
    deliveryRequired: bool
    deliveryAddress: Optional[Dict[str, str]]
    notes: Optional[str]
    
    pricingSnapshot: PricingSnapshot
    
    bookingStatus: BookingStatus
    paymentStatus: PaymentStatus
    
    cancellationReason: Optional[str] = None
    
    version: int
    createdAt: datetime
    updatedAt: datetime

class PaginatedEquipmentBookingResponse(BaseModel):
    items: List[EquipmentBookingResponse]
    total: int
    skip: int
    limit: int
