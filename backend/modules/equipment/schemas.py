from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from modules.equipment.constants import EquipmentStatus, EquipmentCategory, FuelType
from modules.users.schemas import GPSCoordinates

# --- Embedded Documents ---

class OwnerSnapshot(BaseModel):
    ownerId: str
    ownerName: str
    ownerRating: float = 0.0
    ownerVerification: str = "PENDING"
    contactSummary: Optional[str] = None

class EquipmentImage(BaseModel):
    imageId: str
    cloudinaryUrl: str
    thumbnailUrl: str
    displayOrder: int = 0
    caption: Optional[str] = None
    isCover: bool = False
    uploadedAt: datetime

class PricingSchema(BaseModel):
    hourlyRate: Optional[float] = None
    dailyRate: float
    weeklyRate: Optional[float] = None
    monthlyRate: Optional[float] = None
    seasonalRate: Optional[float] = None
    holidayRate: Optional[float] = None
    weekendRate: Optional[float] = None
    securityDeposit: float = 0.0
    deliveryChargePerKm: float = 0.0
    fuelCharges: float = 0.0
    operatorCharges: float = 0.0
    discountRules: List[str] = []

class AnalyticsSnapshot(BaseModel):
    views: int = 0
    bookings: int = 0
    revenue: float = 0.0
    averageRating: float = 0.0
    reviewCount: int = 0
    lastBookingDate: Optional[datetime] = None

class EquipmentLocation(BaseModel):
    country: str = "India"
    state: str
    district: str
    mandal: Optional[str] = None
    village: Optional[str] = None
    address: str
    pinCode: str = Field(..., pattern=r"^\d{6}$")
    coordinates: GPSCoordinates
    operatingRadiusKm: int = 50
    googleMapsPlaceId: Optional[str] = None

class Specifications(BaseModel):
    fuelType: FuelType = FuelType.OTHER
    enginePower: Optional[str] = None
    horsepower: Optional[int] = None
    capacity: Optional[str] = None
    weight: Optional[str] = None
    workingWidth: Optional[str] = None
    attachments: List[str] = []

# --- Root Equipment ---

class EquipmentCreate(BaseModel):
    equipmentName: str = Field(..., min_length=3)
    equipmentCode: Optional[str] = None
    category: EquipmentCategory
    brand: str
    model: str
    manufacturingYear: int = Field(..., ge=1950)
    description: str = Field(..., min_length=10)
    specifications: Specifications
    condition: str = "Good"
    color: Optional[str] = None
    serialNumber: Optional[str] = None
    registrationNumber: Optional[str] = None
    location: EquipmentLocation
    pricing: PricingSchema

class EquipmentUpdate(BaseModel):
    equipmentName: Optional[str] = None
    description: Optional[str] = None
    condition: Optional[str] = None
    specifications: Optional[Specifications] = None
    location: Optional[EquipmentLocation] = None
    pricing: Optional[PricingSchema] = None

class EquipmentResponse(BaseModel):
    id: str
    equipmentName: str
    equipmentCode: Optional[str] = None
    category: EquipmentCategory
    brand: str
    model: str
    manufacturingYear: int
    description: str
    specifications: Specifications
    condition: str
    serialNumber: Optional[str] = None
    registrationNumber: Optional[str] = None
    
    status: EquipmentStatus
    ownerSnapshot: OwnerSnapshot
    location: EquipmentLocation
    pricing: PricingSchema
    images: List[EquipmentImage]
    analytics: AnalyticsSnapshot
    
    version: int
    isDeleted: bool
    createdAt: datetime
    updatedAt: datetime
    
class PaginatedEquipmentResponse(BaseModel):
    items: List[EquipmentResponse]
    total: int
    skip: int
    limit: int

# --- Separated Collections ---

class AvailabilityCreate(BaseModel):
    startTime: datetime
    endTime: datetime
    reason: str
    blockedBy: str = "OWNER" # OWNER, ADMIN, SYSTEM (Booked)
    bookingId: Optional[str] = None

class AvailabilityResponse(AvailabilityCreate):
    id: str
    equipmentId: str
    status: str = "ACTIVE"
    createdAt: datetime

class MaintenanceCreate(BaseModel):
    serviceType: str
    provider: str
    cost: float
    invoiceUrl: Optional[str] = None
    notes: Optional[str] = None
    nextDueDate: Optional[datetime] = None

class MaintenanceResponse(MaintenanceCreate):
    id: str
    equipmentId: str
    serviceDate: datetime
    createdAt: datetime
