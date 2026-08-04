from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class MarketplaceListing(Base):
    __tablename__ = "marketplace_listings"

    id = Column(Integer, primary_key=True, index=True)
    sellerId = Column(Integer, ForeignKey("users.id"), nullable=False)
    cropName = Column(String, nullable=False, default="Paddy Seedlings (Naruu)")
    quantity = Column(Integer, nullable=False)          # Number of bundles
    price = Column(Float, nullable=False)               # Price per bundle
    village = Column(String, nullable=False)
    district = Column(String, nullable=False)
    state = Column(String, nullable=False)
    contactPhone = Column(String, nullable=False)
    images = Column(String, default="[]")               # JSON list of URLs
    listingStatus = Column(String, default="Active")     # "Active", "Sold", "Cancelled"
    createdAt = Column(DateTime, default=datetime.utcnow)

    seller = relationship("User", back_populates="listings")
