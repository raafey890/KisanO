// =======================================
// Standard Success Response
// =======================================

exports.sendSuccess = (
    res,
    statusCode,
    message,
    data = null
) => {

    return res.status(statusCode).json({
        success: true,
        message,
        data
    });

};

// =======================================
// Standard Error Response
// =======================================

exports.sendError = (
    res,
    statusCode,
    message
) => {

    return res.status(statusCode).json({
        success: false,
        message,
        data: null
    });

};