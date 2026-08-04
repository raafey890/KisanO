from typing import List, Dict, Any
from shared.base_repository import BaseRepository

class SecurityAuditRepository(BaseRepository):
    def __init__(self):
        super().__init__("security_audit")

class BlockedIPRepository(BaseRepository):
    def __init__(self):
        super().__init__("blocked_ips")

class ApiKeyRepository(BaseRepository):
    def __init__(self):
        super().__init__("api_keys")

security_audit_repo = SecurityAuditRepository()
blocked_ip_repo = BlockedIPRepository()
api_key_repo = ApiKeyRepository()
