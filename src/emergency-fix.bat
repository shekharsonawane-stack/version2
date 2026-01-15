@echo off
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║       🚨 EMERGENCY FIX - BROKEN VERCEL DEPLOYMENT 🚨     ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

echo This script will:
echo   1. Clean all build artifacts
echo   2. Reinstall dependencies with correct versions
echo   3. Verify @tailwindcss/postcss is installed
echo   4. Test build locally
echo   5. Commit and push to deploy
echo.
set /p continue="Continue? (y/n): "
if /i not "%continue%"=="y" (
    echo ❌ Aborted by user
    exit /b 1
)

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Step 1: Cleaning build artifacts...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if exist node_modules rmdir /s /q node_modules
if exist dist rmdir /s /q dist
if exist .vite rmdir /s /q .vite
if exist package-lock.json del /q package-lock.json

echo ✅ Cleaned: node_modules, dist, .vite, package-lock.json

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Step 2: Installing dependencies...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

call npm install --legacy-peer-deps

if errorlevel 1 (
    echo ❌ npm install failed!
    exit /b 1
)

echo ✅ Dependencies installed

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Step 3: Verifying @tailwindcss/postcss...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

call npm list @tailwindcss/postcss | findstr "@tailwindcss/postcss@" >nul
if errorlevel 1 (
    echo ⚠️  @tailwindcss/postcss not found!
    echo ⚠️  Trying to install it explicitly...
    call npm install --save-dev @tailwindcss/postcss@4.0.0 --legacy-peer-deps
    if errorlevel 1 (
        echo ❌ Failed to install @tailwindcss/postcss
        exit /b 1
    )
)

echo ✅ @tailwindcss/postcss is installed

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Step 4: Building project...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

call npm run build

if errorlevel 1 (
    echo ❌ Build failed!
    echo.
    echo Common issues:
    echo   - Check for TypeScript errors
    echo   - Check for missing imports
    echo   - Check console output above for specific error
    exit /b 1
)

echo ✅ Build completed successfully

if not exist dist (
    echo ❌ dist/ folder missing!
    exit /b 1
)

echo ✅ dist/ folder created

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Step 5: Testing build locally (optional)...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
set /p test="Test locally before deploying? (y/n): "
if /i "%test%"=="y" (
    echo ⚠️  Starting preview server...
    echo Open http://localhost:4173 in your browser
    echo Press Ctrl+C when done testing
    call npm run preview
)

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Step 6: Deploying to Vercel...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
set /p deploy="Ready to commit and push? (y/n): "
if /i not "%deploy%"=="y" (
    echo ⚠️  Skipping deployment. Run these commands manually when ready:
    echo    git add .
    echo    git commit -m "Fix build"
    echo    git push
    exit /b 0
)

git add .
git commit -m "Fix: Rebuild with correct CSS processor configuration"
git push

if errorlevel 1 (
    echo ❌ Git push failed!
    echo You may need to pull first: git pull --rebase origin main
    exit /b 1
)

echo ✅ Pushed to GitHub!

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║                    ✅ DEPLOYMENT STARTED ✅               ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo Next steps:
echo.
echo   1. Go to: https://vercel.com
echo   2. Watch your deployment build
echo   3. Wait 1-2 minutes
echo   4. Visit: https://furniture-showcase-site-7.vercel.app/
echo.
echo   Or test diagnostic pages:
echo     → https://furniture-showcase-site-7.vercel.app/test.html
echo     → https://furniture-showcase-site-7.vercel.app/diagnostic.html
echo.
echo ✅ Done! Your site should be fixed in ~2 minutes! 🚀
echo.
pause
