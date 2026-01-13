const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// Security middleware with updated CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      scriptSrcAttr: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'"],
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
// CORS configuration
const devCors = (origin, callback) => callback(null, true);
const prodOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'http://localhost:5001',
  'http://127.0.0.1:5001',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? function (origin, callback) {
      if (!origin || prodOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    }
    : devCors,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-memory storage for development (replace with MongoDB for production)
const inMemoryStorage = {
  prayers: [],
  testimonies: [],
  users: [],
  prayerCounts: {}
};

// Database connection (optional for development)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('🔥 Connected to MongoDB - THE JOEL 2:28 GENERATION'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
} else {
  console.log('⚠️  Running with in-memory storage (set MONGODB_URI for production)');
}

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

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
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

httpServer.listen(PORT, () => {
  console.log(`🚀 THE JOEL 2:28 GENERATION API server running on port ${PORT}`);
  console.log(`📖 Scripture: "And it shall come to pass afterward, that I will pour out my spirit upon all flesh" - Joel 2:28`);
});
