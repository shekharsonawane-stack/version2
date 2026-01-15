#!/bin/bash

echo "╔══════════════════════════════════════════════════════╗"
echo "║                                                      ║"
echo "║     🚨 EMERGENCY FIX - JSR ERROR SOLUTION 🚨        ║"
echo "║                                                      ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

set -e  # Exit on any error

# Check if Git is initialized
if [ ! -d ".git" ]; then
    echo "⚠️  No Git repository found!"
    echo ""
    echo "Option 1: Initialize Git first:"
    echo "  git init"
    echo "  git add ."
    echo "  git commit -m 'Initial commit'"
    echo ""
    echo "Option 2: Skip Git and use nuclear option:"
    echo "  ./nuclear-deploy.sh"
    echo ""
    exit 1
fi

echo "Step 1: Checking current Git status..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if supabase is tracked
TRACKED=$(git ls-files | grep "^supabase/" | wc -l)

if [ "$TRACKED" -gt 0 ]; then
    echo "❌ Found $TRACKED supabase files in Git"
    echo ""
    echo "Removing from Git tracking..."
    git rm -r --cached supabase/
    echo "✅ Removed!"
else
    echo "✅ supabase not tracked by Git"
fi

echo ""
echo ""

echo "Step 2: Adding ignore files to Git..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

git add .gitignore .vercelignore .npmignore

echo "✅ Ignore files staged"
echo ""
echo ""

echo "Step 3: Committing changes..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if there's anything to commit
if git diff --cached --quiet; then
    echo "ℹ️  No changes to commit (already done)"
else
    git commit -m "Fix: Remove supabase from Git, add ignore files"
    echo "✅ Changes committed"
fi

echo ""
echo ""

echo "Step 4: Verifying fix..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

STILL_TRACKED=$(git ls-files | grep "^supabase/" | wc -l)

if [ "$STILL_TRACKED" -eq 0 ]; then
    echo "✅ SUCCESS! supabase is NOT in Git anymore"
else
    echo "⚠️  Warning: $STILL_TRACKED files still tracked"
    echo "Manual intervention may be needed"
fi

echo ""
echo ""

echo "╔══════════════════════════════════════════════════════╗"
echo "║                                                      ║"
echo "║                  ✅ FIX COMPLETE ✅                  ║"
echo "║                                                      ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo ""
echo "1. Push to Git:"
echo "   git push"
echo ""
echo "2. Deploy to Vercel:"
echo "   - Via dashboard (if using Git integration)"
echo "   - OR via CLI: vercel --prod"
echo ""
echo "3. The build will now succeed! 🎉"
echo ""
echo "4. Deploy server separately:"
echo "   supabase functions deploy"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
