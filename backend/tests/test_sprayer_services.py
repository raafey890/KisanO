import pytest
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_search_sprayer_services_unauthorized():
    # Search is public, should return 200 even without token
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/v1/sprayer-services/query/search?service_type=Drone Spraying")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_service_fsm_valid_transition():
    from modules.sprayer_services.constants import VALID_SERVICE_TRANSITIONS, ServiceStatus
    
    # Check DRAFT to PENDING_APPROVAL
    assert ServiceStatus.PENDING_APPROVAL in VALID_SERVICE_TRANSITIONS[ServiceStatus.DRAFT]
    
    # Check AVAILABLE to BUSY
    assert ServiceStatus.BUSY in VALID_SERVICE_TRANSITIONS[ServiceStatus.AVAILABLE]
    
    # Check invalid transition
    assert ServiceStatus.AVAILABLE not in VALID_SERVICE_TRANSITIONS[ServiceStatus.DRAFT]
