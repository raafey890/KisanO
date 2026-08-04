const multer = require('multer');

// Store files in server RAM temporarily instead of the hard drive (Faster and safer for production)
const storage = multer.memoryStorage();

// Middleware configuration
const uploadMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit each image to 5MB maximum
  },
  fileFilter: (req, file, cb) => {
    // Strictly accept only image file types
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only image files (JPEG, PNG, WEBP) are allowed.'), false);
    }
  }
});

module.exports = uploadMiddleware;