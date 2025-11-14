# Getting Started with Knowledge Discovery System

## 5-Minute Quick Start

### 1. Prerequisites
- Node.js 16+ (`node --version`)
- npm 8+ (`npm --version`)
- MongoDB (local installation or MongoDB Atlas account)

### 2. Set Up MongoDB

**Option A: Local MongoDB**
- Install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
- Default connection: `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud)**
- Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get connection string from dashboard

### 3. Install & Configure

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cp .env.example .env

# Edit backend/.env with your MongoDB connection URI
# MONGODB_URI=mongodb://localhost:27017/knowledge-discovery
# Or for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/knowledge-discovery
```

### 4. Start Both Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm start
# Should show: "MongoDB connected successfully" and "Server running on port 5000"
```

**Terminal 2 (Frontend):**
```bash
npm run dev
# Should show: "Local: http://localhost:5173/"
```

### 5. Open Browser
Navigate to `http://localhost:5173`

## What You Can Do Now

### Upload Documents
1. Go to **Upload** tab
2. Enter project name and tags
3. Upload a PDF, DOCX, or TXT file
4. Document is instantly processed

### Search
1. Go to **Search** tab
2. Type any query
3. See real-time results with relevance scores
4. Click to preview full content

### Manage Documents
1. Go to **Documents** tab
2. View all uploaded files
3. Filter by project
4. Delete when needed

## Try With Sample Data

```bash
cd backend
npm run seed
```

This adds 3 sample documents (Finance, Product, Marketing) ready to search.

## File Locations

**Key Files:**
- Frontend: `src/pages/` - UploadPage, SearchPage, DocumentsPage
- Backend: `backend/server.js` - Main API
- Database: Configured in `backend/.env`
- Docs: `README.md`, `QUICKSTART.md`

## Common Commands

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Check code style

# Backend
cd backend && npm start   # Start server
npm run dev               # Start with auto-reload
npm run seed              # Load sample data
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Change PORT in backend/.env |
| No search results | Wait for document processing, or run `npm run seed` |
| API connection error | Verify backend is running on port 5000 |
| MongoDB connection error | Check MONGODB_URI in backend/.env, ensure MongoDB is running |

## Next: Read Full Documentation

- **README.md** - Complete project overview
- **QUICKSTART.md** - Detailed setup guide
- **backend/README.md** - API endpoints & architecture
- **PROJECT_STRUCTURE.md** - File organization

## Project Overview

```
┌─────────────────┐
│   React UI      │  Upload, Search, Manage Documents
│   (Vite)        │
└────────┬────────┘
         │
┌────────▼─────────────────────┐
│  Express.js API Server       │  /api/upload, /api/search, /api/documents
│  (Node.js)                   │
└────────┬────────────────────┘
         │
┌────────▼──────────────────────┐
│  MongoDB                      │  documents, chunks collections
│  (NoSQL Database)             │
└────────────────────────────────┘
```

## Key Features

✅ Upload PDF, DOCX, TXT (max 10MB)
✅ Automatic text extraction
✅ Semantic text chunking
✅ Deterministic embeddings
✅ Real-time search with similarity scores
✅ Project & tag organization
✅ Document management
✅ Beautiful React UI
✅ Production-ready code
✅ Comprehensive error handling

## Support & Documentation

Everything you need is in the docs folder:
1. **Quick Start?** → Read QUICKSTART.md
2. **How does it work?** → Read README.md
3. **Which file does what?** → Read PROJECT_STRUCTURE.md
4. **How to use the API?** → Read backend/README.md
5. **Implementation details?** → Read IMPLEMENTATION_SUMMARY.md

## Ready to Go!

Your complete Knowledge Discovery & Internal Search System is ready to use. Start with the upload tab and explore the full capabilities of the system.

Happy searching! 🚀
