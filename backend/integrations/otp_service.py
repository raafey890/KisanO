import logging
import random

logger = logging.getLogger(__name__)

class OTPService:
    """
    Abstraction layer for OTP sending.
    Can be easily swapped with MSG91, Twilio, etc.
    """
    @staticmethod
    async def send_otp(phone: str) -> str:
        # Generate a 6-digit OTP
        otp = str(random.randint(100000, 999999))
        logger.info(f"[OTP Service] Simulating sending OTP {otp} to {phone}")
        # TODO: Implement real provider logic here (e.g. MSG91, Twilio)
        return otp

    @staticmethod
    async def verify_otp(phone: str, provided_otp: str, stored_otp: str) -> bool:
        logger.info(f"[OTP Service] Verifying OTP for {phone}")
        return provided_otp == stored_otp

otp_service = OTPService()
