const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const crypto = require('crypto');
const sendEmail = require('../utils/email');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_ADMIN_SECRET || 'joel228admin_secret', {
        expiresIn: process.env.JWT_ADMIN_EXPIRES_IN || '2h'
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    
    // Remove password from output
    user.password = undefined;
    user.adminPassword = undefined;
    
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

// @desc    Admin login
// @route   POST /api/v1/auth/admin/login
// @access  Public
exports.login = catchAsync(async (req, res, next) => {
    console.log('Admin login attempt:', req.body);
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        console.log('Missing email or password');
        return next(new AppError('Please provide email and password', 400));
    }
    
    // 2) Check if user exists and has admin role
    const user = await User.findOne({ email, role: 'admin' }).select('+password +adminPassword +role');
    
    if (!user) {
        console.log('No admin user found with email:', email);
        return next(new AppError('Incorrect email or password', 401));
    }
    
    console.log('Found admin user:', user.email);
    
    // 3) Check if the provided password matches either the regular or admin password
    const isPasswordValid = await user.comparePassword(password) || 
                           (user.adminPassword && await user.compareAdminPassword(password));
    
    console.log('Password validation result:', isPasswordValid);
    
    if (!isPasswordValid) {
        return next(new AppError('Incorrect email or password', 401));
    }
    
    // 3) Check if user is an admin
    if (user.role !== 'admin') {
        return next(new AppError('You do not have permission to access this route', 403));
    }
    
    // 4) Check if admin password is set
    if (!user.adminPassword) {
        return next(new AppError('Admin password not set. Please set your admin password.', 403));
    }
    
    // 5) If everything is ok, send token to client
    createSendToken(user, 200, res);
});

// @desc    Admin password verification
// @route   POST /api/v1/auth/admin/verify-password
// @access  Private (Admin)
exports.verifyAdminPassword = catchAsync(async (req, res, next) => {
    const { adminPassword } = req.body;
    
    if (!adminPassword) {
        return next(new AppError('Please provide your admin password', 400));
    }
    
    // Get user from the request (set by auth middleware)
    const user = await User.findById(req.user.id).select('+adminPassword');
    
    // Check if admin password is correct
    if (!(await user.compareAdminPassword(adminPassword))) {
        return next(new AppError('Incorrect admin password', 401));
    }
    
    // Update last admin login
    user.lastAdminLogin = Date.now();
    await user.save();
    
    // Generate admin JWT
    const token = signToken(user._id);
    
    // Send the token to the client
    res.status(200).json({
        status: 'success',
        token,
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }
    });
});

// @desc    Set/Change admin password
// @route   PATCH /api/v1/auth/admin/change-password
// @access  Private (Admin)
exports.changeAdminPassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+adminPassword');
    
    // 2) Check if current password is correct
    if (!(await user.compareAdminPassword(req.body.currentPassword))) {
        return next(new AppError('Your current password is wrong.', 401));
    }
    
    // 3) If so, update password
    user.adminPassword = req.body.newPassword;
    user.adminPasswordChangedAt = Date.now() - 1000; // Ensure token is created after password change
    await user.save();
    
    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
});

// @desc    Forgot admin password
// @route   POST /api/v1/auth/admin/forgot-password
// @access  Public
exports.forgotAdminPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email, role: 'admin' });
    
    if (!user) {
        return next(new AppError('There is no admin with that email address.', 404));
    }
    
    // 2) Generate the random reset token
    const resetToken = user.createAdminPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    
    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/admin/reset-password/${resetToken}`;
    
    const message = `Forgot your admin password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });
        
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    } catch (err) {
        user.adminPasswordResetToken = undefined;
        user.adminPasswordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        
        return next(
            new AppError('There was an error sending the email. Try again later!'),
            500
        );
    }
});

// @desc    Reset admin password
// @route   PATCH /api/v1/auth/admin/reset-password/:token
// @access  Public
exports.resetAdminPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    
    const user = await User.findOne({
        adminPasswordResetToken: hashedToken,
        adminPasswordResetExpires: { $gt: Date.now() }
    });
    
    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }
    
    // 3) Update changedPasswordAt property for the user
    user.adminPassword = req.body.password;
    user.adminPasswordResetToken = undefined;
    user.adminPasswordResetExpires = undefined;
    user.adminPasswordChangedAt = Date.now() - 1000;
    await user.save();
    
    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
});

// @desc    Get current admin
// @route   GET /api/v1/auth/admin/me
// @access  Private (Admin)
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

// @desc    Get user by ID
// @route   GET /api/v1/auth/admin/me
// @access  Private (Admin)
exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-password -adminPassword -__v');
    
    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }
    
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

// @desc    Update admin details
// @route   PATCH /api/v1/auth/admin/update-me
// @access  Private (Admin)
exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for password updates. Please use /update-password.',
                400
            )
        );
    }
    
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = {};
    if (req.body.name) filteredBody.name = req.body.name;
    if (req.body.email) filteredBody.email = req.body.email;
    
    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });
    
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});
