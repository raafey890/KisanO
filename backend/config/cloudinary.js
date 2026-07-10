const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Check if Cloudinary credentials exist
if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
) {
    console.warn(
        '[Cloudinary Warning] Cloudinary credentials are missing. Image uploads will not work.'
    );
} else {
    console.log(
        '[Cloudinary] Configuration loaded successfully.'
    );
}

module.exports = cloudinary;