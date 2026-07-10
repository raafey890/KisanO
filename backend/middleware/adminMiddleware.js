const authorizeAdmin = (req, res, next) => {
  // Ensure the protect middleware ran before this step and set the req.user object
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access Denied. This resource is strictly restricted to platform administrators only.'
    });
  }
};

module.exports = { authorizeAdmin };