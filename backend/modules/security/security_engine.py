from typing import Dict, Any, Optional
from fastapi import Request, UploadFile

from modules.security.secret_manager import secret_manager
from modules.security.encryption import encryption_engine
from modules.security.hashing import hashing_engine
from modules.security.rate_limiter import rate_limiter
from modules.security.rbac import rbac_engine
from modules.security.upload_security import upload_security_engine
from modules.security.webhook_security import webhook_security_engine
from modules.security.threat_detection import threat_detection_engine
from modules.security.policy_engine import policy_engine
from modules.security.audit import audit_engine
from modules.security.constants import SecurityEventType

class SecurityEngine:
    """
    Unified Facade for all Security Operations (Zero Trust Architecture)
    """

    # --- Secrets & Crypto ---
    @staticmethod
    def get_secret(key: str) -> str:
        return secret_manager.get(key)
        
    @staticmethod
    def hash_password(password: str) -> str:
        return hashing_engine.hash_password(password)
        
    @staticmethod
    def verify_password(plain: str, hashed: str) -> bool:
        return hashing_engine.verify_password(plain, hashed)
        
    @staticmethod
    def encrypt_data(data: str) -> str:
        return encryption_engine.encrypt_string(data)
        
    @staticmethod
    def decrypt_data(data: str) -> str:
        return encryption_engine.decrypt_string(data)

    # --- Access Control ---
    @staticmethod
    def has_permission(role: str, permission: str) -> bool:
        return rbac_engine.has_permission(role, permission)

    # --- Rate Limiting ---
    @staticmethod
    async def check_rate_limit(key: str, max_requests: int = 100, window_seconds: int = 60):
        await rate_limiter.check_rate_limit(key, max_requests, window_seconds)

    # --- File Uploads ---
    @staticmethod
    async def validate_upload(file: UploadFile):
        await upload_security_engine.validate_upload(file)

    # --- Webhooks ---
    @staticmethod
    async def verify_webhook_signature(request: Request, secret: str):
        await webhook_security_engine.verify_signature(request, secret)

    # --- Policies ---
    @staticmethod
    def validate_password_policy(password: str) -> bool:
        return policy_engine.validate_password_policy(password)

    # --- Threat Detection & Audit ---
    @staticmethod
    async def log_security_event(event_type: SecurityEventType, ip: str, user_id: Optional[str] = None):
        await threat_detection_engine.analyze_event(event_type, ip, user_id)


security_engine = SecurityEngine()
