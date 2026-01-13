const express = require('express');
const { body, validationResult } = require('express-validator');
const PrayerRequest = require('../models/PrayerRequest');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/prayers
// @desc    Create new prayer request
// @access  Public
router.post('/', [
    body('request').trim().isLength({ min: 1 }).withMessage('Prayer request is required')
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

        const { name, request, category, isAnonymous, isUrgent } = req.body;
        const storage = req.app.locals.storage;

        const prayerRequest = {
            id: Date.now().toString(),
            userId: req.user?.userId || null,
            name: isAnonymous ? 'Anonymous' : (name || 'Anonymous'),
            request,
            category: category || 'other',
            isAnonymous: isAnonymous || false,
            isUrgent: isUrgent || false,
            prayerCount: 0,
            prayedBy: [],
            status: 'active',
            visibility: 'public',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Use MongoDB if available, otherwise use in-memory storage
        if (process.env.MONGODB_URI) {
            const mongoRequest = new PrayerRequest(prayerRequest);
            await mongoRequest.save();
            prayerRequest.id = mongoRequest._id;
        } else {
            storage.prayers.push(prayerRequest);
        }

        res.status(201).json({
            success: true,
            message: 'Prayer request submitted successfully',
            prayerRequest
        });

    } catch (error) {
        console.error('Prayer request creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/prayers/my
// @desc    Get current user's prayer requests
// @access  Private
router.get('/my', auth, async (req, res) => {
    try {
        let prayers;
        if (process.env.MONGODB_URI) {
            prayers = await PrayerRequest.find({ userId: req.user.userId })
                .sort({ createdAt: -1 });
        } else {
            const storage = req.app.locals.storage;
            prayers = storage.prayers.filter(p => p.userId === req.user.userId);
        }
        res.json({ success: true, prayers });
    } catch (error) {
        console.error('Get my prayers error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/prayers
// @desc    Get all public prayer requests
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, status, page = 1, limit = 10 } = req.query;
        const storage = req.app.locals.storage;

        let prayerRequests;

        if (process.env.MONGODB_URI) {
            const filter = { visibility: 'public' };
            if (category) filter.category = category;
            if (status) filter.status = status;

            prayerRequests = await PrayerRequest.find(filter)
                .populate('userId', 'name')
                .sort({ isUrgent: -1, createdAt: -1 })
                .limit(limit * 1)
                .skip((page - 1) * limit);
        } else {
            prayerRequests = storage.prayers
                .filter(p => p.visibility === 'public')
                .sort((a, b) => {
                    if (a.isUrgent !== b.isUrgent) return b.isUrgent - a.isUrgent;
                    return new Date(b.createdAt) - new Date(a.createdAt);
                })
                .slice((page - 1) * limit, page * limit);
        }

        res.json({
            success: true,
            prayerRequests,
            pagination: {
                current: page,
                pages: Math.ceil(storage.prayers.length / limit),
                total: storage.prayers.length
            }
        });

    } catch (error) {
        console.error('Get prayer requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/prayers/:id/pray
// @desc    Increment prayer count
// @access  Public
router.post('/:id/pray', async (req, res) => {
    try {
        const prayerRequest = await PrayerRequest.findById(req.params.id);

        if (!prayerRequest) {
            return res.status(404).json({
                success: false,
                message: 'Prayer request not found'
            });
        }

        // Check if user already prayed (if authenticated)
        if (req.user?.userId) {
            const alreadyPrayed = prayerRequest.prayedBy.some(
                entry => entry.user.toString() === req.user.userId
            );

            if (!alreadyPrayed) {
                prayerRequest.prayedBy.push({ user: req.user.userId });
            }
        }

        prayerRequest.prayerCount += 1;
        await prayerRequest.save();

        res.json({
            success: true,
            message: 'Prayer recorded',
            prayerCount: prayerRequest.prayerCount
        });

    } catch (error) {
        console.error('Prayer count error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/prayers/:id
// @desc    Update prayer request (owner only)
// @access  Private
router.put('/:id', auth, [
    body('request').optional().trim().isLength({ min: 10 }).withMessage('Prayer request must be at least 10 characters'),
    body('followUp').optional().trim().isLength({ max: 500 }).withMessage('Follow-up cannot exceed 500 characters')
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

        const prayerRequest = await PrayerRequest.findById(req.params.id);

        if (!prayerRequest) {
            return res.status(404).json({
                success: false,
                message: 'Prayer request not found'
            });
        }

        // Check ownership
        if (prayerRequest.userId?.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this prayer request'
            });
        }

        const { request, followUp, status } = req.body;

        if (request) prayerRequest.request = request;
        if (followUp) prayerRequest.followUp = followUp;
        if (status) {
            prayerRequest.status = status;
            if (status === 'answered') {
                prayerRequest.answeredAt = new Date();
            }
        }

        await prayerRequest.save();

        res.json({
            success: true,
            message: 'Prayer request updated successfully',
            prayerRequest
        });

    } catch (error) {
        console.error('Prayer request update error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
