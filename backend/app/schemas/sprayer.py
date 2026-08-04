from pydantic import BaseModel, Field
from typing import Optional, List

class SprayerProfileCreate(BaseModel):
    experienceYears: int = Field(default=0, ge=0)
    equipmentType: Optional[str] = None
    dailyCapacityAcres: float = Field(default=1.0, ge=0.1)
    ratePerAcre: float = Field(..., ge=0)
    availableAreas: List[str] = []

class SprayerProfileResponse(BaseModel):
    id: int
    userId: int
    experienceYears: int
    equipmentType: Optional[str] = None
    dailyCapacityAcres: float
    ratePerAcre: float
    availableAreas: str
    rating: float
    isVerified: bool

    class Config:
        from_attributes = True
