#!/bin/bash

echo "======================================"
echo "Knowledge Discovery System Setup Verification"
echo "======================================"
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "  Node.js version: $NODE_VERSION"
else
    echo "  ✗ Node.js not found. Please install Node.js 16+"
    exit 1
fi

# Check npm
echo ""
echo "✓ Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "  npm version: $NPM_VERSION"
else
    echo "  ✗ npm not found"
    exit 1
fi

# Check frontend dependencies
echo ""
echo "✓ Checking frontend dependencies..."
if [ -d "node_modules" ]; then
    echo "  Frontend node_modules exists"
else
    echo "  ✗ Frontend node_modules not found. Run: npm install"
    exit 1
fi

# Check backend dependencies
echo ""
echo "✓ Checking backend dependencies..."
if [ -d "backend/node_modules" ]; then
    echo "  Backend node_modules exists"
else
    echo "  ✗ Backend node_modules not found. Run: cd backend && npm install"
    exit 1
fi

# Check frontend configuration
echo ""
echo "✓ Checking frontend configuration..."
if [ -f ".env" ]; then
    echo "  Frontend .env file exists"
else
    echo "  ⚠ Frontend .env file not found"
fi

# Check backend configuration
echo ""
echo "✓ Checking backend configuration..."
if [ -f "backend/.env" ]; then
    echo "  Backend .env file exists"
else
    echo "  ⚠ Backend .env file not found. Run: cd backend && cp .env.example .env"
fi

# Check source files
echo ""
echo "✓ Checking source files..."
BACKEND_FILES=$(find backend -name "*.js" -type f | wc -l)
FRONTEND_FILES=$(find src -name "*.tsx" -o -name "*.ts" | wc -l)
echo "  Backend files: $BACKEND_FILES"
echo "  Frontend files: $FRONTEND_FILES"

# Check build
echo ""
echo "✓ Checking production build..."
if [ -d "dist" ]; then
    echo "  Production build exists"
else
    echo "  ⚠ Production build not found. Run: npm run build"
fi

echo ""
echo "======================================"
echo "✅ Setup verification complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Ensure backend/.env has Supabase credentials"
echo "2. Start backend: cd backend && npm start"
echo "3. Start frontend: npm run dev"
echo "4. Open http://localhost:5173 in your browser"
echo ""
