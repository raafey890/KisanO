from typing import Optional, Dict, Any, List
from shared.base_repository import BaseRepository
from datetime import datetime, timezone
from db.mongodb import get_db

class UserRepository(BaseRepository):
    def __init__(self):
        super().__init__("users")

    async def get_by_phone(self, phone: str) -> Optional[Dict[str, Any]]:
        return await self.collection.find_one({"phone": phone, "isDeleted": False})

    async def get_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        return await self.collection.find_one({"email": email, "isDeleted": False})
        
    async def get_by_identifier(self, identifier: str) -> Optional[Dict[str, Any]]:
        user = await self.get_by_phone(identifier)
        if not user:
            user = await self.get_by_email(identifier)
        return user


class SessionRepository(BaseRepository):
    def __init__(self):
        super().__init__("sessions")

    async def create_session(self, user_id: str, device_name: str, os: str, browser: str, ip_address: str, expires_at: datetime) -> str:
        data = {
            "userId": user_id,
            "deviceName": device_name,
            "os": os,
            "browser": browser,
            "ipAddress": ip_address,
            "loginTime": datetime.now(timezone.utc),
            "lastActivity": datetime.now(timezone.utc),
            "expiresAt": expires_at,
            "isActive": True
        }
        res = await self.create(data)
        return str(res["_id"])

    async def get_active_sessions(self, user_id: str) -> List[Dict[str, Any]]:
        cursor = self.collection.find({
            "userId": user_id, 
            "isActive": True,
            "expiresAt": {"$gt": datetime.now(timezone.utc)}
        }).sort("lastActivity", -1)
        return await cursor.to_list(length=100)

    async def invalidate_session(self, session_id: str):
        await self.update(session_id, {"isActive": False})

    async def invalidate_all_sessions(self, user_id: str, except_session_id: Optional[str] = None):
        filter_q = {"userId": user_id}
        if except_session_id:
            from bson import ObjectId
            filter_q["_id"] = {"$ne": ObjectId(except_session_id)}
        await self.collection.update_many(filter_q, {"$set": {"isActive": False}})


class OTPRepository(BaseRepository):
    def __init__(self):
        super().__init__("otp_requests")

    async def store_otp(self, identifier: str, hashed_otp: str, expires_at: datetime):
        # Invalidate old OTPs for this identifier
        await self.collection.update_many({"identifier": identifier}, {"$set": {"isActive": False}})
        data = {
            "identifier": identifier,
            "hashedOtp": hashed_otp,
            "expiresAt": expires_at,
            "attempts": 0,
            "resends": 0,
            "isActive": True,
            "createdAt": datetime.now(timezone.utc)
        }
        await self.create(data)

    async def get_active_otp(self, identifier: str) -> Optional[Dict[str, Any]]:
        return await self.collection.find_one({
            "identifier": identifier,
            "isActive": True,
            "expiresAt": {"$gt": datetime.now(timezone.utc)}
        })
        
    async def increment_attempts(self, otp_id: str):
        from bson import ObjectId
        await self.collection.update_one({"_id": ObjectId(otp_id)}, {"$inc": {"attempts": 1}})
        
    async def invalidate_otp(self, otp_id: str):
        await self.update(otp_id, {"isActive": False})


class LoginHistoryRepository(BaseRepository):
    def __init__(self):
        super().__init__("login_history")

    async def log_event(self, identifier: str, event_type: str, ip: str, device: str, os: str, browser: str, success: bool):
        data = {
            "identifier": identifier,
            "eventType": event_type,
            "ipAddress": ip,
            "device": device,
            "os": os,
            "browser": browser,
            "success": success,
            "timestamp": datetime.now(timezone.utc)
        }
        await self.create(data)


class RefreshTokenRepository(BaseRepository):
    def __init__(self):
        super().__init__("refresh_tokens")

    async def store_token(self, session_id: str, user_id: str, hashed_token: str, expires_at: datetime):
        data = {
            "sessionId": session_id,
            "userId": user_id,
            "hashedToken": hashed_token,
            "expiresAt": expires_at,
            "isRevoked": False,
            "createdAt": datetime.now(timezone.utc)
        }
        await self.create(data)

    async def get_valid_token(self, session_id: str) -> Optional[Dict[str, Any]]:
        return await self.collection.find_one({
            "sessionId": session_id,
            "isRevoked": False,
            "expiresAt": {"$gt": datetime.now(timezone.utc)}
        })

    async def revoke_token(self, session_id: str):
        await self.collection.update_many({"sessionId": session_id}, {"$set": {"isRevoked": True}})

user_repository = UserRepository()
session_repository = SessionRepository()
otp_repository = OTPRepository()
login_history_repository = LoginHistoryRepository()
refresh_token_repository = RefreshTokenRepository()
