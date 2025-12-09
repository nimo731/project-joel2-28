# Netlify Frontend Deployment Guide

## Overview

This guide walks you through deploying the **THE JOEL 2:28 GENERATION** frontend to Netlify.

## Prerequisites

- Netlify account (free at https://app.netlify.com)
- Node.js installed (for Netlify CLI)
- Git repository pushed to GitHub

## Deployment Methods

### Method 1: Drag & Drop (Simplest)

**Best for:** Quick testing and previews

1. **Log in to Netlify**
   - Go to https://app.netlify.com
   - Sign in with your account

2. **Drag and Drop**
   - Look for the "Drag and drop your site folder here" area
   - Open your file explorer
   - Navigate to `/home/nimo/development/code/phase_6/project joel-2-28/frontend`
   - Drag the entire `frontend` folder to Netlify
   - Wait for deployment to complete

3. **Get Your Site URL**
   - Netlify will assign a random URL (e.g., `https://random-name.netlify.app`)
   - Your site is now live!

**Pros:** No CLI needed, instant deployment  
**Cons:** Can't automate, manual redeploy each time

---

### Method 2: Netlify CLI (Recommended)

**Best for:** Production deployments and automation

#### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

Verify installation:
```bash
netlify --version
```

#### Step 2: Navigate to Frontend Directory

```bash
cd /home/nimo/development/code/phase_6/project\ joel-2-28/frontend
```

#### Step 3: Deploy to Production

```bash
netlify deploy --prod --dir=.
```

#### Step 4: Follow the Prompts

When you run the command, you'll be asked:

```
? What would you like to do?
  Create & configure a new site
  
? Team:
  [Select your team or personal account]

? Site name:
  [Enter a name, e.g., "joel-228-generation"]
  
? Directory to deploy:
  [Should show "." - press Enter]
```

#### Step 5: Verify Deployment

After successful deployment, you'll see:
```
✨ Site is live at https://your-site-name.netlify.app
```

---

### Method 3: GitHub Integration (Most Automated)

**Best for:** Continuous deployment on every push

#### Step 1: Connect GitHub Repository

1. Log in to Netlify
2. Click "New site from Git"
3. Choose "GitHub"
4. Authorize Netlify to access your GitHub account
5. Select your `project-joel2-28` repository

#### Step 2: Configure Build Settings

1. **Branch to deploy:** `main`
2. **Build command:** Leave empty (static site, no build needed)
3. **Publish directory:** `frontend`

#### Step 3: Deploy

Click "Deploy site" and Netlify will:
- Clone your repository
- Deploy the `frontend` folder
- Assign a URL
- Redeploy automatically on every push to `main`

---

## Post-Deployment Configuration

### 1. Update API Endpoint

Your frontend currently points to `http://localhost:5001/api/v1`. After deploying your backend, update this:

**File:** `/frontend/js/main.js`

**Current:**
```javascript
const API_BASE_URL = 'http://localhost:5001/api/v1';
```

**Change to:**
```javascript
const API_BASE_URL = 'https://your-backend-url.com/api/v1';
```

**Example (if backend is on Heroku):**
```javascript
const API_BASE_URL = 'https://your-app-name.herokuapp.com/api/v1';
```

Then redeploy:
```bash
netlify deploy --prod --dir=.
```

### 2. Enable CORS on Backend

Ensure your backend allows requests from your Netlify domain:

**File:** `/backend/server.js`

Update CORS configuration:
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

### 3. Create _redirects File (Optional)

If you have client-side routing issues, create:

**File:** `/frontend/_redirects`

**Content:**
```
/* /index.html 200
```

This ensures all routes serve `index.html` for client-side routing.

---

## Custom Domain Setup

### Option 1: Use Netlify Subdomain

Your site automatically gets a Netlify subdomain (e.g., `your-site.netlify.app`). No additional setup needed!

### Option 2: Connect Custom Domain

1. **In Netlify Dashboard:**
   - Go to Site Settings → Domain Management
   - Click "Add custom domain"
   - Enter your domain (e.g., `joel228.com`)

2. **Update DNS Records:**
   - Netlify will provide DNS records to add
   - Go to your domain registrar
   - Add the provided DNS records
   - Wait 24-48 hours for propagation

3. **Enable HTTPS:**
   - Netlify automatically provides free SSL certificate
   - Enable auto-renewal in settings

---

## Environment Variables (If Needed)

If your frontend needs environment variables:

1. **In Netlify Dashboard:**
   - Go to Site Settings → Build & Deploy → Environment
   - Click "Edit variables"
   - Add your variables (e.g., `API_URL`, `ANALYTICS_KEY`)

2. **In Your Code:**
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/v1';
   ```

---

## Deployment Checklist

### Before Deploying

- [ ] All HTML files are in `/frontend`
- [ ] All CSS files are in `/frontend/css`
- [ ] All JS files are in `/frontend/js`
- [ ] No `node_modules` folder in `/frontend`
- [ ] No `.env` file in `/frontend`
- [ ] All relative paths are correct
- [ ] No console errors when running locally
- [ ] All links use relative paths (not absolute)

### After Deploying

- [ ] Site loads without errors
- [ ] All pages are accessible
- [ ] Navigation works correctly
- [ ] Responsive design works on mobile
- [ ] No console errors in browser DevTools
- [ ] API calls work (if backend is deployed)
- [ ] Images load correctly
- [ ] CSS styles are applied

---

## Troubleshooting

### Issue: 404 Errors on Page Refresh

**Cause:** Client-side routing not configured

**Solution:** Create `/frontend/_redirects` file with:
```
/* /index.html 200
```

Then redeploy.

### Issue: API Calls Failing (CORS Error)

**Cause:** Backend CORS not configured for your Netlify domain

**Solution:**
1. Update backend CORS settings
2. Add your Netlify URL to allowed origins
3. Redeploy backend
4. Test API calls

### Issue: CSS/JS Not Loading

**Cause:** Incorrect file paths

**Solution:**
- Use relative paths: `./css/main.css` not `/css/main.css`
- Check file paths in HTML files
- Verify files exist in `/frontend` folder

### Issue: Images Not Showing

**Cause:** Images not in `/frontend` folder

**Solution:**
- Move all images to `/frontend/images` or similar
- Update image paths in HTML
- Redeploy

### Issue: Want to Redeploy

**Solution:** Run:
```bash
cd /home/nimo/development/code/phase_6/project\ joel-2-28/frontend
netlify deploy --prod --dir=.
```

### Issue: Forgot Site ID

**Solution:** Check `.netlify` folder or run:
```bash
netlify status
```

---

## Quick Commands Reference

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to frontend
cd /home/nimo/development/code/phase_6/project\ joel-2-28/frontend

# Deploy to production
netlify deploy --prod --dir=.

# Deploy to preview (draft)
netlify deploy --dir=.

# Check deployment status
netlify status

# View site info
netlify sites:list

# Open site in browser
netlify open:site

# View logs
netlify logs
```

---

## Monitoring & Maintenance

### View Deployment Logs

In Netlify Dashboard:
- Go to Deploys
- Click on any deployment
- View build logs and errors

### Monitor Site Performance

In Netlify Dashboard:
- Go to Analytics (if enabled)
- View page views, unique visitors, etc.

### Update Site

To update your site:

1. Make changes locally
2. Commit and push to GitHub (if using GitHub integration)
3. Or run `netlify deploy --prod --dir=.` manually

---

## Security Best Practices

1. **Never commit `.env` files**
   - Use environment variables in Netlify dashboard
   - Keep secrets out of code

2. **Enable HTTPS**
   - Netlify provides free SSL
   - Always enabled by default

3. **Keep dependencies updated**
   - Regularly update packages
   - Check for security vulnerabilities

4. **Monitor API calls**
   - Ensure backend has rate limiting
   - Use CORS properly

---

## Next Steps

1. ✅ Deploy frontend to Netlify
2. 📝 Update API endpoint in `main.js`
3. 🚀 Deploy backend (Heroku, AWS, etc.)
4. 🔗 Connect frontend to backend
5. 🧪 Test all features
6. 📊 Monitor performance

---

## Support & Resources

- **Netlify Docs:** https://docs.netlify.com
- **Netlify CLI Docs:** https://cli.netlify.com
- **Your Site Dashboard:** https://app.netlify.com

---

**Happy deploying! 🚀**

Last Updated: December 9, 2025
