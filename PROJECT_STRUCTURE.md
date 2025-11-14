# Complete Project Structure

## Root Directory
```
project/
├── backend/                          # Express.js API server
│   ├── config/
│   │   └── mongodb.js                # MongoDB connection configuration
│   ├── models/                      # MongoDB models
│   │   ├── Document.js
│   │   └── Chunk.js
│   ├── controllers/                  # Route handlers
│   │   ├── uploadController.js
│   │   ├── searchController.js
│   │   └── documentController.js
│   ├── middleware/
│   │   ├── multerConfig.js          # File upload configuration
│   │   └── errorHandler.js          # Global error handling
│   ├── routes/
│   │   ├── uploadRoutes.js
│   │   ├── searchRoutes.js
│   │   └── documentRoutes.js
│   ├── services/                     # Business logic
│   │   ├── documentService.js       # Document CRUD & processing
│   │   └── searchService.js         # Search & similarity logic
│   ├── utils/                        # Utility functions
│   │   ├── errors.js                # Custom error classes
│   │   ├── embedding.js             # Deterministic embedding & cosine similarity
│   │   ├── chunking.js              # Text normalization & chunking
│   │   ├── fileExtraction.js        # PDF/DOCX/TXT extraction
│   │   └── seedData.js              # Sample data seeding
│   ├── uploads/                      # Temporary file storage
│   ├── server.js                     # Express app entry point
│   ├── package.json                  # Backend dependencies
│   ├── .env                          # Backend configuration
│   ├── .env.example                  # Backend config template
│   ├── .gitignore                    # Git ignore rules
│   ├── README.md                     # Backend documentation
│   └── [17 source files total]
│
├── src/                              # React frontend
│   ├── pages/                        # Page components
│   │   ├── UploadPage.tsx           # Document upload interface
│   │   ├── SearchPage.tsx           # Semantic search interface
│   │   └── DocumentsPage.tsx        # Document management
│   ├── components/                   # Reusable UI components
│   │   ├── Button.tsx               # Button component
│   │   ├── Input.tsx                # Input component with validation
│   │   ├── Modal.tsx                # Modal dialog component
│   │   ├── Toast.tsx                # Toast notification system
│   │   └── Layout.tsx               # Main layout with navigation
│   ├── services/
│   │   └── api.ts                   # API client with Axios
│   ├── hooks/
│   │   └── useDebounce.ts           # Debounce hook
│   ├── utils/
│   │   ├── formatters.ts            # Text formatting utilities
│   │   └── validation.ts            # Input validation logic
│   ├── App.tsx                       # Main app with routing
│   ├── main.tsx                      # React entry point
│   ├── index.css                     # Global styles & Tailwind
│   ├── vite-env.d.ts                # Vite type definitions
│   └── [14 source files total]
│
├── dist/                             # Production build output
│   ├── index.html
│   └── assets/
│       ├── index-*.css
│       └── index-*.js
│
├── node_modules/                     # Frontend dependencies (gitignored)
├── package.json                      # Frontend configuration
├── package-lock.json                 # Dependency lock file
├── tsconfig.json                     # TypeScript configuration
├── tsconfig.app.json                 # App TypeScript config
├── tsconfig.node.json                # Node TypeScript config
├── vite.config.ts                    # Vite configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── postcss.config.js                 # PostCSS configuration
├── eslint.config.js                  # ESLint configuration
├── index.html                        # HTML entry point
│
├── .env                              # Frontend environment variables
├── .gitignore                        # Git ignore rules
│
├── Documentation/
│   ├── README.md                     # Comprehensive project documentation
│   ├── QUICKSTART.md                 # Quick start setup guide
│   ├── IMPLEMENTATION_SUMMARY.md     # Implementation details & summary
│   ├── PROJECT_STRUCTURE.md          # This file
│   └── backend/README.md             # Backend API documentation
│
├── Scripts/
│   ├── verify-setup.sh               # Setup verification script
│   └── start-all.sh                  # Server startup helper
│
└── [31 total source files]
```

## Technology Stack by Directory

### Backend (Node.js/Express)
- **Framework:** Express.js 4.18
- **Database:** MongoDB with Mongoose
- **File Upload:** Multer 1.4
- **Text Extraction:** pdf-parse, Mammoth
- **HTTP Client:** Axios
- **Development:** Nodemon
- **Environment:** Node.js with ES6 modules

### Frontend (React/TypeScript)
- **Framework:** React 18.3
- **Build Tool:** Vite 5.4
- **Routing:** React Router v6
- **Styling:** Tailwind CSS 3.4
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Language:** TypeScript 5.5
- **Linting:** ESLint 9.9

### Database (MongoDB)
- **Collections:** documents, chunks
- **Indexes:** project_name, tags, processed, document_id
- **ODM:** Mongoose for schema validation
- **Vectors:** Number arrays for embeddings

## Key Features by Location

### Upload Flow
1. **Frontend:** `src/pages/UploadPage.tsx` - UI form
2. **API Call:** `src/services/api.ts` - POST /api/upload
3. **Backend:** `backend/routes/uploadRoutes.js` - Route handler
4. **Controller:** `backend/controllers/uploadController.js` - Validation & processing
5. **Services:** `backend/services/documentService.js` - Database operations
6. **Utilities:** `backend/utils/fileExtraction.js` - Text extraction

### Search Flow
1. **Frontend:** `src/pages/SearchPage.tsx` - Search UI with debouncing
2. **API Call:** `src/services/api.ts` - POST /api/search
3. **Backend:** `backend/routes/searchRoutes.js` - Route handler
4. **Controller:** `backend/controllers/searchController.js` - Query handling
5. **Services:** `backend/services/searchService.js` - Similarity calculation
6. **Utilities:** `backend/utils/embedding.js` - Embedding & similarity logic

### Document Management
1. **Frontend:** `src/pages/DocumentsPage.tsx` - Document list UI
2. **API Calls:** `src/services/api.ts` - GET/DELETE endpoints
3. **Backend:** `backend/routes/documentRoutes.js` - Routes
4. **Controller:** `backend/controllers/documentController.js` - CRUD operations
5. **Services:** `backend/services/documentService.js` - Database queries

## File Statistics

### Backend Files: 17
- Controllers: 3
- Routes: 3
- Services: 2
- Middleware: 2
- Utils: 5
- Config: 1
- Server: 1

### Frontend Files: 14
- Pages: 3
- Components: 5
- Services: 1
- Hooks: 1
- Utils: 2
- Config files: 2

### Configuration Files: 8
- package.json files: 2
- Environment files: 2 (.env, .env.example)
- TypeScript configs: 3
- Build configs: 1 (vite, tailwind, eslint, postcss)

### Documentation: 4
- README.md (main)
- QUICKSTART.md
- backend/README.md
- IMPLEMENTATION_SUMMARY.md

## Database Schema

### Documents Table
- `id` (uuid, primary key)
- `filename` (text)
- `project_name` (text) - Indexed
- `tags` (text array) - Indexed with GIN
- `file_size` (integer)
- `upload_date` (timestamptz)
- `processed` (boolean) - Indexed
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### Chunks Table
- `id` (uuid, primary key)
- `document_id` (uuid, FK to documents) - Indexed
- `chunk_index` (integer)
- `content` (text)
- `embedding` (float8 array)
- `token_count` (integer)
- `created_at` (timestamptz)

## API Endpoints

### Upload
- POST `/api/upload` - Upload document (multipart/form-data)

### Search
- POST `/api/search` - Search documents
- GET `/api/search/suggestions` - Get search suggestions

### Documents
- GET `/api/documents` - List documents
- GET `/api/documents/projects` - Get project names
- GET `/api/documents/:id/chunks` - Get document chunks
- DELETE `/api/documents/:id` - Delete document

### Health
- GET `/api/health` - Health check

## Dependencies Summary

### Frontend (package.json)
- react, react-dom, react-router-dom
- axios, lucide-react
- @supabase/supabase-js
- tailwindcss, vite
- typescript, eslint

### Backend (backend/package.json)
- express, cors
- multer, pdf-parse, mammoth
- @supabase/supabase-js
- dotenv, nodemon
- axios

## Setup Requirements

1. **Node.js 16+** - Runtime environment
2. **npm 8+** - Package manager
3. **Supabase Account** - PostgreSQL database
4. **Internet Connection** - For Supabase connectivity

## Build Artifacts

### Production Build
- Location: `dist/`
- Files:
  - `index.html` - Main HTML file
  - `assets/index-*.css` - Compiled styles
  - `assets/index-*.js` - Minified JavaScript
- Size: ~300KB gzipped

## Running the Project

### Development
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
npm install
npm run dev
```

### Production
```bash
npm run build
cd backend && npm start
# Serve dist/ folder with static web server
```

### With Sample Data
```bash
cd backend
npm run seed
```

## Environment Configuration

### Backend (.env)
- `SUPABASE_URL` - Database connection
- `SUPABASE_SERVICE_ROLE_KEY` - Admin API key
- `SUPABASE_ANON_KEY` - Public API key
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MAX_FILE_SIZE` - Upload limit (default: 10MB)

### Frontend (.env)
- `VITE_SUPABASE_URL` - Database connection
- `VITE_SUPABASE_ANON_KEY` - Public API key

## Code Statistics

- **Total Source Lines:** ~3,500+
- **Backend Lines:** ~1,800
- **Frontend Lines:** ~1,700
- **Languages:** JavaScript, TypeScript, CSS

## Performance Metrics

- **Search Debounce:** 300ms
- **Max File Size:** 10MB
- **Chunk Size:** 300-600 words
- **Chunk Overlap:** 50 words
- **Top Results:** 5 per search
- **Embedding Dimension:** 384

## Security Features

- File type validation
- File size limits
- Input sanitization
- CORS configuration
- Row Level Security
- Error message sanitization
- Environment variable protection

---

This structure provides a clean, scalable, and maintainable architecture for the Knowledge Discovery & Internal Search System.
