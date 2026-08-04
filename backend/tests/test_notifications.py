import pytest
import asyncio
from unittest.mock import patch, MagicMock

@pytest.mark.asyncio
async def test_template_engine():
    from modules.notifications.templates import template_engine
    
    subject, body = await template_engine.render(
        "BOOKING_CONFIRMED", 
        "PUSH", 
        "en", 
        {"bookingId": "BKG-123", "userName": "Rahul", "equipmentName": "Tractor", "date": "2026-10-10"}
    )
    
    assert subject == "Booking BKG-123 Confirmed"
    assert "Hi Rahul" in body
    assert "Tractor" in body

@pytest.mark.asyncio
async def test_provider_selection():
    from modules.notifications.providers import get_provider
    provider = get_provider("PUSH")
    assert provider.provider_name == "MockProvider"
    
@pytest.mark.asyncio
async def test_event_bus_subscription():
    from modules.shared.event_bus import InMemoryEventBus
    bus = InMemoryEventBus()
    
    called = False
    async def mock_handler(payload):
        nonlocal called
        called = True
        
    bus.subscribe("TEST_EVENT", mock_handler)
    await bus.publish("TEST_EVENT", {"data": 123})
    
    # Let the async loop run
    await asyncio.sleep(0.1)
    
    assert called == True
