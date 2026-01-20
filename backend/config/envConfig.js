require('dotenv').config();

const normalizeEnv = () => {
    // Only log if something changed or on first run to avoid spam
    let changed = false;

    // Trim everything that looks like a ministry config
    Object.keys(process.env).forEach(key => {
        if (key.includes('CLOUDINARY') || key.includes('MONGO') || key.includes('JWT')) {
            const original = process.env[key];
            if (typeof original !== 'string') return;

            let val = original.trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.substring(1, val.length - 1).trim();
            }
            if (val !== original) {
                process.env[key] = val;
                changed = true;
            }
        }
    });

    // POWER FIX: Automatically alias typos
    if (process.env.CLOUDINARY_APT_KEY && !process.env.CLOUDINARY_API_KEY) {
        process.env.CLOUDINARY_API_KEY = process.env.CLOUDINARY_APT_KEY;
        changed = true;
    }
    if (process.env.CLOUDINARY_APT_SECRET && !process.env.CLOUDINARY_API_SECRET) {
        process.env.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_APT_SECRET;
        changed = true;
    }

    return changed;
};

// Run normalization immediately upon require
normalizeEnv();

module.exports = { normalizeEnv };
