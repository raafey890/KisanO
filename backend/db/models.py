import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = 'users'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    fullName = Column(String(100), nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=True)
    passwordHash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)
    verificationStatus = Column(String(50), default="PENDING")
    status = Column(String(50), default="ACTIVE")
    failedLoginAttempts = Column(Integer, default=0)
    lockoutUntil = Column(DateTime(timezone=True), nullable=True)
    isDeleted = Column(Boolean, default=False)
    createdAt = Column(DateTime(timezone=True), default=utc_now)
    updatedAt = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)
    authProvider = Column(String(50), default="LOCAL")

class UserSession(Base):
    __tablename__ = 'user_sessions'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    userId = Column(UUID(as_uuid=True), ForeignKey('users.id'), index=True, nullable=False)
    deviceName = Column(String(100), nullable=False)
    os = Column(String(100), nullable=False)
    browser = Column(String(100), nullable=False)
    ipAddress = Column(String(50), nullable=False)
    loginTime = Column(DateTime(timezone=True), default=utc_now)
    lastActivity = Column(DateTime(timezone=True), default=utc_now)
    expiresAt = Column(DateTime(timezone=True), nullable=False)
    isActive = Column(Boolean, default=True)

class OTPCode(Base):
    __tablename__ = 'otp_codes'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    identifier = Column(String(255), index=True, nullable=False)
    otpHash = Column(String(255), nullable=False)
    expiresAt = Column(DateTime(timezone=True), nullable=False)
    attempts = Column(Integer, default=0)
    isActive = Column(Boolean, default=True)
    createdAt = Column(DateTime(timezone=True), default=utc_now)

class RefreshToken(Base):
    __tablename__ = 'refresh_tokens'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sessionId = Column(UUID(as_uuid=True), ForeignKey('user_sessions.id'), index=True, nullable=False)
    userId = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    tokenHash = Column(String(255), nullable=False)
    expiresAt = Column(DateTime(timezone=True), nullable=False)
    isRevoked = Column(Boolean, default=False)
    createdAt = Column(DateTime(timezone=True), default=utc_now)

class LoginHistory(Base):
    __tablename__ = 'login_history'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    identifier = Column(String(255), index=True, nullable=False)
    eventType = Column(String(50), nullable=False)
    ipAddress = Column(String(50), nullable=False)
    device = Column(String(100), nullable=False)
    os = Column(String(100), nullable=False)
    browser = Column(String(100), nullable=False)
    success = Column(Boolean, nullable=False)
    timestamp = Column(DateTime(timezone=True), default=utc_now)
