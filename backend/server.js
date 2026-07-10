const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const walletRoutes = require('./routes/walletRoutes');
const withdrawalRoutes = require('./routes/withdrawalRoutes');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');



// Load Environment Variables
dotenv.config();

const PORT = process.env.PORT || 5001;

// Connect Database
connectDB();

// Initialize Express
const app = express();

// Standard Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/equipment', equipmentRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/withdrawals', withdrawalRoutes);
// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'KisanO Backend Engine is healthy and running perfectly.'
    });
});
// Global Error Handler
app.use(errorHandler);
// Start Server


app.listen(PORT, () => {
    console.log(`
========================================
🌾 KisanO Backend Started
🌍 Environment : ${process.env.NODE_ENV}
📡 Port        : ${PORT}
========================================
`);
});