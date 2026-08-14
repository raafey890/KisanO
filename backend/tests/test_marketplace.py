import pytest
from httpx import AsyncClient, ASGITransport
from main import app


@pytest.mark.asyncio
async def test_search_products_unauthorized(mock_db):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get(
            "/api/v1/marketplace/search?category=Seeds"
        )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_product_fsm_valid_transition():
    from modules.marketplace.constants import (
        VALID_PRODUCT_TRANSITIONS, ProductStatus
    )

    assert ProductStatus.PENDING_APPROVAL in VALID_PRODUCT_TRANSITIONS[
        ProductStatus.DRAFT
    ]
    assert ProductStatus.OUT_OF_STOCK in VALID_PRODUCT_TRANSITIONS[
        ProductStatus.APPROVED
    ]
    assert ProductStatus.ARCHIVED not in VALID_PRODUCT_TRANSITIONS[
        ProductStatus.DRAFT
    ]
