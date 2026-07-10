
const Equipment = require('../models/Equipment');
const cloudinary = require('../config/cloudinary');
const { sendSuccess, sendError } = require('../utils/response');

const {
    isValidObjectId,
    isValidCoordinates
} = require('../utils/validation');

// =======================================
// Helper Functions
// =======================================

/**
 * Validates if a string is a valid MongoDB ObjectId
 * @param {string} id 
 * @returns {boolean}
 */


/**
 * Sends a consistent error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 */

/**
 * Validates geographical coordinates
 * @param {number|string} lat - Latitude
 * @param {number|string} lng - Longitude
 * @returns {boolean}
 */


/**
 * Uploads buffer data to Cloudinary directly
 * @param {Buffer} fileBuffer 
 * @param {string} mimeType 
 * @returns {Promise<string>} secure URL
 */
const uploadToCloudinary = async (fileBuffer, mimeType) => {
    const b64 = Buffer.from(fileBuffer).toString('base64');
    const dataURI = `data:${mimeType};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'agriconnect/equipment'
    });
    return result.secure_url;
};

// =======================================
// Create Equipment
// POST /api/v1/equipment
// =======================================
exports.createEquipment = async (req, res) => {
    try {
        // Verify user authorization
        if (req.user.role !== 'EQUIPMENT_OWNER') {
            return sendError(res, 403, 'Only authorized equipment owners can list machinery.');
        }

        const { 
            equipmentName, 
            equipmentType, 
            description, 
            hourlyRate, 
            dailyRate, 
            longitude, 
            latitude 
        } = req.body;

        // Validate Coordinates
        if (!isValidCoordinates(latitude, longitude)) {
            return sendError(res, 400, 'Invalid geographical coordinates provided.');
        }

        // Validate Rates
        const parsedHourlyRate = Number(hourlyRate);
        const parsedDailyRate = Number(dailyRate);

        if (isNaN(parsedHourlyRate) || parsedHourlyRate < 0 || isNaN(parsedDailyRate) || parsedDailyRate < 0) {
            return sendError(res, 400, 'Rates must be valid positive numbers.');
        }

        // Handle Image Uploads via Cloudinary Pipeline
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer, file.mimetype));
            imageUrls = await Promise.all(uploadPromises);
        }

        // Create Equipment Document
        const newEquipment = await Equipment.create({
            ownerId: req.user._id,
            equipmentName,
            equipmentType,
            description,
            hourlyRate: parsedHourlyRate,
            dailyRate: parsedDailyRate,
            location: {
                type: 'Point',
                coordinates: [Number(longitude), Number(latitude)] // MongoDB requires [Longitude, Latitude]
            },
            images: imageUrls,
            equipmentStatus: 'Available'
        });

        return sendSuccess(
    res,
    201,
    'Equipment listed successfully.',
    newEquipment
);

    } catch (error) {
       return sendError(res, 500, error.message);
    }
};

// =======================================
// Get All Equipment
// GET /api/v1/equipment
// =======================================
exports.getAllEquipment = async (req, res) => {
    try {
        const { type, minPrice, maxPrice } = req.query;
        
        // Base query: Only fetch available equipment
        const query = { equipmentStatus: 'Available' };

        // Apply active filters if provided
        if (type) {
            query.equipmentType = type;
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            query.dailyRate = {};
            if (minPrice) {
                const min = Number(minPrice);
                if (!isNaN(min) && min >= 0) query.dailyRate.$gte = min;
            }
            if (maxPrice) {
                const max = Number(maxPrice);
                if (!isNaN(max) && max >= 0) query.dailyRate.$lte = max;
            }
        }

        const equipment = await Equipment.find(query)
            .populate('ownerId', 'fullName mobileNumber district');

        return sendSuccess(
    res,
    200,
    'Equipment fetched successfully.',
    {
        count: equipment.length,
        equipment
    }
);

    } catch (error) {
       return sendError(res, 500, error.message);
    }
};

// =======================================
// Get Equipment In Radius
// GET /api/v1/equipment/radius/:distance/:lat/:lng
// =======================================
exports.getEquipmentInRadius = async (req, res) => {
    try {
        const { distance, lat, lng } = req.params;

        // Validate Inputs
        const parsedDistance = Number(distance);
        if (isNaN(parsedDistance) || parsedDistance <= 0) {
            return sendError(res, 400, 'Invalid distance parameter.');
        }

        if (!isValidCoordinates(lat, lng)) {
            return sendError(res, 400, 'Invalid geographical coordinates provided.');
        }

        // Earth radius = 6378.1 km. Divide distance by earth radius to get MongoDB radians
        const radius = parsedDistance / 6378.1;

        const nearbyEquipment = await Equipment.find({
            location: {
                $geoWithin: { 
                    $centerSphere: [[Number(lng), Number(lat)], radius] 
                }
            },
            equipmentStatus: 'Available'
        }).populate('ownerId', 'fullName mobileNumber village');

        return sendSuccess(
    res,
    200,
    'Nearby equipment fetched successfully.',
    {
        count: nearbyEquipment.length,
        equipment: nearbyEquipment
    }
);

    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

// =======================================
// Get Equipment By ID
// GET /api/v1/equipment/:id
// =======================================
exports.getEquipmentById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return sendError(res, 400, 'Invalid Equipment ID format.');
        }

        const equipment = await Equipment.findById(id)
            .populate('ownerId', 'fullName mobileNumber village district state');

        if (!equipment) {
            return sendError(res, 404, 'Equipment not found.');
        }

        return sendSuccess(
    res,
    200,
    'Equipment fetched successfully.',
    equipment
);

    } catch (error) {
        return sendError(res, 500, error.message);
    }
};