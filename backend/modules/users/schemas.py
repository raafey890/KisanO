from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime

class GPSCoordinates(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)

class FarmSchema(BaseModel):
    id: str
    farmName: str = Field(..., min_length=2)
    farmSize: float = Field(..., gt=0)
    farmUnit: str = Field(..., description="Acres, Hectares, SqFt")
    cropTypes: List[str]
    soilType: Optional[str] = None
    waterSource: Optional[str] = None
    irrigationType: Optional[str] = None
    coordinates: Optional[GPSCoordinates] = None
    village: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    isDefault: bool = False

class FarmCreate(BaseModel):
    farmName: str = Field(..., min_length=2)
    farmSize: float = Field(..., gt=0)
    farmUnit: str
    cropTypes: List[str] = []
    soilType: Optional[str] = None
    waterSource: Optional[str] = None
    irrigationType: Optional[str] = None
    coordinates: Optional[GPSCoordinates] = None
    village: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    isDefault: bool = False

class AddressSchema(BaseModel):
    id: str
    addressType: str = Field(..., description="Home, Farm, Billing, Shipping")
    streetAddress: str
    village: Optional[str] = None
    district: str
    state: str
    country: str = "India"
    pinCode: str = Field(..., pattern=r"^\d{6}$")
    isDefault: bool = False

class AddressCreate(BaseModel):
    addressType: str
    streetAddress: str
    village: Optional[str] = None
    district: str
    state: str
    country: str = "India"
    pinCode: str = Field(..., pattern=r"^\d{6}$")
    isDefault: bool = False

class KYCMetadata(BaseModel):
    documentType: str
    documentUrl: str
    status: str = "PENDING" # PENDING, VERIFIED, REJECTED
    verificationDate: Optional[datetime] = None
    verifiedBy: Optional[str] = None

class PreferencesSchema(BaseModel):
    language: str = "en"
    notificationsEnabled: bool = True
    theme: str = "system"
    measurementUnit: str = "metric"
    currency: str = "INR"
    dateFormat: str = "DD/MM/YYYY"
    timeFormat: str = "24h"

class ProfileSchema(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    gender: Optional[str] = None
    dateOfBirth: Optional[str] = None
    alternatePhone: Optional[str] = None
    profilePhotoUrl: Optional[str] = None
    completionPercentage: int = 0

class ProfileUpdate(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    gender: Optional[str] = None
    dateOfBirth: Optional[str] = None
    alternatePhone: Optional[str] = None
    email: Optional[EmailStr] = None

class UserResponse(BaseModel):
    id: str
    fullName: str
    phone: str
    email: Optional[str] = None
    role: str
    status: str
    verificationStatus: str
    profile: ProfileSchema
    preferences: PreferencesSchema
    farms: List[FarmSchema]
    addresses: List[AddressSchema]
    kyc: Optional[KYCMetadata] = None
    createdAt: datetime
    updatedAt: datetime
    
class PaginatedUserResponse(BaseModel):
    items: List[UserResponse]
    total: int
    skip: int
    limit: int
