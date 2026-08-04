import pytest
import json
import logging
from unittest.mock import patch, MagicMock

@pytest.mark.asyncio
async def test_logging_redaction():
    from modules.monitoring.engines.logging_engine import LoggingEngine
    
    payload = {
        "user": "test",
        "password": "secretPassword123!",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    
    # Dump to str and redact
    log_str = json.dumps(payload)
    redacted_str = LoggingEngine._redact(log_str)
    
    assert "secretPassword123!" not in redacted_str
    assert "***REDACTED***" in redacted_str
    assert "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." not in redacted_str

@pytest.mark.asyncio
async def test_health_check_aggregation():
    from modules.monitoring.engines.health_engine import health_engine
    
    health = await health_engine.check_health()
    assert health.status in ["UP", "DEGRADED", "DOWN"]
    assert len(health.components) > 0

def test_context_vars():
    from modules.monitoring.context import set_request_id, get_request_id
    set_request_id("req-123")
    assert get_request_id() == "req-123"
