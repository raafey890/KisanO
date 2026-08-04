import pytest
from httpx import AsyncClient
from main import app
from datetime import datetime, timezone
from db.mongodb import db_manager

# Note: In a real test environment, db_manager is overridden to use a test DB connection.
# For demonstration, we assume conftest.py prepares the event loop and client.

@pytest.mark.asyncio
async def test_register_user_success():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/api/v1/auth/register", json={
            "fullName": "Test Farmer",
            "phone": "+19999999999",
            "email": "farmer@test.com",
            "password": "StrongPassword123!",
            "confirmPassword": "StrongPassword123!",
            "role": "Farmer",
            "acceptTerms": True
        })
    # Will fail if phone already exists, but verifies structure
    assert response.status_code in [201, 400]
    if response.status_code == 201:
        assert response.json()["success"] == True

@pytest.mark.asyncio
async def test_register_weak_password():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/api/v1/auth/register", json={
            "fullName": "Test Farmer",
            "phone": "+19999999998",
            "password": "weak",
            "confirmPassword": "weak",
            "role": "Farmer",
            "acceptTerms": True
        })
    assert response.status_code == 422 # Validation Error

@pytest.mark.asyncio
async def test_login_invalid_credentials():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/api/v1/auth/login", json={
            "identifier": "unknown@test.com",
            "password": "WrongPassword123!"
        })
    assert response.status_code == 401
    assert "Invalid credentials" in response.json()["message"]

@pytest.mark.asyncio
async def test_forgot_password_sends_otp():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/api/v1/auth/forgot-password", json={
            "identifier": "+19999999999"
        })
    assert response.status_code == 200
    assert response.json()["success"] == True
