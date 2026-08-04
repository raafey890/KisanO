const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({

    // =======================================
    // References
    // =======================================
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
        index: true
    },

    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    // =======================================
    // Payment Details
    // =======================================
    amount: {
        type: Number,
        required: true,
        min: 0
    },
paymentMethod: {
    type: String,
    enum: {
        values: [
            'Cash',
            'UPI',
            'Card',
            'Net Banking'
        ],
        message: '{VALUE} is not a valid payment method'
    },
    default: null
},
    paymentStatus: {
        type: String,
        enum: [
            'Pending',
            'Paid',
            'Failed',
            'Refunded'
        ],
        default: 'Pending',
        index: true
    },

    transactionId: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    default: null
},

    remarks: {
        type: String,
        trim: true,
        maxlength: 500
    },

    paymentDate: {
    type: Date
},

refundDate: {
    type: Date,
    default: null
}

}, {
    timestamps: true
});

// =======================================
// Indexes
// =======================================


paymentSchema.index({ ownerId: 1, paymentStatus: 1 });
paymentSchema.index({ farmerId: 1, paymentStatus: 1 });

module.exports = mongoose.model('Payment', paymentSchema);