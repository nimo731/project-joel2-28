# Project Structure Documentation

## Overview

This is a **monorepo** containing a complete full-stack application with clean separation between frontend and backend.

## Directory Tree

```
project-joel-2-28/
│
├── client/                            # React Frontend Application
│   ├── src/                           # Source code
│   │   ├── components/                # Reusable UI components
│   │   ├── pages/                     # Page components (Home, Contact, etc.)
│   │   ├── services/                  # API service layer (axios)
│   │   └── utils/                     # Utility functions
│   ├── public/                        # Static assets
│   ├── index.html                     # Vite entry point
│   └── package.json                   # Dependencies & scripts
│
├── backend/                           # Node.js Express API Server
│   ├── server.js                      # Entry point
│   ├── routes/                        # API routes
│   ├── models/                        # Mongoose schemas
│   ├── controllers/                   # Business logic
│   ├── middleware/                    # Auth & error handling
│   ├── services/                      # Email & other services
│   ├── utils/                         # API utilities
│   └── package.json                   # Dependencies & scripts
│
├── .gitignore                         # Git ignore rules
├── README.md                          # Main project documentation
├── PROJECT_STRUCTURE.md               # This file
├── RENDER_DEPLOYMENT.md               # Backend deployment guide
└── NETLIFY_DEPLOYMENT.md              # Frontend deployment guide
```

## Key Features by Directory

### Frontend (`/client`)

**Purpose:** Modern React-based user interface

**Components:**
- **Pages:** Home, Sermons, Events, Testimonials, Contact, Login, Signup
- **Admin:** Admin dashboard, management interfaces (integrated in React)
- **State Management:** React hooks and local state
- **API Integration:** Axios-based services connecting to the backend

**Key Technologies:**
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- React Icons

### Backend (`/backend`)

**Purpose:** RESTful API server and data management

**Components:**

1. **Routes** - API endpoint definitions
   - Authentication (user & admin)
   - CRUD operations for sermons, events, prayers, testimonies
   - User profile and contact management

2. **Models** - Mongoose Schemas
   - User, Event, Sermon, PrayerRequest, Testimony

3. **Services** - External Integrations
   - Nodemailer for email notifications

4. **Middleware**
   - JWT authentication, security headers (Helmet), CORS

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
