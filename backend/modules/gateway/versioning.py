from fastapi import Request
from modules.gateway.constants import ApiVersion
import re

class VersioningEngine:
    @staticmethod
    def extract_version(request: Request) -> str:
        """
        Extracts API version from URI first, then headers.
        Falls back to default v1.
        """
        # 1. Check URI (e.g., /api/v2/users)
        path = request.url.path
        match = re.search(r'/api/(v\d+)/', path)
        if match:
            return match.group(1)
            
        # 2. Check Headers (e.g., Accept-Version: v2)
        header_version = request.headers.get("Accept-Version")
        if header_version:
            return header_version
            
        return ApiVersion.V1.value

versioning_engine = VersioningEngine()
