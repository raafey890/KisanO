from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Equipment(Base):
    __tablename__ = "equipments"

    id = Column(Integer, primary_key=True, index=True)
    ownerId = Column(Integer, ForeignKey("users.id"), nullable=False)
    equipmentName = Column(String, nullable=False)
    equipmentType = Column(String, nullable=False)  # "Tractor", "Harvester", etc.
    description = Column(String, nullable=False)
    hourlyRate = Column(Float, nullable=False)
    dailyRate = Column(Float, nullable=False)
    
    # Extended specifications
    category = Column(String, nullable=True)        # e.g., "Ploughing", "Sowing"
    brand = Column(String, nullable=True)
    model = Column(String, nullable=True)
    manufacturingYear = Column(Integer, nullable=True)
    fuelType = Column(String, nullable=True)
    images = Column(String, default="[]")           # JSON list stored as string
    
    # Status & Coordinates
    equipmentStatus = Column(String, default="Available")  # "Available", "Booked", "Maintenance"
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow)

    # Relationships
    owner = relationship("User", back_populates="equipments")
    bookings = relationship("Booking", back_populates="equipment")
    reviews = relationship("Review", back_populates="equipment")
