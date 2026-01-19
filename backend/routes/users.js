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
        console.log('--- Profile Photo Upload ---');
        console.log('User ID:', req.user._id);

        if (!req.file) {
            console.log('❌ No file received');
            return res.status(400).json({ success: false, message: 'No image file provided' });
        }

        console.log('File detected:', req.file.originalname);
        console.log('File Storage Details:', {
            path: req.file.path,
            filename: req.file.filename,
            mimetype: req.file.mimetype
        });

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Set the profile image URL
        // Cloudinary returns the full URL in req.file.path
        // Fallback to local storage path if path is not a full URL
        let imagePath = req.file.path;

        if (!imagePath && req.file.filename) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        // If we still don't have a path, check if it's in a buffer (memoryStorage)
        if (!imagePath && req.file.buffer) {
            console.log('⚠️ File is in memory buffer only - likely Cloudinary setup issue or fallback active');

            // Helpful hint discoverable via logs
            let hint = '';
            if (process.env.CLOUDINARY_APT_KEY || process.env.CLOUDINARY_APT_SECRET) {
                hint = ' Hint: Detected "APT" instead of "API" in Render names.';
            }

            return res.status(500).json({
                success: false,
                message: `Server is running in restricted mode. Cloudinary (persistent storage) is not currently active.${hint}`
            });
        }

        if (!imagePath) {
            console.error('❌ Could not determine image path. File object keys:', Object.keys(req.file));
            return res.status(500).json({ success: false, message: 'Failed to process uploaded file' });
        }

        user.profileImage = imagePath;
        console.log('✅ Saving profileImage:', user.profileImage);

        await user.save();

        res.json({
            success: true,
            message: 'Profile photo updated successfully',
            profileImage: user.profileImage,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error('❌ Profile photo upload error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
});

// @route   GET /api/users/admin-contact
// @desc    Get admin contact details
// @access  Private
router.get('/admin-contact', auth, async (req, res) => {
    try {
        const admin = await User.findOne({ role: 'admin' }).select('name email _id');
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }
        res.json({ success: true, admin });
    } catch (error) {
        console.error('Fetch admin error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/users/find
// @desc    Find user by email (Admin only ideally, but kept simple)
// @access  Private
router.post('/find', auth, async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email }).select('name email _id');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error('Find user error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
