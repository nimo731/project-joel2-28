const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect admin routes with admin password
const requireAdminAuth = async (req, res, next) => {
    try {
        // 1) Get token and check if it exists
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies?.adminJwt) {
            token = req.cookies.adminJwt;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'You are not logged in! Please log in to get access.'
            });
        }

        // 2) Verify token
        const decoded = await jwt.verify(token, process.env.JWT_ADMIN_SECRET || 'joel228admin_secret');

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id).select('+adminPassword');
        if (!currentUser) {
            return res.status(401).json({
                success: false,
                message: 'The user belonging to this token no longer exists.'
            });
        }

        // 4) Check if user is an admin
        if (currentUser.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action.'
            });
        }

        // 5) Check if admin password was changed after the token was issued
        if (currentUser.changedAdminPasswordAfter(decoded.iat)) {
            return res.status(401).json({
                success: false,
                message: 'Admin password was recently changed! Please log in again.'
            });
        }

        // 6) Check if admin has set up their admin password
        if (!currentUser.adminPassword) {
            return res.status(403).json({
                success: false,
                message: 'Admin password not set up. Please contact the system administrator.'
            });
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        next();
    } catch (error) {
        console.error('Admin auth error:', error);
        return res.status(401).json({
            success: false,
            message: 'You are not authorized to access this route.'
        });
    }
};

// Middleware to check if user is an admin (without requiring admin password)
const checkAdmin = async (req, res, next) => {
    try {
        // Get token from header or cookie
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies?.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return next();
        }

        // Verify token
        const decoded = await jwt.verify(token, process.env.JWT_SECRET || 'joel228generation_secret');

        // Check if user still exists
        const currentUser = await User.findById(decoded.userId);
        if (!currentUser) {
            return next();
        }

        // Check if user is an admin
        if (currentUser.role === 'admin') {
            req.user = currentUser;
        }

        next();
    } catch (error) {
        console.error('Check admin error:', error);
        next();
    }
};

module.exports = {
    requireAdminAuth,
    checkAdmin
};
