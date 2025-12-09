const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const Sermon = require('../models/Sermon');

const router = express.Router();

// @route   GET /api/sermons
// @desc    Get all published sermons
// @access  Public
router.get('/', async (req, res) => {
    try {
        const sermons = await Sermon.find({ isPublished: true })
            .sort({ date: -1 })
            .limit(20);
        res.json({ success: true, sermons });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
