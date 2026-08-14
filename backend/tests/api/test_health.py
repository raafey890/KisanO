import pytest
from httpx import AsyncClient, ASGITransport
from main import app


@pytest.mark.api
@pytest.mark.asyncio
async def test_system_health(mock_db):
    """Test the unauthenticated health endpoint (no DB required)."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "app" in data  # app name varies by environment


@pytest.mark.api
@pytest.mark.asyncio
async def test_liveness_check(mock_db):
    """Test the liveness endpoint."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/live")
    assert response.status_code == 200
    assert response.json()["status"] == "alive"


@pytest.mark.api
@pytest.mark.asyncio
async def test_security_health(mock_db):
    """Test the security subsystem health endpoint."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/v1/security/health")
    assert response.status_code == 200
    assert response.json()["data"]["status"] in ["HEALTHY", "OK", "UP"]
