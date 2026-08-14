import pytest
from httpx import AsyncClient, ASGITransport
from main import app


@pytest.mark.asyncio
async def test_create_order_unauthorized(mock_db):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/api/v1/orders/create-order", json={
            "items": [{"productId": "some-id", "quantity": 2}],
            "shippingAddress": {
                "street": "123", "district": "d",
                "state": "s", "pincode": "1", "phone": "123"
            },
            "billingAddress": {
                "street": "123", "district": "d",
                "state": "s", "pincode": "1", "phone": "123"
            }
        })
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_order_fsm_valid_transition():
    from modules.orders.constants import VALID_ORDER_TRANSITIONS, OrderStatus

    assert OrderStatus.CANCELLED in VALID_ORDER_TRANSITIONS[OrderStatus.CREATED]
    assert OrderStatus.SHIPPED in VALID_ORDER_TRANSITIONS[OrderStatus.PACKED]
    assert OrderStatus.CANCELLED not in VALID_ORDER_TRANSITIONS[OrderStatus.SHIPPED]
