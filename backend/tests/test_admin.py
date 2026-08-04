import pytest
import asyncio
from unittest.mock import patch, MagicMock

@pytest.mark.asyncio
async def test_platform_write_facade():
    from modules.admin.facades import platform_write_facade
    from core.exceptions import AppException
    
    called = False
    async def mock_handler(payload):
        nonlocal called
        called = True
        return True
        
    platform_write_facade.register_command("TEST_COMMAND", mock_handler)
    
    res = await platform_write_facade.execute_command("TEST_COMMAND", {"foo": "bar"})
    assert res == True
    assert called == True
    
    # Test unregistered
    import pytest
    with pytest.raises(NotImplementedError):
        await platform_write_facade.execute_command("NOT_FOUND", {})

@pytest.mark.asyncio
async def test_feature_flag_cache():
    from modules.admin.cache import config_cache
    
    config_cache.update_flag_cache("MOCK_FLAG", {"state": "ENABLED"})
    assert config_cache.get_flag("MOCK_FLAG")["state"] == "ENABLED"
    
    from modules.admin.engines.feature_flag_engine import feature_flag_engine
    assert feature_flag_engine.is_enabled("MOCK_FLAG") == True
    assert feature_flag_engine.is_enabled("UNKNOWN_FLAG") == False
