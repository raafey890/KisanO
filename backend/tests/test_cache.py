import pytest
import asyncio
from unittest.mock import patch, MagicMock

@pytest.mark.asyncio
async def test_cache_fallback():
    from modules.cache.cache_manager import cache_manager
    from modules.cache.constants import CacheStatus
    
    # Simulate Redis being DOWN (which triggers exception in our mock setup or degraded state)
    # The provider mock returns False for ping
    
    await cache_manager.set("test_key", "test_value", 300)
    val = await cache_manager.get("test_key")
    
    assert val == "test_value"
    # Even if L2 failed, L1 should have it
    assert "test_key" in cache_manager.l1_cache._store
    
@pytest.mark.asyncio
async def test_key_engine():
    from modules.cache.engines.key_engine import key_engine
    assert key_engine.user("123") == "user:v1:123"
    assert key_engine.equipment("abc") == "equipment:v1:abc"
    assert key_engine.feature_flags() == "feature_flags:v1"

@pytest.mark.asyncio
async def test_serialization():
    from modules.cache.engines.serialization_engine import serialization_engine
    
    data = {"foo": "bar", "count": 5}
    ser = serialization_engine.serialize(data)
    deser = serialization_engine.deserialize(ser)
    
    assert isinstance(ser, str)
    assert deser["foo"] == "bar"
    assert deser["count"] == 5
