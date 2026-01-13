#Render Backend Deployment Guide

## Overview

This guide walks you through deploying the **THE JOEL 2:28 GENERATION** backend to Render.

## Prerequisites

- Render account (free at https://render.com)
- GitHub repository with code pushed
- MongoDB Atlas account (for cloud database)

## Step 1: Set Up MongoDB Atlas (Cloud Database)

### 1.1 Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with your email or GitHub
4. Create a new project

### 1.2 Create a Cluster

1. Click "Create a Deployment"
2. Choose "M0 Free" tier
3. Select your preferred region
4. Click "Create Deployment"
5. Wait for cluster to be created (5-10 minutes)

### 1.3 Get Connection String

1. Click "Connect" on your cluster
2. Choose "Drivers"
3. Copy the connection string
4. Replace `<password>` with your database password
5. Replace `myFirstDatabase` with `joel228generation`

**Example:**
```
mongodb+srv://username:password@cluster.mongodb.net/joel228generation?retryWrites=true&w=majority
```

Save this for later!

---

## Step 2: Prepare Backend for Render

### 2.1 Update Environment Variables

**File:** `/backend/.env`

```env
# Database - Use MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/joel228generation?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=joel228generation_super_secret_key_2025_prayer_ministry

# Server
PORT=5001
NODE_ENV=production

# Frontend URL (update with your Netlify URL)
FRONTEND_URL=https://your-site-name.netlify.app

# Email Configuration (optional)
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

### 2.2 Verify package.json

**File:** `/backend/package.json`

Ensure you have:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

---

## Step 3: Deploy to Render

### 3.1 Create Render Account

1. Go to https://render.com
2. Click "Sign up"
3. Choose "Sign up with GitHub" (recommended)
4. Authorize Render to access your GitHub

### 3.2 Create New Web Service

1. In Render Dashboard, click "New +"
2. Select "Web Service"
3. Choose "Deploy an existing repository"
4. Search for `project-joel2-28`
5. Click "Connect"

### 3.3 Configure Service

Fill in the following details:

**Name:**
```
joel-228-api
```

**Environment:**
```
Node
```

**Build Command:**
```
cd backend && npm install
```

**Start Command:**
```
node backend/server.js
```

**Region:**
```
Choose closest to your location
```

**Plan:**
```
Free (for testing) or Paid (for production)
```

### 3.4 Add Environment Variables

1. Scroll down to "Environment"
2. Click "Add Environment Variable"
3. Add each variable from your `.env` file:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Your JWT secret |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | Your Netlify frontend URL |
| `PORT` | `5001` |
| `ADMIN_EMAIL` | Your admin email |
| `ADMIN_PASSWORD` | Your admin password |

**Important:** Do NOT commit `.env` file to GitHub. Add variables in Render dashboard only.

### 3.5 Deploy

1. Click "Create Web Service"
2. Render will start building and deploying
3. Wait for deployment to complete (2-5 minutes)
4. You'll see a URL like: `https://joel-228-api.onrender.com`

---

## Step 4: Verify Backend Deployment

### 4.1 Test Health Endpoint

Once deployed, test the health check:

```bash
curl https://joel-228-api.onrender.com/api/health
```

You should see:
```json
{
  "status": "OK",
  "message": "THE JOEL 2:28 GENERATION API is running",
  "timestamp": "2025-12-09T16:20:00.000Z",
  "scripture": "Joel 2:28 - And it shall come to pass afterward..."
}
```

### 4.2 Test API Endpoints

```bash
# Get events
curl https://joel-228-api.onrender.com/api/v1/events

# Get sermons
curl https://joel-228-api.onrender.com/api/v1/sermons
```

---

## Step 5: Update Frontend API URL

Once your backend is deployed on Render, update the frontend:

**File:** `/frontend/js/main.js`

Change line 2 from:
```javascript
const API_BASE_URL = 'http://localhost:5001/api/v1';
```

To:
```javascript
const API_BASE_URL = 'https://joel-228-api.onrender.com/api/v1';
```

Also update `/frontend/js/admin-login.js` if it has an API URL.

Then redeploy frontend to Netlify.

---

## Step 6: Configure CORS

**File:** `/backend/server.js`

Update CORS to allow your Netlify frontend:

```javascript
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:5001',
        'https://your-site-name.netlify.app'  // Add your Netlify URL
    ],
    credentials: true
};

app.use(cors(corsOptions));
```

Then redeploy backend to Render.

---

## Render Dashboard Features

### Monitor Logs

1. Go to your service in Render
2. Click "Logs" tab
3. View real-time logs

### View Metrics

1. Click "Metrics" tab
2. Monitor CPU, memory, requests

### Manage Environment Variables

1. Click "Environment" tab
2. Edit or add variables
3. Changes trigger automatic redeploy

### Manual Redeploy

1. Click "Deploys" tab
2. Click "Trigger deploy"
3. Select branch (main)
4. Click "Deploy"

---

## Troubleshooting

### Issue: Deployment Failed

**Check logs:**
1. Go to Render dashboard
2. Click "Logs" tab
3. Look for error messages

**Common causes:**
- Missing environment variables
- Incorrect MongoDB URI
- Port not set to 5001
- Missing dependencies in package.json

### Issue: 503 Service Unavailable

**Cause:** Service is starting up

**Solution:** Wait 1-2 minutes and try again

### Issue: Database Connection Error

**Check:**
1. MongoDB URI is correct
2. IP whitelist includes Render (usually 0.0.0.0/0)
3. Database password is correct

### Issue: CORS Errors

**Fix:**
1. Update CORS settings in server.js
2. Add Netlify URL to allowed origins
3. Redeploy backend

### Issue: Want to Redeploy

**Solution:**
1. Make changes locally
2. Push to GitHub
3. Render auto-deploys on push
4. Or manually trigger in Render dashboard

---

## Important Notes

### Free Tier Limitations

- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30 seconds
- Limited to 750 hours/month

### Upgrade to Paid

For production:
1. Go to service settings
2. Click "Change Plan"
3. Select "Standard" or higher
4. Services stay running 24/7

### Keep Secrets Safe

- Never commit `.env` to GitHub
- Always use Render environment variables
- Rotate secrets regularly
- Use strong passwords

---

## Deployment Checklist

### Before Deploying

- [ ] GitHub repository is up to date
- [ ] `.env` file is NOT in git
- [ ] MongoDB Atlas cluster is created
- [ ] MongoDB connection string is ready
- [ ] package.json has correct start script
- [ ] All dependencies are listed in package.json

### After Deploying

- [ ] Health endpoint responds
- [ ] API endpoints return data
- [ ] Database connection works
- [ ] Logs show no errors
- [ ] Frontend can connect to backend
- [ ] CORS is configured correctly

---

## Quick Reference

**Render Dashboard:** https://dashboard.render.com

**Your Backend URL:** `https://joel-228-api.onrender.com`

**Health Check:** `https://joel-228-api.onrender.com/api/health`

**MongoDB Atlas:** https://cloud.mongodb.com

---

## Next Steps

1. ✅ Create MongoDB Atlas account and cluster
2. ✅ Get MongoDB connection string
3. ✅ Deploy backend to Render
4. ✅ Test backend endpoints
5. ✅ Update frontend API URL
6. ✅ Deploy frontend to Netlify
7. ✅ Test full application

---

## Support & Resources

- **Render Docs:** https://render.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com
- **Your Render Dashboard:** https://dashboard.render.com

---

**Happy deploying! 🚀**

Last Updated: December 9, 2025
