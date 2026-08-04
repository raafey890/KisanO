import pytest
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_create_booking_unauthorized():
    # Only authenticated users with FARMER role can create bookings
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/api/v1/equipment-bookings", json={
            "equipmentId": "some-id",
            "rentalStartDate": "2026-08-01T10:00:00Z",
            "rentalEndDate": "2026-08-05T10:00:00Z"
        })
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_booking_fsm_valid_transition():
    from modules.equipment_bookings.constants import VALID_BOOKING_TRANSITIONS, BookingStatus
    
    # Check REQUESTED to ACCEPTED
    assert BookingStatus.ACCEPTED in VALID_BOOKING_TRANSITIONS[BookingStatus.REQUESTED]
    
    # Check ACCEPTED to CANCELLED
    assert BookingStatus.CANCELLED in VALID_BOOKING_TRANSITIONS[BookingStatus.ACCEPTED]
    
    # Check invalid transition
    assert BookingStatus.COMPLETED not in VALID_BOOKING_TRANSITIONS[BookingStatus.REQUESTED]
