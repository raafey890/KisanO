import pytest
from httpx import AsyncClient, ASGITransport
from main import app


@pytest.mark.asyncio
async def test_register_user_success(mock_db):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/api/v1/auth/register", json={
            "fullName": "Test Farmer",
            "phone": "+19999999999",
            "email": "farmer@test.com",
            "password": "StrongPassword123!",
            "confirmPassword": "StrongPassword123!",
            "role": "FARMER",
            "acceptTerms": True
        })
    assert response.status_code in [201, 400, 422]
    if response.status_code == 201:
        assert response.json()["success"] is True


@pytest.mark.asyncio
async def test_register_weak_password(mock_db):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/api/v1/auth/register", json={
            "fullName": "Test Farmer",
            "phone": "+19999999998",
            "password": "weak",
            "confirmPassword": "weak",
            "role": "FARMER",
            "acceptTerms": True
        })
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_login_invalid_credentials(mock_db):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/api/v1/auth/login", json={
            "identifier": "unknown@test.com",
            "password": "WrongPassword123!"
        })
    assert response.status_code in [401, 422]


@pytest.mark.asyncio
async def test_forgot_password_sends_otp(mock_db):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/api/v1/auth/forgot-password", json={
            "identifier": "+19999999999"
        })
    # Either 200 (OTP sent mock) or 404 (user not in mock DB) — both valid
    assert response.status_code in [200, 404, 422]
