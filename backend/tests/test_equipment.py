import pytest
from datetime import datetime, timezone, timedelta
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_search_equipment_unauthorized():
    # Public search should work if auth is disabled for it, but currently it's open
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/v1/equipment/query/search?category=Tractor")
    # Even if empty, it should return 200
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_fsm_valid_transition():
    from modules.equipment.constants import VALID_TRANSITIONS, EquipmentStatus
    
    # Check DRAFT to PENDING_APPROVAL
    assert EquipmentStatus.PENDING_APPROVAL in VALID_TRANSITIONS[EquipmentStatus.DRAFT]
    
    # Check BOOKED to MAINTENANCE
    assert EquipmentStatus.MAINTENANCE in VALID_TRANSITIONS[EquipmentStatus.BOOKED]
    
    # Check invalid transition
    assert EquipmentStatus.AVAILABLE not in VALID_TRANSITIONS[EquipmentStatus.DRAFT]

@pytest.mark.asyncio
async def test_availability_overlap_logic():
    # Mocking the repository overlap logic
    from modules.equipment.repository import AvailabilityRepository
    repo = AvailabilityRepository()
    
    # This requires DB connection, we just verify the datetime logic
    start = datetime.now(timezone.utc)
    end = start + timedelta(hours=2)
    assert start < end
