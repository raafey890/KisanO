from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from modules.support.constants import TicketStatus, TicketPriority, TicketSeverity, SupportCategory, CommentVisibility

# --- Immutable Snapshots ---

class UserSnapshot(BaseModel):
    userId: str
    userName: str
    userRole: str
    email: Optional[str] = None
    phone: Optional[str] = None

class AgentSnapshot(BaseModel):
    agentId: str
    agentName: str
    agentRole: str

# --- Main Support Models ---

class TicketCreate(BaseModel):
    subject: str
    description: str
    category: SupportCategory
    subCategory: Optional[str] = None
    priority: TicketPriority = TicketPriority.MEDIUM
    severity: TicketSeverity = TicketSeverity.MINOR
    relatedModule: Optional[str] = None
    relatedResourceId: Optional[str] = None
    attachmentUrls: List[str] = []

class TicketResponse(BaseModel):
    id: str
    ticketNumber: str
    
    userSnapshot: UserSnapshot
    assignedAgentSnapshot: Optional[AgentSnapshot] = None
    
    category: SupportCategory
    subCategory: Optional[str] = None
    priority: TicketPriority
    severity: TicketSeverity
    status: TicketStatus
    
    subject: str
    description: str
    attachmentUrls: List[str]
    
    relatedModule: Optional[str]
    relatedResourceId: Optional[str]
    resolution: Optional[str] = None
    
    # SLA Timestamps
    firstResponseTargetAt: Optional[datetime] = None
    resolutionTargetAt: Optional[datetime] = None
    firstResponseAt: Optional[datetime] = None
    
    isDeleted: bool
    createdAt: datetime
    updatedAt: datetime
    closedAt: Optional[datetime] = None

# --- Comment Models ---

class CommentCreate(BaseModel):
    ticketId: str
    comment: str
    visibility: CommentVisibility = CommentVisibility.PUBLIC
    attachmentUrls: List[str] = []

class CommentResponse(BaseModel):
    id: str
    ticketId: str
    authorId: str
    authorName: str
    authorRole: str
    comment: str
    visibility: CommentVisibility
    attachmentUrls: List[str]
    isEdited: bool = False
    isDeleted: bool = False
    createdAt: datetime
    updatedAt: datetime

# --- Knowledge Base Models ---

class KBArticleCreate(BaseModel):
    title: str
    content: str
    category: str
    tags: List[str] = []

class KBArticleResponse(BaseModel):
    id: str
    title: str
    content: str
    category: str
    tags: List[str]
    version: int
    authorId: str
    isPublished: bool
    createdAt: datetime
    updatedAt: datetime

class SLALog(BaseModel):
    ticketId: str
    breachType: str # e.g. "FIRST_RESPONSE", "RESOLUTION"
    targetTime: datetime
    actualTime: datetime
    breachDurationMinutes: int
