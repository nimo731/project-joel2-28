const express = require('express');
const { body, validationResult } = require('express-validator');
const PrayerRequest = require('../models/PrayerRequest');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/prayers
// @desc    Create new prayer request
// @access  Private (Authenticated Users)
router.post('/', auth, [
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

        const { title, name, request, category, isAnonymous, isUrgent } = req.body;

        // Valid categories from the model
        const validCategories = ['healing', 'family', 'finances', 'guidance', 'thanksgiving', 'other'];
        const safeCategory = validCategories.includes(category) ? category : 'other';

        // Create prayer request using Mongoose model (don't set _id manually)
        const prayerRequest = new PrayerRequest({
            userId: req.user._id,
            name: isAnonymous ? 'Anonymous' : (name || req.user.name),
            title: title || 'Prayer Request',
            request,
            category: safeCategory,
            isAnonymous: isAnonymous || false,
            isUrgent: isUrgent || false,
            visibility: 'private'
        });

        await prayerRequest.save();

        res.status(201).json({
            success: true,
            message: 'Prayer request submitted successfully',
            prayerRequest
        });

    } catch (error) {
        console.error('Prayer request creation error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
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
            prayers = await PrayerRequest.find({ userId: req.user._id })
                .sort({ createdAt: -1 });
        } else {
            const storage = req.app.locals.storage;
            prayers = storage.prayers.filter(p => p.userId === (req.user.id || req.user._id?.toString()));
        }
        res.json({ success: true, prayers });
    } catch (error) {
        console.error('Error fetching user prayers:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/prayers
// @desc    Get all (removed as prayers are private)
// @access  Private (Admin only - handled in admin routes)
router.get('/', auth, async (req, res) => {
    // Regular users cannot see all prayers
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied'
        });
    }

    // Admin can see all (fallback for admin dashboard if needed, though admin routes exist)
    try {
        let prayerRequests;
        if (process.env.MONGODB_URI) {
            prayerRequests = await PrayerRequest.find()
                .populate('userId', 'name')
                .sort({ createdAt: -1 });
        } else {
            prayerRequests = req.app.locals.storage.prayers;
        }
        res.json({ success: true, prayers: prayerRequests });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
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

// @route   DELETE /api/prayers/:id
// @desc    Delete prayer request
// @access  Admin
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const prayer = await PrayerRequest.findByIdAndDelete(req.params.id);
        if (!prayer) {
            return res.status(404).json({ success: false, message: 'Prayer request not found' });
        }
        res.json({ success: true, message: 'Prayer request deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
