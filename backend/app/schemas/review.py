from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ReviewCreate(BaseModel):
    equipmentId: int
    rating: float = Field(..., ge=1.0, le=5.0)
    review: Optional[str] = None

class ReviewResponse(BaseModel):
    id: int
    userId: int
    equipmentId: int
    rating: float
    review: Optional[str] = None
    createdAt: datetime

    class Config:
        from_attributes = True
