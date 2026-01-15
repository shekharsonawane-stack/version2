#!/bin/bash

# ============================================
# NUCLEAR OPTION: Deploy Without Supabase Folder
# ============================================
# This script physically moves supabase folder out,
# deploys to Vercel, then restores it.

set -e  # Exit on error

echo "🚀 Nuclear Deploy to Vercel"
echo "======================================"
echo ""

# Step 1: Backup supabase folder
echo "📦 Step 1: Backing up supabase folder..."
if [ -d "supabase" ]; then
    if [ -d "../supabase-backup-temp" ]; then
        echo "⚠️  Removing old backup..."
        rm -rf ../supabase-backup-temp
    fi
    
    cp -r supabase ../supabase-backup-temp
    echo "✅ Backup created at: ../supabase-backup-temp"
else
    echo "ℹ️  No supabase folder found (already moved?)"
fi

echo ""

# Step 2: Remove supabase from project
echo "🗑️  Step 2: Removing supabase from project..."
if [ -d "supabase" ]; then
    rm -rf supabase
    echo "✅ supabase folder removed"
else
    echo "ℹ️  supabase folder already removed"
fi

echo ""

# Step 3: Clean npm cache
echo "🧹 Step 3: Cleaning npm cache..."
rm -rf node_modules package-lock.json .vercel
echo "✅ Cache cleaned"

echo ""

# Step 4: Test build locally
echo "🔨 Step 4: Testing build locally..."
npm install --legacy-peer-deps
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Local build successful!"
else
    echo "❌ Local build failed!"
    echo ""
    echo "Restoring supabase folder..."
    if [ -d "../supabase-backup-temp" ]; then
        cp -r ../supabase-backup-temp supabase
    fi
    exit 1
fi

echo ""

# Step 5: Deploy to Vercel
echo "🚀 Step 5: Deploying to Vercel..."
echo ""
echo "Choose deployment method:"
echo "  1) Deploy via Vercel CLI (vercel --prod)"
echo "  2) Commit to Git and push (if using Git integration)"
echo ""
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "Deploying via CLI..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Deployed to Vercel!"
    else
        echo ""
        echo "❌ Deployment failed"
    fi
elif [ "$choice" = "2" ]; then
    echo ""
    echo "Committing changes..."
    git add .
    git commit -m "Deploy without supabase folder"
    git push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Pushed to Git - Vercel will auto-deploy"
    else
        echo ""
        echo "❌ Git push failed"
    fi
else
    echo "Invalid choice"
fi

echo ""

# Step 6: Restore supabase folder
echo "♻️  Step 6: Restoring supabase folder..."
if [ -d "../supabase-backup-temp" ]; then
    cp -r ../supabase-backup-temp supabase
    rm -rf ../supabase-backup-temp
    echo "✅ supabase folder restored"
else
    echo "⚠️  No backup found - manually restore if needed"
fi

echo ""
echo "======================================"
echo "🎉 Deployment Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "  1. Check Vercel dashboard for deployment status"
echo "  2. Deploy server to Supabase: supabase functions deploy"
echo ""
echo "Your supabase folder has been restored locally."
echo ""
