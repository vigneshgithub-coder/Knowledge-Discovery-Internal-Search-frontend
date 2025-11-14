# Knowledge Discovery & Internal Search System

A complete full-stack application for document management and semantic search. Upload PDF, DOCX, and TXT files, and search through them using intelligent semantic matching powered by deterministic embeddings.

## Project Overview

This system enables organizations to:
- Upload and organize documents by project and tags
- Extract and chunk text content from documents automatically
- Search across all documents using semantic similarity
- Preview matching content with relevance scores
- Manage documents and projects centrally

## Technology Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- React Router v6 (routing)
- Axios (HTTP client)
- Tailwind CSS (styling)
- Lucide React (icons)

**Backend:**
- Node.js + Express.js
- MongoDB (NoSQL database)
- Mongoose (MongoDB ODM)
- Multer (file uploads)
- pdf-parse (PDF text extraction)
- Mammoth (DOCX text extraction)

**Database:**
- MongoDB with Mongoose
- Vector storage for embeddings
- Indexed collections for fast queries

## Project Structure

```
project/
├── frontend (React app)
│   ├── src/
│   │   ├── pages/           # Page components
│   │   │   ├── UploadPage.tsx
│   │   │   ├── SearchPage.tsx
│   │   │   └── DocumentsPage.tsx
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Layout.tsx
│   │   ├── services/        # API integration
│   │   │   └── api.ts
│   │   ├── hooks/           # Custom React hooks
│   │   │   └── useDebounce.ts
│   │   ├── utils/           # Utility functions
│   │   │   ├── formatters.ts
│   │   │   └── validation.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── config/
│   │   └── mongodb.js        # MongoDB connection configuration
│   ├── models/              # MongoDB models
│   │   ├── Document.js
│   │   └── Chunk.js
│   ├── controllers/         # Route handlers
│   │   ├── uploadController.js
│   │   ├── searchController.js
│   │   └── documentController.js
│   ├── middleware/
│   │   ├── multerConfig.js  # File upload configuration
│   │   └── errorHandler.js  # Global error handler
│   ├── routes/              # API route definitions
│   │   ├── uploadRoutes.js
│   │   ├── searchRoutes.js
│   │   └── documentRoutes.js
│   ├── services/            # Business logic
│   │   ├── documentService.js
│   │   └── searchService.js
│   ├── utils/               # Utility functions
│   │   ├── errors.js        # Custom error classes
│   │   ├── embedding.js     # Embedding generation & similarity
│   │   ├── chunking.js      # Text chunking logic
│   │   └── fileExtraction.js # File text extraction
│   ├── uploads/             # Temporary file storage
│   ├── server.js            # Express app entry point
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── package.json (frontend)
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- MongoDB (local installation or MongoDB Atlas account)

### Setup Instructions

#### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB connection URI

# Start the backend server
npm start
```

The backend will run on `http://localhost:5000`

#### 2. Frontend Setup

```bash
# From project root directory
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Database Setup

MongoDB collections are automatically created when documents are inserted. The schema includes:

- `documents` collection - stores document metadata
- `chunks` collection - stores text chunks and embeddings
- Indexes on project_name, tags, and processed status for fast queries

## Features

### 1. Document Upload
- Upload PDF, DOCX, and TXT files (max 10MB per file)
- Organize by project name and tags
- Real-time upload progress display
- File validation and error handling

### 2. Text Processing Pipeline
- Automatic text extraction from documents
- Text normalization (removing extra whitespace, special characters)
- Semantic chunking into 300-600 word chunks with 50-word overlap
- Deterministic embedding generation for reproducible results

### 3. Semantic Search
- Debounced search input (300ms delay)
- Real-time search suggestions
- Filter results by project
- Display top 5 most relevant chunks
- Show similarity scores (0-100%)

### 4. Document Management
- List all uploaded documents
- View document metadata and status
- Filter documents by project
- Delete documents and associated chunks
- Track processing status

## Core Algorithms

### Deterministic Embedding Function

The embedding function uses SHA-256 hashing to create deterministic 384-dimensional vectors:

1. Hash the input text using SHA-256
2. Convert hash bytes to normalized values in range [-1, 1]
3. Generate 384-dimensional embedding vector

**Key Property:** Same input always produces same vector, enabling reproducible search.

### Semantic Chunking

Text is split intelligently into chunks:

1. Segment text by sentences (using `.!?` delimiters)
2. Group sentences into chunks of 300-600 words
3. Add 50-word overlap between consecutive chunks
4. Maintain context across chunk boundaries

### Cosine Similarity Search

1. Convert search query to embedding
2. Calculate cosine similarity against all chunk embeddings
3. Return top N results ranked by similarity score
4. Filter by project name if specified

## API Endpoints

All endpoints return JSON responses with the following format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "name": "ErrorType",
    "message": "Error description"
  }
}
```

### Upload Document
- **POST** `/api/upload`
- Accepts multipart form data
- Returns document metadata and chunk count

### Search
- **POST** `/api/search`
- Body: `{ "query": "string", "projectName": "string" }`
- Returns: Top 5 matching chunks with similarity scores

### List Documents
- **GET** `/api/documents?projectName=optional`
- Returns: Array of documents

### Get Projects
- **GET** `/api/documents/projects`
- Returns: Array of unique project names

### Delete Document
- **DELETE** `/api/documents/:id`
- Returns: Success message

### Get Document Chunks
- **GET** `/api/documents/:id/chunks`
- Returns: All chunks for a document

## Testing the System

### 1. Upload a Test Document

```bash
curl -X POST http://localhost:5000/api/upload \
  -F "file=@sample.pdf" \
  -F "projectName=TestProject" \
  -F "tags=test,sample"
```

### 2. Search Documents

Via UI: Go to `/search` and enter a query

Via API:
```bash
curl -X POST http://localhost:5000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "search term"}'
```

### 3. View Documents

Via UI: Go to `/documents` page

Via API:
```bash
curl http://localhost:5000/api/documents
```

## Error Handling

The system includes comprehensive error handling:

- **ValidationError** (400): Invalid input data
- **UnauthorizedError** (401): Authentication required
- **NotFoundError** (404): Resource not found
- **FileProcessingError** (422): File extraction/processing failed
- **DatabaseError** (500): Database operation failed

All errors include descriptive messages for debugging.

## Performance Considerations

- Search queries are debounced (300ms) to reduce server load
- Embeddings are cached in the database to avoid recalculation
- Indexes on frequently queried columns (project_name, tags, processed)
- Pagination ready for large result sets

## Security Features

- File type validation (PDF, DOCX, TXT only)
- File size limits (10MB max)
- Input sanitization on all endpoints
- CORS configuration for frontend requests
- Input validation and sanitization
- Error messages don't expose system internals

## Environment Variables

**Backend (.env):**
```
MONGODB_URI=mongodb://localhost:27017/knowledge-discovery
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/knowledge-discovery
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE=10485760
```

## Future Enhancements

- Replace placeholder embeddings with OpenAI embeddings
- Add multi-language support
- Implement document version history
- Add collaborative annotations
- Real-time document collaboration
- Advanced filtering (date range, file type)
- Bulk upload and batch processing
- Export search results
- User authentication and permissions
- Document OCR for scanned files

## Troubleshooting

**Backend won't start:**
- Check MongoDB connection URI in .env
- Ensure MongoDB is running (local) or connection string is correct (Atlas)
- Verify MongoDB is accessible from your network

**Upload fails:**
- Verify file is in supported format (PDF, DOCX, TXT)
- Check file size is under 10MB
- Ensure backend is running and accessible

**Search returns no results:**
- Verify documents are processed (check status in Documents page)
- Try more general search terms
- Ensure data exists in the database

**Port 5000 already in use:**
- Change PORT in backend .env
- Update API_BASE_URL in frontend api.ts

## License

MIT

## Support

For issues or questions, check the backend and frontend README files for additional information.
