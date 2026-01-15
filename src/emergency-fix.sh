#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║       🚨 EMERGENCY FIX - BROKEN VERCEL DEPLOYMENT 🚨     ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC}  $1"
}

echo "This script will:"
echo "  1. Clean all build artifacts"
echo "  2. Reinstall dependencies with correct versions"
echo "  3. Verify @tailwindcss/postcss is installed"
echo "  4. Test build locally"
echo "  5. Commit and push to deploy"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_error "Aborted by user"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Cleaning build artifacts..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

rm -rf node_modules dist .vite package-lock.json
print_status "Cleaned: node_modules, dist, .vite, package-lock.json"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Installing dependencies..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    print_error "npm install failed!"
    exit 1
fi

print_status "Dependencies installed"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3: Verifying @tailwindcss/postcss..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if npm list @tailwindcss/postcss | grep -q "@tailwindcss/postcss@"; then
    VERSION=$(npm list @tailwindcss/postcss | grep "@tailwindcss/postcss@" | head -1)
    print_status "Found: $VERSION"
else
    print_error "@tailwindcss/postcss not found!"
    print_warning "Trying to install it explicitly..."
    npm install --save-dev @tailwindcss/postcss@4.0.0 --legacy-peer-deps
    
    if [ $? -ne 0 ]; then
        print_error "Failed to install @tailwindcss/postcss"
        exit 1
    fi
    print_status "Installed @tailwindcss/postcss@4.0.0"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4: Building project..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed!"
    echo ""
    echo "Common issues:"
    echo "  - Check for TypeScript errors"
    echo "  - Check for missing imports"
    echo "  - Check console output above for specific error"
    exit 1
fi

print_status "Build completed successfully"

# Check if dist folder exists and has files
if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
    FILE_COUNT=$(ls -1 dist | wc -l)
    print_status "dist/ folder created with $FILE_COUNT files"
else
    print_error "dist/ folder is empty or missing!"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 5: Testing build locally (optional)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
read -p "Test locally before deploying? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Starting preview server..."
    echo "Open http://localhost:4173 in your browser"
    echo "Press Ctrl+C when done testing"
    npm run preview
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 6: Deploying to Vercel..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
read -p "Ready to commit and push? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Skipping deployment. Run 'git add . && git commit -m \"Fix build\" && git push' manually when ready."
    exit 0
fi

# Check if there are changes to commit
if [[ -n $(git status -s) ]]; then
    git add .
    git commit -m "Fix: Rebuild with correct CSS processor configuration"
    git push
    
    if [ $? -ne 0 ]; then
        print_error "Git push failed!"
        echo "You may need to pull first: git pull --rebase origin main"
        exit 1
    fi
    
    print_status "Pushed to GitHub!"
else
    print_warning "No changes to commit"
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║                    ✅ DEPLOYMENT STARTED ✅               ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo ""
echo "  1. Go to: https://vercel.com"
echo "  2. Watch your deployment build"
echo "  3. Wait 1-2 minutes"
echo "  4. Visit: https://furniture-showcase-site-7.vercel.app/"
echo ""
echo "  Or test diagnostic pages:"
echo "    → https://furniture-showcase-site-7.vercel.app/test.html"
echo "    → https://furniture-showcase-site-7.vercel.app/diagnostic.html"
echo ""
print_status "Done! Your site should be fixed in ~2 minutes! 🚀"
echo ""
