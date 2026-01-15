#!/bin/bash

echo "🔧 Fixing Vercel Deployment - Removing Server Files from Git"
echo "=============================================================="
echo ""

# Step 1: Show what files Git is tracking in supabase
echo "📋 Step 1: Checking if supabase/ is tracked by Git..."
SUPABASE_FILES=$(git ls-files | grep "^supabase/" | wc -l)

if [ "$SUPABASE_FILES" -gt 0 ]; then
    echo "⚠️  Found $SUPABASE_FILES files in supabase/ tracked by Git"
    echo ""
    echo "These files are causing the npm error!"
    echo ""
    
    # Step 2: Remove from Git tracking
    echo "📋 Step 2: Removing supabase/ from Git tracking..."
    git rm -r --cached supabase/
    
    if [ $? -eq 0 ]; then
        echo "✅ Removed from Git tracking"
    else
        echo "❌ Failed to remove. Run manually:"
        echo "   git rm -r --cached supabase/"
        exit 1
    fi
else
    echo "✅ supabase/ is NOT tracked by Git (good!)"
fi

echo ""

# Step 3: Commit the change
echo "📋 Step 3: Committing .gitignore changes..."
git add .gitignore .npmignore .vercelignore

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "ℹ️  No changes to commit (already done)"
else
    git commit -m "Remove server files from Git - fix Vercel JSR error"
    
    if [ $? -eq 0 ]; then
        echo "✅ Changes committed"
    else
        echo "❌ Commit failed"
        exit 1
    fi
fi

echo ""

# Step 4: Show status
echo "📋 Step 4: Verifying..."
SUPABASE_AFTER=$(git ls-files | grep "^supabase/" | wc -l)

if [ "$SUPABASE_AFTER" -eq 0 ]; then
    echo "✅ SUCCESS! supabase/ is no longer in Git"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Push to Git: git push"
    echo "   2. Deploy to Vercel (via dashboard or CLI)"
    echo "   3. Deploy server separately: supabase functions deploy"
    echo ""
    echo "The build will now succeed! 🎉"
else
    echo "⚠️  Warning: $SUPABASE_AFTER files still in supabase/"
    echo "Run: git ls-files | grep supabase"
fi

echo ""
echo "✅ Script complete!"
