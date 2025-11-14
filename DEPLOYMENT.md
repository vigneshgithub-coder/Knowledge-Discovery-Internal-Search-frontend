# Deployment Guide

This guide will help you deploy both the frontend and backend of the Knowledge Discovery & Internal Search System.

## Prerequisites

- GitHub account with both repositories pushed
- MongoDB Atlas account (already configured)
- Deployment platform accounts (Vercel for frontend, Railway/Render for backend)

## Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) - Recommended

#### Frontend Deployment (Vercel)

1. **Go to [Vercel](https://vercel.com)**
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your frontend repository: `Knowledge-Discovery-Internal-Search-frontend`

2. **Configure Build Settings**
   - Framework Preset: Vite
   - Root Directory: `./` (or leave default)
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables**
   - Add: `VITE_API_BASE_URL` = `https://your-backend-url.railway.app/api`
   - (You'll get this after deploying the backend)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your frontend will be live!

#### Backend Deployment (Railway)

1. **Go to [Railway](https://railway.app)**
   - Sign up/login with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose: `Knowledge-Discovery-Internal-Search-backend`

2. **Configure Environment Variables**
   - Go to your project → Variables
   - Add:
     - `MONGODB_URI` = Your MongoDB Atlas connection string
     - `PORT` = `5000` (or leave default)
     - `NODE_ENV` = `production`
     - `MAX_FILE_SIZE` = `10485760`

3. **Deploy**
   - Railway will automatically detect Node.js and deploy
   - Wait for deployment to complete
   - Copy the generated URL (e.g., `https://your-app.railway.app`)

4. **Update Frontend API URL**
   - Go back to Vercel
   - Update `VITE_API_BASE_URL` to: `https://your-app.railway.app/api`
   - Redeploy frontend

---

### Option 2: Vercel (Frontend) + Render (Backend)

#### Frontend Deployment (Vercel)
Same as Option 1 above.

#### Backend Deployment (Render)

1. **Go to [Render](https://render.com)**
   - Sign up/login with GitHub
   - Click "New +" → "Web Service"
   - Connect your backend repository

2. **Configure Service**
   - Name: `knowledge-discovery-backend`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free (or choose paid)

3. **Environment Variables**
   - Add:
     - `MONGODB_URI` = Your MongoDB Atlas connection string
     - `PORT` = `10000` (Render uses this)
     - `NODE_ENV` = `production`
     - `MAX_FILE_SIZE` = `10485760`

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment
   - Copy the URL (e.g., `https://your-app.onrender.com`)

5. **Update Frontend**
   - Update `VITE_API_BASE_URL` in Vercel to: `https://your-app.onrender.com/api`

---

### Option 3: Netlify (Frontend) + Any Backend Host

#### Frontend Deployment (Netlify)

1. **Go to [Netlify](https://netlify.com)**
   - Sign up/login with GitHub
   - Click "Add new site" → "Import an existing project"
   - Connect your frontend repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Base directory: `./`

3. **Environment Variables**
   - Add: `VITE_API_BASE_URL` = Your backend URL

4. **Deploy**
   - Click "Deploy site"
   - Your site will be live!

---

## Post-Deployment Checklist

### Backend
- [ ] MongoDB Atlas network access allows your hosting platform IPs
- [ ] Environment variables are set correctly
- [ ] Health endpoint works: `https://your-backend-url/api/health`
- [ ] CORS is configured to allow your frontend domain

### Frontend
- [ ] Environment variable `VITE_API_BASE_URL` is set
- [ ] Build completes successfully
- [ ] Frontend can connect to backend API
- [ ] All routes work correctly

---

## Troubleshooting

### Backend Issues

**Connection refused:**
- Check MongoDB Atlas network access settings
- Verify `MONGODB_URI` is correct
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0) or your hosting IP

**CORS errors:**
- Update backend `server.js` to allow your frontend domain:
  ```javascript
  app.use(cors({
    origin: ['https://your-frontend.vercel.app', 'http://localhost:5173']
  }));
  ```

**File upload fails:**
- Check `uploads/` directory exists
- Verify file size limits
- Check multer configuration

### Frontend Issues

**API calls fail:**
- Verify `VITE_API_BASE_URL` is set correctly
- Check browser console for CORS errors
- Ensure backend is running and accessible

**Build fails:**
- Check Node.js version (should be 16+)
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

---

## Environment Variables Reference

### Frontend (.env or Vercel/Netlify)
```
VITE_API_BASE_URL=https://your-backend-url.com/api
```

### Backend (Railway/Render)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/knowledge-discovery
PORT=5000
NODE_ENV=production
MAX_FILE_SIZE=10485760
```

---

## Quick Deploy Commands

### Railway CLI
```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

### Vercel CLI
```bash
npm i -g vercel
cd project
vercel
```

---

## Support

If you encounter issues:
1. Check deployment platform logs
2. Verify environment variables
3. Test API endpoints directly
4. Check MongoDB Atlas connection

Good luck with your deployment! 🚀

