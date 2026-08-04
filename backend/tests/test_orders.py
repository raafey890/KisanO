import pytest
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_create_order_unauthorized():
    # Only authenticated users with FARMER role can create orders
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/api/v1/orders", json={
            "items": [{"productId": "some-id", "quantity": 2}],
            "shippingAddress": {
                "street": "123", "district": "d", "state": "s", "pincode": "1", "phone": "123"
            },
            "billingAddress": {
                "street": "123", "district": "d", "state": "s", "pincode": "1", "phone": "123"
            }
        })
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_order_fsm_valid_transition():
    from modules.orders.constants import VALID_ORDER_TRANSITIONS, OrderStatus
    
    # Check CREATED to CANCELLED
    assert OrderStatus.CANCELLED in VALID_ORDER_TRANSITIONS[OrderStatus.CREATED]
    
    # Check PACKED to SHIPPED
    assert OrderStatus.SHIPPED in VALID_ORDER_TRANSITIONS[OrderStatus.PACKED]
    
    # Check invalid transition: SHIPPED cannot be CANCELLED
    assert OrderStatus.CANCELLED not in VALID_ORDER_TRANSITIONS[OrderStatus.SHIPPED]
