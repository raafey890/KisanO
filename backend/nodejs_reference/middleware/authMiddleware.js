const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/response');

const protect = async (req, res, next) => {
  let token;

  // Check if token exists in the Authorization header and starts with Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token out from the 'Bearer <token>' string split array
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify the token signature against our environment secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user data linked to the token, excluding the hashed password string
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
       return sendError(
    res,
    401,
    'Authorization failed. The user account associated with this token no longer exists.'
);
      }

      // Explicitly block requests if the Admin has suspended this user account
      if (req.user.isBlocked) {
        if (req.user.isBlocked) {
    return sendError(
        res,
        403,
        'Access Denied. Your user profile has been suspended by an administrator.'
    );
}
      }

      // Token is fully valid, move forward to the controller function
     return next();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
    console.error(error);
}
      return sendError(
    res,
    401,
    'Authorization failed. Session token is either expired, altered, or invalid.'
);
    }
  }

  if (!token) {
    return sendError(
    res,
    401,
    'Access denied. No authorization token was provided in the request headers.'
);
  }
};

module.exports = { protect };