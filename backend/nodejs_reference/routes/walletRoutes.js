const express = require('express');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

const {
    getMyWallet,
    getWalletDashboard
} = require('../controllers/walletController');

// =======================================
// Wallet Routes
// =======================================

// GET Wallet

router.get(
    '/my-wallet',
    protect,
    getMyWallet
);
router.get(
    '/dashboard',
    protect,
    getWalletDashboard
);

module.exports = router;