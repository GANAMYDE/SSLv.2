@echo off
SETLOCAL

:: Define the directory containing your HTML files and port
set "DIR=C:\Users\goreh\Downloads\September\documents\Sunday\Assignment2\INFO6150"
set "PORT=3000"

:: Navigate to the directory
cd /d "%DIR%"

:: Ensure Node.js is installed
where node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js manually.
    exit /b 1
)

:: Check if http-server is installed locally
if not exist "node_modules\.bin\http-server" (
    echo http-server not found in local node_modules. Installing http-server...
    npm install http-server --save-dev
)

:: Start the http-server using the local node_modules
start "" .\node_modules\.bin\http-server -p %PORT%

:: Wait for the server to start
timeout /t 5 /nobreak >nul

:: Open the updated HTML file in the default web browser
start "" http://localhost:3000/homepage.html 

ENDLOCAL
