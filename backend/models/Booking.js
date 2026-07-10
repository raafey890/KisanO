const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({

    // =======================================
    // References & Relationships
    // =======================================
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Farmer ID is required'],
        index: true
    },
    equipmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment',
        required: [true, 'Equipment ID is required'],
        index: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Owner ID is required'],
        index: true
    },

    // =======================================
    // Rental Period Configuration
    // =======================================
    bookingDate: {
        type: Date,
        default: Date.now,
        index: true
    },
    rentalStartDate: {
        type: Date,
        required: [true, 'Rental start date is required']
    },
    rentalEndDate: {
        type: Date,
        required: [true, 'Rental end date is required'],
        validate: {
            validator: function (value) {
                return this.rentalStartDate <= value;
            },
            message: 'Rental end date must be on or after the rental start date'
        }
    },
    totalDays: {
        type: Number,
        required: [true, 'Total number of rental days is required'],
        min: [1, 'Rental period must be at least 1 day']
    },

    // =======================================
    // Pricing & Financials
    // =======================================
    dailyRate: {
        type: Number,
        required: [true, 'Daily rate is required'],
        min: [0, 'Daily rate cannot be negative']
    },
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required'],
        min: [0, 'Total amount cannot be negative']
    },
    paymentStatus: {
        type: String,
        enum: {
            values: ['Pending', 'Paid', 'Refunded'],
            message: '{VALUE} is not a valid payment status'
        },
        default: 'Pending',
        index: true
    },
    
    paymentTransactionId: {
        type: String,
        trim: true,
        index: true
    },
    invoiceNumber: {
        type: String,
        trim: true,
        index: true,
        sparse: true
    },

    // =======================================
    // Logistics & Location
    // =======================================
    deliveryAddress: {
        village: { type: String, trim: true },
        district: { type: String, trim: true },
        state: { type: String, trim: true },
        pincode: { 
            type: String, 
            trim: true,
            match: [/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit Indian PIN code']
        },
        landmark: { type: String, trim: true }
    },
    location: {
        latitude: { 
            type: Number,
            min: [-90, 'Latitude cannot be less than -90'],
            max: [90, 'Latitude cannot be more than 90']
        },
        longitude: { 
            type: Number,
            min: [-180, 'Longitude cannot be less than -180'],
            max: [180, 'Longitude cannot be more than 180']
        }
    },

    // =======================================
    // Booking Lifecycle & Status
    // =======================================
    bookingStatus: {
        type: String,
        enum: {
            values: ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Completed'],
            message: '{VALUE} is not a valid booking status'
        },
        default: 'Pending',
        index: true
    },

    // =======================================
    // Remarks, Notes & Reasons
    // =======================================
    farmerNote: {
        type: String,
        trim: true,
        maxlength: [1000, 'Farmer note cannot exceed 1000 characters']
    },
    ownerNote: {
        type: String,
        trim: true,
        maxlength: [1000, 'Owner note cannot exceed 1000 characters']
    },
    cancellationReason: {
        type: String,
        trim: true,
        maxlength: [1000, 'Cancellation reason cannot exceed 1000 characters']
    },
    rejectionReason: {
        type: String,
        trim: true,
        maxlength: [1000, 'Rejection reason cannot exceed 1000 characters']
    },
    adminRemark: {
        type: String,
        trim: true,
        maxlength: [1000, 'Admin remark cannot exceed 1000 characters']
    },

    // =======================================
    // Lifecycle Timestamps
    // =======================================
    acceptedAt: { type: Date },
    rejectedAt: { type: Date },
    cancelledAt: { type: Date },
    completedAt: { type: Date }

}, {
    timestamps: true
});

// =======================================
// Compound Indexes for Performance
// =======================================
// Optimized for querying a specific farmer's bookings by status (used in farmer dashboard)
bookingSchema.index({ farmerId: 1, bookingStatus: 1 });

// Optimized for querying an owner's equipment bookings by status (used in owner dashboard)
bookingSchema.index({ ownerId: 1, bookingStatus: 1 });

module.exports = mongoose.model('Booking', bookingSchema);