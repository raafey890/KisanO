"""
Cloudinary Integration Service
Real implementation using the Cloudinary Python SDK.
Handles image uploads, deletions, and transformations for the KisanO platform.
"""
import logging
import io
from typing import Optional

import cloudinary
import cloudinary.uploader
import cloudinary.api

from core.config import settings

logger = logging.getLogger(__name__)

# -------------------------------------------------------------------
# Cloudinary SDK Configuration (runs once at import time)
# -------------------------------------------------------------------
_configured = False


def _ensure_configured():
    """Lazy-configure Cloudinary credentials from settings."""
    global _configured
    if _configured:
        return

    cloud_name = settings.CLOUDINARY_CLOUD_NAME
    api_key = settings.CLOUDINARY_API_KEY
    api_secret = settings.CLOUDINARY_API_SECRET

    if not all([cloud_name, api_key, api_secret]):
        logger.warning(
            "[CloudinaryService] Credentials not configured — "
            "uploads will fall back to mock URLs."
        )
        return

    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret,
        secure=True,
    )
    _configured = True
    logger.info(f"[CloudinaryService] Configured for cloud '{cloud_name}'")


class CloudinaryService:
    """
    Production-ready abstraction layer for Cloudinary image operations.
    Falls back to mock URLs when credentials are not set (local dev).
    """

    @staticmethod
    async def upload_image(
        file_data: bytes,
        folder: str = "general",
        public_id: Optional[str] = None,
    ) -> Optional[str]:
        """
        Upload an image to Cloudinary.

        Args:
            file_data: Raw image bytes.
            folder: Cloudinary folder (e.g., 'profiles', 'products').
            public_id: Optional custom public ID.

        Returns:
            The secure HTTPS URL of the uploaded image, or None on failure.
        """
        _ensure_configured()

        if not _configured:
            # Fallback for local development without credentials
            logger.info(
                f"[CloudinaryService] MOCK upload to '{folder}' "
                f"({len(file_data)} bytes)"
            )
            return (
                f"https://res.cloudinary.com/kisano/image/upload/"
                f"v123456789/{folder}/mock_image.jpg"
            )

        try:
            upload_options = {
                "folder": f"kisano/{folder}",
                "resource_type": "image",
                "overwrite": True,
                "quality": "auto:good",
                "fetch_format": "auto",
            }
            if public_id:
                upload_options["public_id"] = public_id

            result = cloudinary.uploader.upload(
                io.BytesIO(file_data), **upload_options
            )

            secure_url = result.get("secure_url")
            logger.info(
                f"[CloudinaryService] Uploaded to '{folder}' -> {secure_url}"
            )
            return secure_url

        except Exception as e:
            logger.error(f"[CloudinaryService] Upload failed: {e}")
            return None

    @staticmethod
    async def delete_image(public_id: str) -> bool:
        """
        Delete an image from Cloudinary by its public ID.

        Args:
            public_id: The Cloudinary public ID (e.g., 'kisano/profiles/abc123').

        Returns:
            True if deleted successfully, False otherwise.
        """
        _ensure_configured()

        if not _configured:
            logger.info(f"[CloudinaryService] MOCK delete: {public_id}")
            return True

        try:
            result = cloudinary.uploader.destroy(public_id)
            success = result.get("result") == "ok"
            logger.info(
                f"[CloudinaryService] Delete '{public_id}': "
                f"{'success' if success else 'not found'}"
            )
            return success

        except Exception as e:
            logger.error(f"[CloudinaryService] Delete failed: {e}")
            return False

    @staticmethod
    async def get_image_url(
        public_id: str,
        width: Optional[int] = None,
        height: Optional[int] = None,
        crop: str = "fill",
    ) -> str:
        """
        Generate a transformed Cloudinary URL (resizing, cropping).

        Args:
            public_id: The Cloudinary public ID.
            width: Desired width in pixels.
            height: Desired height in pixels.
            crop: Crop mode (fill, fit, limit, etc.).

        Returns:
            The transformed image URL.
        """
        _ensure_configured()

        transformations = {}
        if width:
            transformations["width"] = width
        if height:
            transformations["height"] = height
        if width or height:
            transformations["crop"] = crop

        url = cloudinary.CloudinaryImage(public_id).build_url(
            **transformations, secure=True
        )
        return url


cloudinary_service = CloudinaryService()
