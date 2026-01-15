#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║        🔧 FIX JSR ERROR & DEPLOY TO VERCEL 🔧             ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

echo "This script will fix the JSR package error:"
echo ""
echo "  Error: npm error 404 @jsr/supabase__supabase-js"
echo ""
echo "How it fixes it:"
echo "  1. ✅ .vercelignore already created (ignores supabase/ folder)"
echo "  2. ✅ .npmrc already created (legacy peer deps)"
echo "  3. ✅ .gitignore already created"
echo "  4. ✅ vite.config.ts updated (denies supabase files)"
echo "  5. ✅ Will commit and push all changes"
echo ""
read -p "Continue with deployment? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Cancelled. Run this when ready:"
    echo "  git add . && git commit -m 'Fix JSR error' && git push"
    exit 0
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Checking files..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f ".vercelignore" ]; then
    print_success ".vercelignore exists"
else
    print_error ".vercelignore missing!"
    exit 1
fi

if [ -f ".npmrc" ]; then
    print_success ".npmrc exists"
else
    print_error ".npmrc missing!"
    exit 1
fi

if [ -f "postcss.config.js" ]; then
    print_success "postcss.config.js exists"
else
    print_warning "postcss.config.js missing (might cause CSS issues)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Checking what will be committed..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

git status --short

if [[ -z $(git status -s) ]]; then
    print_warning "No changes to commit"
    echo "Everything is already committed. Just push:"
    echo "  git push"
    exit 0
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Committing changes..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

git add .

if [ $? -ne 0 ]; then
    print_error "git add failed!"
    exit 1
fi

git commit -m "Fix JSR error - add .vercelignore and update config

- Add .vercelignore to exclude supabase/ directory from build
- Add .npmrc for legacy peer deps
- Add .gitignore for standard files
- Update vite.config.ts to deny supabase files
- Update vercel.json with legacy peer deps install command
- Add postcss.config.js for Tailwind v4

This prevents npm from trying to install JSR packages from the
Deno server code during Vercel deployment."

if [ $? -ne 0 ]; then
    print_error "git commit failed!"
    exit 1
fi

print_success "Changes committed"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Pushing to GitHub..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

git push

if [ $? -ne 0 ]; then
    print_error "git push failed!"
    echo ""
    echo "You might need to pull first:"
    echo "  git pull --rebase origin main"
    echo "  git push"
    exit 1
fi

print_success "Pushed to GitHub!"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║              ✅ DEPLOYMENT STARTED! ✅                     ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "What's happening now:"
echo ""
echo "  1. ✅ Vercel received your push"
echo "  2. ⏳ Reading .vercelignore"
echo "  3. ⏳ Installing dependencies (will skip supabase/ folder)"
echo "  4. ⏳ Building your app"
echo "  5. ⏳ Deploying to production"
echo ""
echo "Expected timeline:"
echo "  📦 Dependency install: 30-60 seconds"
echo "  🔨 Build: 30-60 seconds"
echo "  🚀 Deploy: 10-20 seconds"
echo "  ⏱️  Total: ~2 minutes"
echo ""
print_success "Watch progress at: https://vercel.com/dashboard"
echo ""
echo "Test your site after deployment:"
echo "  Main site:     https://furniture-showcase-site-7.vercel.app/"
echo "  Simple test:   https://furniture-showcase-site-7.vercel.app/test.html"
echo "  Diagnostic:    https://furniture-showcase-site-7.vercel.app/diagnostic.html"
echo ""
print_success "Done! Check your site in ~2 minutes! 🎉"
echo ""
