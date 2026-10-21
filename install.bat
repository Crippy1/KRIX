@echo off
REM Herems_Plus Hub - installer (Windows)
cd /d "%~dp0"
echo Installing Herems_Plus Hub...
where node >nul 2>nul || (echo Node.js not found. Install Node 20+ from https://nodejs.org and try again. & pause & exit /b 1)
for /f "tokens=*" %%v in ('node -v') do echo Node %%v found
if not exist .env (copy .env.example .env >nul && echo Created .env from .env.example - edit it to set your admin email/password and secrets.)
if not exist data mkdir data
if not exist uploads mkdir uploads
echo Installing dependencies (one-time download)...
call npm ci --no-audit --no-fund || call npm install --no-audit --no-fund
echo Preparing the SQLite database...
call npm run migrate
echo.
echo Installation complete! Run start.bat, then open http://localhost:3000
pause
