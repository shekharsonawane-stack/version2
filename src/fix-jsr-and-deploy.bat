@echo off
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║        🔧 FIX JSR ERROR ^& DEPLOY TO VERCEL 🔧             ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo This script will fix the JSR package error:
echo.
echo   Error: npm error 404 @jsr/supabase__supabase-js
echo.
echo How it fixes it:
echo   1. ✅ .vercelignore already created (ignores supabase/ folder)
echo   2. ✅ .npmrc already created (legacy peer deps)
echo   3. ✅ .gitignore already created
echo   4. ✅ vite.config.ts updated (denies supabase files)
echo   5. ✅ Will commit and push all changes
echo.
set /p continue="Continue with deployment? (y/n): "
if /i not "%continue%"=="y" (
    echo ⚠️  Cancelled. Run this when ready:
    echo   git add . ^&^& git commit -m "Fix JSR error" ^&^& git push
    exit /b 0
)

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Checking files...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if exist .vercelignore (
    echo ✅ .vercelignore exists
) else (
    echo ❌ .vercelignore missing!
    exit /b 1
)

if exist .npmrc (
    echo ✅ .npmrc exists
) else (
    echo ❌ .npmrc missing!
    exit /b 1
)

if exist postcss.config.js (
    echo ✅ postcss.config.js exists
) else (
    echo ⚠️  postcss.config.js missing (might cause CSS issues)
)

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Checking what will be committed...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

git status --short

git status --short | findstr /r "." >nul
if errorlevel 1 (
    echo ⚠️  No changes to commit
    echo Everything is already committed. Just push:
    echo   git push
    exit /b 0
)

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Committing changes...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

git add .

if errorlevel 1 (
    echo ❌ git add failed!
    exit /b 1
)

git commit -m "Fix JSR error - add .vercelignore and update config" -m "- Add .vercelignore to exclude supabase/ directory from build" -m "- Add .npmrc for legacy peer deps" -m "- Add .gitignore for standard files" -m "- Update vite.config.ts to deny supabase files" -m "- Update vercel.json with legacy peer deps install command" -m "- Add postcss.config.js for Tailwind v4" -m "" -m "This prevents npm from trying to install JSR packages from the" -m "Deno server code during Vercel deployment."

if errorlevel 1 (
    echo ❌ git commit failed!
    exit /b 1
)

echo ✅ Changes committed

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Pushing to GitHub...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

git push

if errorlevel 1 (
    echo ❌ git push failed!
    echo.
    echo You might need to pull first:
    echo   git pull --rebase origin main
    echo   git push
    exit /b 1
)

echo ✅ Pushed to GitHub!

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║              ✅ DEPLOYMENT STARTED! ✅                     ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo What's happening now:
echo.
echo   1. ✅ Vercel received your push
echo   2. ⏳ Reading .vercelignore
echo   3. ⏳ Installing dependencies (will skip supabase/ folder)
echo   4. ⏳ Building your app
echo   5. ⏳ Deploying to production
echo.
echo Expected timeline:
echo   📦 Dependency install: 30-60 seconds
echo   🔨 Build: 30-60 seconds
echo   🚀 Deploy: 10-20 seconds
echo   ⏱️  Total: ~2 minutes
echo.
echo ✅ Watch progress at: https://vercel.com/dashboard
echo.
echo Test your site after deployment:
echo   Main site:     https://furniture-showcase-site-7.vercel.app/
echo   Simple test:   https://furniture-showcase-site-7.vercel.app/test.html
echo   Diagnostic:    https://furniture-showcase-site-7.vercel.app/diagnostic.html
echo.
echo ✅ Done! Check your site in ~2 minutes! 🎉
echo.
pause
