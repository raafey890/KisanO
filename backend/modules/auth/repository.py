from typing import Optional, Dict, Any, List
from datetime import datetime, timezone
from sqlalchemy import select, update, insert
from db.postgres import postgres_manager
from db.models import User, UserSession, OTPCode, RefreshToken, LoginHistory
import uuid

def to_dict(model_instance) -> Dict[str, Any]:
    if not model_instance:
        return None
    d = {c.name: getattr(model_instance, c.name) for c in model_instance.__table__.columns}
    # Add _id for MongoDB compatibility in service layer
    if "id" in d:
        d["_id"] = str(d["id"])
    return d

class UserRepository:
    async def get_by_phone(self, phone: str) -> Optional[Dict[str, Any]]:
        async with postgres_manager.session_factory() as session:
            result = await session.execute(select(User).where(User.phone == phone, User.isDeleted == False))
            return to_dict(result.scalars().first())

    async def get_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        async with postgres_manager.session_factory() as session:
            result = await session.execute(select(User).where(User.email == email, User.isDeleted == False))
            return to_dict(result.scalars().first())
            
    async def get_by_identifier(self, identifier: str) -> Optional[Dict[str, Any]]:
        user = await self.get_by_phone(identifier)
        if not user:
            user = await self.get_by_email(identifier)
        return user

    async def get_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        async with postgres_manager.session_factory() as session:
            result = await session.execute(select(User).where(User.id == uuid.UUID(user_id)))
            return to_dict(result.scalars().first())

    async def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        async with postgres_manager.session_factory() as session:
            user = User(
                fullName=data.get("fullName"),
                phone=data.get("phone"),
                email=data.get("email"),
                passwordHash=data.get("passwordHash"),
                role=data.get("role"),
                verificationStatus=data.get("verificationStatus", "PENDING"),
                status=data.get("status", "ACTIVE"),
                createdAt=datetime.now(timezone.utc),
                updatedAt=datetime.now(timezone.utc)
            )
            session.add(user)
            await session.commit()
            await session.refresh(user)
            return to_dict(user)

    async def update(self, user_id: str, data: Dict[str, Any]) -> bool:
        async with postgres_manager.session_factory() as session:
            data["updatedAt"] = datetime.now(timezone.utc)
            await session.execute(update(User).where(User.id == uuid.UUID(user_id)).values(**data))
            await session.commit()
            return True


class SessionRepository:
    async def get_by_id(self, session_id: str) -> Optional[Dict[str, Any]]:
        async with postgres_manager.session_factory() as session:
            result = await session.execute(select(UserSession).where(UserSession.id == uuid.UUID(session_id)))
            return to_dict(result.scalars().first())

    async def create_session(self, user_id: str, device_name: str, os: str, browser: str, ip_address: str, expires_at: datetime) -> str:
        async with postgres_manager.session_factory() as session:
            user_session = UserSession(
                userId=uuid.UUID(user_id),
                deviceName=device_name,
                os=os,
                browser=browser,
                ipAddress=ip_address,
                loginTime=datetime.now(timezone.utc),
                lastActivity=datetime.now(timezone.utc),
                expiresAt=expires_at,
                isActive=True
            )
            session.add(user_session)
            await session.commit()
            await session.refresh(user_session)
            return str(user_session.id)

    async def get_active_sessions(self, user_id: str) -> List[Dict[str, Any]]:
        async with postgres_manager.session_factory() as session:
            result = await session.execute(
                select(UserSession).where(
                    UserSession.userId == uuid.UUID(user_id),
                    UserSession.isActive == True,
                    UserSession.expiresAt > datetime.now(timezone.utc)
                ).order_by(UserSession.lastActivity.desc())
            )
            return [to_dict(s) for s in result.scalars().all()]

    async def invalidate_session(self, session_id: str):
        await self.update(session_id, {"isActive": False})

    async def update(self, session_id: str, data: Dict[str, Any]):
        async with postgres_manager.session_factory() as session:
            await session.execute(update(UserSession).where(UserSession.id == uuid.UUID(session_id)).values(**data))
            await session.commit()

    async def invalidate_all_sessions(self, user_id: str, except_session_id: Optional[str] = None):
        async with postgres_manager.session_factory() as session:
            stmt = update(UserSession).where(UserSession.userId == uuid.UUID(user_id))
            if except_session_id:
                stmt = stmt.where(UserSession.id != uuid.UUID(except_session_id))
            stmt = stmt.values(isActive=False)
            await session.execute(stmt)
            await session.commit()


class OTPRepository:
    async def store_otp(self, identifier: str, hashed_otp: str, expires_at: datetime):
        async with postgres_manager.session_factory() as session:
            # Invalidate old OTPs for this identifier
            await session.execute(update(OTPCode).where(OTPCode.identifier == identifier).values(isActive=False))
            otp_code = OTPCode(
                identifier=identifier,
                otpHash=hashed_otp,
                expiresAt=expires_at,
                attempts=0,
                isActive=True,
                createdAt=datetime.now(timezone.utc)
            )
            session.add(otp_code)
            await session.commit()

    async def get_active_otp(self, identifier: str) -> Optional[Dict[str, Any]]:
        async with postgres_manager.session_factory() as session:
            result = await session.execute(
                select(OTPCode).where(
                    OTPCode.identifier == identifier,
                    OTPCode.isActive == True,
                    OTPCode.expiresAt > datetime.now(timezone.utc)
                )
            )
            return to_dict(result.scalars().first())
        
    async def increment_attempts(self, otp_id: str):
        async with postgres_manager.session_factory() as session:
            await session.execute(
                update(OTPCode)
                .where(OTPCode.id == uuid.UUID(otp_id))
                .values(attempts=OTPCode.attempts + 1)
            )
            await session.commit()
        
    async def invalidate_otp(self, otp_id: str):
        async with postgres_manager.session_factory() as session:
            await session.execute(update(OTPCode).where(OTPCode.id == uuid.UUID(otp_id)).values(isActive=False))
            await session.commit()


class LoginHistoryRepository:
    async def log_event(self, identifier: str, event_type: str, ip: str, device: str, os: str, browser: str, success: bool):
        async with postgres_manager.session_factory() as session:
            history = LoginHistory(
                identifier=identifier,
                eventType=event_type,
                ipAddress=ip,
                device=device,
                os=os,
                browser=browser,
                success=success,
                timestamp=datetime.now(timezone.utc)
            )
            session.add(history)
            await session.commit()


class RefreshTokenRepository:
    async def store_token(self, session_id: str, user_id: str, hashed_token: str, expires_at: datetime):
        async with postgres_manager.session_factory() as session:
            token = RefreshToken(
                sessionId=uuid.UUID(session_id),
                userId=uuid.UUID(user_id),
                tokenHash=hashed_token,
                expiresAt=expires_at,
                isRevoked=False,
                createdAt=datetime.now(timezone.utc)
            )
            session.add(token)
            await session.commit()

    async def get_valid_token(self, session_id: str) -> Optional[Dict[str, Any]]:
        async with postgres_manager.session_factory() as session:
            result = await session.execute(
                select(RefreshToken).where(
                    RefreshToken.sessionId == uuid.UUID(session_id),
                    RefreshToken.isRevoked == False,
                    RefreshToken.expiresAt > datetime.now(timezone.utc)
                )
            )
            return to_dict(result.scalars().first())

    async def revoke_token(self, session_id: str):
        async with postgres_manager.session_factory() as session:
            await session.execute(
                update(RefreshToken)
                .where(RefreshToken.sessionId == uuid.UUID(session_id))
                .values(isRevoked=True)
            )
            await session.commit()
    
    async def revoke_all_user_tokens(self, user_id: str):
        async with postgres_manager.session_factory() as session:
            await session.execute(
                update(RefreshToken)
                .where(RefreshToken.userId == uuid.UUID(user_id))
                .values(isRevoked=True)
            )
            await session.commit()


user_repository = UserRepository()
session_repository = SessionRepository()
otp_repository = OTPRepository()
login_history_repository = LoginHistoryRepository()
refresh_token_repository = RefreshTokenRepository()
