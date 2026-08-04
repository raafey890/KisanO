import pytest
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_search_products_unauthorized():
    # Search is public, should return 200 even without token
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/v1/marketplace/query/search?category=Seeds")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_product_fsm_valid_transition():
    from modules.marketplace.constants import VALID_PRODUCT_TRANSITIONS, ProductStatus
    
    # Check DRAFT to PENDING_APPROVAL
    assert ProductStatus.PENDING_APPROVAL in VALID_PRODUCT_TRANSITIONS[ProductStatus.DRAFT]
    
    # Check APPROVED to OUT_OF_STOCK
    assert ProductStatus.OUT_OF_STOCK in VALID_PRODUCT_TRANSITIONS[ProductStatus.APPROVED]
    
    # Check invalid transition
    assert ProductStatus.ARCHIVED not in VALID_PRODUCT_TRANSITIONS[ProductStatus.DRAFT]
