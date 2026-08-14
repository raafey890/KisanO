import pytest
from httpx import AsyncClient, ASGITransport
from main import app


@pytest.mark.asyncio
async def test_create_sprayer_booking_unauthorized(mock_db):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/api/v1/sprayer-bookings/create-booking", json={
            "serviceId": "some-id",
            "district": "d", "village": "v",
            "latitude": 0.0, "longitude": 0.0,
            "bookingDate": "2026-08-01T10:00:00Z",
            "cropName": "Wheat", "cropStage": "Sowing", "areaSize": 10.0
        })
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_sprayer_booking_fsm_valid_transition():
    from modules.sprayer_bookings.constants import (
        VALID_BOOKING_TRANSITIONS, BookingStatus
    )

    assert BookingStatus.ACCEPTED in VALID_BOOKING_TRANSITIONS[
        BookingStatus.REQUESTED
    ]
    assert BookingStatus.WORK_COMPLETED in VALID_BOOKING_TRANSITIONS[
        BookingStatus.WORK_STARTED
    ]
    assert BookingStatus.CANCELLED not in VALID_BOOKING_TRANSITIONS[
        BookingStatus.WORK_STARTED
    ]
