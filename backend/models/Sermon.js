const mongoose = require('mongoose');

const sermonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Sermon title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    preacher: {
        type: String,
        required: [true, 'Preacher name is required'],
        trim: true,
        maxlength: [50, 'Preacher name cannot exceed 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Sermon description is required'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    videoLink: {
        type: String,
        required: [true, 'Video link is required'],
        match: [/^(https?:\/\/|\/uploads\/).+/, 'Please enter a valid URL or an uploaded file path']
    },
    thumbnailUrl: {
        type: String,
        default: null
    },
    date: {
        type: Date,
        required: [true, 'Sermon date is required'],
        default: Date.now
    },
    duration: {
        type: String, // Format: "45:30" (minutes:seconds)
        default: null
    },
    scripture: {
        type: String,
        default: null
    },
    category: {
        type: String,
        enum: ['prayer', 'worship', 'teaching', 'testimony', 'special'],
        default: 'teaching'
    },
    tags: [{
        type: String,
        trim: true
    }],
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    publishedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Indices for performance
sermonSchema.index({ isPublished: 1, date: -1 });
sermonSchema.index({ title: 'text', description: 'text', preacher: 'text' });

module.exports = mongoose.model('Sermon', sermonSchema);
