const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

const {
    requestWithdrawal,
    getMyWithdrawals,
    getAllWithdrawals,
    approveWithdrawal,
    rejectWithdrawal
} = require('../controllers/withdrawalController');

// =======================================
// Equipment Owner Routes
// =======================================

// Request Withdrawal
// POST /api/v1/withdrawals
router.post('/', protect, requestWithdrawal);

// Get My Withdrawals
// GET /api/v1/withdrawals/my-withdrawals
router.get('/my-withdrawals', protect, getMyWithdrawals);

// =======================================
// Admin Routes
// =======================================

// Get All Withdrawal Requests
// GET /api/v1/withdrawals
router.get('/', protect, getAllWithdrawals);

// Approve Withdrawal
// PUT /api/v1/withdrawals/:id/approve
router.put('/:id/approve', protect, approveWithdrawal);

// Reject Withdrawal
// PUT /api/v1/withdrawals/:id/reject
router.put('/:id/reject', protect, rejectWithdrawal);

module.exports = router;