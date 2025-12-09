const mongoose = require('mongoose');

const testimonySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Testimony title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    testimony: {
        type: String,
        required: [true, 'Testimony content is required'],
        maxlength: [2000, 'Testimony cannot exceed 2000 characters']
    },
    category: {
        type: String,
        enum: ['healing', 'provision', 'breakthrough', 'salvation', 'deliverance', 'other'],
        default: 'other'
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    approvedAt: {
        type: Date,
        default: null
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    likes: {
        type: Number,
        default: 0
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

// Index for approved testimonies
testimonySchema.index({ isApproved: 1, createdAt: -1 });

module.exports = mongoose.model('Testimony', testimonySchema);
