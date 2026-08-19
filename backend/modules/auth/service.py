import logging
import random
import string
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, Optional

from shared.error_codes import ErrorCode
from core.exceptions import UnauthorizedException, AppException
from core.security import verify_password, get_password_hash, create_access_token, create_refresh_token
from modules.auth.schemas import UserRegister, LoginRequest, ChangePasswordRequest
from modules.auth.repository import (
    user_repository, session_repository, otp_repository, 
    login_history_repository, refresh_token_repository
)
from core.config import settings

logger = logging.getLogger(__name__)

class AuthService:
    
    @staticmethod
    async def register_user(data: UserRegister, ip: str, device: str, os: str, browser: str) -> Dict[str, Any]:
        logger.info(f"Registering new user with phone: {data.phone}")
        
        # 1. Check for duplicates
        existing = await user_repository.get_by_phone(data.phone)
        if existing:
            raise AppException(message="Phone number is already registered.", status_code=409, code=ErrorCode.AUTH_DUPLICATE_PHONE.value)
            
        if data.email:
            existing_email = await user_repository.get_by_email(data.email)
            if existing_email:
                raise AppException(message="Email is already registered.", status_code=409, code=ErrorCode.AUTH_DUPLICATE_EMAIL.value)

        # 2. Hash Password
        hashed_password = get_password_hash(data.password)

        # 3. Create User Document
        user_doc = {
            "fullName": data.fullName,
            "phone": data.phone,
            "email": data.email,
            "passwordHash": hashed_password,
            "role": data.role.value,
            "verificationStatus": "PENDING",
            "status": "ACTIVE",
            "failedLoginAttempts": 0,
            "lockoutUntil": None,
            "isDeleted": False,
            "createdAt": datetime.now(timezone.utc),
            "updatedAt": datetime.now(timezone.utc),
            "authProvider": "LOCAL"
        }

        created_user = await user_repository.create(user_doc)
        
        # Audit Log
        await login_history_repository.log_event(
            data.phone, "REGISTRATION", ip, device, os, browser, True
        )
        
        return created_user

    @staticmethod
    async def login_user(data: LoginRequest, ip: str) -> Dict[str, Any]:
        logger.info(f"Login attempt for: {data.identifier}")
        
        # 1. Fetch user by phone or email
        user = await user_repository.get_by_identifier(data.identifier)
        if not user:
            await login_history_repository.log_event(data.identifier, "LOGIN", ip, data.deviceInfo or "Unknown", data.os or "Unknown", data.browser or "Unknown", False)
            raise UnauthorizedException(message="Invalid phone number or password. Please try again.", code=ErrorCode.AUTH_INVALID_CREDENTIALS.value)
            
        user_id_str = str(user["_id"])

        # 2. Check Account Lockout
        if user.get("lockoutUntil") and user["lockoutUntil"] > datetime.now(timezone.utc):
            raise UnauthorizedException(message="Your account is temporarily locked due to too many failed attempts. Please try again later.", code=ErrorCode.AUTH_ACCOUNT_LOCKED.value)

        # 3. Verify password
        if not verify_password(data.password, user.get("passwordHash")):
            # Increment failed attempts
            attempts = user.get("failedLoginAttempts", 0) + 1
            update_data = {"failedLoginAttempts": attempts}
            if attempts >= 5:
                update_data["lockoutUntil"] = datetime.now(timezone.utc) + timedelta(minutes=15)
                update_data["failedLoginAttempts"] = 0
                logger.warning(f"Account locked out: {data.identifier}")
            
            await user_repository.update(user_id_str, update_data)
            await login_history_repository.log_event(data.identifier, "FAILED_LOGIN", ip, data.deviceInfo or "Unknown", data.os or "Unknown", data.browser or "Unknown", False)
            raise UnauthorizedException(message="Invalid phone number or password. Please try again.", code=ErrorCode.AUTH_INVALID_CREDENTIALS.value)

        # 4. Check Status
        status = user.get("status", "ACTIVE")
        if status in ["SUSPENDED", "BLOCKED", "DELETED"]:
            raise UnauthorizedException(message=f"Your account has been {status.lower()}. Please contact support for assistance.", code=ErrorCode.AUTH_ACCOUNT_SUSPENDED.value)
            
        # 5. Reset failed attempts
        if user.get("failedLoginAttempts", 0) > 0 or user.get("lockoutUntil"):
            await user_repository.update(user_id_str, {"failedLoginAttempts": 0, "lockoutUntil": None})

        # 6. Create Session
        expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        session_id = await session_repository.create_session(
            user_id_str, 
            data.deviceInfo or "Unknown", 
            data.os or "Unknown", 
            data.browser or "Unknown", 
            ip, 
            expires_at
        )

        # 7. Generate Tokens
        access_token = create_access_token(user_id=user_id_str, role=user["role"], phone=user["phone"], session_id=session_id)
        refresh_token = create_refresh_token(user_id=user_id_str, session_id=session_id)

        # 8. Hash and Store Refresh Token
        hashed_rt = get_password_hash(refresh_token)
        await refresh_token_repository.store_token(session_id, user_id_str, hashed_rt, expires_at)

        # 9. Audit Log
        await login_history_repository.log_event(data.identifier, "LOGIN", ip, data.deviceInfo or "Unknown", data.os or "Unknown", data.browser or "Unknown", True)

        return {
            "user": {
                "id": user_id_str,
                "fullName": user["fullName"],
                "phone": user["phone"],
                "email": user.get("email"),
                "role": user["role"],
                "status": status
            },
            "tokens": {
                "accessToken": access_token,
                "refreshToken": refresh_token,
                "tokenType": "Bearer",
                "expiresIn": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
            }
        }

    @staticmethod
    async def rotate_refresh_token(old_refresh_token: str, ip: str) -> Dict[str, Any]:
        import jwt
        from jwt.exceptions import PyJWTError
        try:
            payload = jwt.decode(old_refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            user_id = payload.get("sub")
            session_id = payload.get("session_id")
            if not user_id or not session_id or payload.get("type") != "refresh":
                raise UnauthorizedException(message="Your session has expired. Please log in again.", code=ErrorCode.AUTH_TOKEN_INVALID.value)
        except PyJWTError:
            raise UnauthorizedException(message="Your session has expired. Please log in again.", code=ErrorCode.AUTH_TOKEN_INVALID.value)

        # Verify session and token validity in DB
        db_token = await refresh_token_repository.get_valid_token(session_id)
        if not db_token:
            # Token reuse detected! Invalidate all tokens for this session
            await refresh_token_repository.revoke_token(session_id)
            await session_repository.invalidate_session(session_id)
            raise UnauthorizedException(message="Your session is no longer active. Please log in again.", code=ErrorCode.AUTH_TOKEN_INVALID.value)
            
        if not verify_password(old_refresh_token, db_token["hashedToken"]):
            raise UnauthorizedException(message="Your session is no longer active. Please log in again.", code=ErrorCode.AUTH_TOKEN_INVALID.value)
            
        # Verify user
        user = await user_repository.get_by_id(user_id)
        if not user or user.get("status") != "ACTIVE":
            raise UnauthorizedException(message="Your account is inactive.", code=ErrorCode.AUTH_ACCOUNT_SUSPENDED.value)
            
        # Revoke old token
        await refresh_token_repository.revoke_token(session_id)
        
        # Generate new tokens
        access_token = create_access_token(user_id=user_id, role=user["role"], phone=user["phone"], session_id=session_id)
        new_refresh_token = create_refresh_token(user_id=user_id, session_id=session_id)
        
        # Store new token
        expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        hashed_rt = get_password_hash(new_refresh_token)
        await refresh_token_repository.store_token(session_id, user_id, hashed_rt, expires_at)
        
        await session_repository.update(session_id, {"lastActivity": datetime.now(timezone.utc)})
        await login_history_repository.log_event(user["phone"], "TOKEN_REFRESH", ip, "Unknown", "Unknown", "Unknown", True)
        
        return {
            "accessToken": access_token,
            "refreshToken": new_refresh_token,
            "tokenType": "Bearer",
            "expiresIn": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        }

    @staticmethod
    async def logout_device(session_id: str, ip: str):
        await session_repository.invalidate_session(session_id)
        await refresh_token_repository.revoke_token(session_id)
        await login_history_repository.log_event(session_id, "LOGOUT", ip, "Unknown", "Unknown", "Unknown", True)

    @staticmethod
    async def logout_all_devices(user_id: str, current_session_id: str, ip: str):
        await session_repository.invalidate_all_sessions(user_id)
        await refresh_token_repository.collection.update_many({"userId": user_id}, {"$set": {"isRevoked": True}})
        await login_history_repository.log_event(user_id, "LOGOUT_ALL", ip, "Unknown", "Unknown", "Unknown", True)
        
    @staticmethod
    async def get_active_sessions(user_id: str, current_session_id: str) -> list:
        sessions = await session_repository.get_active_sessions(user_id)
        formatted = []
        for s in sessions:
            formatted.append({
                "id": str(s["_id"]),
                "deviceName": s["deviceName"],
                "os": s["os"],
                "browser": s["browser"],
                "ipAddress": s["ipAddress"],
                "lastActivity": s["lastActivity"].isoformat() + "Z",
                "loginTime": s["loginTime"].isoformat() + "Z",
                "isCurrent": str(s["_id"]) == current_session_id
            })
        return formatted

    # OTP Logic
    @staticmethod
    def _generate_otp() -> str:
        return ''.join(random.choices(string.digits, k=6))
        
    @staticmethod
    async def request_otp(identifier: str, ip: str) -> None:
        user = await user_repository.get_by_identifier(identifier)
        if not user:
            return # Silent fail for security
            
        otp = AuthService._generate_otp()
        hashed_otp = get_password_hash(otp)
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
        
        await otp_repository.store_otp(identifier, hashed_otp, expires_at)
        
        # MOCK DELIVERY (As requested: Print in terminal, do not integrate external provider yet)
        print("\n======================================")
        print(f"MOCK OTP DELIVERY FOR {identifier}: {otp}")
        print("======================================\n")
        
        await login_history_repository.log_event(identifier, "OTP_REQUEST", ip, "Unknown", "Unknown", "Unknown", True)

    @staticmethod
    async def verify_otp(identifier: str, otp: str, ip: str) -> bool:
        otp_doc = await otp_repository.get_active_otp(identifier)
        if not otp_doc:
            raise AppException(message="The OTP you entered is invalid or has expired.", status_code=400, code=ErrorCode.AUTH_INVALID_OTP.value)
            
        if otp_doc["attempts"] >= 5:
            await otp_repository.invalidate_otp(str(otp_doc["_id"]))
            raise AppException(message="Maximum attempts reached. Please request a new OTP.", status_code=429, code=ErrorCode.AUTH_TOO_MANY_REQUESTS.value)
            
        if not verify_password(otp, otp_doc["hashedOtp"]):
            await otp_repository.increment_attempts(str(otp_doc["_id"]))
            raise AppException(message="The OTP you entered is incorrect.", status_code=400, code=ErrorCode.AUTH_INVALID_OTP.value)
            
        await otp_repository.invalidate_otp(str(otp_doc["_id"]))
        await login_history_repository.log_event(identifier, "OTP_VERIFY", ip, "Unknown", "Unknown", "Unknown", True)
        return True

    @staticmethod
    async def reset_password(identifier: str, otp: str, new_password: str, ip: str) -> None:
        # verify_otp invalidates the OTP on success
        await AuthService.verify_otp(identifier, otp, ip)
        
        user = await user_repository.get_by_identifier(identifier)
        hashed_pw = get_password_hash(new_password)
        await user_repository.update(str(user["_id"]), {
            "passwordHash": hashed_pw,
            "updatedAt": datetime.now(timezone.utc)
        })
        
        await login_history_repository.log_event(identifier, "PASSWORD_RESET", ip, "Unknown", "Unknown", "Unknown", True)

    @staticmethod
    async def change_password(user_id: str, data: ChangePasswordRequest, ip: str) -> None:
        user = await user_repository.get_by_id(user_id)
        if not verify_password(data.oldPassword, user["passwordHash"]):
            raise UnauthorizedException(message="The old password you entered is incorrect.", code=ErrorCode.AUTH_INVALID_CREDENTIALS.value)
            
        hashed_pw = get_password_hash(data.newPassword)
        await user_repository.update(user_id, {
            "passwordHash": hashed_pw,
            "updatedAt": datetime.now(timezone.utc)
        })
        await login_history_repository.log_event(user["phone"], "PASSWORD_CHANGE", ip, "Unknown", "Unknown", "Unknown", True)
