const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const PrayerRequest = require('../models/PrayerRequest');
const Sermon = require('../models/Sermon');
const Event = require('../models/Event');
const Testimony = require('../models/Testimony');
const upload = require('../middleware/upload');
const router = express.Router();

// All routes in this file are protected and require admin authentication
router.use(auth.auth);
router.use(auth.adminAuth);

// Helper function to check for admin role
const adminAuth = [auth.auth, auth.adminAuth];

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Admin
router.get('/dashboard', adminAuth, async (req, res) => {
    try {
        const [
            totalUsers,
            totalPrayers,
            totalSermons,
            totalEvents,
            upcomingEvents,
            totalTestimonies,
            pendingTestimonies
        ] = await Promise.all([
            User.countDocuments(),
            PrayerRequest.countDocuments(),
            Sermon.countDocuments(),
            Event.countDocuments(),
            Event.find({ date: { $gte: new Date() } })
                .sort({ date: 1 })
                .limit(5)
                .select('title date'),
            Testimony.countDocuments(),
            Testimony.countDocuments({ isApproved: false })
        ]);

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalPrayers,
                totalSermons,
                totalEvents,
                upcomingEvents,
                totalTestimonies,
                pendingTestimonies
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Prayer Management
// @route   GET /api/admin/prayers
// @desc    Get all prayer requests (admin view)
// @access  Admin
router.get('/prayers', adminAuth, async (req, res) => {
    try {
        const prayers = await PrayerRequest.find().sort({ createdAt: -1 });
        res.json({ success: true, prayers });
    } catch (error) {
        console.error('Error fetching prayers:', error);
        res.status(500).json({ success: false, message: 'Error fetching prayers' });
    }
});

// @route   PATCH /api/admin/prayers/:id/approve
// @desc    Toggle prayer approval status (active/closed)
// @access  Admin
router.patch('/prayers/:id/approve', adminAuth, async (req, res) => {
    try {
        const prayer = await PrayerRequest.findById(req.params.id);
        if (!prayer) {
            return res.status(404).json({ success: false, message: 'Prayer not found' });
        }

        // Toggle status or set to active if pending (assuming 'active' means approved)
        // If current status is 'active', maybe we don't toggle back?
        // Let's assume the button is "Approve" so it sets to 'active'.
        prayer.status = 'active';
        await prayer.save();

        res.json({ success: true, prayer });
    } catch (error) {
        console.error('Error approving prayer:', error);
        res.status(500).json({ success: false, message: 'Error approving prayer' });
    }
});

// @route   DELETE /api/admin/prayers/:id
// @desc    Delete a prayer request
// @access  Admin
router.delete('/prayers/:id', adminAuth, async (req, res) => {
    try {
        const prayer = await PrayerRequest.findByIdAndDelete(req.params.id);
        if (!prayer) {
            return res.status(404).json({ success: false, message: 'Prayer not found' });
        }
        res.json({ success: true, message: 'Prayer request deleted' });
    } catch (error) {
        console.error('Error deleting prayer:', error);
        res.status(500).json({ success: false, message: 'Error deleting prayer' });
    }
});

// Sermon Management
// @route   GET /api/admin/sermons
// @desc    Get all sermons (admin view)
// @access  Admin
router.get('/sermons', adminAuth, async (req, res) => {
    try {
        const sermons = await Sermon.find().sort({ date: -1 });
        res.json({ success: true, sermons });
    } catch (error) {
        console.error('Error fetching sermons:', error);
        res.status(500).json({ success: false, message: 'Error fetching sermons' });
    }
});

// @route   POST /api/admin/sermons
// @desc    Create a new sermon
// @access  Admin
router.post('/sermons', adminAuth, upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), async (req, res) => {
    try {
        const { title, speaker, date, description, videoUrl, audioUrl, thumbnailUrl } = req.body;

        let finalThumbnailUrl = thumbnailUrl;
        let finalVideoLink = videoUrl;

        if (req.files) {
            if (req.files.thumbnail) {
                finalThumbnailUrl = `/uploads/${req.files.thumbnail[0].filename}`;
            }
            if (req.files.video) {
                finalVideoLink = `/uploads/${req.files.video[0].filename}`;
            }
        }

        const newSermon = new Sermon({
            title,
            preacher: speaker, // Model uses 'preacher'
            date: date || Date.now(),
            description,
            videoLink: finalVideoLink, // Model uses 'videoLink'
            audioUrl,
            thumbnailUrl: finalThumbnailUrl,
            publishedBy: req.user._id, // Model uses 'publishedBy'
            isPublished: true // Ensure it appears on public page
        });

        await newSermon.save();
        res.status(201).json({ success: true, sermon: newSermon });
    } catch (error) {
        console.error('Error creating sermon:', error);
        res.status(500).json({ success: false, message: 'Error creating sermon', error: error.message });
    }
});

// @route   PUT /api/admin/sermons/:id
// @desc    Update a sermon
// @access  Admin
router.put('/sermons/:id', adminAuth, upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), async (req, res) => {
    try {
        const { title, speaker, date, description, videoUrl, audioUrl, thumbnailUrl } = req.body;

        const sermon = await Sermon.findById(req.params.id);
        if (!sermon) {
            return res.status(404).json({ success: false, message: 'Sermon not found' });
        }

        // Update fields if they are provided
        if (title) sermon.title = title;
        if (speaker) sermon.preacher = speaker;
        if (date) sermon.date = date;
        if (description) sermon.description = description;
        if (audioUrl) sermon.audioUrl = audioUrl;

        if (req.files) {
            if (req.files.thumbnail) {
                sermon.thumbnailUrl = `/uploads/${req.files.thumbnail[0].filename}`;
            } else if (thumbnailUrl) {
                sermon.thumbnailUrl = thumbnailUrl;
            }

            if (req.files.video) {
                sermon.videoLink = `/uploads/${req.files.video[0].filename}`;
            } else if (videoUrl) {
                sermon.videoLink = videoUrl;
            }
        } else {
            if (thumbnailUrl) sermon.thumbnailUrl = thumbnailUrl;
            if (videoUrl) sermon.videoLink = videoUrl;
        }

        sermon.updatedAt = Date.now();
        await sermon.save();

        res.json({ success: true, sermon });
    } catch (error) {
        console.error('Error updating sermon:', error);
        res.status(500).json({ success: false, message: 'Error updating sermon' });
    }
});

// @route   DELETE /api/admin/sermons/:id
// @desc    Delete a sermon
// @access  Admin
router.delete('/sermons/:id', adminAuth, async (req, res) => {
    try {
        const sermon = await Sermon.findByIdAndDelete(req.params.id);
        if (!sermon) {
            return res.status(404).json({ success: false, message: 'Sermon not found' });
        }
        res.json({ success: true, message: 'Sermon deleted successfully' });
    } catch (error) {
        console.error('Error deleting sermon:', error);
        res.status(500).json({ success: false, message: 'Error deleting sermon' });
    }
});

// Event Management
// @route   GET /api/admin/events
// @desc    Get all events (admin view)
// @access  Admin
router.get('/events', adminAuth, async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json({ success: true, events });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ success: false, message: 'Error fetching events' });
    }
});

// @route   POST /api/admin/events
// @desc    Create a new event
// @access  Admin
router.post('/events', adminAuth, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), async (req, res) => {
    try {
        const { title, description, date, location, googleMeetLink, isRecurring, recurringDetails, imageUrl, videoUrl } = req.body;

        let finalImageUrl = imageUrl;
        let finalVideoUrl = videoUrl;

        if (req.files) {
            if (req.files.image) {
                finalImageUrl = `/uploads/${req.files.image[0].filename}`;
            }
            if (req.files.video) {
                finalVideoUrl = `/uploads/${req.files.video[0].filename}`;
            }
        }

        const newEvent = new Event({
            title,
            description,
            date,
            location,
            venue: location, // Model uses 'venue'
            startTime: req.body.startTime || "00:00", // Required fields
            endTime: req.body.endTime || "23:59", // Required fields
            googleMeetLink,
            isRecurring: isRecurring === 'true' || isRecurring === true,
            recurringDetails: isRecurring ? recurringDetails : null,
            imageUrl: finalImageUrl,
            videoUrl: finalVideoUrl,
            createdBy: req.user._id,
            isPublished: true // Ensure it appears on public page
        });

        await newEvent.save();
        res.status(201).json({ success: true, event: newEvent });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ success: false, message: 'Error creating event', error: error.message });
    }
});

// @route   PUT /api/admin/events/:id
// @desc    Update an event
// @access  Admin
router.put('/events/:id', adminAuth, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), async (req, res) => {
    try {
        const { title, description, date, location, googleMeetLink, isRecurring, recurringDetails, imageUrl, videoUrl } = req.body;

        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        // Update fields if they are provided
        if (title) event.title = title;
        if (description) event.description = description;
        if (date) event.date = date;
        if (location) {
            event.location = location;
            event.venue = location;
        }
        if (googleMeetLink) event.googleMeetLink = googleMeetLink;
        if (isRecurring !== undefined) {
            event.isRecurring = isRecurring === 'true' || isRecurring === true;
            if (event.isRecurring && recurringDetails) {
                event.recurringDetails = recurringDetails;
            } else {
                event.recurringDetails = null;
            }
        }

        if (req.files) {
            if (req.files.image) {
                event.imageUrl = `/uploads/${req.files.image[0].filename}`;
            } else if (imageUrl) {
                event.imageUrl = imageUrl;
            }

            if (req.files.video) {
                event.videoUrl = `/uploads/${req.files.video[0].filename}`;
            } else if (videoUrl) {
                event.videoUrl = videoUrl;
            }
        } else {
            if (imageUrl) event.imageUrl = imageUrl;
            if (videoUrl) event.videoUrl = videoUrl;
        }

        event.updatedAt = Date.now();
        await event.save();

        res.json({ success: true, event });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ success: false, message: 'Error updating event' });
    }
});

// @route   DELETE /api/admin/events/:id
// @desc    Delete an event
// @access  Admin
router.delete('/events/:id', adminAuth, async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        res.json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ success: false, message: 'Error deleting event' });
    }
});

// Google Meet Management
// @route   GET /api/admin/meet-links
// @desc    Get all Google Meet links
// @access  Admin
router.get('/meet-links', adminAuth, async (req, res) => {
    try {
        // Get events with Google Meet links
        const events = await Event.find({
            googleMeetLink: { $exists: true, $ne: '' }
        }).select('title date googleMeetLink');

        res.json({ success: true, meetLinks: events });
    } catch (error) {
        console.error('Error fetching meet links:', error);
        res.status(500).json({ success: false, message: 'Error fetching Google Meet links' });
    }
});

// @route   PUT /api/admin/events/:id/meet-link
// @desc    Update Google Meet link for an event
// @access  Admin
router.put('/events/:id/meet-link', adminAuth, async (req, res) => {
    try {
        const { googleMeetLink } = req.body;

        if (!googleMeetLink) {
            return res.status(400).json({
                success: false,
                message: 'Google Meet link is required'
            });
        }

        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        event.googleMeetLink = googleMeetLink;
        event.updatedAt = Date.now();
        await event.save();

        res.json({
            success: true,
            message: 'Google Meet link updated successfully',
            event: {
                id: event._id,
                title: event.title,
                googleMeetLink: event.googleMeetLink
            }
        });
    } catch (error) {
        console.error('Error updating Google Meet link:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating Google Meet link'
        });
    }
});

// User Management
// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ success: true, users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Admin
router.put('/users/:id/role', adminAuth, async (req, res) => {
    try {
        const { role } = req.body;

        if (!['admin', 'user'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be either "admin" or "user"'
            });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Prevent changing your own role
        if (user._id.toString() === req.user.userId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot change your own role'
            });
        }

        user.role = role;
        await user.save();

        res.json({
            success: true,
            message: 'User role updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ success: false, message: 'Error updating user role' });
    }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status (active/inactive)
// @access  Admin
router.put('/users/:id/status', adminAuth, async (req, res) => {
    try {
        const { isActive } = req.body;

        if (typeof isActive !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'isActive must be a boolean'
            });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Prevent deactivating your own account
        if (user._id.toString() === req.user.userId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot deactivate your own account'
            });
        }

        user.isActive = isActive;
        await user.save();

        res.json({
            success: true,
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ success: false, message: 'Error updating user status' });
    }
});

module.exports = router;
