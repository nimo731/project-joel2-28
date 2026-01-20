require('dotenv').config();

const normalizeEnv = () => {
    // Trim everything that looks like a ministry config
    Object.keys(process.env).forEach(key => {
        if (key.includes('CLOUDINARY') || key.includes('MONGO') || key.includes('JWT')) {
            let val = process.env[key].trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.substring(1, val.length - 1).trim();
            }
            process.env[key] = val;
        }
    });

    // POWER FIX: Automatically alias typos
    if (process.env.CLOUDINARY_APT_KEY && !process.env.CLOUDINARY_API_KEY) {
        process.env.CLOUDINARY_API_KEY = process.env.CLOUDINARY_APT_KEY;
    }
    if (process.env.CLOUDINARY_APT_SECRET && !process.env.CLOUDINARY_API_SECRET) {
        process.env.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_APT_SECRET;
    }
};

// Run normalization immediately upon require
normalizeEnv();

module.exports = { normalizeEnv };
