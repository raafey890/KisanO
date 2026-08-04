const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },

    availableBalance: {
        type: Number,
        default: 0,
        min: 0
    },

    pendingBalance: {
        type: Number,
        default: 0,
        min: 0
    },

    lifetimeEarnings: {
        type: Number,
        default: 0,
        min: 0
    },

    totalWithdrawn: {
        type: Number,
        default: 0,
        min: 0
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Wallet', walletSchema);