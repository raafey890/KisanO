from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from modules.sprayer_services.constants import ServiceStatus, ServiceType

# --- Embedded Documents ---

class OperatorSnapshot(BaseModel):
    operatorId: str
    operatorName: str
    businessName: Optional[str] = None
    phone: str
    verificationStatus: str = "PENDING"
    averageRating: float = 0.0
    experienceYears: int = 0

class ServiceImage(BaseModel):
    imageId: str
    cloudinaryUrl: str
    thumbnailUrl: str
    displayOrder: int = 0
    isCover: bool = False
    uploadedAt: datetime

class ServicePricing(BaseModel):
    perAcre: Optional[float] = None
    perHour: Optional[float] = None
    perDay: Optional[float] = None
    minimumCharge: float = 0.0
    travelChargePerKm: float = 0.0
    emergencyCharge: float = 0.0
    discountPercentage: float = 0.0

class GeoPoint(BaseModel):
    type: str = "Point"
    coordinates: List[float] # [longitude, latitude]

class CoverageArea(BaseModel):
    country: str = "India"
    state: str
    district: str
    mandal: Optional[str] = None
    village: Optional[str] = None
    location: GeoPoint
    operatingRadiusKm: float
    googlePlaceId: Optional[str] = None

class AnalyticsSummary(BaseModel):
    views: int = 0
    serviceRequests: int = 0
    completedJobs: int = 0
    revenue: float = 0.0
    averageRating: float = 0.0
    reviewCount: int = 0
    repeatCustomers: int = 0

# --- Root Service ---

class ServiceCreate(BaseModel):
    businessName: str
    description: str = Field(..., min_length=10)
    serviceType: ServiceType
    serviceCategory: str
    equipmentUsed: List[str] = []
    droneSupport: bool = False
    supportedCrops: List[str] = []
    supportedChemicals: List[str] = []
    workingCapacityAcrePerDay: float
    yearsOfExperience: int
    pricing: ServicePricing
    coverageAreas: List[CoverageArea]

class ServiceUpdate(BaseModel):
    description: Optional[str] = None
    equipmentUsed: Optional[List[str]] = None
    supportedCrops: Optional[List[str]] = None
    supportedChemicals: Optional[List[str]] = None
    workingCapacityAcrePerDay: Optional[float] = None

class ServiceResponse(BaseModel):
    id: str
    serviceCode: str
    businessName: str
    description: str
    serviceType: ServiceType
    serviceCategory: str
    equipmentUsed: List[str]
    droneSupport: bool
    supportedCrops: List[str]
    supportedChemicals: List[str]
    workingCapacityAcrePerDay: float
    yearsOfExperience: int
    
    status: ServiceStatus
    operatorSnapshot: OperatorSnapshot
    pricing: ServicePricing
    coverageAreas: List[CoverageArea]
    images: List[ServiceImage]
    analytics: AnalyticsSummary
    
    version: int
    isDeleted: bool
    createdAt: datetime
    updatedAt: datetime
    
class PaginatedServiceResponse(BaseModel):
    items: List[ServiceResponse]
    total: int
    skip: int
    limit: int

# --- Separated Collections ---

class PricingUpdate(BaseModel):
    pricing: ServicePricing
    reason: Optional[str] = None

class CertificationCreate(BaseModel):
    certificationName: str
    authority: str
    issueDate: datetime
    expiryDate: Optional[datetime] = None
    certificateUrl: str

class AvailabilityCreate(BaseModel):
    startTime: datetime
    endTime: datetime
    reason: str = "UNAVAILABLE"
