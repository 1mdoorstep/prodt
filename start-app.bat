@echo off
echo Starting Fyke App...
echo.
echo This script will help you run the app with the correct configuration.
echo.

echo Step 1: Checking your IP address...
ipconfig | findstr /i "IPv4"
echo.
echo Please note your IP address from the list above.
echo.

echo Step 2: Updating mobile-bridge.ts with your IP...
echo Please edit app/mobile-bridge.ts and replace 'localhost' with your IP address if needed.
echo.

echo Step 3: Starting the app...
echo.
echo Running: npm start
echo.
echo When the QR code appears, scan it with your Expo Go app.
echo.

npm start