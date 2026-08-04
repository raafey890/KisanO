from fastapi import APIRouter, Depends, status, UploadFile, File, Query
from typing import Dict, Any, List, Optional
from shared.responses import success_response, SuccessResponse
from modules.users.schemas import (
    UserResponse, PaginatedUserResponse, ProfileUpdate, 
    PreferencesSchema, FarmCreate, FarmSchema, AddressCreate, AddressSchema
)
from modules.users.service import UserService
from modules.auth.dependencies import get_current_user, RequireRole
from modules.auth.constants import UserRole

router = APIRouter()

@router.get(
    "/me",
    response_model=SuccessResponse[UserResponse],
    summary="Get current user's complete profile"
)
async def get_my_profile(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Fetches the completely aggregated profile for the logged in user,
    including their farms, addresses, preferences, and KYC status.
    """
    user_id = str(current_user["_id"])
    profile = await UserService.get_user_profile(user_id)
    return success_response(message="Profile retrieved", data=profile)


@router.put(
    "/me",
    response_model=SuccessResponse[UserResponse],
    summary="Update current user's profile"
)
async def update_my_profile(
    data: ProfileUpdate, 
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Update personal information. Automatically recalculates the profile completion percentage.
    """
    user_id = str(current_user["_id"])
    updated_profile = await UserService.update_profile(user_id, data)
    return success_response(message="Profile updated successfully", data=updated_profile)


@router.patch(
    "/profile-photo",
    response_model=SuccessResponse[Dict[str, str]],
    summary="Upload or update profile photo"
)
async def upload_profile_photo(
    file: UploadFile = File(...),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Uploads a profile picture to Cloudinary (Mocked).
    Validates file type and size before replacing the existing photo URL.
    """
    contents = await file.read()
    url = await UserService.upload_profile_photo(str(current_user["_id"]), contents, file.filename)
    return success_response(message="Photo uploaded successfully", data={"profilePhotoUrl": url})


# --- Farm Management ---

@router.post(
    "/me/farms",
    response_model=SuccessResponse[FarmSchema],
    summary="Add a new farm"
)
async def add_farm(
    farm: FarmCreate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Embeds a new Farm document into the user's profile.
    """
    new_farm = await UserService.add_farm(str(current_user["_id"]), farm)
    return success_response(message="Farm added successfully", data=new_farm)


@router.delete(
    "/me/farms/{farm_id}",
    response_model=SuccessResponse[None],
    summary="Delete a farm"
)
async def delete_farm(
    farm_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Removes a farm from the user's embedded array.
    """
    await UserService.remove_farm(str(current_user["_id"]), farm_id)
    return success_response(message="Farm removed successfully")


# --- Address Management ---

@router.post(
    "/me/addresses",
    response_model=SuccessResponse[AddressSchema],
    summary="Add a new address"
)
async def add_address(
    address: AddressCreate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Embeds a new Address into the user's profile.
    Supports Home, Farm, Billing, or Shipping types.
    """
    new_address = await UserService.add_address(str(current_user["_id"]), address)
    return success_response(message="Address added successfully", data=new_address)

@router.delete(
    "/me/addresses/{address_id}",
    response_model=SuccessResponse[None],
    summary="Delete an address"
)
async def delete_address(
    address_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Removes an address from the user's embedded array.
    """
    await UserService.remove_address(str(current_user["_id"]), address_id)
    return success_response(message="Address removed successfully")


# --- Search & Admin ---

@router.get(
    "/search",
    response_model=SuccessResponse[PaginatedUserResponse],
    summary="Search and filter users"
)
async def search_users(
    query: Optional[str] = Query(None, description="Search name, phone, or email"),
    role: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    _: Dict[str, Any] = Depends(RequireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SUPPORT_AGENT]))
):
    """
    Search for users across the platform. Restricted to Admins and Support Agents.
    Optimized to hit MongoDB indexes on email, phone, and fullName.
    """
    filters = {}
    if query: filters["query"] = query
    if role: filters["role"] = role
    if status: filters["status"] = status
    
    items, total = await UserService.search_users(filters, skip, limit)
    return success_response(message="Users found", data={"items": items, "total": total, "skip": skip, "limit": limit})


@router.patch(
    "/admin/{target_user_id}/suspend",
    response_model=SuccessResponse[None],
    summary="Suspend a user account"
)
async def suspend_user(
    target_user_id: str,
    _: Dict[str, Any] = Depends(RequireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
):
    """
    Sets a user's status to SUSPENDED. They will immediately fail all authentication checks.
    """
    await UserService.update_status(target_user_id, "SUSPENDED")
    return success_response(message="User suspended successfully")
