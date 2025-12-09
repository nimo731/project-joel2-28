const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', [
    body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
    body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { firstName, lastName, email, password } = req.body;
        const storage = req.app.locals.storage;
        const fullName = `${firstName} ${lastName}`;

        // Check if user already exists (in-memory or MongoDB)
        let existingUser;
        if (process.env.MONGODB_URI) {
            existingUser = await User.findOne({ email });
        } else {
            existingUser = storage.users.find(u => u.email === email);
        }

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        const userData = {
            id: Date.now().toString(),
            name: fullName,
            firstName,
            lastName,
            email,
            password, // In production, this should be hashed
            role: 'member',
            isActive: true,
            createdAt: new Date(),
            lastLogin: null
        };

        // Use MongoDB if available, otherwise use in-memory storage
        if (process.env.MONGODB_URI) {
            const user = new User(userData);
            await user.save();
            userData.id = user._id;
        } else {
            storage.users.push(userData);
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: userData.id, role: userData.role },
            process.env.JWT_SECRET || 'joel228generation_secret',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                role: userData.role
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').exists().withMessage('Password is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { email, password } = req.body;
        const storage = req.app.locals.storage;

        // Find user by email (in-memory or MongoDB)
        let user;
        if (process.env.MONGODB_URI) {
            user = await User.findOne({ email });
        } else {
            user = storage.users.find(u => u.email === email);
        }

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(400).json({
                success: false,
                message: 'Account is deactivated. Please contact admin.'
            });
        }

        // Verify password (simplified for in-memory storage)
        let isMatch;
        if (process.env.MONGODB_URI) {
            isMatch = await user.comparePassword(password);
        } else {
            isMatch = user.password === password; // In production, use proper hashing
        }

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        if (process.env.MONGODB_URI) {
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id || user._id, role: user.role },
            process.env.JWT_SECRET || 'joel228generation_secret',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id || user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                lastLogin: user.lastLogin
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', auth, (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

module.exports = router;
