@echo off
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  start "" "Portfolio.html"
  exit /b
)
node scripts/open-portfolio.mjs
pause
