const express = require('express');
const router = express.Router();

// =======================================
// Middleware Imports
// =======================================
const { protect } = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// =======================================
// Controller Imports
// =======================================
const {
    createEquipment,
    getAllEquipment,
    getEquipmentInRadius,
    getEquipmentById
} = require('../controllers/equipmentController');

// =======================================
// Public Routes
// =======================================

/**
 * @route   GET /api/v1/equipment
 * @desc    Get all available equipment listings with optional query filters (type, price bounds)
 * @access  Public
 */
router.get('/', getAllEquipment);

/**
 * @route   GET /api/v1/equipment/radius/:distance/:lat/:lng
 * @desc    Find available equipment within a specified geospatial radius (in kilometers)
 * @access  Public
 * @note    Placed strictly before /:id to prevent route execution collision
 */
router.get('/radius/:distance/:lat/:lng', getEquipmentInRadius);

/**
 * @route   GET /api/v1/equipment/:id
 * @desc    Get detailed specifications and owner data for a single equipment entry by ID
 * @access  Public
 */
router.get('/:id', getEquipmentById);

// =======================================
// Protected Routes
// =======================================

/**
 * @route   POST /api/v1/equipment
 * @desc    List and register new agricultural machinery with multi-image upload streams
 * @access  Private (EQUIPMENT_OWNER only)
 */
router.post(
    '/',
    protect,
    uploadMiddleware.array('images', 5),
    createEquipment
);

module.exports = router;