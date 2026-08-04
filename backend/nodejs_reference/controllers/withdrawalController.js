const Withdrawal = require('../models/Withdrawal');
const Wallet = require('../models/Wallet');

const { sendSuccess, sendError } = require('../utils/response');
const { isValidObjectId } = require('../utils/validation');

// =======================================
// Request Withdrawal
// POST /api/v1/withdrawals
// =======================================

exports.requestWithdrawal = async (req, res) => {

    try {

        if (req.user.role !== 'EQUIPMENT_OWNER') {
            return sendError(res, 403, 'Only equipment owners can request withdrawals.');
        }

        const {
            amount,
            bankName,
            accountHolderName,
            accountNumber,
            ifscCode
        } = req.body;

        if (!amount || amount <= 0) {
            return sendError(res, 400, 'Please enter a valid withdrawal amount.');
        }

        const wallet = await Wallet.findOne({
            ownerId: req.user._id
        });

        if (!wallet) {
            return sendError(res, 404, 'Wallet not found.');
        }

        if (wallet.availableBalance < amount) {
            return sendError(res, 400, 'Insufficient wallet balance.');
        }

        const withdrawal = await Withdrawal.create({

            ownerId: req.user._id,
            walletId: wallet._id,

            amount,

            bankName,
            accountHolderName,
            accountNumber,
            ifscCode,

            status: 'Pending'

        });

        wallet.availableBalance -= amount;
        wallet.pendingBalance += amount;

        await wallet.save();

        return sendSuccess(
            res,
            201,
            'Withdrawal request submitted successfully.',
            withdrawal
        );

    } catch (error) {

        return sendError(res, 500, error.message);

    }

};

// =======================================
// Get My Withdrawals
// GET /api/v1/withdrawals/my-withdrawals
// =======================================

exports.getMyWithdrawals = async (req, res) => {

    try {

        const withdrawals = await Withdrawal.find({
            ownerId: req.user._id
        }).sort({ createdAt: -1 });

        return sendSuccess(
            res,
            200,
            'Withdrawals fetched successfully.',
            {
                count: withdrawals.length,
                withdrawals
            }
        );

    } catch (error) {

        return sendError(res, 500, error.message);

    }

};
// =======================================
// Get All Withdrawal Requests (Admin)
// GET /api/v1/withdrawals
// =======================================

exports.getAllWithdrawals = async (req, res) => {

    try {if (req.user.role !== 'ADMIN') {
    return sendError(
        res,
        403,
        'Only admins can view all withdrawals.'
    );
}


        const withdrawals = await Withdrawal.find()
            .populate('ownerId', 'fullName mobileNumber email')
            .sort({ createdAt: -1 });

        return sendSuccess(
            res,
            200,
            'All withdrawal requests fetched successfully.',
            {
                count: withdrawals.length,
                withdrawals
            }
        );

    } catch (error) {

        return sendError(res, 500, error.message);

    }

};

// =======================================
// Approve Withdrawal (Admin)
// PUT /api/v1/withdrawals/:id/approve
// =======================================

exports.approveWithdrawal = async (req, res) => {

    try {

        const { id } = req.params;

        if (req.user.role !== 'ADMIN') {
    return sendError(
        res,
        403,
        'Only admins can approve withdrawals.'
    );
}

        if (!isValidObjectId(id)) {
            return sendError(res, 400, 'Invalid Withdrawal ID.');
        }

        const withdrawal = await Withdrawal.findById(id);

        if (!withdrawal) {
            return sendError(res, 404, 'Withdrawal request not found.');
        }

        if (withdrawal.status !== 'Pending') {
            return sendError(
                res,
                400,
                `Withdrawal is already ${withdrawal.status}.`
            );
        }

        const wallet = await Wallet.findById(withdrawal.walletId);

        if (!wallet) {
            return sendError(res, 404, 'Wallet not found.');
        }

        withdrawal.status = 'Approved';
        withdrawal.approvedAt = new Date();
        withdrawal.transactionId = `WD${Date.now()}`;

        wallet.pendingBalance -= withdrawal.amount;
        wallet.totalWithdrawn += withdrawal.amount;

        await withdrawal.save();
        await wallet.save();

        return sendSuccess(
            res,
            200,
            'Withdrawal approved successfully.',
            withdrawal
        );

    } catch (error) {

        return sendError(res, 500, error.message);

    }

};

// =======================================
// Reject Withdrawal (Admin)
// PUT /api/v1/withdrawals/:id/reject
// =======================================

exports.rejectWithdrawal = async (req, res) => {

    try {

        const { id } = req.params;

        if (req.user.role !== 'ADMIN') {
    return sendError(
        res,
        403,
        'Only admins can reject withdrawals.'
    );
}

        if (!isValidObjectId(id)) {
            return sendError(res, 400, 'Invalid Withdrawal ID.');
        }

        const withdrawal = await Withdrawal.findById(id);

        if (!withdrawal) {
            return sendError(res, 404, 'Withdrawal request not found.');
        }

        if (withdrawal.status !== 'Pending') {
            return sendError(
                res,
                400,
                `Withdrawal is already ${withdrawal.status}.`
            );
        }

        const wallet = await Wallet.findById(withdrawal.walletId);

        if (!wallet) {
            return sendError(res, 404, 'Wallet not found.');
        }

        withdrawal.status = 'Rejected';
        withdrawal.rejectedAt = new Date();

        wallet.pendingBalance -= withdrawal.amount;
        wallet.availableBalance += withdrawal.amount;

        await withdrawal.save();
        await wallet.save();

        return sendSuccess(
            res,
            200,
            'Withdrawal rejected successfully.',
            withdrawal
        );

    } catch (error) {

        return sendError(res, 500, error.message);

    }

};