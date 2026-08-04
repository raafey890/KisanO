import re
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
from modules.auth.constants import UserRole

# Password Policy Validator
def validate_password(v: str) -> str:
    if len(v) < 8:
        raise ValueError("Password must be at least 8 characters long")
    if not re.search(r"[A-Z]", v):
        raise ValueError("Password must contain at least one uppercase letter")
    if not re.search(r"[a-z]", v):
        raise ValueError("Password must contain at least one lowercase letter")
    if not re.search(r"\d", v):
        raise ValueError("Password must contain at least one number")
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
        raise ValueError("Password must contain at least one special character")
    return v

class UserRegister(BaseModel):
    fullName: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., pattern=r"^\+?[1-9]\d{9,14}$")
    email: Optional[EmailStr] = None
    password: str
    confirmPassword: str
    role: UserRole
    acceptTerms: bool = True

    @field_validator("password")
    @classmethod
    def check_password(cls, v):
        return validate_password(v)

    @field_validator("confirmPassword")
    @classmethod
    def passwords_match(cls, v, info):
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Passwords do not match")
        return v

class LoginRequest(BaseModel):
    identifier: str = Field(..., description="Phone or Email")
    password: str
    deviceInfo: Optional[str] = None
    ipAddress: Optional[str] = None
    os: Optional[str] = None
    browser: Optional[str] = None

class TokenData(BaseModel):
    accessToken: str
    refreshToken: str
    tokenType: str = "Bearer"
    expiresIn: int

class LoginResponse(BaseModel):
    user: dict
    tokens: TokenData

class RefreshTokenRequest(BaseModel):
    refreshToken: str

class ForgotPasswordRequest(BaseModel):
    identifier: str = Field(..., description="Phone or Email")

class VerifyOTPRequest(BaseModel):
    identifier: str
    otp: str

class ResetPasswordRequest(BaseModel):
    identifier: str
    otp: str
    newPassword: str
    
    @field_validator("newPassword")
    @classmethod
    def check_new_password(cls, v):
        return validate_password(v)

class ChangePasswordRequest(BaseModel):
    oldPassword: str
    newPassword: str

    @field_validator("newPassword")
    @classmethod
    def check_new_password(cls, v):
        return validate_password(v)

class SessionResponse(BaseModel):
    id: str
    deviceName: str
    os: str
    browser: str
    ipAddress: str
    lastActivity: str
    loginTime: str
    isCurrent: bool
