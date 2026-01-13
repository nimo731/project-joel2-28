const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// @route   POST /api/v1/messages
// @desc    Send a message
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { recipientId, subject, content } = req.body;

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ success: false, message: 'Recipient not found' });
        }

        const message = await Message.create({
            sender: req.user.id,
            recipient: recipientId,
            subject,
            content
        });

        // Socket.io emission
        const io = req.app.get('io');
        if (io) {
            // Emit to specific user room
            io.to(`user_${recipientId}`).emit('new_message', {
                message,
                senderName: req.user.name // Assuming req.user has name from middleware
            });

            // If recipient is admin, emit to admin room (assuming specific admin ID or role check logic here, 
            // but simplified: if we had an admin room for all admins)
            if (recipient.role === 'admin') {
                io.to('admin_notifications').emit('new_message', { message });
            }
        }

        res.status(201).json({ success: true, message: 'Message sent', data: message });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   GET /api/v1/messages
// @desc    Get my messages (received)
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const messages = await Message.find({ recipient: req.user.id })
            .populate('sender', 'name email')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: messages.length, messages });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   GET /api/v1/messages/sent
// @desc    Get my sent messages
// @access  Private
router.get('/sent', protect, async (req, res) => {
    try {
        const messages = await Message.find({ sender: req.user.id })
            .populate('recipient', 'name email')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: messages.length, messages });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/v1/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        // Check if user is the recipient
        if (message.recipient.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        message.isRead = true;
        await message.save();

        res.json({ success: true, data: message });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

module.exports = router;
