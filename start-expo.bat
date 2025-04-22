@echo off
echo =========================================
echo Fyke App - Expo Go Compatibility Launcher
echo =========================================
echo.
echo This script will start your app with settings 
echo optimized for Expo Go 2.32.19
echo.
echo Step 1: Clearing cache and node modules...
call npx kill-port 8081 8082
call npx kill-port 19000 19001
echo.

echo Step 2: Starting Expo server...
echo.
echo IMPORTANT: When the QR code appears, scan it with your Expo Go app.
echo.
echo Press Ctrl+C to stop the server at any time.
echo.
call npm run expo-go

echo Server closed. Goodbye! 