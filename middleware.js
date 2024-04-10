const secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const { body, check } = require('express-validator');

// Middleware for authentication
const authenticate = (req, res, next) => {
    try {
        // Get token from req.headers.authorization
        let token = req.headers.authorization.split(" ")[1];

        // Verify token
        let decode = jwt.verify(token, secret);

        // Token pass in req.userData
        req.userData = decode;
        next();
    } catch (error) {
        console.log("catch error", error)
        printLogger(0, `Authentication error:- ${JSON.stringify(error)}`, 'auth');
        res.status(401).json({
            success: false,
            message: "Authentication Failed.",
            data: error
        })
    }
};

// Generate JWT token for the users
const generateToken = async (params) => {
    const options = {
        expiresIn: '24h' // Set the expiry period (e.g., 24 hours)
    };
    let token = jwt.sign(params, secret, options);
    return token;
};

// Verify JWT token
const verifyToken = async (token) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};

// Error handling middleware
const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    const data = error.data || null;
    res.status(statusCode).json({ success: false, message, data });
};

// Validation middleware
const validationMiddleware = {
    loginId: check('loginId').not().isEmpty().trim().isLength({ min: 2 }).withMessage('loginId is required'),
    email: body('email').notEmpty().withMessage('Email address is required').isEmail().withMessage('Invalid email address'),
    mobileNumber: body('mobileNumber').notEmpty().withMessage('Mobile number is required').isMobilePhone('any', { strictMode: false })
        .withMessage('Invalid mobile number format'),
};

module.exports = {
    authenticate,
    generateToken,
    verifyToken,
    errorHandler,
    validationMiddleware
};
