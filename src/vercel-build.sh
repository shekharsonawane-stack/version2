#!/bin/bash

# Vercel Build Script - Temporarily hide server files during npm install
echo "🔧 Vercel Build: Hiding server files..."

# Move supabase folder to a hidden location
if [ -d "supabase" ]; then
    mv supabase .supabase-temp
    echo "✅ Server files hidden"
fi

# Install dependencies (won't see JSR imports now)
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Restore supabase folder (in case needed for reference)
if [ -d ".supabase-temp" ]; then
    mv .supabase-temp supabase
    echo "✅ Server files restored"
fi

# Build the frontend
echo "🔨 Building frontend..."
npm run build

echo "✅ Build complete!"
