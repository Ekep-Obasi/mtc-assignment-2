#!/bin/bash
# Setup and run the NSM application (macOS / Linux)

set -e

echo "=== Neighborhood Service Marketplace - Setup ==="
echo ""

# check node
if ! command -v node &> /dev/null; then
  echo "ERROR: Node.js is not installed. Install it from https://nodejs.org"
  exit 1
fi

# check mongodb
if ! command -v mongod &> /dev/null; then
  echo "WARNING: mongod not found locally."
  echo "Make sure MongoDB is running (local install, Docker, or Atlas URI in backend/.env)"
fi

echo "--- Installing backend dependencies ---"
cd backend
npm install
cd ..

echo ""
echo "--- Installing frontend dependencies ---"
cd frontend
npm install
cd ..

echo ""
echo "--- Setting up environment ---"
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "Created backend/.env from .env.example (edit if needed)"
else
  echo "backend/.env already exists"
fi

echo ""
echo "=== Starting servers ==="
echo "Backend:  http://localhost:3000"
echo "Frontend: http://localhost:4200"
echo ""

# start backend in background
cd backend
npm start &
BACKEND_PID=$!
cd ..

# start frontend
cd frontend
npx ng serve --port 4200 &
FRONTEND_PID=$!
cd ..

echo ""
echo "Press Ctrl+C to stop both servers"

# cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
