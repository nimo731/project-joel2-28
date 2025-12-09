# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Install Dependencies

```bash
# From project root
npm run install-all
```

This installs dependencies for both root and backend.

### Step 2: Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your settings (MongoDB URI, JWT secret, etc.)

### Step 3: Start the Server

```bash
# From project root
npm start
```

Server will run on `http://localhost:5001`

### Step 4: Access the Application

- **Public Site:** http://localhost:5001/
- **Admin Login:** http://localhost:5001/admin-login.html
- **API Health:** http://localhost:5001/api/health

---

## 📁 Project Structure at a Glance

```
project-joel-2-28/
├── frontend/          # User-facing web app (HTML, CSS, JS)
├── backend/           # Express API server
├── package.json       # Root configuration
└── README.md          # Full documentation
```

---

## 🔧 Common Commands

### Development
```bash
npm run dev           # Start with auto-reload
npm test              # Run tests
npm start             # Production mode
```

### Frontend
- All files in `/frontend` are automatically served
- CSS in `/frontend/css/`
- JavaScript in `/frontend/js/`
- HTML pages in `/frontend/`

### Backend
- API routes in `/backend/routes/`
- Data models in `/backend/models/`
- Business logic in `/backend/controllers/`

---

## 📡 API Quick Reference

### Get All Events
```bash
curl http://localhost:5001/api/v1/events
```

### Submit Prayer Request
```bash
curl -X POST http://localhost:5001/api/v1/prayers \
  -H "Content-Type: application/json" \
  -d '{"name":"John","request":"Please pray for my family"}'
```

### Admin Login
```bash
curl -X POST http://localhost:5001/api/v1/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

---

## 🔐 Default Admin Credentials

**Email:** `jameskinyanjui@gmail.com`  
**Password:** `admin123456`

⚠️ **Change these in production!**

---

## 📝 Environment Variables

Key variables in `.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/joel228generation
JWT_SECRET=your_secret_key
PORT=5001
NODE_ENV=development
```

See `.env.example` for all available options.

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change PORT in .env
PORT=5002
```

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
mongod
```

### CORS Errors
- Check that frontend URL matches CORS config in `backend/server.js`

### Module Not Found
```bash
# Reinstall dependencies
cd backend && npm install
```

---

## 📚 Learn More

- **Full Documentation:** See `README.md`
- **Project Structure:** See `PROJECT_STRUCTURE.md`
- **API Docs:** See `README.md` API Endpoints section

---

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Configure `.env`
3. ✅ Start the server
4. ✅ Visit http://localhost:5001
5. 📝 Create your first event/sermon
6. 🚀 Deploy to production

---

**Happy coding! 🙏**
