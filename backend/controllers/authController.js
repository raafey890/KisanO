const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendSuccess, sendError } = require('../utils/response');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Register User
exports.registerUser = async (req, res) => {
    try {

        const {
            fullName,
            mobileNumber,
            email,
            password,
            role,
            village,
            district,
            state
        } = req.body;

        // Check Existing User
        const existingUser = await User.findOne({
            $or: [
                { mobileNumber },
                { email }
            ]
        });

        if (existingUser) {
           return sendError(
    res,
    400,
    'User already exists.'
);
        }

        // Create User
        const user = await User.create({
            fullName,
            mobileNumber,
            email,
            password,
            role,
            village,
            district,
            state
        });

        // Remove Password Before Sending Response
        const userData = user.toObject();
        delete userData.password;

       return sendSuccess(
    res,
    201,
    'User registered successfully.',
    {
        token: generateToken(user._id),
        user: userData
    }
);

    } catch (error) {

        return sendError(
    res,
    500,
    error.message
);

    }
};

// Login User
exports.loginUser = async (req, res) => {

    try {

        const { mobileNumber, password } = req.body;

        const user = await User.findOne({ mobileNumber });

        if (!user) 
           return sendError(
    res,
    401,
    'Invalid mobile number or password.'
);
        

        // Blocked User Check
        if (user.isBlocked) 
            return sendError(
    res,
    403,
    'Your account has been blocked. Please contact support.'
);
        

        const isMatch = await user.comparePassword(password);

        if (!isMatch) 
            return sendError(
    res,
    401,
    'Invalid mobile number or password.'
);
        

        // Remove Password Before Sending Response
        const userData = user.toObject();
        delete userData.password;

       return sendSuccess(
    res,
    200,
    'Login successful.',
    {
        token: generateToken(user._id),
        user: userData
    }
);
    } catch (error) {

        return sendError(
    res,
    500,
    error.message
);

    }

};