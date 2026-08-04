from fastapi import APIRouter, Depends, Body, status, Request
from typing import Dict, Any, List

from shared.responses import success_response, SuccessResponse
from modules.auth.schemas import (
    UserRegister, LoginRequest, LoginResponse, TokenData,
    ForgotPasswordRequest, VerifyOTPRequest, ResetPasswordRequest,
    ChangePasswordRequest, RefreshTokenRequest, SessionResponse
)
from modules.auth.service import AuthService
from modules.auth.dependencies import get_current_user, get_current_user_and_session

router = APIRouter()

def get_client_ip(request: Request) -> str:
    # Handle Nginx proxy forwarding
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0]
    return request.client.host if request.client else "Unknown"


@router.post(
    "/register", 
    response_model=SuccessResponse[Dict[str, Any]], 
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user"
)
async def register(request: Request, user_data: UserRegister):
    """
    Register a new user (Farmer, Owner, Operator, Admin).
    Requires a strong password.
    """
    ip = get_client_ip(request)
    # Extract naive device info from User-Agent for demo purposes
    ua = request.headers.get("User-Agent", "Unknown")
    
    result = await AuthService.register_user(user_data, ip, ua, ua, ua)
    result.pop("passwordHash", None)
    result["_id"] = str(result["_id"])
    return success_response(message="Registration successful", data=result)


@router.post(
    "/login", 
    response_model=SuccessResponse[LoginResponse],
    summary="Authenticate user and get tokens"
)
async def login(request: Request, credentials: LoginRequest):
    """
    Authenticate a user using Email or Phone and Password.
    Returns Access and Refresh tokens. Automatically tracks the device session.
    """
    ip = credentials.ipAddress or get_client_ip(request)
    result = await AuthService.login_user(credentials, ip)
    return success_response(message="Login successful", data=result)


@router.post(
    "/refresh", 
    response_model=SuccessResponse[TokenData],
    summary="Rotate refresh token"
)
async def refresh_token(request: Request, data: RefreshTokenRequest):
    """
    Exchange an old refresh token for a new pair of Access and Refresh tokens.
    Invalidates the old refresh token immediately to prevent replay attacks.
    """
    ip = get_client_ip(request)
    result = await AuthService.rotate_refresh_token(data.refreshToken, ip)
    return success_response(message="Tokens rotated successfully", data=result)


@router.post(
    "/forgot-password", 
    response_model=SuccessResponse[None],
    summary="Request a password reset OTP"
)
async def forgot_password(request: Request, req: ForgotPasswordRequest):
    """
    Request a password reset OTP. The OTP is sent (mocked in console) to the registered phone or email.
    """
    ip = get_client_ip(request)
    await AuthService.request_otp(req.identifier, ip)
    return success_response(message="If the identifier exists, an OTP has been sent.")


@router.post(
    "/verify-otp", 
    response_model=SuccessResponse[None],
    summary="Verify an OTP"
)
async def verify_otp(request: Request, req: VerifyOTPRequest):
    """
    Validates the 6-digit OTP independently. 
    Mainly used for intermediate steps before reset.
    """
    ip = get_client_ip(request)
    await AuthService.verify_otp(req.identifier, req.otp, ip)
    return success_response(message="OTP verified successfully.")


@router.post(
    "/reset-password", 
    response_model=SuccessResponse[None],
    summary="Reset password using OTP"
)
async def reset_password(request: Request, req: ResetPasswordRequest):
    """
    Verify OTP and instantly reset the password.
    Requires strong password compliance.
    """
    ip = get_client_ip(request)
    await AuthService.reset_password(req.identifier, req.otp, req.newPassword, ip)
    return success_response(message="Password reset successfully. You can now login.")


@router.post(
    "/change-password", 
    response_model=SuccessResponse[None],
    summary="Change password while authenticated",
    dependencies=[Depends(get_current_user)]
)
async def change_password(request: Request, req: ChangePasswordRequest, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Change the current logged-in user's password.
    Requires providing the old password.
    """
    ip = get_client_ip(request)
    await AuthService.change_password(str(current_user["_id"]), req, ip)
    return success_response(message="Password changed successfully.")


@router.get(
    "/me", 
    response_model=SuccessResponse[Dict[str, Any]],
    summary="Get current user profile"
)
async def get_me(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Fetch the currently authenticated user's profile.
    """
    current_user.pop("passwordHash", None)
    current_user["_id"] = str(current_user["_id"])
    return success_response(message="Profile retrieved", data=current_user)


@router.get(
    "/sessions", 
    response_model=SuccessResponse[List[SessionResponse]],
    summary="Get active device sessions"
)
async def get_sessions(data: tuple = Depends(get_current_user_and_session)):
    """
    Returns a list of all active device sessions for the authenticated user.
    """
    user, session_id = data
    sessions = await AuthService.get_active_sessions(str(user["_id"]), session_id)
    return success_response(message="Sessions retrieved", data=sessions)


@router.post(
    "/logout", 
    response_model=SuccessResponse[None],
    summary="Logout current device session"
)
async def logout(request: Request, data: tuple = Depends(get_current_user_and_session)):
    """
    Invalidates the current session and refresh token in the backend.
    """
    user, session_id = data
    ip = get_client_ip(request)
    await AuthService.logout_device(session_id, ip)
    return success_response(message="Logged out current device successfully")


@router.post(
    "/logout-all", 
    response_model=SuccessResponse[None],
    summary="Logout all device sessions"
)
async def logout_all(request: Request, data: tuple = Depends(get_current_user_and_session)):
    """
    Invalidates ALL active sessions and refresh tokens for this user, including the current one.
    """
    user, session_id = data
    ip = get_client_ip(request)
    await AuthService.logout_all_devices(str(user["_id"]), session_id, ip)
    return success_response(message="Logged out from all devices successfully")


@router.delete(
    "/session/{session_id_to_delete}", 
    response_model=SuccessResponse[None],
    summary="Logout a specific device session"
)
async def delete_session(session_id_to_delete: str, request: Request, data: tuple = Depends(get_current_user_and_session)):
    """
    Forcefully invalidate a specific remote device session.
    """
    user, current_session_id = data
    ip = get_client_ip(request)
    
    # Optional: Verify that the session_id_to_delete actually belongs to this user before deleting
    
    await AuthService.logout_device(session_id_to_delete, ip)
    return success_response(message="Remote session terminated successfully")
