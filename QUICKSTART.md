# Quick Start Guide

Get the Knowledge Discovery & Internal Search System running locally in minutes.

## Prerequisites

- Node.js 16+ (check: `node --version`)
- npm 8+ (check: `npm --version`)
- MongoDB (local installation or MongoDB Atlas account)

## Step 1: Set Up MongoDB

### Option A: Local MongoDB

1. Install MongoDB locally from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service (usually runs automatically on Windows/Mac)
3. Default connection: `mongodb://localhost:27017`

### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Get your connection string from Atlas dashboard
4. Format: `mongodb+srv://username:password@cluster.mongodb.net/knowledge-discovery`

## Step 2: Configure Environment Variables

### Backend Configuration

1. Navigate to backend directory:
```bash
cd backend
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Edit `.env` and add your MongoDB connection URI:
```
MONGODB_URI=mongodb://localhost:27017/knowledge-discovery
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/knowledge-discovery
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE=10485760
```

## Step 3: Install Dependencies

### Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### Frontend Dependencies

```bash
npm install
```

## Step 4: Start the Servers

### In Terminal 1 - Start Backend

```bash
cd backend
npm start
```

You should see:
```
MongoDB connected successfully
Server running on port 5000
```

### In Terminal 2 - Start Frontend

From the project root:
```bash
npm run dev
```

You should see:
```
  ➜  Local:   http://localhost:5173/
```

## Step 5: Open the Application

Navigate to `http://localhost:5173` in your web browser.

You'll see the Knowledge Discovery interface with three main sections:
- **Upload** - Upload documents for processing
- **Search** - Search across uploaded documents
- **Documents** - Manage your uploaded documents

## Step 6: Try It Out

### Upload a Document

1. Click on the **Upload** tab
2. Enter a project name (e.g., "Demo Project")
3. Add some tags (optional, e.g., "demo,test")
4. Click the upload area or drag & drop a PDF, DOCX, or TXT file
5. Click "Upload Document"

You should see a success message. The document is now being processed.

### Search for Content

1. Click on the **Search** tab
2. Type a search query related to your document content
3. Results appear in real-time with relevance scores
4. Click a result to see the full content preview

### Manage Documents

1. Click on the **Documents** tab
2. See all your uploaded documents
3. Click the eye icon to view details
4. Click the trash icon to delete a document

## Troubleshooting

### Backend fails to start

**Error:** `Missing MongoDB connection URI` or connection errors

**Solution:** Ensure your `.env` file in the backend folder has:
- `MONGODB_URI` set correctly
- For local MongoDB: `mongodb://localhost:27017/knowledge-discovery`
- For Atlas: Your full connection string from Atlas dashboard

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:** Port 5000 is already in use. Either:
- Close other applications using port 5000
- Change PORT in `backend/.env` to a different port (e.g., 5001)
- Update `API_BASE_URL` in `src/services/api.ts` to match

### Frontend won't connect to backend

**Error:** `Failed to fetch` or connection errors in console

**Solution:**
1. Verify backend is running on `http://localhost:5000`
2. Check for CORS issues in the browser console
3. Ensure API_BASE_URL in `src/services/api.ts` matches your backend URL

### Upload fails

**Error:** `Unsupported file type` or `File size must be less than...`

**Solution:**
- Only PDF, DOCX, and TXT files are supported
- Maximum file size is 10MB
- Check the error message in the toast notification

### No search results

**Possible causes:**
1. Document is still processing (check Documents page for status)
2. No documents uploaded yet
3. Search terms don't match document content

**Solution:**
- Wait a few seconds for the document to process
- Upload a test document with known content
- Try searching with simpler, more general terms

### Database errors

**Error:** `Failed to create document record` or similar

**Solution:**
1. Verify MongoDB connection URI is correct
2. Ensure MongoDB is running (local) or accessible (Atlas)
3. Check MongoDB connection logs in backend console
4. For Atlas: Verify network access settings allow your IP

## Next Steps

1. **Explore Features:**
   - Upload multiple documents
   - Use project filters and tags
   - Try different search queries

2. **Read Full Documentation:**
   - See [README.md](./README.md) for complete documentation
   - See [backend/README.md](./backend/README.md) for API details

3. **Customize:**
   - Modify the UI in `src/components/`
   - Adjust upload limits in `backend/.env`
   - Customize search behavior in `src/pages/SearchPage.tsx`

4. **Deploy:**
   - Backend can be deployed to Heroku, Railway, Vercel, or any Node.js host
   - Frontend can be deployed to Vercel, Netlify, or any static host
   - See individual README files for deployment instructions

## Development Mode

For development with hot reloading:

### Backend (with auto-restart)
```bash
cd backend
npm run dev
```

### Frontend (with Vite HMR)
```bash
npm run dev
```

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## Common Commands

```bash
# Start both servers (in separate terminals)
cd backend && npm start          # Terminal 1
npm run dev                       # Terminal 2 (from project root)

# Build frontend
npm run build

# Lint frontend code
npm run lint

# Type check frontend
npm run typecheck

# Install dependencies
npm install
cd backend && npm install && cd ..

# Backend logs
cd backend && npm start

# Seed sample data
cd backend && npm run seed
```

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the full README.md for detailed documentation
3. Check browser console for JavaScript errors
4. Check backend console for server errors
5. Verify MongoDB connection URI and accessibility

## Architecture Overview

```
User Browser → Frontend (React) → Backend (Express) → MongoDB
                                        ↓
                              File Processing
                              (PDFs, DOCX, TXT)
                                        ↓
                              Text Extraction & Chunking
                                        ↓
                              Embedding Generation
                                        ↓
                              Database Storage
```

Enjoy your Knowledge Discovery system!
