# Project Structure Documentation

## Overview

This is a **monorepo** containing a complete full-stack application with clean separation between frontend and backend.

## Directory Tree

```
project-joel-2-28/
│
├── frontend/                          # Frontend Application
│   ├── index.html                     # Main public landing page
│   ├── admin-login.html               # Admin authentication page
│   ├── admin-dashboard.html           # Admin control panel
│   ├── admin-events.html              # Event management interface
│   ├── admin-sermons.html             # Sermon management interface
│   ├── past-events.html               # Past events archive page
│   │
│   ├── css/                           # Stylesheets
│   │   ├── main.css                   # Main application styles
│   │   └── admin-login.css            # Admin login page styles
│   │
│   └── js/                            # JavaScript Files
│       ├── main.js                    # Main frontend logic & API calls
│       ├── admin-login.js             # Admin login handler
│       └── past-events.js             # Past events page logic
│
├── backend/                           # Backend API Server
│   ├── server.js                      # Express.js entry point
│   ├── package.json                   # Backend dependencies
│   ├── package-lock.json              # Dependency lock file
│   │
│   ├── .env                           # Environment variables (local)
│   ├── .env.example                   # Environment template
│   │
│   ├── routes/                        # API Route Handlers
│   │   ├── auth.js                    # User authentication routes
│   │   ├── adminAuth.js               # Admin authentication routes
│   │   ├── admin.js                   # Admin management routes
│   │   ├── users.js                   # User management routes
│   │   ├── sermons.js                 # Sermon CRUD routes
│   │   ├── events.js                  # Event CRUD routes
│   │   ├── prayers.js                 # Prayer request routes
│   │   └── testimonies.js             # Testimony routes
│   │
│   ├── models/                        # MongoDB Mongoose Schemas
│   │   ├── User.js                    # User data model
│   │   ├── Event.js                   # Event data model
│   │   ├── Sermon.js                  # Sermon data model
│   │   ├── PrayerRequest.js           # Prayer request data model
│   │   └── Testimony.js               # Testimony data model
│   │
│   ├── controllers/                   # Business Logic
│   │   └── adminAuthController.js     # Admin authentication logic
│   │
│   ├── middleware/                    # Custom Middleware
│   │   ├── adminAuth.js               # Admin authentication middleware
│   │   └── errorHandler.js            # Global error handling
│   │
│   ├── utils/                         # Utility Functions
│   │   ├── catchAsync.js              # Async error wrapper
│   │   └── appError.js                # Custom error class
│   │
│   ├── scripts/                       # Setup & Utility Scripts
│   │   └── setupAdmins.js             # Admin user initialization
│   │
│   ├── public/                        # Static assets (if any)
│   │   └── admin-events.html          # Legacy admin file
│   │
│   └── node_modules/                  # Dependencies (not in git)
│
├── .gitignore                         # Git ignore rules
├── package.json                       # Root package.json (monorepo)
├── README.md                          # Main project documentation
├── PROJECT_STRUCTURE.md               # This file
│
└── .git/                              # Git repository
```

## Key Features by Directory

### Frontend (`/frontend`)

**Purpose:** User-facing web application

**Components:**
- **Public Pages:** Landing page, past events, prayer wall
- **Admin Pages:** Login, dashboard, event management, sermon management
- **Styling:** Modern, responsive CSS with CSS variables
- **Interactivity:** Vanilla JavaScript with API integration

**Key Technologies:**
- HTML5
- CSS3 (with CSS custom properties)
- Vanilla JavaScript (ES6+)
- Font Awesome icons
- Google Fonts

### Backend (`/backend`)

**Purpose:** RESTful API server and data management

**Components:**

1. **Routes** - API endpoint definitions
   - Authentication (user & admin)
   - CRUD operations for sermons, events, prayers, testimonies
   - User management

2. **Models** - Data schemas
   - User (with password hashing)
   - Event (with date/location)
   - Sermon (with metadata)
   - PrayerRequest (with timestamps)
   - Testimony (with author info)

3. **Controllers** - Business logic
   - Authentication logic
   - Data validation
   - Error handling

4. **Middleware** - Request processing
   - JWT authentication
   - Error handling
   - CORS support
   - Rate limiting
   - Security headers (Helmet)

5. **Utils** - Helper functions
   - Async error wrapper
   - Custom error class

6. **Scripts** - Initialization
   - Admin user setup

**Key Technologies:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (JSON Web Tokens)
- Bcrypt (password hashing)
- Helmet (security)
- CORS
- Rate Limiting

## API Endpoints

### Authentication
```
POST   /api/v1/auth/login              # User login
POST   /api/v1/auth/register           # User registration
POST   /api/v1/auth/admin/login        # Admin login
```

### Sermons
```
GET    /api/v1/sermons                 # Get all sermons
POST   /api/v1/sermons                 # Create sermon (admin)
GET    /api/v1/sermons/:id             # Get specific sermon
PUT    /api/v1/sermons/:id             # Update sermon (admin)
DELETE /api/v1/sermons/:id             # Delete sermon (admin)
```

### Events
```
GET    /api/v1/events                  # Get all events
POST   /api/v1/events                  # Create event (admin)
GET    /api/v1/events/:id              # Get specific event
PUT    /api/v1/events/:id              # Update event (admin)
DELETE /api/v1/events/:id              # Delete event (admin)
```

### Prayers
```
GET    /api/v1/prayers                 # Get all prayer requests
POST   /api/v1/prayers                 # Submit prayer request
GET    /api/v1/prayers/:id             # Get specific prayer
DELETE /api/v1/prayers/:id             # Delete prayer (admin)
```

### Testimonies
```
GET    /api/v1/testimonies             # Get all testimonies
POST   /api/v1/testimonies             # Submit testimony
GET    /api/v1/testimonies/:id         # Get specific testimony
DELETE /api/v1/testimonies/:id         # Delete testimony (admin)
```

### Health Check
```
GET    /api/health                     # API health status
```

## Data Flow

```
User Browser
    ↓
Frontend (HTML/CSS/JS)
    ↓
API Requests (Fetch/AJAX)
    ↓
Express Server (backend/server.js)
    ↓
Routes (backend/routes/*)
    ↓
Controllers (backend/controllers/*)
    ↓
Models (backend/models/*)
    ↓
MongoDB Database
    ↓
Response back to Frontend
    ↓
DOM Update & Rendering
```

## Environment Configuration

### Backend Environment Variables (`.env`)

```env
# Database
MONGODB_URI=mongodb://127.0.0.1:27017/joel228generation

# JWT
JWT_SECRET=joel228generation_super_secret_key_2025_prayer_ministry

# Server
PORT=5001
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3001

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Admin Credentials
ADMIN_EMAIL=jameskinyanjui@gmail.com
ADMIN_PASSWORD=admin123456

# File Upload
MAX_FILE_SIZE=10MB
UPLOAD_PATH=./uploads
```

## Development Workflow

### Starting the Application

1. **Install dependencies:**
   ```bash
   npm run install-all
   ```

2. **Start the server:**
   ```bash
   npm start          # Production mode
   npm run dev        # Development mode with auto-reload
   ```

3. **Access the application:**
   - Public site: `http://localhost:5001/`
   - Admin login: `http://localhost:5001/admin-login.html`
   - API health: `http://localhost:5001/api/health`

### File Organization Best Practices

- **Frontend:** All user-facing files in `/frontend`
- **Backend:** All server logic in `/backend`
- **Separation of Concerns:** Routes, models, controllers are separate
- **Reusable Code:** Utils and middleware are centralized
- **Configuration:** Environment variables in `.env`

## Security Measures

1. **Authentication:** JWT tokens for secure API access
2. **Password Security:** Bcrypt hashing for user passwords
3. **CORS:** Configured to prevent unauthorized cross-origin requests
4. **Rate Limiting:** Protects against brute force attacks
5. **Security Headers:** Helmet.js provides HTTP security headers
6. **Input Validation:** Express-validator for request validation
7. **Error Handling:** Centralized error handling prevents information leakage

## Deployment Considerations

- **Frontend:** Can be deployed to Netlify, Vercel, or any static host
- **Backend:** Can be deployed to Heroku, AWS, DigitalOcean, etc.
- **Database:** MongoDB Atlas for cloud database
- **Environment:** Use `.env` files for production secrets
- **Build:** No build step required (static frontend, Node.js backend)

## Performance Optimization

- **Frontend:** Lazy loading, CSS optimization, minimal JavaScript
- **Backend:** Database indexing, caching, efficient queries
- **API:** Pagination for large datasets, compression enabled

## Monitoring & Logging

- **Health Check:** `/api/health` endpoint for monitoring
- **Error Logging:** Centralized error handling
- **Request Logging:** Can be enhanced with Morgan middleware

---

**Last Updated:** December 9, 2025
**Version:** 1.0.0
