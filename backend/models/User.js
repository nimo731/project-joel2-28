const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    // Admin-specific authentication
    adminPassword: {
        type: String,
        select: false,
        minlength: [8, 'Admin password must be at least 8 characters']
    },
    adminPasswordChangedAt: Date,
    adminPasswordResetToken: String,
    adminPasswordResetExpires: Date,
    lastAdminLogin: Date,
    role: {
        type: String,
        enum: ['guest', 'member', 'admin'],
        default: 'guest',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    joinedDate: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    },
    prayerRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PrayerRequest'
    }],
    testimonies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Testimony'
    }],
    profileImage: {
        type: String,
        default: null
    },
    phoneNumber: {
        type: String,
        default: null
    },
    location: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Compare admin password method
userSchema.methods.compareAdminPassword = async function(candidatePassword) {
    if (!this.adminPassword) return false;
    return await bcrypt.compare(candidatePassword, this.adminPassword);
};

// Check if admin password was changed after JWT was issued
userSchema.methods.changedAdminPasswordAfter = function(JWTTimestamp) {
    if (this.adminPasswordChangedAt) {
        const changedTimestamp = parseInt(
            this.adminPasswordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

// Create admin password reset token
userSchema.methods.createAdminPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    this.adminPasswordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    
    this.adminPasswordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    return resetToken;
};

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    delete user.adminPassword;
    delete user.adminPasswordResetToken;
    delete user.adminPasswordResetExpires;
    return user;
};

module.exports = mongoose.model('User', userSchema);
