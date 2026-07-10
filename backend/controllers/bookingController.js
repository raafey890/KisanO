const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');
const Payment = require('../models/Payment');
const { sendSuccess, sendError } = require('../utils/response');

const {
    isValidObjectId
} = require('../utils/validation');

// =======================================
// Helper Functions
// =======================================

/**
 * Validates if a string is a valid MongoDB ObjectId
 * @param {string} id 
 * @returns {boolean}
 */


/**
 * Sends a consistent error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 */

// =======================================
// Create Booking
// POST /api/v1/bookings
// =======================================
exports.createBooking = async (req, res) => {
    try {
        // Only farmers can create bookings
        if (req.user.role !== 'FARMER') {
            return sendError(res, 403, 'Only farmers can book equipment.');
        }

       const {
    equipmentId,
    rentalStartDate,
    rentalEndDate,
    deliveryAddress,
    farmerNote
} = req.body;
        // Required fields validation
        if (!equipmentId || !rentalStartDate || !rentalEndDate) {
            return sendError(res, 400, 'Equipment ID and rental dates are required.');
        }

        // Validate MongoDB ObjectId
        if (!isValidObjectId(equipmentId)) {
            return sendError(res, 400, 'Invalid Equipment ID format.');
        }

        // Convert and validate dates
        const start = new Date(rentalStartDate);
        const end = new Date(rentalEndDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return sendError(res, 400, 'Invalid date format provided.');
        }

        if (start >= end) {
            return sendError(res, 400, 'End date must be after start date.');
        }

        // Don't allow booking in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (start < today) {
            return sendError(res, 400, 'Booking cannot be created for past dates.');
        }

        // Find equipment and verify existence
        const equipment = await Equipment.findById(equipmentId).populate('ownerId');
        if (!equipment) {
            return sendError(res, 404, 'Equipment not found.');
        }

        // Check equipment availability configuration
        // Check equipment availability configuration
if (equipment.equipmentStatus !== 'Available') {
    return sendError(res, 400, 'Equipment is currently unavailable for rent.');
}

        // Prevent overlapping bookings (Pending or Approved)
        const overlappingBooking = await Booking.findOne({
            equipmentId: equipment._id,
            bookingStatus: { $in: ['Pending', 'Approved'] },
            rentalStartDate: { $lte: end },
            rentalEndDate: { $gte: start }
        });

        if (overlappingBooking) {
            return sendError(res, 400, 'Equipment is already booked or has a pending request for the selected dates.');
        }

        // Calculate rental days and amounts
        const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const totalAmount = totalDays * equipment.dailyRate;

        // Create booking records
        const booking = await Booking.create({
            farmerId: req.user._id,
            ownerId: equipment.ownerId._id,
            equipmentId: equipment._id,
            rentalStartDate: start,
            rentalEndDate: end,
            totalDays,
            dailyRate: equipment.dailyRate,
            totalAmount,
            deliveryAddress,
            
            farmerNote,
            bookingStatus: 'Pending'
        });

        return sendSuccess(
    res,
    201,
    'Booking created successfully.',
    booking
);
    } catch (error) {
       return sendError(res, 500, error.message);
    }
};

// =======================================
// Get My Bookings (Farmer View)
// GET /api/v1/bookings/my-bookings
// =======================================
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ farmerId: req.user._id })
            .populate('equipmentId')
            .populate('ownerId', 'fullName mobileNumber');

        return sendSuccess(
    res,
    200,
    'Bookings fetched successfully.',
    {
        count: bookings.length,
        bookings
    }
);
    } catch (error) {
       return sendError(res, 500, error.message);
    }
};

// =======================================
// Get Owner Bookings (Owner View)
// GET /api/v1/bookings/owner
// =======================================
exports.getOwnerBookings = async (req, res) => {
    try {
        // Only Equipment Owners can access
        if (req.user.role !== 'EQUIPMENT_OWNER') {
            return sendError(res, 403, 'Only equipment owners can access this resource.');
        }

        const bookings = await Booking.find({ ownerId: req.user._id })
            .populate('farmerId', 'fullName mobileNumber village district')
            .populate('equipmentId');

        return sendSuccess(
    res,
    200,
    'Owner bookings fetched successfully.',
    {
        count: bookings.length,
        bookings
    }
);

    } catch (error) {
       return sendError(res, 500, error.message);
    }
};

// =======================================
// Get Booking By ID
// GET /api/v1/bookings/:id
// =======================================
exports.getBookingById = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return sendError(res, 400, 'Invalid Booking ID format.');
        }

        const booking = await Booking.findById(req.params.id)
            .populate('farmerId', 'fullName mobileNumber village district')
            .populate('ownerId', 'fullName mobileNumber')
            .populate('equipmentId');

        if (!booking) {
            return sendError(res, 404, 'Booking not found.');
        }

        // Authorization Guard: Allow only the involved farmer or equipment owner
        const currentUserId = req.user._id.toString();
        const farmerId = booking.farmerId._id.toString();
        const ownerId = booking.ownerId._id.toString();

        if (currentUserId !== farmerId && currentUserId !== ownerId) {
            return sendError(res, 403, 'You are not authorized to view this booking.');
        }

       return sendSuccess(
    res,
    200,
    'Booking fetched successfully.',
    booking
);

    } catch (error) {
       return sendError(res, 500, error.message);
    }
};

// =======================================
// Approve Booking
// PUT /api/v1/bookings/:id/approve
// =======================================
exports.approveBooking = async (req, res) => {
    try {
        if (req.user.role !== 'EQUIPMENT_OWNER') {
            return sendError(res, 403, 'Only equipment owners can approve bookings.');
        }

        if (!isValidObjectId(req.params.id)) {
            return sendError(res, 400, 'Invalid Booking ID format.');
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return sendError(res, 404, 'Booking not found.');
        }

        // Verify ownership ownership
        if (booking.ownerId.toString() !== req.user._id.toString()) {
            return sendError(res, 403, 'Unauthorized. This booking does not belong to your equipment.');
        }

        // Validate state transitions
        if (booking.bookingStatus !== 'Pending') {
            return sendError(res, 400, `Booking cannot be approved because it is already ${booking.bookingStatus}.`);
        }

        const equipment = await Equipment.findById(booking.equipmentId);
        if (!equipment) {
            return sendError(res, 404, 'Associated equipment not found.');
        }

        // Update booking details
        booking.bookingStatus = 'Approved';
        booking.acceptedAt = new Date();

        // Synchronize equipment status
        equipment.equipmentStatus = 'Booked';

       await booking.save();
await equipment.save();

// =======================================
// Automatically Create Payment Record
// =======================================
await Payment.create({
    bookingId: booking._id,
    farmerId: booking.farmerId,
    ownerId: booking.ownerId,
    amount: booking.totalAmount,
    paymentStatus: 'Pending',
    paymentMethod: null,
    remarks: 'Payment generated after booking approval.'
});

return sendSuccess(
    res,
    200,
    'Booking approved successfully. Payment record created.',
    booking
);

    } catch (error) {
       return sendError(res, 500, error.message);
    }
};

// =======================================
// Reject Booking
// PUT /api/v1/bookings/:id/reject
// =======================================
exports.rejectBooking = async (req, res) => {
    try {
        if (req.user.role !== 'EQUIPMENT_OWNER') {
            return sendError(res, 403, 'Only equipment owners can reject bookings.');
        }

        if (!isValidObjectId(req.params.id)) {
            return sendError(res, 400, 'Invalid Booking ID format.');
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return sendError(res, 404, 'Booking not found.');
        }

        // Verify resource ownership
        if (booking.ownerId.toString() !== req.user._id.toString()) {
            return sendError(res, 403, 'Unauthorized. This booking does not belong to your equipment.');
        }

        // Validate state transitions
        if (booking.bookingStatus !== 'Pending') {
            return sendError(res, 400, `Booking cannot be rejected because it is already ${booking.bookingStatus}.`);
        }

        const equipment = await Equipment.findById(booking.equipmentId);
        if (!equipment) {
            return sendError(res, 404, 'Associated equipment not found.');
        }

        // Update booking details
        booking.bookingStatus = 'Rejected';
        booking.rejectedAt = new Date();
        
        if (req.body.rejectionReason) {
            booking.rejectionReason = req.body.rejectionReason;
        }

        // Synchronize equipment status back to Available
        equipment.equipmentStatus = 'Available';

        await booking.save();
        await equipment.save();

        return sendSuccess(
    res,
    200,
    'Booking rejected successfully.',
    booking
);
    } catch (error) {
       return sendError(res, 500, error.message);
    }
};

// =======================================
// Cancel Booking
// PUT /api/v1/bookings/:id/cancel
// =======================================
exports.cancelBooking = async (req, res) => {
    try {
        if (req.user.role !== 'FARMER') {
            return sendError(res, 403, 'Only farmers can cancel bookings.');
        }

        if (!isValidObjectId(req.params.id)) {
            return sendError(res, 400, 'Invalid Booking ID format.');
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return sendError(res, 404, 'Booking not found.');
        }

        // Verify user ownership
        if (booking.farmerId.toString() !== req.user._id.toString()) {
            return sendError(res, 403, 'You are not authorized to cancel this booking.');
        }

        // Validate current status logic
        if (booking.bookingStatus === 'Cancelled') {
            return sendError(res, 400, 'Booking is already cancelled.');
        }

        if (booking.bookingStatus === 'Completed') {
            return sendError(res, 400, 'Completed bookings cannot be cancelled.');
        }

        const equipment = await Equipment.findById(booking.equipmentId);
        if (!equipment) {
            return sendError(res, 404, 'Associated equipment not found.');
        }

        // Update booking metadata
        booking.bookingStatus = 'Cancelled';
        booking.cancelledAt = new Date();

        if (req.body.cancellationReason) {
            booking.cancellationReason = req.body.cancellationReason;
        }

        // Synchronize equipment status back to Available
        equipment.equipmentStatus = 'Available';

        await booking.save();
        await equipment.save();

        return sendSuccess(
    res,
    200,
    'Booking cancelled successfully.',
    booking
);
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

// =======================================
// Complete Booking
// PUT /api/v1/bookings/:id/complete
// =======================================
exports.completeBooking = async (req, res) => {
    try {
        if (req.user.role !== 'EQUIPMENT_OWNER') {
            return sendError(res, 403, 'Only equipment owners can complete bookings.');
        }

        if (!isValidObjectId(req.params.id)) {
            return sendError(res, 400, 'Invalid Booking ID format.');
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return sendError(res, 404, 'Booking not found.');
        }

        // Verify ownership
        if (booking.ownerId.toString() !== req.user._id.toString()) {
            return sendError(res, 403, 'You are not authorized to complete this booking.');
        }

        // Validate correct workflow status transition
        if (booking.bookingStatus !== 'Approved') {
            return sendError(res, 400, 'Only approved bookings can be marked as completed.');
        }

        const equipment = await Equipment.findById(booking.equipmentId);
        if (!equipment) {
            return sendError(res, 404, 'Associated equipment not found.');
        }

        // Finalize state modifications
        booking.bookingStatus = 'Completed';
        booking.completedAt = new Date();

        // Release the asset back into rotation
        equipment.equipmentStatus = 'Available';

        await booking.save();
        await equipment.save();

       return sendSuccess(
    res,
    200,
    'Booking completed successfully.',
    booking
);

    } catch (error) {
        return sendError(res, 500, error.message);
    }
};