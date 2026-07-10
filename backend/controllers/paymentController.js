const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { sendSuccess, sendError } = require('../utils/response');
const Wallet = require('../models/Wallet');

const {
    isValidObjectId
} = require('../utils/validation');

const {
    generateTransactionId
} = require('../utils/generateTransactionId');

// =======================================
// Helper Functions
// =======================================


// =======================================
// Get My Payments
// GET /api/v1/payments/my-payments
// =======================================

exports.getMyPayments = async (req, res) => {
    try {

        // Only Farmers
        if (req.user.role !== 'FARMER') {
            return sendError(
                res,
                403,
                'Only farmers can access their payment history.'
            );
        }

        const payments = await Payment.find({
            farmerId: req.user._id
        })
        .populate('bookingId')
        .sort({ createdAt: -1 });

        return sendSuccess(
    res,
    200,
    'Payments fetched successfully.',
    {
        count: payments.length,
        payments
    }
);

    } catch (error) {

        return sendError(res, 500, error.message);

    }
};
// =======================================
// Get Owner Payments
// GET /api/v1/payments/owner
// =======================================

exports.getOwnerPayments = async (req, res) => {
    try {

        // Only Equipment Owners
        if (req.user.role !== 'EQUIPMENT_OWNER') {
            return sendError(
                res,
                403,
                'Only equipment owners can access payment history.'
            );
        }

        const payments = await Payment.find({
            ownerId: req.user._id
        })
        .populate('bookingId')
        .sort({ createdAt: -1 });

        return sendSuccess(
    res,
    200,
    'Owner payments fetched successfully.',
    {
        count: payments.length,
        payments
    }
);

    } catch (error) {

        return sendError(res, 500, error.message);

    }
};
// =======================================
// Get Payment By ID
// GET /api/v1/payments/:id
// =======================================

exports.getPaymentById = async (req, res) => {
    try {

        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return sendError(
    res,
    400,
    'Invalid payment method.'
);
        }

        const payment = await Payment.findById(id)
            .populate('bookingId')
            .populate('farmerId', 'fullName mobileNumber')
            .populate('ownerId', 'fullName mobileNumber');

        if (!payment) {
            return sendError(
                res,
                404,
                'Payment not found.'
            );
        }

        // Security Check
        const isFarmer =
            payment.farmerId._id.toString() === req.user._id.toString();

        const isOwner =
            payment.ownerId._id.toString() === req.user._id.toString();

        if (!isFarmer && !isOwner) {
            return sendError(
                res,
                403,
                'You are not authorized to view this payment.'
            );
        }

        return sendSuccess(
    res,
    200,
    'Payment fetched successfully.',
    payment
);

    } catch (error) {

        return sendError(res, 500, error.message);

    }
};
// =======================================
// Mark Payment As Paid
// PUT /api/v1/payments/:id/pay
// =======================================

exports.markPaymentAsPaid = async (req, res) => {
   
    try {

        const { id } = req.params;
        const { paymentMethod } = req.body;

        if (req.user.role !== 'FARMER') {
            return sendError(
                res,
                403,
                'Only farmers can complete payment.'
            );
        }

        if (!isValidObjectId(id)) {
            return sendError(res, 400, 'Invalid Payment ID.');
        }

        const payment = await Payment.findById(id);

        if (!payment) {
            return sendError(res, 404, 'Payment not found.');
        }

        // Ensure payment belongs to logged-in farmer
        if (payment.farmerId.toString() !== req.user._id.toString()) {
            return sendError(
                res,
                403,
                'Unauthorized payment access.'
            );
        }

        if (payment.paymentStatus !== 'Pending') {
            return sendError(
                res,
                400,
                `Payment is already ${payment.paymentStatus}.`
            );
        }

        // Validate payment method
        const allowedMethods = [
            'Cash',
            'UPI',
            'Card',
            'Net Banking'
        ];

        if (!allowedMethods.includes(paymentMethod)) {
           return sendError(res, 400, 'DEBUG - Invalid Payment ID.');
        }

        payment.paymentStatus = 'Paid';
        payment.paymentMethod = paymentMethod
        payment.paymentDate = new Date();
      payment.transactionId = generateTransactionId();

        await payment.save();
        // =======================================
// Update Owner Wallet
// =======================================

let wallet = await Wallet.findOne({
    ownerId: payment.ownerId
});

if (!wallet) {

    wallet = await Wallet.create({
        ownerId: payment.ownerId
    });

}

wallet.availableBalance += payment.amount;

wallet.lifetimeEarnings += payment.amount;

await wallet.save();

        // Update Booking
        const booking = await Booking.findById(payment.bookingId);

        if (booking) {
            booking.paymentStatus = 'Paid';
           
            await booking.save();
        }

       return sendSuccess(
    res,
    200,
    'Payment completed successfully.',
    payment
);

    } catch (error) {

        return sendError(res, 500, error.message);

    }
};
// =======================================
// Refund Payment
// PUT /api/v1/payments/:id/refund
// =======================================

exports.refundPayment = async (req, res) => {
    try {

        const { id } = req.params;

        if (req.user.role !== 'EQUIPMENT_OWNER') {
            return sendError(
                res,
                403,
                'Only equipment owners can process refunds.'
            );
        }

        if (!isValidObjectId(id)) {
            return sendError(res, 400, 'Invalid Payment ID.');
        }

        const payment = await Payment.findById(id);

        if (!payment) {
            return sendError(res, 404, 'Payment not found.');
        }

        // Only the farmer who created the booking can make the payment
if (payment.ownerId.toString() !== req.user._id.toString()) {
    return sendError(
        res,
        403,
        'Unauthorized refund access.'
    );
}

        if (payment.paymentStatus !== 'Paid') {
            return sendError(
                res,
                400,
                'Only paid payments can be refunded.'
            );
        }

        payment.paymentStatus = 'Refunded';
        payment.refundDate = new Date();

        await payment.save();

        // Update Booking
        const booking = await Booking.findById(payment.bookingId);

        if (booking) {
            booking.paymentStatus = 'Refunded';
            await booking.save();
        }

        return sendSuccess(
    res,
    200,
    'Payment refunded successfully.',
    payment
);

    } catch (error) {

        return sendError(res, 500, error.message);

    }
};
// =======================================
// Payment Summary
// GET /api/v1/payments/summary
// =======================================

exports.paymentSummary = async (req, res) => {
    try {

        if (req.user.role !== 'EQUIPMENT_OWNER') {
            return sendError(
                res,
                403,
                'Only equipment owners can view payment summary.'
            );
        }

        const summary = await Payment.aggregate([
            {
                $match: {
                    ownerId: req.user._id
                }
            },
            {
                $group: {
                    _id: null,

                    totalPayments: {
                        $sum: 1
                    },

                    totalPaid: {
                        $sum: {
                            $cond: [
                                { $eq: ["$paymentStatus", "Paid"] },
                                "$amount",
                                0
                            ]
                        }
                    },

                    totalPending: {
                        $sum: {
                            $cond: [
                                { $eq: ["$paymentStatus", "Pending"] },
                                "$amount",
                                0
                            ]
                        }
                    },

                    totalRefunded: {
                        $sum: {
                            $cond: [
                                { $eq: ["$paymentStatus", "Refunded"] },
                                "$amount",
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        return sendSuccess(
    res,
    200,
    'Payment summary fetched successfully.',
    summary.length
        ? summary[0]
        : {
              totalPayments: 0,
              totalPaid: 0,
              totalPending: 0,
              totalRefunded: 0
          }
);

    } catch (error) {

        return sendError(res, 500, error.message);

    }
};