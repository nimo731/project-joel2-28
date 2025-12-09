# Complete Deployment Plan - Frontend + Backend

## Overview

Deploy **THE JOEL 2:28 GENERATION** to production using:
- **Frontend:** Netlify
- **Backend:** Render
- **Database:** MongoDB Atlas

---

## Phase 1: Database Setup (MongoDB Atlas)

### Time: 15 minutes

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up (free tier available)

2. **Create Cluster**
   - Click "Create a Deployment"
   - Choose "M0 Free" tier
   - Select your region
   - Wait for creation (5-10 minutes)

3. **Get Connection String**
   - Click "Connect"
   - Choose "Drivers"
   - Copy connection string
   - Replace `<password>` with your password
   - Replace database name with `joel228generation`

**Save this connection string!**

---

## Phase 2: Backend Deployment (Render)

### Time: 10 minutes

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub (recommended)

2. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Name: `joel-228-api`
   - Build Command: `cd backend && npm install`
   - Start Command: `node backend/server.js`

3. **Add Environment Variables**
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - Keep your secret key
   - `NODE_ENV` - Set to `production`
   - `FRONTEND_URL` - Will add after frontend deployment
   - `ADMIN_EMAIL` - Your admin email
   - `ADMIN_PASSWORD` - Your admin password
   - `PORT` - Set to `5001`

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (2-5 minutes)
   - You'll get a URL like: `https://joel-228-api.onrender.com`

5. **Test Backend**
   ```bash
   curl https://joel-228-api.onrender.com/api/health
   ```

**Save your Render URL!**

---

## Phase 3: Frontend Deployment (Netlify)

### Time: 5 minutes

### Step 1: Update API URL

**File:** `/frontend/js/main.js`

Change line 2:
```javascript
// FROM:
const API_BASE_URL = 'http://localhost:5001/api/v1';

// TO:
const API_BASE_URL = 'https://joel-228-api.onrender.com/api/v1';
```

Also check `/frontend/js/admin-login.js` if it has API calls.

### Step 2: Deploy to Netlify

**Option A: Drag & Drop (Easiest)**
1. Go to https://app.netlify.com
2. Drag `/frontend` folder to Netlify
3. Done!

**Option B: Netlify CLI (Recommended)**
```bash
npm install -g netlify-cli
cd /home/nimo/development/code/phase_6/project\ joel-2-28/frontend
netlify deploy --prod --dir=.
```

**Option C: GitHub Integration (Most Automated)**
1. In Netlify: "New site from Git"
2. Connect GitHub repository
3. Publish directory: `frontend`
4. Deploy

**Save your Netlify URL!**

---

## Phase 4: Final Configuration

### Time: 5 minutes

### Step 1: Update Backend CORS

**File:** `/backend/server.js`

Update CORS to allow your Netlify domain:
```javascript
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:5001',
        'https://your-netlify-site.netlify.app'  // Add your URL
    ],
    credentials: true
};
```

### Step 2: Update Render Environment Variables

In Render dashboard for your backend service:
- Add `FRONTEND_URL` = Your Netlify URL
- Redeploy backend

### Step 3: Test Full Application

1. Visit your Netlify frontend URL
2. Check that pages load
3. Test API calls (events, sermons, prayers, testimonies)
4. Check browser console for errors
5. Test admin login

---

## Deployment URLs

Once deployed, you'll have:

| Component | URL |
|-----------|-----|
| **Frontend** | `https://your-site.netlify.app` |
| **Backend** | `https://joel-228-api.onrender.com` |
| **API Health** | `https://joel-228-api.onrender.com/api/health` |
| **Database** | MongoDB Atlas (cloud) |

---

## Quick Commands

```bash
# Deploy frontend
cd /home/nimo/development/code/phase_6/project\ joel-2-28/frontend
netlify deploy --prod --dir=.

# Redeploy backend (after pushing to GitHub)
# Render auto-deploys on push, or manually trigger in dashboard

# Test backend
curl https://joel-228-api.onrender.com/api/health

# Test frontend API
curl https://joel-228-api.onrender.com/api/v1/events
```

---

## Troubleshooting

### Frontend not connecting to backend?
- Check API URL in `/frontend/js/main.js`
- Check CORS settings in backend
- Check browser console for errors

### Backend not starting?
- Check logs in Render dashboard
- Verify environment variables are set
- Verify MongoDB URI is correct

### Database connection error?
- Check MongoDB Atlas connection string
- Verify IP whitelist (should be 0.0.0.0/0)
- Verify database password

### Want to redeploy?
- Frontend: Run `netlify deploy --prod --dir=.`
- Backend: Push to GitHub (auto-deploys) or trigger manually in Render

---

## Security Checklist

- [ ] `.env` file is NOT in GitHub
- [ ] Secrets are in Render environment variables only
- [ ] CORS is configured for your domain
- [ ] HTTPS is enabled (automatic on both platforms)
- [ ] Admin password is strong
- [ ] JWT secret is secure

---

## Monitoring

### Netlify
- Dashboard: https://app.netlify.com
- View deployments, logs, analytics

### Render
- Dashboard: https://dashboard.render.com
- View logs, metrics, environment variables

### MongoDB Atlas
- Dashboard: https://cloud.mongodb.com
- View database metrics, backups

---

## Next Steps

1. ✅ Set up MongoDB Atlas
2. ✅ Deploy backend to Render
3. ✅ Update frontend API URL
4. ✅ Deploy frontend to Netlify
5. ✅ Configure CORS
6. ✅ Test full application
7. ✅ Monitor and maintain

---

## Total Time: ~45 minutes

- Database setup: 15 min
- Backend deployment: 10 min
- Frontend deployment: 5 min
- Configuration: 5 min
- Testing: 10 min

---

**You're ready to deploy! 🚀**

For detailed instructions, see:
- `RENDER_DEPLOYMENT.md` - Backend deployment guide
- `NETLIFY_DEPLOYMENT.md` - Frontend deployment guide

Last Updated: December 9, 2025
