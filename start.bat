@echo off
REM Setup and run the NSM application (Windows)

echo === Neighborhood Service Marketplace - Setup ===
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Install it from https://nodejs.org
    pause
    exit /b 1
)

echo --- Installing backend dependencies ---
cd backend
call npm install
cd ..

echo.
echo --- Installing frontend dependencies ---
cd frontend
call npm install
cd ..

echo.
echo --- Setting up environment ---
if not exist backend\.env (
    copy backend\.env.example backend\.env
    echo Created backend\.env from .env.example (edit if needed)
) else (
    echo backend\.env already exists
)

echo.
echo === Starting servers ===
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:4200
echo.

start "NSM Backend" cmd /c "cd backend && npm start"
start "NSM Frontend" cmd /c "cd frontend && npx ng serve --port 4200"

echo Both servers started in separate windows.
echo Close the server windows to stop them.
pause
