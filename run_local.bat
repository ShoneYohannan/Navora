@echo off
title Navora Travel Planner Launcher

echo ===================================================
echo   Navora Travel Planner - Local Launcher
echo ===================================================
echo.

:: Start backend FastAPI server
echo [1/2] Launching Backend Server on port 8000...
start "Navora Backend" cmd /c "cd backend && venv\Scripts\activate.bat && python -m uvicorn main:app --reload --port 8000"

:: Start frontend Vite server
echo [2/2] Launching Frontend Development Server...
start "Navora Frontend" cmd /c "cd frontend && npm run dev"

echo.
echo ===================================================
echo   Navora Backend and Frontend are launching!
echo   Close the separate command windows to stop them.
echo ===================================================
pause
