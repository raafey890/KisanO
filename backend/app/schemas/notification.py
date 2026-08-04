from pydantic import BaseModel
from datetime import datetime

class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    isRead: bool
    createdAt: datetime

    class Config:
        from_attributes = True
