const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token, authorization denied'
            });
        }

        // First try with the regular JWT secret
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'joel228generation_secret');
            const user = await User.findById(decoded.id || decoded.userId);
            
            if (!user || user.isActive === false) {
                throw new Error('User not found or inactive');
            }
            
            req.user = user;
            return next();
        } catch (err) {
            // If first attempt fails, try with admin JWT secret
            try {
                const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET || 'joel228admin_secret');
                const user = await User.findById(decoded.id || decoded.userId);
                
                if (!user || user.isActive === false) {
                    throw new Error('User not found or inactive');
                }
                
                req.user = user;
                return next();
            } catch (adminErr) {
                console.error('Admin auth error:', adminErr);
                throw new Error('Invalid token');
            }
        }
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({
            success: false,
            message: 'Token is not valid',
            error: error.message
        });
    }
};

// Simple middleware to check if user is authenticated
const protect = (req, res, next) => {
    auth(req, res, next);
};

// Admin authorization middleware
const adminAuth = (req, res, next) => {
    // First run the auth middleware
    auth(req, res, (err) => {
        if (err) {
            return next(err);
        }
        
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin role required.'
            });
        }
        
        next();
    });
};

module.exports = { 
    auth, 
    protect, 
    adminAuth 
};
