from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class MarketplaceBase(BaseModel):
    cropName: str = "Paddy Seedlings (Naruu)"
    quantity: int = Field(..., ge=1, description="Number of bundles")
    price: float = Field(..., ge=0, description="Price per bundle")
    village: str
    district: str
    state: str
    contactPhone: str = Field(..., pattern=r"^[0-9]{10}$")

class MarketplaceCreate(MarketplaceBase):
    pass

class MarketplaceUpdate(BaseModel):
    cropName: Optional[str] = None
    quantity: Optional[int] = None
    price: Optional[float] = None
    village: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    contactPhone: Optional[str] = None
    listingStatus: Optional[str] = None
    images: Optional[List[str]] = None

class MarketplaceResponse(MarketplaceBase):
    id: int
    sellerId: int
    listingStatus: str
    images: str
    createdAt: datetime

    class Config:
        from_attributes = True
