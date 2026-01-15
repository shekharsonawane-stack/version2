#!/bin/bash

echo "🔍 Vercel JSR Error Diagnostic"
echo "========================================"
echo ""

echo "1️⃣ Checking if supabase is tracked by Git..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
GIT_FILES=$(git ls-files 2>/dev/null | grep "^supabase/" | wc -l)

if [ "$GIT_FILES" -gt 0 ]; then
    echo "❌ PROBLEM FOUND: $GIT_FILES files in supabase/ are tracked by Git"
    echo ""
    echo "Files being tracked:"
    git ls-files | grep "^supabase/" | head -10
    echo ""
    echo "This is why Vercel sees them!"
    echo ""
    echo "FIX: Run this command:"
    echo "  git rm -r --cached supabase/"
    echo "  git commit -m 'Remove server files'"
    echo "  git push"
else
    echo "✅ Good: No supabase files tracked by Git"
fi

echo ""
echo ""

echo "2️⃣ Checking if supabase folder exists locally..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -d "supabase" ]; then
    FILE_COUNT=$(find supabase -type f | wc -l)
    echo "✅ supabase folder exists ($FILE_COUNT files)"
    echo ""
    echo "Files in supabase/functions/server/:"
    ls -la supabase/functions/server/ 2>/dev/null || echo "  (directory not found)"
else
    echo "❌ supabase folder does NOT exist locally"
fi

echo ""
echo ""

echo "3️⃣ Checking .gitignore..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f ".gitignore" ]; then
    if grep -q "supabase" .gitignore; then
        echo "✅ .gitignore contains 'supabase'"
        echo "   $(grep supabase .gitignore)"
    else
        echo "❌ .gitignore does NOT contain 'supabase'"
        echo ""
        echo "FIX: Add this line to .gitignore:"
        echo "  supabase/"
    fi
else
    echo "❌ No .gitignore file found"
fi

echo ""
echo ""

echo "4️⃣ Checking .vercelignore..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f ".vercelignore" ]; then
    if grep -q "supabase" .vercelignore; then
        echo "✅ .vercelignore contains 'supabase'"
        echo "   $(grep supabase .vercelignore)"
    else
        echo "⚠️  .vercelignore does NOT contain 'supabase'"
    fi
else
    echo "⚠️  No .vercelignore file found"
fi

echo ""
echo ""

echo "5️⃣ Checking for package-lock.json..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f "package-lock.json" ]; then
    if grep -q "jsr" package-lock.json; then
        echo "❌ PROBLEM: package-lock.json contains JSR references"
        echo ""
        echo "FIX: Delete it:"
        echo "  rm package-lock.json"
    else
        echo "✅ package-lock.json exists but no JSR references"
    fi
else
    echo "✅ No package-lock.json (good for fresh install)"
fi

echo ""
echo ""

echo "6️⃣ Checking package.json..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f "package.json" ]; then
    if grep -q "jsr" package.json; then
        echo "❌ PROBLEM: package.json contains JSR references"
        grep "jsr" package.json
    else
        echo "✅ package.json has no JSR references"
    fi
else
    echo "❌ No package.json found!"
fi

echo ""
echo ""

echo "7️⃣ Checking for JSR imports in TypeScript files..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
JSR_IMPORTS=$(find . -name "*.tsx" -o -name "*.ts" | xargs grep -l "from \"jsr:" 2>/dev/null | grep -v node_modules || echo "")

if [ -n "$JSR_IMPORTS" ]; then
    echo "❌ PROBLEM: Found JSR imports in these files:"
    echo "$JSR_IMPORTS"
    echo ""
    echo "These files should NOT be deployed to Vercel!"
else
    echo "⚠️  No JSR imports found (might be in supabase folder)"
fi

echo ""
echo ""

echo "=========================================="
echo "📋 DIAGNOSIS SUMMARY"
echo "=========================================="
echo ""

# Determine the issue
if [ "$GIT_FILES" -gt 0 ]; then
    echo "🎯 ROOT CAUSE: supabase folder IS in Git repository"
    echo ""
    echo "SOLUTION 1 (Proper Fix):"
    echo "  git rm -r --cached supabase/"
    echo "  git commit -m 'Remove server files'"
    echo "  git push"
    echo ""
    echo "SOLUTION 2 (Nuclear Option):"
    echo "  Run: ./nuclear-deploy.sh"
    echo ""
elif [ -d "supabase" ] && [ "$GIT_FILES" -eq 0 ]; then
    echo "🎯 Status: supabase folder exists locally but NOT in Git"
    echo ""
    echo "If deploying via CLI: Use .vercelignore"
    echo "If deploying via Git: Already fixed!"
    echo ""
    echo "Try deploying now - it should work."
    echo ""
else
    echo "🤔 Cannot determine issue. Manual inspection needed."
    echo ""
    echo "Try the nuclear option:"
    echo "  ./nuclear-deploy.sh"
fi

echo "=========================================="
