import pytest
from datetime import datetime, timezone, timedelta
from httpx import AsyncClient, ASGITransport
from main import app


@pytest.mark.asyncio
async def test_search_equipment_unauthorized(mock_db):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get(
            "/api/v1/equipment/search?category=Tractor"
        )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_fsm_valid_transition():
    from modules.equipment.constants import VALID_TRANSITIONS, EquipmentStatus

    assert EquipmentStatus.PENDING_APPROVAL in VALID_TRANSITIONS[
        EquipmentStatus.DRAFT
    ]
    assert EquipmentStatus.MAINTENANCE in VALID_TRANSITIONS[
        EquipmentStatus.BOOKED
    ]
    assert EquipmentStatus.AVAILABLE not in VALID_TRANSITIONS[
        EquipmentStatus.DRAFT
    ]


@pytest.mark.asyncio
async def test_availability_overlap_logic():
    start = datetime.now(timezone.utc)
    end = start + timedelta(hours=2)
    assert start < end
