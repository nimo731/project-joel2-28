const express = require('express');
const adminAuthController = require('../controllers/adminAuthController');
const { protect, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Admin authentication routes
router.post('/login', adminAuthController.login);
router.post('/verify-password', protect, adminAuthController.verifyAdminPassword);
router.patch('/change-password', protect, adminAuth, adminAuthController.changeAdminPassword);
router.post('/forgot-password', adminAuthController.forgotAdminPassword);
router.patch('/reset-password/:token', adminAuthController.resetAdminPassword);

// Admin profile routes
router.get('/me', protect, adminAuth, adminAuthController.getMe, adminAuthController.getUser);
router.patch('/update-me', protect, adminAuth, adminAuthController.updateMe);

module.exports = router;
