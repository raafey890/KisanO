from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey("users.id"), nullable=False)
    equipmentId = Column(Integer, ForeignKey("equipments.id"), nullable=False)
    rating = Column(Float, nullable=False) # e.g. 1.0 - 5.0
    review = Column(String, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="reviews")
    equipment = relationship("Equipment", back_populates="reviews")
