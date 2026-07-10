const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    // =======================================
    // Ownership & Identification
    // =======================================
    ownerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'Equipment owner ID is required'], 
        index: true 
    },
    equipmentName: { 
        type: String, 
        required: [true, 'Equipment name is required'],
        trim: true,
        minlength: [2, 'Equipment name must be at least 2 characters long'],
        maxlength: [100, 'Equipment name cannot exceed 100 characters']
    },
    equipmentType: { 
        type: String, 
        enum: {
            values: [
                'Tractor', 
                'Harvester', 
                'Narr', 
                'Rotavator', 
                'Cultivator', 
                'Seeder', 
                'Sprayer', 
                'Water Tanker', 
                'Rice Transplanter', 
                'Thresher'
            ],
            message: '{VALUE} is not a supported equipment type'
        }, 
        required: [true, 'Equipment type is required'],
        index: true
    },
    description: { 
        type: String, 
        required: [true, 'Equipment description is required'],
        trim: true,
        maxlength: [1500, 'Description cannot exceed 1500 characters']
    },

    // =======================================
    // Pricing
    // =======================================
    hourlyRate: { 
        type: Number, 
        required: [true, 'Hourly rate is required'],
        min: [0, 'Hourly rate cannot be negative']
    },
    dailyRate: { 
        type: Number, 
        required: [true, 'Daily rate is required'],
        min: [0, 'Daily rate cannot be negative']
    },

    // =======================================
    // Geospatial Data (GeoJSON)
    // =======================================
    location: {
        type: { 
            type: String, 
            enum: ['Point'],
            default: 'Point' 
        },
        coordinates: { 
            type: [Number], 
            required: [true, 'Location coordinates are required'],
            validate: {
                validator: function(coords) {
                    // Ensures array has exactly 2 numbers and valid ranges for [longitude, latitude]
                    return coords.length === 2 && 
                           coords[0] >= -180 && coords[0] <= 180 && 
                           coords[1] >= -90 && coords[1] <= 90;
                },
                message: 'Invalid coordinates. Format must be [longitude, latitude] within valid ranges.'
            }
        }
    },

    // =======================================
    // Media & Status
    // =======================================
    images: [{ 
        type: String,
        trim: true,
        match: [/^https?:\/\/.+/, 'Image string must be a valid URL']
    }],
    equipmentStatus: {
        type: String,
        enum: {
            values: [
                'Available',
                'Booked',
                'In Progress',
                'Maintenance'
            ],
            message: '{VALUE} is not a valid equipment status'
        },
        default: 'Available',
        index: true
    }
}, { 
    timestamps: true 
});

// =======================================
// Indexes
// =======================================
// Create a geospatial index so farmers can efficiently search for nearby equipment by radius
equipmentSchema.index({ location: '2dsphere' });

// Compound index for optimizing popular queries (e.g., finding available equipment of a specific type)
equipmentSchema.index({ equipmentStatus: 1, equipmentType: 1 });

module.exports = mongoose.model('Equipment', equipmentSchema);