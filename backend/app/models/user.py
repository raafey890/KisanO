from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    fullName = Column(String, nullable=False)
    mobileNumber = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)  # "ADMIN", "FARMER", "EQUIPMENT_OWNER"
    village = Column(String, nullable=False)
    district = Column(String, nullable=False)
    state = Column(String, nullable=False)
    profileImage = Column(String, default="")
    isBlocked = Column(Boolean, default=False)
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    equipments = relationship("Equipment", back_populates="owner")
    bookings_as_farmer = relationship("Booking", foreign_keys="[Booking.farmerId]", back_populates="farmer")
    bookings_as_owner = relationship("Booking", foreign_keys="[Booking.ownerId]", back_populates="owner")
    reviews = relationship("Review", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    listings = relationship("MarketplaceListing", back_populates="seller")
    logs = relationship("ActivityLog", back_populates="user")

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String, nullable=False)  # e.g., "USER_LOGIN", "BOOKING_CREATED"
    details = Column(String, nullable=True)   # JSON string or descriptive text
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="logs")
