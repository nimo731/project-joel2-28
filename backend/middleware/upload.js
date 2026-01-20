const multer = require('multer');
const { createCloudinaryStorage } = require('../config/cloudinary');

const { normalizeEnv } = require('../config/envConfig');

// Use Cloudinary storage if credentials are available, otherwise use memory storage as fallback
const storage = {
    _handleFile: (req, file, cb) => {
        // Force re-normalization to catch late-loading Render env vars
        normalizeEnv();

        const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME &&
            (process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_APT_KEY) &&
            (process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_APT_SECRET);

        const realStorage = useCloudinary
            ? createCloudinaryStorage('uploads')
            : multer.memoryStorage();

        realStorage._handleFile(req, file, cb);
    },
    _removeFile: (req, file, cb) => {
        const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME &&
            (process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_APT_KEY) &&
            (process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_APT_SECRET);

        const realStorage = useCloudinary
            ? createCloudinaryStorage('uploads')
            : multer.memoryStorage();

        realStorage._removeFile(req, file, cb);
    }
};

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
