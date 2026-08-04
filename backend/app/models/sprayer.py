from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from datetime import datetime
from app.database import Base

class SprayerProfile(Base):
    __tablename__ = "sprayer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    experienceYears = Column(Integer, default=0)
    equipmentType = Column(String, nullable=True)     # e.g., "Knapsack", "Power Sprayer", "Drone"
    dailyCapacityAcres = Column(Float, default=1.0)
    ratePerAcre = Column(Float, nullable=False)
    availableAreas = Column(String, default="[]")     # JSON list of villages/districts
    rating = Column(Float, default=5.0)
    isVerified = Column(Boolean, default=False)
    createdAt = Column(DateTime, default=datetime.utcnow)
