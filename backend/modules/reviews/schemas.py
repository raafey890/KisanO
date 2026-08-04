from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from modules.reviews.constants import ReviewType, ModerationStatus, TargetRole

# --- Immutable Snapshots ---

class ReviewerSnapshot(BaseModel):
    reviewerId: str
    reviewerName: str
    reviewerRole: str

class TargetSnapshot(BaseModel):
    targetId: str # e.g., Equipment ID, Product ID, User ID
    targetName: str
    targetType: str # matches ReviewType
    ownerId: Optional[str] = None # The user who owns the target (e.g., equipment owner)

class TransactionSnapshot(BaseModel):
    transactionId: str
    transactionType: str # "EquipmentBooking", "MarketplaceOrder", "SprayerBooking"

class RatingSnapshot(BaseModel):
    rating: float = Field(..., ge=1.0, le=5.0)

# --- Main Review Models ---

class ReviewCreate(BaseModel):
    reviewType: ReviewType
    targetId: str
    transactionId: str
    transactionType: str
    rating: float = Field(..., ge=1.0, le=5.0)
    title: Optional[str] = None
    comment: Optional[str] = None
    pros: List[str] = []
    cons: List[str] = []
    tags: List[str] = []
    imageUrls: List[str] = []

class ReviewResponse(BaseModel):
    id: str
    reviewNumber: str
    
    reviewerSnapshot: ReviewerSnapshot
    targetSnapshot: TargetSnapshot
    transactionSnapshot: TransactionSnapshot
    ratingSnapshot: RatingSnapshot
    
    title: Optional[str]
    comment: Optional[str]
    pros: List[str]
    cons: List[str]
    tags: List[str]
    imageUrls: List[str]
    
    moderationStatus: ModerationStatus
    
    helpfulVotes: int
    reportedCount: int
    
    isDeleted: bool
    createdAt: datetime
    updatedAt: datetime
    
# --- Reputation Models ---

class ReputationSummary(BaseModel):
    id: str
    targetId: str
    targetType: str # matches ReviewType
    
    averageRating: float
    totalReviews: int
    verifiedReviews: int
    responseRate: float
    trustScore: float
    
    ratingDistribution: Dict[str, int] # e.g. {"1": 0, "2": 1, "3": 5, "4": 10, "5": 20}
    
    lastUpdated: datetime

# --- Auxiliary Models ---

class ReviewReport(BaseModel):
    reviewId: str
    reporterId: str
    reason: str
    notes: Optional[str] = None
    createdAt: datetime

class ReviewReply(BaseModel):
    reviewId: str
    replierId: str
    replierRole: TargetRole
    comment: str
    createdAt: datetime

class AdminModerationRequest(BaseModel):
    reviewId: str
    status: ModerationStatus
    adminNotes: str
