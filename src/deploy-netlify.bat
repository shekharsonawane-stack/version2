@echo off
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║           🚀 DEPLOY TO NETLIFY - QUICK START 🚀           ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo This script will help you deploy to Netlify!
echo.

REM Check if netlify.toml exists
if exist netlify.toml (
    echo ✅ netlify.toml found
) else (
    echo ⚠️  netlify.toml missing! Creating it now...
    (
        echo [build]
        echo   command = "npm run build"
        echo   publish = "dist"
        echo   ignore = "supabase/"
        echo.
        echo [build.environment]
        echo   NODE_VERSION = "18"
        echo   NPM_FLAGS = "--legacy-peer-deps"
        echo.
        echo [[redirects]]
        echo   from = "/*"
        echo   to = "/index.html"
        echo   status = 200
        echo.
        echo [[headers]]
        echo   for = "/assets/*"
        echo   [headers.values]
        echo     Cache-Control = "public, max-age=31536000, immutable"
    ) > netlify.toml
    echo ✅ Created netlify.toml
)

REM Check .npmrc
if exist .npmrc (
    echo ✅ .npmrc found
) else (
    echo ⚠️  .npmrc missing! Make sure you created it.
)

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Choose deployment method:
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo   1. Deploy via GitHub (Recommended)
echo      - Push to GitHub
echo      - Connect on Netlify website
echo      - Auto-deploy on every push
echo.
echo   2. Deploy via Netlify CLI
echo      - Deploy directly from command line
echo.
set /p choice="Choose option (1 or 2): "

if "%choice%"=="1" goto github_deploy
if "%choice%"=="2" goto cli_deploy

echo ❌ Invalid option
goto end

:github_deploy
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Option 1: Deploy via GitHub
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

echo ℹ️  Step 1: Committing files...
git add .
git commit -m "Add Netlify configuration for deployment"

if errorlevel 1 (
    echo ⚠️  Nothing to commit or commit failed
)

echo.
echo ℹ️  Step 2: Pushing to GitHub...
git push

if errorlevel 1 (
    echo ❌ Git push failed. You might need to pull first:
    echo   git pull --rebase origin main
    echo   git push
    goto end
)

echo ✅ Pushed to GitHub!

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Step 3: Connect to Netlify
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo Now do this:
echo.
echo   1. Go to: https://app.netlify.com/
echo   2. Click 'Add new site' → 'Import an existing project'
echo   3. Choose 'GitHub'
echo   4. Find your repository and click on it
echo   5. Netlify will auto-detect settings from netlify.toml
echo   6. Add environment variables:
echo      - VITE_SUPABASE_URL (your Supabase URL)
echo      - VITE_SUPABASE_ANON_KEY (your Supabase anon key)
echo   7. Click 'Deploy site'
echo.
echo ✅ Your code is ready on GitHub!
echo.
pause
start https://app.netlify.com/
goto success

:cli_deploy
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Option 2: Deploy via Netlify CLI
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Check if netlify CLI is installed
where netlify >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Netlify CLI not found. Installing...
    call npm install -g netlify-cli
    
    if errorlevel 1 (
        echo ❌ Failed to install. Try manually:
        echo   npm install -g netlify-cli
        goto end
    )
    
    echo ✅ Netlify CLI installed
) else (
    echo ✅ Netlify CLI found
)

echo.
echo ℹ️  Step 1: Login to Netlify...
call netlify login

echo.
echo ℹ️  Step 2: Building project...
call npm run build

if errorlevel 1 (
    echo ❌ Build failed! Check errors above.
    goto end
)

echo ✅ Build completed

echo.
echo ℹ️  Step 3: Deploying to Netlify...
echo.
echo Choose what to do:
echo   a) Initialize new site (first time)
echo   b) Deploy to existing site
echo.
set /p deploy_choice="Choose (a/b): "

if "%deploy_choice%"=="a" (
    call netlify init
) else if "%deploy_choice%"=="b" (
    call netlify deploy --prod
) else (
    echo ❌ Invalid choice
    goto end
)

echo ✅ Deployment complete!
goto success

:success
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║                  ✅ DEPLOYMENT STARTED! ✅                ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo ✅ Your site will be live in ~2-3 minutes!
echo.
echo After deployment, your site will be at:
echo   https://your-site-name.netlify.app
echo.
echo Test diagnostic pages:
echo   https://your-site-name.netlify.app/test.html
echo   https://your-site-name.netlify.app/diagnostic.html
echo.
echo ✅ Done! 🚀
echo.

:end
pause
