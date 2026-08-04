from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class BookingCreate(BaseModel):
    equipmentId: int
    rentalStartDate: datetime
    rentalEndDate: datetime
    farmerNote: Optional[str] = None

class BookingUpdateStatus(BaseModel):
    status: str = Field(..., pattern="^(Approved|Rejected|Cancelled|Completed)$")
    reason: Optional[str] = None

class BookingResponse(BaseModel):
    id: int
    farmerId: int
    equipmentId: int
    ownerId: int
    bookingDate: datetime
    rentalStartDate: datetime
    rentalEndDate: datetime
    totalHours: float
    totalDays: int
    rateApplied: float
    totalAmount: float
    paymentStatus: str
    paymentTransactionId: Optional[str] = None
    invoiceNumber: Optional[str] = None
    bookingStatus: str
    farmerNote: Optional[str] = None
    ownerNote: Optional[str] = None
    cancellationReason: Optional[str] = None
    rejectionReason: Optional[str] = None
    createdAt: datetime

    class Config:
        from_attributes = True
