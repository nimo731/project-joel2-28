# THE JOEL 2:28 GENERATION - Prayer Group Ministry

A modern, full-stack web application for a prayer group ministry with separate frontend and backend architecture.

## Project Structure

```
project-joel-2-28/
├── frontend/                 # Frontend application (HTML, CSS, JS)
│   ├── index.html           # Main public page
│   ├── admin-login.html     # Admin login page
│   ├── admin-dashboard.html # Admin dashboard
│   ├── admin-events.html    # Event management
│   ├── admin-sermons.html   # Sermon management
│   ├── past-events.html     # Past events page
│   ├── css/
│   │   ├── main.css         # Main stylesheet
│   │   └── admin-login.css  # Admin login styles
│   └── js/
│       ├── main.js          # Main frontend logic
│       ├── admin-login.js   # Admin login logic
│       └── past-events.js   # Past events logic
│
├── backend/                  # Backend API (Express.js)
│   ├── server.js            # Express server entry point
│   ├── package.json         # Backend dependencies
│   ├── .env                 # Environment variables
│   ├── routes/              # API routes
│   ├── models/              # MongoDB schemas
│   ├── controllers/         # Business logic
│   ├── middleware/          # Custom middleware
│   ├── utils/               # Utility functions
│   └── scripts/             # Setup scripts
│
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## Technology Stack

**Frontend:**
- HTML5
- CSS3 (with custom properties/variables)
- Vanilla JavaScript (ES6+)
- Font Awesome Icons
- Google Fonts

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Helmet for security
- CORS support
- Rate limiting

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-joel-2-28
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env with your settings
   nano .env
   ```

4. **Start the backend server**
   ```bash
   npm start          # Production
   npm run dev        # Development with auto-reload
   ```

The server will run on `http://localhost:5001` (or the port specified in `.env`)

### Frontend Access

Open your browser and navigate to:
- **Public Site:** `http://localhost:5001/`
- **Admin Login:** `http://localhost:5001/admin-login.html`

## API Endpoints

### Authentication
- `POST /api/v1/auth/admin/login` - Admin login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login

### Resources
- `GET /api/v1/sermons` - Get all sermons
- `POST /api/v1/sermons` - Create sermon (admin)
- `GET /api/v1/events` - Get all events
- `POST /api/v1/events` - Create event (admin)
- `GET /api/v1/prayers` - Get prayer requests
- `POST /api/v1/prayers` - Submit prayer request
- `GET /api/v1/testimonies` - Get testimonies
- `POST /api/v1/testimonies` - Submit testimony

### Health Check
- `GET /api/health` - API health status

## Features

- **Prayer Wall** - Community prayer requests
- **Testimonies** - Share spiritual testimonies
- **Sermons** - Sermon library and streaming
- **Events** - Event management and scheduling
- **Admin Dashboard** - Manage content and users
- **User Authentication** - Secure login system
- **Responsive Design** - Works on all devices

## Environment Variables

```env
# Database
MONGODB_URI=mongodb://127.0.0.1:27017/joel228generation

# JWT
JWT_SECRET=your_secret_key_here

# Server
PORT=5001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3001

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure_password

# File Upload
MAX_FILE_SIZE=10MB
UPLOAD_PATH=./uploads
```

## Development

### Running Tests
```bash
cd backend
npm test
```

### Code Structure

- **Routes** - Define API endpoints
- **Models** - Define data schemas
- **Controllers** - Handle business logic
- **Middleware** - Authentication, validation, error handling
- **Utils** - Helper functions and error classes

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Helmet security headers
- Input validation
- SQL injection prevention (via Mongoose)

## Deployment

The application is ready to be deployed to platforms like:
- Netlify (frontend)
- Heroku (backend)
- AWS (both)
- DigitalOcean (both)

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT License - See LICENSE file for details

## Scripture

> "And it shall come to pass afterward, that I will pour out my spirit upon all flesh" - Joel 2:28

---

**THE JOEL 2:28 GENERATION** - A Prayer Group Ministry

