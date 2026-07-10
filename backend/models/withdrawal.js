const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({

    // =======================================
    // Owner Reference
    // =======================================

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    // =======================================
    // Wallet Reference
    // =======================================

    walletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true
    },

    // =======================================
    // Withdrawal Amount
    // =======================================

    amount: {
        type: Number,
        required: true,
        min: 1
    },

    // =======================================
    // Withdrawal Status
    // =======================================

    status: {
        type: String,
        enum: [
            'Pending',
            'Approved',
            'Rejected'
        ],
        default: 'Pending',
        index: true
    },

    // =======================================
    // Bank Details
    // =======================================

    bankName: {
        type: String,
        trim: true
    },

    accountHolderName: {
        type: String,
        trim: true
    },

    accountNumber: {
        type: String,
        trim: true
    },

    ifscCode: {
        type: String,
        trim: true
    },

    // =======================================
    // Transaction Details
    // =======================================

    transactionId: {
        type: String,
        default: null
    },

    remarks: {
        type: String,
        trim: true
    },

    // =======================================
    // Timeline
    // =======================================

    requestedAt: {
        type: Date,
        default: Date.now
    },

    approvedAt: {
        type: Date,
        default: null
    },

    rejectedAt: {
        type: Date,
        default: null
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Withdrawal', withdrawalSchema);