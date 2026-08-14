import pytest
from httpx import AsyncClient, ASGITransport
from main import app


@pytest.mark.asyncio
async def test_search_sprayer_services_unauthorized(mock_db):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get(
            "/api/v1/sprayer-services/query/search"
            "?service_type=Drone Spraying"
        )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_service_fsm_valid_transition():
    from modules.sprayer_services.constants import (
        VALID_SERVICE_TRANSITIONS, ServiceStatus
    )

    assert ServiceStatus.PENDING_APPROVAL in VALID_SERVICE_TRANSITIONS[
        ServiceStatus.DRAFT
    ]
    assert ServiceStatus.BUSY in VALID_SERVICE_TRANSITIONS[
        ServiceStatus.AVAILABLE
    ]
    assert ServiceStatus.AVAILABLE not in VALID_SERVICE_TRANSITIONS[
        ServiceStatus.DRAFT
    ]
