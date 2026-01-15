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
                .populate('userId', 'name profileImage') // Include profile image for UI
                .sort({ isFeatured: -1, createdAt: -1 });
        } else {
            testimonies = storage.testimonies
                .filter(t => t.isApproved)
                .sort((a, b) => {
                    if (a.isFeatured !== b.isFeatured) return b.isFeatured - a.isFeatured;
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
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

// @route   POST /api/testimonies/:id/like
// @desc    Like/Unlike a testimony
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
    try {
        const testimony = await Testimony.findById(req.params.id);

        if (!testimony) {
            return res.status(404).json({
                success: false,
                message: 'Testimony not found'
            });
        }

        if (!testimony.isApproved) {
            return res.status(403).json({
                success: false,
                message: 'Cannot like an unapproved testimony'
            });
        }

        const userId = req.user.id || req.user._id;
        const alreadyLikedIndex = testimony.likedBy.indexOf(userId);

        if (alreadyLikedIndex === -1) {
            // Like
            testimony.likedBy.push(userId);
            testimony.likes += 1;
        } else {
            // Unlike
            testimony.likedBy.splice(alreadyLikedIndex, 1);
            testimony.likes = Math.max(0, testimony.likes - 1);
        }

        await testimony.save();

        res.json({
            success: true,
            likes: testimony.likes,
            liked: alreadyLikedIndex === -1
        });

    } catch (error) {
        console.error('Like testimony error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/testimonies/admin
// @desc    Get all testimonies for admin
// @access  Admin
router.get('/admin', auth, adminAuth, async (req, res) => {
    try {
        const testimonies = await Testimony.find()
            .populate('userId', 'name email profileImage')
            .sort({ createdAt: -1 });
        res.json({ success: true, testimonies });
    } catch (error) {
        console.error('Admin get testimonies error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PATCH /api/testimonies/:id/approve
// @desc    Approve/Disapprove a testimony
// @access  Admin
router.patch('/:id/approve', auth, adminAuth, async (req, res) => {
    try {
        const testimony = await Testimony.findById(req.params.id);
        if (!testimony) {
            return res.status(404).json({ success: false, message: 'Testimony not found' });
        }

        testimony.isApproved = !testimony.isApproved;
        if (testimony.isApproved) {
            testimony.approvedBy = req.user.id || req.user._id;
            testimony.approvedAt = new Date();
        }

        await testimony.save();
        res.json({ success: true, testimony });
    } catch (error) {
        console.error('Approve testimony error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/testimonies/:id
// @desc    Delete a testimony
// @access  Admin
router.delete('/:id', auth, adminAuth, async (req, res) => {
    try {
        const testimony = await Testimony.findByIdAndDelete(req.params.id);
        if (!testimony) {
            return res.status(404).json({ success: false, message: 'Testimony not found' });
        }
        res.json({ success: true, message: 'Testimony deleted' });
    } catch (error) {
        console.error('Delete testimony error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
