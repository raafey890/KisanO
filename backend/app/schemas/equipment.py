from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class EquipmentBase(BaseModel):
    equipmentName: str
    equipmentType: str
    description: str
    hourlyRate: float = Field(..., ge=0)
    dailyRate: float = Field(..., ge=0)
    category: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    manufacturingYear: Optional[int] = None
    fuelType: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class EquipmentCreate(EquipmentBase):
    pass

class EquipmentUpdate(BaseModel):
    equipmentName: Optional[str] = None
    equipmentType: Optional[str] = None
    description: Optional[str] = None
    hourlyRate: Optional[float] = None
    dailyRate: Optional[float] = None
    category: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    manufacturingYear: Optional[int] = None
    fuelType: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    equipmentStatus: Optional[str] = None
    images: Optional[List[str]] = None

class EquipmentResponse(EquipmentBase):
    id: int
    ownerId: int
    equipmentStatus: str
    images: str # Represented as JSON string from SQLite

    class Config:
        from_attributes = True
