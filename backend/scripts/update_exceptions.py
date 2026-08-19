import os
import re

def update_file(path):
    with open(path, 'r') as f:
        content = f.read()

    # Add import
    if "from shared.error_codes import ErrorCode" not in content:
        content = content.replace("from core.exceptions import", "from shared.error_codes import ErrorCode\nfrom core.exceptions import")
        if "from shared.error_codes import ErrorCode" not in content:
             content = "from shared.error_codes import ErrorCode\n" + content

    # Replace Auth errors
    content = content.replace('message="Phone number is already registered.", status_code=400', 'message="Phone number is already registered.", status_code=409, code=ErrorCode.AUTH_DUPLICATE_PHONE.value')
    content = content.replace('message="Email is already registered.", status_code=400', 'message="Email is already registered.", status_code=409, code=ErrorCode.AUTH_DUPLICATE_EMAIL.value')
    
    content = content.replace('UnauthorizedException(message="Invalid credentials")', 'UnauthorizedException(message="Invalid phone number or password. Please try again.", code=ErrorCode.AUTH_INVALID_CREDENTIALS.value)')
    content = content.replace('UnauthorizedException(message="Account is temporarily locked due to too many failed attempts.")', 'UnauthorizedException(message="Your account is temporarily locked due to too many failed attempts. Please try again later.", code=ErrorCode.AUTH_ACCOUNT_LOCKED.value)')
    content = content.replace('UnauthorizedException(message=f"Account {status.lower()}. Contact support.")', 'UnauthorizedException(message=f"Your account has been {status.lower()}. Please contact support for assistance.", code=ErrorCode.AUTH_ACCOUNT_SUSPENDED.value)')
    
    content = content.replace('UnauthorizedException(message="Invalid token")', 'UnauthorizedException(message="Your session has expired. Please log in again.", code=ErrorCode.AUTH_TOKEN_INVALID.value)')
    content = content.replace('UnauthorizedException("Invalid refresh token")', 'UnauthorizedException(message="Your session has expired. Please log in again.", code=ErrorCode.AUTH_TOKEN_INVALID.value)')
    content = content.replace('UnauthorizedException(message="Refresh token invalid or revoked")', 'UnauthorizedException(message="Your session is no longer active. Please log in again.", code=ErrorCode.AUTH_TOKEN_INVALID.value)')
    content = content.replace('UnauthorizedException(message="Refresh token mismatch")', 'UnauthorizedException(message="Your session is no longer active. Please log in again.", code=ErrorCode.AUTH_TOKEN_INVALID.value)')
    content = content.replace('UnauthorizedException(message="User inactive")', 'UnauthorizedException(message="Your account is inactive.", code=ErrorCode.AUTH_ACCOUNT_SUSPENDED.value)')
    
    content = content.replace('AppException("Invalid or expired OTP", status_code=400)', 'AppException(message="The OTP you entered is invalid or has expired.", status_code=400, code=ErrorCode.AUTH_INVALID_OTP.value)')
    content = content.replace('AppException("Maximum attempts reached. Request a new OTP.", status_code=400)', 'AppException(message="Maximum attempts reached. Please request a new OTP.", status_code=429, code=ErrorCode.AUTH_TOO_MANY_REQUESTS.value)')
    content = content.replace('AppException("Invalid OTP", status_code=400)', 'AppException(message="The OTP you entered is incorrect.", status_code=400, code=ErrorCode.AUTH_INVALID_OTP.value)')
    
    content = content.replace('UnauthorizedException("Incorrect old password")', 'UnauthorizedException(message="The old password you entered is incorrect.", code=ErrorCode.AUTH_INVALID_CREDENTIALS.value)')

    # Payments
    content = content.replace('AppException("Payment verification failed", status_code=400)', 'AppException(message="Payment verification failed. If money was deducted, it will be refunded.", status_code=400, code=ErrorCode.PAYMENT_VERIFICATION_FAILED.value)')
    
    # Equipment
    content = content.replace('NotFoundException("Equipment not found")', 'NotFoundException(message="The requested equipment was not found.", code=ErrorCode.EQUIPMENT_NOT_FOUND.value)')

    with open(path, 'w') as f:
        f.write(content)

services = [
    r"C:\Users\DELL\OneDrive\Desktop\KisanO\backend\modules\auth\service.py",
    r"C:\Users\DELL\OneDrive\Desktop\KisanO\backend\modules\payments\service.py",
    r"C:\Users\DELL\OneDrive\Desktop\KisanO\backend\modules\equipment\router.py",
    r"C:\Users\DELL\OneDrive\Desktop\KisanO\backend\modules\marketplace\router.py"
]

for s in services:
    if os.path.exists(s):
        update_file(s)
        print(f"Updated {s}")
