from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    fullName: str
    mobileNumber: str = Field(..., pattern=r"^[0-9]{10}$", description="10-digit mobile number")
    email: Optional[EmailStr] = None
    role: str = Field(..., pattern=r"^(ADMIN|FARMER|EQUIPMENT_OWNER)$")
    village: str
    district: str
    state: str

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserUpdate(BaseModel):
    fullName: Optional[str] = None
    email: Optional[EmailStr] = None
    village: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    profileImage: Optional[str] = None

class UserResponse(UserBase):
    id: int
    profileImage: str
    isBlocked: bool
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[str] = None
