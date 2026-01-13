const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { auth, adminAuth } = require('../middleware/auth');
const Sermon = require('../models/Sermon');

const router = express.Router();

// Multer storage for optional uploads
const uploadDir = path.join(__dirname, '../uploads/sermons');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '_');
    cb(null, `${base}-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// @route   GET /api/v1/sermons
// @desc    Get all published sermons
// @access  Public
router.get('/', async (req, res) => {
  try {
    const sermons = await Sermon.find({ isPublished: true }).sort({ date: -1 }).limit(50);
    res.json({ success: true, sermons });
  } catch (error) {
    console.error('Get sermons error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/v1/sermons/:id
// @desc    Get a sermon by id (public if published)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);
    if (!sermon || (!sermon.isPublished)) {
      return res.status(404).json({ success: false, message: 'Sermon not found' });
    }
    res.json({ success: true, sermon });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Sermon not found' });
  }
});

// @route   POST /api/v1/sermons
// @desc    Create a new sermon (admin)
// @access  Private/Admin
router.post('/', adminAuth, upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'audio', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const body = req.body || {};
    // Determine media link: prefer provided URL, else uploaded video/audio path
    let videoLink = body.videoLink || body.videoUrl || null;
    if (!videoLink) {
      if (req.files?.video?.[0]) videoLink = `/uploads/sermons/${req.files.video[0].filename}`;
      else if (req.files?.audio?.[0]) videoLink = `/uploads/sermons/${req.files.audio[0].filename}`;
    }

    // Thumbnail if uploaded
    let thumbnailUrl = body.thumbnailUrl || null;
    if (req.files?.thumbnail?.[0]) thumbnailUrl = `/uploads/sermons/${req.files.thumbnail[0].filename}`;

    // Required fields
    const required = ['title', 'preacher', 'description', 'date'];
    const missing = required.filter(f => !body[f]);
    if (!videoLink) missing.push('videoLink');
    if (missing.length) {
      return res.status(400).json({ success: false, message: `Missing required fields: ${missing.join(', ')}` });
    }

    const sermon = new Sermon({
      title: body.title,
      preacher: body.preacher,
      description: body.description,
      videoLink,
      thumbnailUrl,
      date: new Date(body.date),
      duration: body.duration || null,
      scripture: body.scripture || body.bibleVerse || null,
      category: body.category || 'teaching',
      tags: body.tags || [],
      isPublished: body.isPublished !== undefined ? body.isPublished === 'true' || body.isPublished === true : true,
      publishedBy: req.user._id
    });

    const saved = await sermon.save();
    res.status(201).json({ success: true, sermon: saved });
  } catch (error) {
    console.error('Create sermon error:', error);
    res.status(500).json({ success: false, message: 'Error creating sermon' });
  }
});

// @route   PATCH /api/v1/sermons/:id
// @desc    Update a sermon (admin)
// @access  Private/Admin
router.patch('/:id', adminAuth, upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'audio', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);
    if (!sermon) return res.status(404).json({ success: false, message: 'Sermon not found' });

    const body = req.body || {};
    if (body.title) sermon.title = body.title;
    if (body.preacher) sermon.preacher = body.preacher;
    if (body.description) sermon.description = body.description;
    if (body.date) sermon.date = new Date(body.date);
    if (body.duration) sermon.duration = body.duration;
    if (body.scripture || body.bibleVerse) sermon.scripture = body.scripture || body.bibleVerse;
    if (body.category) sermon.category = body.category;
    if (body.tags) sermon.tags = Array.isArray(body.tags) ? body.tags : [body.tags];
    if (body.isPublished !== undefined) sermon.isPublished = body.isPublished === 'true' || body.isPublished === true;
    if (body.videoLink || body.videoUrl) sermon.videoLink = body.videoLink || body.videoUrl;
    if (body.thumbnailUrl) sermon.thumbnailUrl = body.thumbnailUrl;

    if (req.files?.video?.[0]) sermon.videoLink = `/uploads/sermons/${req.files.video[0].filename}`;
    if (req.files?.audio?.[0] && !req.files?.video?.[0]) sermon.videoLink = `/uploads/sermons/${req.files.audio[0].filename}`;
    if (req.files?.thumbnail?.[0]) sermon.thumbnailUrl = `/uploads/sermons/${req.files.thumbnail[0].filename}`;

    await sermon.save();
    res.json({ success: true, sermon });
  } catch (error) {
    console.error('Update sermon error:', error);
    res.status(400).json({ success: false, message: 'Error updating sermon' });
  }
});

// @route   DELETE /api/v1/sermons/:id
// @desc    Delete a sermon (admin)
// @access  Private/Admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const sermon = await Sermon.findByIdAndDelete(req.params.id);
    if (!sermon) return res.status(404).json({ success: false, message: 'Sermon not found' });
    res.json({ success: true, message: 'Sermon deleted successfully' });
  } catch (error) {
    console.error('Delete sermon error:', error);
    res.status(500).json({ success: false, message: 'Error deleting sermon' });
  }
});

module.exports = router;
