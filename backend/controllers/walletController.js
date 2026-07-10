const Wallet = require('../models/Wallet');

const { sendSuccess, sendError } = require('../utils/response');

// =======================================
// Get My Wallet
// GET /api/v1/wallet/my-wallet
// =======================================

exports.getMyWallet = async (req, res) => {

    try {

        if (req.user.role !== 'EQUIPMENT_OWNER') {
            return sendError(
                res,
                403,
                'Only equipment owners can access wallet.'
            );
        }

        let wallet = await Wallet.findOne({
            ownerId: req.user._id
        });

        // Automatically create wallet if it doesn't exist
        if (!wallet) {

            wallet = await Wallet.create({
                ownerId: req.user._id
            });

        }

        return sendSuccess(
            res,
            200,
            'Wallet fetched successfully.',
            wallet
        );

    } catch (error) {

        return sendError(
            res,
            500,
            error.message
        );

    }

};
// =======================================
// Owner Wallet Dashboard
// GET /api/v1/wallet/dashboard
// =======================================

exports.getWalletDashboard = async (req, res) => {

    try {

        if (req.user.role !== 'EQUIPMENT_OWNER') {
            return sendError(
                res,
                403,
                'Only equipment owners can access dashboard.'
            );
        }

        let wallet = await Wallet.findOne({
            ownerId: req.user._id
        });

        if (!wallet) {

            wallet = await Wallet.create({
                ownerId: req.user._id
            });

        }

        const dashboard = {

            availableBalance: wallet.availableBalance,

            pendingBalance: wallet.pendingBalance,

            lifetimeEarnings: wallet.lifetimeEarnings,

            totalWithdrawn: wallet.totalWithdrawn

        };

        return sendSuccess(
            res,
            200,
            'Wallet dashboard fetched successfully.',
            dashboard
        );

    } catch (error) {

        return sendError(
            res,
            500,
            error.message
        );

    }

};