const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');
const Testimony = require('../models/Testimony');

const router = express.Router();

// @route   POST /api/testimonies
// @desc    Submit new testimony
// @access  Public
router.post('/', [
    body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
    body('testimony').trim().isLength({ min: 10 }).withMessage('Testimony must be at least 10 characters')
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

        const { name, email, testimony } = req.body;
        const storage = req.app.locals.storage;

        const testimonyData = {
            id: Date.now().toString(),
            userId: req.user?.userId || null,
            name,
            email: email || null,
            testimony,
            isApproved: false,
            isFeatured: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Use MongoDB if available, otherwise use in-memory storage
        if (process.env.MONGODB_URI) {
            const mongoTestimony = new Testimony(testimonyData);
            await mongoTestimony.save();
            testimonyData.id = mongoTestimony._id;
        } else {
            storage.testimonies.push(testimonyData);
        }

        res.status(201).json({
            success: true,
            message: 'Testimony submitted successfully! It will be reviewed before publishing.',
            testimony: testimonyData
        });

    } catch (error) {
        console.error('Testimony creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/testimonies
// @desc    Get all approved testimonies
// @access  Public
router.get('/', async (req, res) => {
    try {
        const storage = req.app.locals.storage;
        let testimonies;

        if (process.env.MONGODB_URI) {
            testimonies = await Testimony.find({ isApproved: true })
                .populate('userId', 'name')
                .sort({ isFeatured: -1, createdAt: -1 })
                .limit(10);
        } else {
            testimonies = storage.testimonies
                .filter(t => t.isApproved)
                .sort((a, b) => {
                    if (a.isFeatured !== b.isFeatured) return b.isFeatured - a.isFeatured;
                    return new Date(b.createdAt) - new Date(a.createdAt);
                })
                .slice(0, 10);
        }

        res.json({ 
            success: true, 
            testimonies 
        });
    } catch (error) {
        console.error('Get testimonies error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

module.exports = router;
