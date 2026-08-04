from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime
from modules.notifications.constants import NotificationChannel, NotificationPriority, NotificationStatus, NotificationType

# --- Immutable Snapshots ---

class UserSnapshot(BaseModel):
    userId: str
    userName: str
    userRole: str
    contactEmail: Optional[str] = None
    contactPhone: Optional[str] = None
    deviceToken: Optional[str] = None # For FCM

# --- Main Notification Models ---

class NotificationCreate(BaseModel):
    userId: str
    channel: NotificationChannel
    type: NotificationType
    priority: NotificationPriority = NotificationPriority.NORMAL
    templateId: str
    payload: Dict[str, Any]
    scheduledFor: Optional[datetime] = None

class NotificationResponse(BaseModel):
    id: str
    notificationNumber: str
    
    userSnapshot: UserSnapshot
    channel: NotificationChannel
    type: NotificationType
    priority: NotificationPriority
    
    title: str
    body: str
    templateId: str
    payload: Dict[str, Any]
    
    status: NotificationStatus
    isRead: bool
    
    sentAt: Optional[datetime] = None
    deliveredAt: Optional[datetime] = None
    readAt: Optional[datetime] = None
    
    isDeleted: bool
    createdAt: datetime
    updatedAt: datetime

# --- Preferences Models ---

class UserPreferences(BaseModel):
    userId: str
    pushEnabled: bool = True
    emailEnabled: bool = True
    smsEnabled: bool = True
    language: str = "en"
    quietHoursStart: Optional[str] = None # e.g. "22:00"
    quietHoursEnd: Optional[str] = None # e.g. "06:00"
    marketingOptIn: bool = False
    updatedAt: datetime
    
# --- Template Models ---

class NotificationTemplate(BaseModel):
    templateId: str # e.g. "BOOKING_CONFIRMED"
    channel: NotificationChannel
    language: str
    subjectTemplate: str # e.g. "Booking {{bookingId}} Confirmed"
    bodyTemplate: str
    version: int
    createdAt: datetime
