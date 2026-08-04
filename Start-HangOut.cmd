@echo off
setlocal
title HangOut Client Demo
color 0B

cd /d "%~dp0web"

echo.
echo  ========================================
echo           HANGOUT CLIENT DEMO
echo  ========================================
echo.

where node.exe >nul 2>nul
if errorlevel 1 (
  color 0C
  echo  Node.js is not installed on this computer.
  echo  Install Node.js from https://nodejs.org and try again.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\vite\bin\vite.js" (
  echo  Preparing HangOut for first use...
  echo  An internet connection may be required.
  call npm.cmd install
  if errorlevel 1 (
    color 0C
    echo.
    echo  Setup failed. Check the internet connection and try again.
    pause
    exit /b 1
  )
)

echo  Starting HangOut...
echo  The app will open automatically in your browser.
echo.
echo  Keep this window open during the presentation.
echo  Press Ctrl+C here when the presentation is finished.
echo.

start "" powershell.exe -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 3; Start-Process 'http://127.0.0.1:5173/demo'"
call npm.cmd run dev -- --host 127.0.0.1

echo.
echo  HangOut has stopped.
pause
endlocal
