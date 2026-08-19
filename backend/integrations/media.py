"""
Media Upload Service
Uses CloudinaryService for all image operations.
Provides file validation and size checks before uploading.
"""
import logging
import uuid
from typing import Optional

from integrations.cloudinary_service import cloudinary_service

logger = logging.getLogger(__name__)

# Maximum file size: 5 MB
MAX_FILE_SIZE = 5 * 1024 * 1024

# Allowed MIME-type prefixes
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}


class MediaService:
    """
    High-level media upload abstraction.
    Validates files and delegates to CloudinaryService.
    """

    @staticmethod
    async def upload_image(
        file_bytes: bytes,
        file_name: str,
        folder: str = "general",
        content_type: Optional[str] = None,
    ) -> str:
        """
        Validate and upload an image.

        Args:
            file_bytes: Raw file content.
            file_name: Original filename for logging.
            folder: Cloudinary folder target.
            content_type: MIME type for validation.

        Returns:
            Secure URL of the uploaded image.

        Raises:
            ValueError: If file is too large or has an unsupported type.
        """
        # Size check
        if len(file_bytes) > MAX_FILE_SIZE:
            raise ValueError(
                f"File size ({len(file_bytes)} bytes) exceeds the "
                f"{MAX_FILE_SIZE // (1024 * 1024)} MB limit."
            )

        # Type check (optional — only enforced if content_type is provided)
        if content_type and content_type not in ALLOWED_TYPES:
            raise ValueError(
                f"Unsupported file type: {content_type}. "
                f"Allowed: {', '.join(ALLOWED_TYPES)}"
            )

        logger.info(f"[MediaService] Uploading '{file_name}' to '{folder}'")

        # Generate a unique public ID
        unique_id = uuid.uuid4().hex[:10]
        clean_name = file_name.rsplit(".", 1)[0] if "." in file_name else file_name
        public_id = f"{unique_id}_{clean_name}"

        url = await cloudinary_service.upload_image(
            file_bytes, folder=folder, public_id=public_id
        )

        if not url:
            raise ValueError("Image upload failed. Please try again.")

        return url

    @staticmethod
    async def delete_image(image_url: str) -> bool:
        """
        Delete an image by its Cloudinary URL.
        Extracts the public_id from the URL before deleting.
        """
        # Extract public_id from a Cloudinary URL
        # Example: https://res.cloudinary.com/xxx/image/upload/v123/kisano/profiles/abc.jpg
        # -> public_id = kisano/profiles/abc
        try:
            parts = image_url.split("/upload/")
            if len(parts) == 2:
                path = parts[1]
                # Remove version prefix (v123456/)
                if path.startswith("v"):
                    path = path.split("/", 1)[1] if "/" in path else path
                # Remove file extension
                public_id = path.rsplit(".", 1)[0]
                return await cloudinary_service.delete_image(public_id)
        except Exception as e:
            logger.error(f"[MediaService] Failed to extract public_id: {e}")

        logger.warning(f"[MediaService] Could not parse URL for deletion: {image_url}")
        return False


media_service = MediaService()
