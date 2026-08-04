import pytest
from unittest.mock import patch, MagicMock

@pytest.mark.asyncio
async def test_retry_engine_backoff():
    from modules.jobs.engines.retry_engine import retry_engine
    
    assert retry_engine.calculate_backoff(0) == 5    # 5 * 2^0 = 5
    assert retry_engine.calculate_backoff(1) == 10   # 5 * 2^1 = 10
    assert retry_engine.calculate_backoff(3) == 40   # 5 * 2^3 = 40

def test_retry_engine_should_retry():
    from modules.jobs.engines.retry_engine import retry_engine
    
    assert retry_engine.should_retry(0, max_retries=3) is True
    assert retry_engine.should_retry(2, max_retries=3) is True
    assert retry_engine.should_retry(3, max_retries=3) is False
