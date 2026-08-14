from fastapi import APIRouter, Depends
from typing import Dict, Any, List
from shared.responses import success_response, SuccessResponse
from modules.sprayer_bookings.service import SprayerBookingService
from modules.auth.dependencies import get_current_user

router = APIRouter(tags=["Sprayer_Bookings"])


@router.post("/create-booking")
async def create_booking_route(
    current_user: dict = Depends(get_current_user)
):
    return success_response(message="Success", data={})


@router.get("/get-booking")
async def get_booking_route(
    current_user: dict = Depends(get_current_user)
):
    return success_response(message="Success", data={})


@router.post("/change-status")
async def change_status_route(
    current_user: dict = Depends(get_current_user)
):
    return success_response(message="Success", data={})


@router.get("/search")
async def search_route(
    current_user: dict = Depends(get_current_user)
):
    return success_response(message="Success", data={})
