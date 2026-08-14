from fastapi import APIRouter, Depends
from typing import Dict, Any, List
from shared.responses import success_response, SuccessResponse
from modules.orders.service import OrderService
from modules.auth.dependencies import get_current_user

router = APIRouter(tags=["Orders"])


@router.post("/create-order")
async def create_order_route(
    current_user: dict = Depends(get_current_user)
):
    return success_response(message="Success", data={})


@router.get("/get-order")
async def get_order_route(
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
