from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    farmerId = Column(Integer, ForeignKey("users.id"), nullable=False)
    equipmentId = Column(Integer, ForeignKey("equipments.id"), nullable=False)
    ownerId = Column(Integer, ForeignKey("users.id"), nullable=False)

    bookingDate = Column(DateTime, default=datetime.utcnow)
    rentalStartDate = Column(DateTime, nullable=False)
    rentalEndDate = Column(DateTime, nullable=False)
    totalHours = Column(Float, default=2.0)  # Support hourly bookings
    totalDays = Column(Integer, default=1)
    
    # Financial details
    rateApplied = Column(Float, nullable=False)   # Rate per hour/day applied at booking
    totalAmount = Column(Float, nullable=False)
    paymentStatus = Column(String, default="Pending")       # "Pending", "Paid", "Refunded"
    paymentTransactionId = Column(String, nullable=True)
    invoiceNumber = Column(String, nullable=True)

    # Status lifecycle
    bookingStatus = Column(String, default="Pending")  # "Pending", "Approved", "Rejected", "Cancelled", "Completed"
    farmerNote = Column(String, nullable=True)
    ownerNote = Column(String, nullable=True)
    cancellationReason = Column(String, nullable=True)
    rejectionReason = Column(String, nullable=True)

    # Timestamps
    acceptedAt = Column(DateTime, nullable=True)
    rejectedAt = Column(DateTime, nullable=True)
    cancelledAt = Column(DateTime, nullable=True)
    completedAt = Column(DateTime, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow)

    # Relationships
    farmer = relationship("User", foreign_keys=[farmerId], back_populates="bookings_as_farmer")
    owner = relationship("User", foreign_keys=[ownerId], back_populates="bookings_as_owner")
    equipment = relationship("Equipment", back_populates="bookings")
