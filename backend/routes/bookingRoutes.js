const express = require('express');
const router = express.Router();

// =======================================
// Middleware
// =======================================
const { protect } = require('../middleware/authMiddleware');

// =======================================
// Controllers
// =======================================
const {
    createBooking,
    getMyBookings,
    getOwnerBookings,
    getBookingById,
    approveBooking,
    rejectBooking,
    cancelBooking,
    completeBooking
} = require('../controllers/bookingController');

// =======================================
// Routes
// =======================================
// Note: All routes are protected by authentication middleware

// ---------------------------------------
// Collection Routes (General Queries & Creation)
// ---------------------------------------
// @route   POST /api/v1/bookings/
// @desc    Create a new equipment booking (Farmers only)
// @access  Private (FARMER)
router.post('/', protect, createBooking);

// @route   GET /api/v1/bookings/my-bookings
// @desc    Get all bookings created by the logged-in farmer
// @access  Private (FARMER)
router.get('/my-bookings', protect, getMyBookings);

// @route   GET /api/v1/bookings/owner
// @desc    Get all bookings for equipment owned by the logged-in user
// @access  Private (EQUIPMENT_OWNER)
router.get('/owner', protect, getOwnerBookings);

// ---------------------------------------
// Item Routes (Specific Booking Operations)
// ---------------------------------------
// @route   GET /api/v1/bookings/:id
// @desc    Get details of a specific booking by ID
// @access  Private (Involved FARMER or EQUIPMENT_OWNER)
router.get('/:id', protect, getBookingById);

// ---------------------------------------
// Lifecycle Status Operations
// ---------------------------------------
// @route   PUT /api/v1/bookings/:id/approve
// @desc    Approve a pending booking request
// @access  Private (EQUIPMENT_OWNER only)
router.put('/:id/approve', protect, approveBooking);

// @route   PUT /api/v1/bookings/:id/reject
// @desc    Reject a pending booking request
// @access  Private (EQUIPMENT_OWNER only)
router.put('/:id/reject', protect, rejectBooking);

// @route   PUT /api/v1/bookings/:id/cancel
// @desc    Cancel an existing booking
// @access  Private (FARMER only)
router.put('/:id/cancel', protect, cancelBooking);

// @route   PUT /api/v1/bookings/:id/complete
// @desc    Mark an approved booking as completed
// @access  Private (EQUIPMENT_OWNER only)
router.put('/:id/complete', protect, completeBooking);

module.exports = router;