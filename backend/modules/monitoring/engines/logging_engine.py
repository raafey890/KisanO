import json
import logging
import re
from typing import Dict, Any, Optional
from datetime import datetime, timezone
from modules.monitoring.constants import LogLevel
from modules.monitoring.schemas import StructuredLog
from modules.monitoring.context import get_request_id, get_correlation_id, get_user_id

# Configure standard python logger to stdout
logger = logging.getLogger("kisano-json-logger")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
logger.addHandler(handler)
# Disable propagation so it doesn't print twice if root logger is active
logger.propagate = False

class LoggingEngine:
    # Regex patterns for redaction
    _REDACT_PATTERNS = {
        "password": re.compile(r'"password"\s*:\s*"[^"]+"', re.IGNORECASE),
        "token": re.compile(r'"(?:access_token|refresh_token|jwt|token)"\s*:\s*"[^"]+"', re.IGNORECASE),
        "card": re.compile(r'"(?:card_number|credit_card|cvv)"\s*:\s*"[^"]+"', re.IGNORECASE)
    }

    @staticmethod
    def _redact(payload_str: str) -> str:
        payload_str = re.sub(
            r'("password"\s*:\s*)"[^"]+"',
            r'\1"***REDACTED***"',
            payload_str,
            flags=re.IGNORECASE,
        )
        payload_str = re.sub(
            r'("(?:access_token|refresh_token|jwt|token)"\s*:\s*)"[^"]+"',
            r'\1"***REDACTED***"',
            payload_str,
            flags=re.IGNORECASE,
        )
        payload_str = re.sub(
            r'("(?:card_number|credit_card|cvv)"\s*:\s*)"[^"]+"',
            r'\1"***REDACTED***"',
            payload_str,
            flags=re.IGNORECASE,
        )
        return payload_str

    @staticmethod
    def log(level: LogLevel, module: str, message: str, payload: Optional[Dict[str, Any]] = None, **kwargs):
        log_obj = StructuredLog(
            timestamp=datetime.now(timezone.utc),
            level=level,
            module=module,
            message=message,
            requestId=get_request_id(),
            correlationId=get_correlation_id(),
            userId=get_user_id(),
            payload=payload,
            **kwargs
        )
        
        # Convert to JSON String
        log_str = log_obj.model_dump_json(exclude_none=True)
        
        # Redact PII
        if payload:
            log_str = LoggingEngine._redact(log_str)
            
        # Write to stdout
        if level == LogLevel.ERROR or level == LogLevel.CRITICAL:
            logger.error(log_str)
        elif level == LogLevel.WARNING:
            logger.warning(log_str)
        elif level == LogLevel.DEBUG:
            logger.debug(log_str)
        else:
            logger.info(log_str)

logging_engine = LoggingEngine()
