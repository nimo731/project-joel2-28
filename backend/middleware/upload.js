const multer = require('multer');
const { createCloudinaryStorage } = require('../config/cloudinary');

// Use Cloudinary storage if credentials are available, otherwise use memory storage as fallback
const getStorageStatus = () => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_APT_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_APT_SECRET;

    return !!(cloudName && apiKey && apiSecret);
};

const useCloudinary = getStorageStatus();

const storage = useCloudinary
    ? createCloudinaryStorage('uploads')
    : multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg', 'image/png', 'image/webp', 'image/gif',
        'video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, GIF, MP4, MPEG, MOV, and WEBM are allowed.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
});

if (useCloudinary) {
    console.log('✅ Using Cloudinary for file uploads');
} else {
    console.log('⚠️  Cloudinary not configured - using memory storage (files will not persist)');
}

module.exports = upload;
