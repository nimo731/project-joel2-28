const mongoose = require('mongoose');

const prayerRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // Allow anonymous requests
    },
    name: {
        type: String,
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters'],
        default: 'Anonymous'
    },
    title: {
        type: String,
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters'],
        default: 'Prayer Request'
    },
    request: {
        type: String,
        required: [true, 'Prayer request is required'],
        maxlength: [1000, 'Request cannot exceed 1000 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['healing', 'family', 'finances', 'guidance', 'thanksgiving', 'other'],
        default: 'other'
    },
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'private'
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    prayerCount: {
        type: Number,
        default: 0
    },
    prayedBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        prayedAt: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
        enum: ['active', 'answered', 'closed'],
        default: 'active'
    },
    isUrgent: {
        type: Boolean,
        default: false
    },
    followUp: {
        type: String,
        default: null,
        maxlength: [500, 'Follow-up cannot exceed 500 characters']
    },
    answeredAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Index for category and status queries
prayerRequestSchema.index({ category: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('PrayerRequest', prayerRequestSchema);
