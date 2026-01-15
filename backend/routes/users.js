const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
    try {
        // Use req.user._id since auth middleware sets full user object
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PATCH /api/users/profile
// @desc    Update user profile
// @access  Private
router.patch('/profile', auth, async (req, res) => {
    try {
        const { name, phone, bio, location, notificationPreferences } = req.body;

        // Use req.user._id since auth middleware sets full user object
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone || null;
        if (bio !== undefined) user.bio = bio;
        if (location) user.location = location;
        if (notificationPreferences) {
            user.notificationPreferences = {
                ...user.notificationPreferences,
                ...notificationPreferences
            };
        }

        await user.save();
        res.json({ success: true, user });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
});

// @route   POST /api/users/profile/photo
// @desc    Upload profile photo
// @access  Private
router.post('/profile/photo', auth, upload.single('profileImage'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image file provided' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Set the profile image URL
        user.profileImage = `/uploads/${req.file.filename}`;
        await user.save();

        res.json({
            success: true,
            message: 'Profile photo updated successfully',
            profileImage: user.profileImage,
            user
        });
    } catch (error) {
        console.error('Profile photo upload error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
});

module.exports = router;
