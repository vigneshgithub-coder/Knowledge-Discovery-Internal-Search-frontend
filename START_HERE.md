# 🚀 START HERE

Welcome to the **Knowledge Discovery & Internal Search System**!

This is a complete, production-ready application for document management and semantic search.

## Quick Navigation

Pick your path based on your needs:

### 👤 I'm New - Help Me Get Started!
→ Read **[GETTING_STARTED.md](./GETTING_STARTED.md)** (5 minutes)

This guide will:
- Show you what prerequisites you need
- Walk you through setup step-by-step
- Show you what the system can do
- Get you uploading and searching in minutes

### ⚡ I'm in a Hurry - Just Tell Me How to Run It!
→ Read **[QUICKSTART.md](./QUICKSTART.md)** (3 minutes)

Direct commands to:
- Configure environment variables
- Install dependencies
- Start both servers
- Load sample data

### 📚 I Want Complete Documentation
→ Read **[README.md](./README.md)** (20 minutes)

Comprehensive guide covering:
- Project overview and architecture
- All features and how to use them
- Complete API documentation
- Troubleshooting guide

### 📁 I Need to Understand the File Structure
→ Read **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)**

Details about:
- Every directory and file
- What each component does
- Technology stack
- How everything connects

### 🏗️ I Want Technical Implementation Details
→ Read **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)**

Learn about:
- What was built
- How the system works
- Design decisions
- Future enhancements

### 🔌 I'm Integrating the API
→ Read **[backend/README.md](./backend/README.md)**

API reference with:
- All endpoints
- Request/response formats
- Error handling
- Testing examples

## What This System Does

### Upload Documents
Upload PDF, DOCX, or TXT files and the system automatically:
- Extracts text
- Breaks it into semantic chunks
- Generates embeddings
- Stores everything for search

### Search Documents
Type any query and get:
- Real-time results
- Ranked by relevance (0-100% match)
- Full snippet preview
- Document metadata

### Manage Documents
- View all uploaded documents
- Filter by project and tags
- Check processing status
- Delete documents

## 30-Second Setup

```bash
# Terminal 1: Start backend
cd backend
npm install
npm start

# Terminal 2: Start frontend (from project root)
npm install
npm run dev

# Open http://localhost:5173
```

That's it! You're running the system.

## Key Files & Directories

```
project/
├── src/                    # React frontend (components, pages, services)
├── backend/                # Express API server
├── dist/                   # Production build output
├── GETTING_STARTED.md      # → Start here! (easiest guide)
├── QUICKSTART.md           # Fast 5-minute setup
├── README.md               # Complete documentation
├── PROJECT_STRUCTURE.md    # File organization guide
└── IMPLEMENTATION_SUMMARY  # Technical deep-dive
```

## Features at a Glance

✨ **Upload**
- Drag & drop interface
- Support for PDF, DOCX, TXT
- Max 10MB per file
- Real-time progress

✨ **Search**
- Real-time semantic search
- Relevance scoring
- Project filtering
- Tag-based organization

✨ **Manage**
- View all documents
- Process status tracking
- Quick delete
- Bulk operations ready

## Technology Stack

**Frontend:** React 18 + TypeScript + Vite + Tailwind
**Backend:** Express.js + Node.js
**Database:** MongoDB
**Search:** Deterministic embeddings + cosine similarity

## What You Can Try Right Now

1. **Upload a document** → Go to Upload tab, select a file
2. **Search it** → Go to Search tab, type something
3. **Browse results** → Click on results to see previews
4. **Manage** → Go to Documents tab to see all files

## Troubleshooting Quick Links

| Problem | Solution |
|---------|----------|
| Won't start? | Check [QUICKSTART.md](./QUICKSTART.md#troubleshooting) |
| Port conflicts? | See "Port already in use" in docs |
| No search results? | Make sure documents finish processing (1-2 seconds) |
| Need examples? | Run `cd backend && npm run seed` to load sample data |

## Next Steps

1. **Get Started:** Read [GETTING_STARTED.md](./GETTING_STARTED.md)
2. **Run It:** Follow the setup instructions
3. **Explore:** Upload documents and search
4. **Learn More:** Read README.md for full documentation

## Scripts Available

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Check code style
npm run typecheck    # Check TypeScript

# Backend
cd backend && npm start    # Start server
npm run dev                # Start with auto-reload
npm run seed               # Load sample data
```

## Get Help

Everything you need is documented:
- **Quick questions?** → [GETTING_STARTED.md](./GETTING_STARTED.md)
- **How do I...?** → [README.md](./README.md)
- **Where is...?** → [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
- **How does it work?** → [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- **API endpoints?** → [backend/README.md](./backend/README.md)

## Ready?

Choose your guide above and let's get started!

The fastest path is [GETTING_STARTED.md](./GETTING_STARTED.md) → It'll have you running in 5 minutes.

---

**Questions?** Check the documentation files above.
**Ready to code?** All the source code is organized and ready to modify.
**Deploying?** See README.md for deployment instructions.

Happy searching! 🎉
