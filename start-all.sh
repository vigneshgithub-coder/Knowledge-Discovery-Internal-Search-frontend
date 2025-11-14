#!/bin/bash

echo "======================================"
echo "Starting Knowledge Discovery System"
echo "======================================"
echo ""

# Check if ports are available
echo "Checking port availability..."

# Check port 5000 (backend)
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠ Port 5000 is already in use"
    echo "  Either close the process or change PORT in backend/.env"
else
    echo "✓ Port 5000 is available"
fi

# Check port 5173 (frontend)
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠ Port 5173 is already in use"
    echo "  Vite will try the next available port"
else
    echo "✓ Port 5173 is available"
fi

echo ""
echo "Starting backend server..."
echo "Run this command in Terminal 1:"
echo "  cd backend && npm start"
echo ""
echo "Then in Terminal 2, run:"
echo "  npm run dev"
echo ""
echo "Or use this script with screen/tmux:"
echo "  screen -S backend bash -c 'cd backend && npm start'"
echo "  screen -S frontend bash -c 'npm run dev'"
echo ""

