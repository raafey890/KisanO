from fastapi import APIRouter, Depends, Request, status

from shared.responses import success_response
from modules.auth.schemas import (
    UserRegister,
    LoginRequest,
    RefreshTokenRequest,
    ForgotPasswordRequest,
    VerifyOTPRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
)
from modules.auth.service import AuthService
from modules.auth.dependencies import get_current_user

router = APIRouter()


def _get_ip(request: Request) -> str:
    """Extract client IP, with safe fallback for test environments."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    if request.client:
        return request.client.host
    return "0.0.0.0"


# ─── Public Endpoints ────────────────────────────────────────────────────────

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(data: UserRegister, request: Request):
    ip = _get_ip(request)
    result = await AuthService.register_user(
        data,
        ip=ip,
        device="unknown",
        os="unknown",
        browser="unknown",
    )
    return success_response(message="User registered successfully", data=result)


@router.post("/login")
async def login(data: LoginRequest, request: Request):
    ip = _get_ip(request)
    result = await AuthService.login_user(data, ip=ip)
    return success_response(message="Login successful", data=result)


@router.post("/refresh-token")
async def refresh_token(data: RefreshTokenRequest, request: Request):
    ip = _get_ip(request)
    result = await AuthService.rotate_refresh_token(data.refreshToken, ip=ip)
    return success_response(message="Token refreshed", data=result)


@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest, request: Request):
    ip = _get_ip(request)
    await AuthService.request_otp(data.identifier, ip=ip)
    return success_response(
        message="OTP sent to your registered phone/email", data=None
    )


@router.post("/verify-otp")
async def verify_otp(data: VerifyOTPRequest, request: Request):
    ip = _get_ip(request)
    result = await AuthService.verify_otp(data.identifier, data.otp, ip=ip)
    return success_response(message="OTP verified successfully", data=result)


@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest, request: Request):
    ip = _get_ip(request)
    await AuthService.reset_password(
        data.identifier, data.otp, data.newPassword, ip=ip
    )
    return success_response(message="Password reset successful", data=None)


# ─── Authenticated Endpoints ─────────────────────────────────────────────────

@router.post("/logout")
async def logout(request: Request, current_user: dict = Depends(get_current_user)):
    ip = _get_ip(request)
    session_id = current_user.get("session_id", "")
    await AuthService.logout_device(session_id=session_id, ip=ip)
    return success_response(message="Logged out successfully", data=None)


@router.post("/logout-all")
async def logout_all(
    request: Request, current_user: dict = Depends(get_current_user)
):
    ip = _get_ip(request)
    session_id = current_user.get("session_id", "")
    await AuthService.logout_all_devices(
        user_id=current_user["id"], current_session_id=session_id, ip=ip
    )
    return success_response(
        message="Logged out from all devices", data=None
    )


@router.post("/change-password")
async def change_password(
    data: ChangePasswordRequest,
    request: Request,
    current_user: dict = Depends(get_current_user),
):
    ip = _get_ip(request)
    await AuthService.change_password(current_user["id"], data, ip=ip)
    return success_response(message="Password changed successfully", data=None)


@router.get("/sessions")
async def get_sessions(current_user: dict = Depends(get_current_user)):
    session_id = current_user.get("session_id", "")
    sessions = await AuthService.get_active_sessions(
        current_user["id"], session_id
    )
    return success_response(message="Active sessions retrieved", data=sessions)
