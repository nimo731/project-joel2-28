const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const Event = require('../models/Event');

const router = express.Router();

// @route   GET /api/v1/events
// @desc    Get events with optional filtering
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { upcoming, past } = req.query;
        let query = { isPublished: true };
        
        if (upcoming === 'true') {
            query.date = { $gte: new Date() };
        } else if (past === 'true') {
            query.date = { $lt: new Date() };
        }
        
        const events = await Event.find(query)
            .sort({ date: 1 });
            
        res.json({ success: true, events });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/v1/events
// @desc    Create a new event
// @access  Private/Admin
router.post('/', adminAuth, async (req, res) => {
    console.log('Received event data:', req.body);
    try {
        // Ensure required fields are present
        const requiredFields = ['title', 'date', 'startTime', 'endTime', 'venue'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            console.error('Missing required fields:', missingFields);
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }
        
        // Create the event with only the fields defined in the schema
        const eventData = {
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            venue: req.body.venue,
            timezone: req.body.timezone || 'EAT',
            isOnline: req.body.isOnline || false,
            meetingLink: req.body.meetingLink,
            createdBy: req.admin.id,
            isPublished: true
        };
        
        const event = new Event(eventData);
        const savedEvent = await event.save();
        
        console.log('Event created successfully:', savedEvent);
        res.status(201).json({ success: true, event: savedEvent });
    } catch (error) {
        console.error('Error creating event:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            errors: error.errors,
            stack: error.stack
        });
        res.status(500).json({ 
            success: false, 
            message: 'Error creating event',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   PATCH /api/v1/events/:id
// @desc    Update an event
// @access  Private/Admin
router.patch('/:id', adminAuth, async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['title', 'description', 'date', 'venue', 'isOnline', 'meetingLink', 'isPublished'];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));
        
        if (!isValidOperation) {
            return res.status(400).json({ success: false, message: 'Invalid updates' });
        }
        
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        
        updates.forEach(update => event[update] = req.body[update]);
        await event.save();
        
        res.json({ success: true, event });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(400).json({ success: false, message: 'Error updating event' });
    }
});

// @route   DELETE /api/v1/events/:id
// @desc    Delete an event
// @access  Private/Admin
router.delete('/:id', adminAuth, async (req, res) => {
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

module.exports = router;
