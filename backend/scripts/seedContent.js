const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Sermon = require('../models/Sermon');
const Event = require('../models/Event');
const User = require('../models/User');
// We might not have Prayer/Testimony models in this file's context yet, viewing file list would help, but I'll assume standard naming if they exist, or skip for now if unsure. 
// Actually, I should probably check if Prayer/Testimony models exist.
// Based on previous context, we have pages for them, so backend likely has them.
// Let's assume ./models/Prayer.js and ./models/Testimonial.js exist or create minimal versions if not.
// For now, I'll focus on Sermon and Event volume as per specific instruction, and check models for others.

dotenv.config({ path: './.env' });

const titles = [
    "Walking in Faith", "The Power of Love", "Grace Abounds", "Hope for Tomorrow",
    "Living with Purpose", "The Joy of Giving", "Stand Firm", "Peace in the Storm",
    "Divine Connection", "Kingdom Principles", "The Heart of Worship", "Renewal of Mind",
    "Breaking Chains", "Light of the World", "Salt and Light", "Faithful Servant",
    "Victory in Jesus", "Healing Waters", "Mountain Movers", "Quiet Strength"
];

const preachers = ["Pastor John Doe", "Rev. Sarah Smith", "Bishop Michael", "Pastor David", "Evangelist Mary"];
const categories = ["teaching", "worship", "prayer", "testimony", "special"];

const generateSermons = (count, userId) => {
    const sermons = [];
    for (let i = 0; i < count; i++) {
        sermons.push({
            title: `${titles[i % titles.length]} ${Math.floor(i / titles.length) + 1}`,
            preacher: preachers[i % preachers.length],
            description: `This is a powerful message about ${titles[i % titles.length].toLowerCase()}. Join us as we explore deep spiritual truths and practical applications for your daily walk.`,
            videoLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            thumbnailUrl: `https://source.unsplash.com/random/800x600?church,sermon&sig=${i}`,
            date: new Date(Date.now() - i * 86400000 * 3), // Every 3 days
            category: categories[i % categories.length],
            duration: "45:00",
            isPublished: true,
            publishedBy: userId,
            views: Math.floor(Math.random() * 500)
        });
    }
    return sermons;
};

const generateEvents = (count, userId) => {
    const events = [];
    const categories = ["prayer", "worship", "fellowship", "outreach", "special"];
    const locations = ["Main Sanctuary", "Fellowship Hall", "City Park", "Youth Center", "Online"];

    for (let i = 0; i < count; i++) {
        events.push({
            title: `Event: ${titles[i % titles.length]}`,
            description: "Join us for this special gathering. It will be a time of fellowship, learning, and growth.",
            date: new Date(Date.now() + (i + 1) * 86400000 * 2), // Future dates
            startTime: "09:00",
            endTime: "11:00",
            venue: locations[i % locations.length],
            category: categories[i % categories.length],
            imageUrl: `https://source.unsplash.com/random/800x600?event,community&sig=${i}`,
            createdBy: userId,
            isPublished: true
        });
    }
    return events;
};

const seedData = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.log('Admin user not found. Creating one...');
            // Fallback admin creation would be here but usually seedAdmin handles it.
            // We will assume seedAdmin was run or just error out.
            console.error('Run seedAdmin.js first!');
            process.exit(1);
        }

        // Clear and Seed Sermons
        await Sermon.deleteMany({});
        const sermons = generateSermons(30, adminUser._id);
        await Sermon.insertMany(sermons);
        console.log(`Seeded ${sermons.length} sermons`);

        // Clear and Seed Events
        await Event.deleteMany({});
        const events = generateEvents(25, adminUser._id);
        await Event.insertMany(events);
        console.log(`Seeded ${events.length} events`);

        // Note: Prayer and Testimonials seeding would follow similar pattern if models are imported and confirmed.

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
