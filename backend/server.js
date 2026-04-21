const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('./config/envConfig'); // Normalizes environment variables immediately


console.log('--- Environment Initialization ---');
const logKey = (name) => {
  const val = process.env[name];
  if (!val) return console.log(`${name}: ❌ missing`);
  // Show first 3 and last 3 chars for safe verification
  const masked = val.length > 6
    ? `${val.substring(0, 3)}...${val.substring(val.length - 3)}`
    : '***';
  console.log(`${name}: ✅ detected (${val.length} chars: ${masked})`);
};

logKey('CLOUDINARY_CLOUD_NAME');
logKey('CLOUDINARY_API_KEY');
logKey('CLOUDINARY_API_SECRET');
logKey('MONGODB_URI');
if (process.env.CLOUDINARY_APT_KEY) console.log('CLOUDINARY_APT_KEY: ✅ detected (aliased to API_KEY)');
console.log('---------------------------------');

// Disable command buffering so it fails fast if DB is down (needed for reliable in-memory fallback)
mongoose.set('bufferCommands', false);

const app = express();

// CORS configuration - MUST BE FIRST
const prodOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://glittering-boba-2c96da.netlify.app',
  'https://joel2-28.netlify.app',
  'https://joel2-28.netlify.app/',
  'https://joel-2-28.netlify.app',
  'https://joel-2-28.netlify.app/'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    // Check if origin matches any allowed patterns
    const isAllowed = prodOrigins.includes(origin) ||
      origin.includes('netlify.app');

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, false); // Just disallow instead of throwing error
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      scriptSrcAttr: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://joel-228-api.onrender.com", "wss://joel-228-api.onrender.com"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "blob:", "data:"],
      frameSrc: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: null
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory storage for development (replace with MongoDB for production)
const inMemoryStorage = {
  prayers: [],
  testimonies: [],
  users: [],
  sermons: [],
  events: [],
  prayerCounts: {}
};

// Seed initial admins if provided in env
const adminsToSeed = [];

if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
  adminsToSeed.push({
    email: process.env.ADMIN_EMAIL.trim(),
    password: process.env.ADMIN_PASSWORD.trim(),
    name: 'Env seeded Admin'
  });
}
console.log(`👤 Seeded ${adminsToSeed.length} admin accounts into memory for fallback.`);

// Track DB status dynamically
app.locals.isDbConnected = false;
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connection established');
  app.locals.isDbConnected = true;
});
mongoose.connection.on('disconnected', () => {
  console.log('❌ MongoDB connection lost');
  app.locals.isDbConnected = false;
});
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error event:', err.message);
  app.locals.isDbConnected = false;
});

// Database connection
const connectDB = async () => {
  if (process.env.MONGODB_URI) {
    try {
      console.log('⏳ Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
      });
      console.log('🔥 Connected to MongoDB - THE JOEL 2:28 GENERATION');
      app.locals.isDbConnected = true;

      // --- ROBUST ADMIN BOOTSTRAP ---
      const User = require('./models/User');
      if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
        try {
          const adminEmail = process.env.ADMIN_EMAIL.trim().toLowerCase();
          const adminPassword = process.env.ADMIN_PASSWORD.trim();

          let adminUser = await User.findOne({ email: adminEmail });

          if (!adminUser) {
            console.log(`🌱 Creating initial admin account: ${adminEmail}`);
            adminUser = new User({
              name: 'System Admin',
              email: adminEmail,
              password: adminPassword,
              adminPassword: adminPassword,
              role: 'admin',
              isActive: true
            });
            await adminUser.save();
            console.log('✅ Initial admin account created successfully.');
          } else if (adminUser.role !== 'admin') {
            console.log(`🛡️ Promoting existing user to admin: ${adminEmail}`);
            adminUser.role = 'admin';
            adminUser.adminPassword = adminPassword; // Set the admin password too
            await adminUser.save();
            console.log('✅ User promoted to admin successfully.');
          } else {
            console.log(`✅ Admin account confirmed: ${adminEmail}`);
          }
        } catch (seedError) {
          console.error('❌ Failed to bootstrap admin account:', seedError.message);
        }
      }
      // -----------------------------

      return true;
    } catch (err) {
      console.error('❌ MongoDB initial connection error:', err.message);
      app.locals.isDbConnected = false;
      return false;
    }
  } else {
    console.log('⚠️ Running with in-memory storage (set MONGODB_URI for production)');
    app.locals.isDbConnected = false;
    return true;
  }
};

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const adminAuthRoutes = require('./routes/adminAuth');
const sermonRoutes = require('./routes/sermons');
const eventRoutes = require('./routes/events');
const prayerRoutes = require('./routes/prayers');
const testimonyRoutes = require('./routes/testimonies');

// Make in-memory storage available to routes
app.locals.storage = inMemoryStorage;

// Main route
app.get('/', (req, res) => {
  res.json({
    message: 'THE JOEL 2:28 GENERATION API is running.',
    documentation: '/api/v1',
    status: 'OK'
  });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/auth/admin', adminAuthRoutes);
// API v1 routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/sermons', sermonRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/prayers', prayerRoutes);
app.use('/api/v1/testimonies', testimonyRoutes);
app.use('/api/v1/messages', require('./routes/messages'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'THE JOEL 2:28 GENERATION API is running',
    timestamp: new Date().toISOString(),
    scripture: 'Joel 2:28 - And it shall come to pass afterward, that I will pour out my spirit upon all flesh'
  });
});

// Root endpoint for simple health checks
app.get('/', (req, res) => {
  res.status(200).send('THE JOEL 2:28 GENERATION API IS LIVE 🚀');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('--- GLOBAL ERROR HANDLER ---');
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`404 - Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// WebSocket setup
const http = require('http');
const { Server } = require('socket.io');

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: corsOptions
});

// Store io in app locals to access in routes
app.set('io', io);

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join_user', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room user_${userId}`);
  });

  socket.on('join_admin', () => {
    socket.join('admin_notifications');
    console.log('Admin joined/subscribed to notifications');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const dbConnected = await connectDB();

  if (!dbConnected && process.env.NODE_ENV === 'production') {
    console.error('CRITICAL: Could not connect to database in production. Exiting.');
    // In production, we might want to exit if DB is essential
    // process.exit(1); 
  }

  httpServer.listen(PORT, () => {
    console.log(`🚀 THE JOEL 2:28 GENERATION API server running on port ${PORT}`);
    console.log(`📖 Scripture: "And it shall come to pass afterward, that I will pour out my spirit upon all flesh" - Joel 2:28`);
    if (!dbConnected) {
      console.log('⚠️ SERVER STARTED WITH IN-MEMORY STORAGE (DATABASE DISCONNECTED)');
    }
  });
};

startServer();
