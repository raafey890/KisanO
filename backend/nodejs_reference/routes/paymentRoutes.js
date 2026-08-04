const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

const {
    getMyPayments,
    getOwnerPayments,
    getPaymentById,
    markPaymentAsPaid,
    refundPayment,
    paymentSummary
} = require('../controllers/paymentController');

router.get('/my-payments', protect, getMyPayments);

router.get('/owner', protect, getOwnerPayments);

router.get('/summary', protect, paymentSummary);

router.get('/:id', protect, getPaymentById);

router.put('/:id/pay', protect, markPaymentAsPaid);

router.put('/:id/refund', protect, refundPayment);




module.exports = router;