const mongoose = require('mongoose');

// =======================================
// Validate MongoDB ObjectId
// =======================================

exports.isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

// =======================================
// Validate Coordinates
// =======================================

exports.isValidCoordinates = (latitude, longitude) => {

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (isNaN(lat) || isNaN(lng)) {
        return false;
    }

    if (lat < -90 || lat > 90) {
        return false;
    }

    if (lng < -180 || lng > 180) {
        return false;
    }

    return true;
};