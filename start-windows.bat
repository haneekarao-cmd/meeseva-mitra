@echo off
setlocal
cd /d "%~dp0"
echo ==========================================
echo   MeeSeva Mitra - Local Development Start
echo ==========================================
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install Node.js 26 LTS/current and reopen this window.
  pause
  exit /b 1
)
node -v
if not exist node_modules (
  echo Installing project dependencies for the first time...
  call npm.cmd install
  if errorlevel 1 (
    echo Dependency installation failed. Check the error above.
    pause
    exit /b 1
  )
)
echo Starting frontend and backend. Keep this window open.
call npm.cmd run dev
