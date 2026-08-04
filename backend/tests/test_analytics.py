import pytest
import asyncio
from datetime import datetime, timezone
from unittest.mock import patch, AsyncMock

@pytest.mark.asyncio
async def test_snapshot_engine_increment():
    from modules.analytics.engines.snapshot_engine import snapshot_engine
    from modules.analytics.constants import MetricType
    
    # We will mock the repository call to avoid DB dependence in simple unit tests
    with patch('modules.analytics.repository.snapshot_repo.increment_metric', new_callable=AsyncMock) as mock_inc:
        await snapshot_engine.record_event(MetricType.REVENUE, 500.0)
        
        # It should have called increment twice (Hourly and Daily)
        assert mock_inc.call_count == 2
        
@pytest.mark.asyncio
async def test_analytics_facade_fallback():
    from modules.analytics.facades import analytics_read_facade
    
    # Fetching an unregistered read name should return an empty list gracefully
    res = await analytics_read_facade.fetch("UNKNOWN_AGGREGATION")
    assert res == []

@pytest.mark.asyncio
async def test_forecast_engine():
    from modules.analytics.engines.forecast_engine import forecast_engine
    from modules.analytics.constants import MetricType
    
    res = await forecast_engine.predict(MetricType.REVENUE, horizon_days=3)
    assert len(res.predictions) == 3
    assert res.predictions[0]["day_offset"] == 1
