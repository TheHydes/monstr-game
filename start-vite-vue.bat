@echo off
cd /d %~dp0

:: Open the folder in VS Code (if the 'code' command is available)
where code >nul 2>&1
if %errorlevel%==0 (
    echo VS Code is available, opening the project...
    start code "%~dp0"
) else (
    echo VS Code not found in PATH.
    echo Tip: In VS Code press Ctrl+Shift+P -> "Shell Command: Install 'code' command in PATH"
)

:: Start the Vite dev server in a separate window and log the output
start "Vite Dev Server" cmd /c "npm run dev > vite-dev.log 2>&1"

echo Waiting for the Vite server to start...

:waitloop
timeout /t 2 >nul

findstr /C:"Local:" vite-dev.log >nul
if %errorlevel%==0 (
    echo Server started, opening browser...
    start http://localhost:5173
    goto end
)

goto waitloop

:end
echo Done.
