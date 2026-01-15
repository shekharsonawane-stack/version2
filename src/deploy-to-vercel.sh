#!/bin/bash

# Vision Studio - Vercel Deployment Script
# This script helps deploy your app to Vercel with proper configuration

echo "🚀 Vision Studio - Vercel Deployment Helper"
echo "==========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Warning: Node.js version is $NODE_VERSION. Recommended: 18+"
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Step 1: Clean install
echo "📦 Step 1: Cleaning old dependencies..."
rm -rf node_modules package-lock.json
echo "✅ Cleaned"
echo ""

# Step 2: Install dependencies
echo "📦 Step 2: Installing dependencies..."
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
    echo "❌ Installation failed. Check the error above."
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Step 3: Test build locally
echo "🔨 Step 3: Testing build locally..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Check the error above."
    echo "   Common fixes:"
    echo "   - Check for TypeScript errors in components/"
    echo "   - Ensure no imports from supabase/functions/"
    echo "   - Run: npm run dev (to see errors)"
    exit 1
fi
echo "✅ Build successful! Output in dist/"
echo ""

# Step 4: Check Vercel CLI
echo "🔍 Step 4: Checking Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not found. Installing..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Vercel CLI."
        echo "   Try manually: npm install -g vercel"
        exit 1
    fi
fi
echo "✅ Vercel CLI ready: $(vercel --version)"
echo ""

# Step 5: Deploy
echo "🚀 Step 5: Deploying to Vercel..."
echo ""
echo "⚠️  IMPORTANT: You will need to set environment variables:"
echo "   - VITE_SUPABASE_URL"
echo "   - VITE_SUPABASE_ANON_KEY"
echo ""
echo "You can set them:"
echo "  Option 1: During deployment (Vercel will prompt)"
echo "  Option 2: In Vercel dashboard after deployment"
echo "  Option 3: Using: vercel env add VITE_SUPABASE_URL"
echo ""
read -p "Ready to deploy? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    vercel
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 Deployment initiated!"
        echo ""
        echo "📋 Next steps:"
        echo "  1. Go to your Vercel dashboard"
        echo "  2. Add environment variables (if not done yet)"
        echo "  3. Redeploy with: vercel --prod"
        echo ""
        echo "📖 Full guide: See VERCEL_DEPLOYMENT_GUIDE.md"
    else
        echo "❌ Deployment failed. Check error above."
    fi
else
    echo "❌ Deployment cancelled."
    echo ""
    echo "You can deploy manually later with: vercel"
fi

echo ""
echo "✅ Script complete!"
