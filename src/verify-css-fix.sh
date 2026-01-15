#!/bin/bash

echo "🔍 Verifying CSS Fix..."
echo ""

# Check 1: postcss.config.js exists
if [ -f "postcss.config.js" ]; then
    echo "✅ postcss.config.js exists"
else
    echo "❌ postcss.config.js missing"
    exit 1
fi

# Check 2: globals.css has @import
if grep -q "@import \"tailwindcss\"" styles/globals.css; then
    echo "✅ globals.css has @import \"tailwindcss\""
else
    echo "❌ globals.css missing @import"
    exit 1
fi

# Check 3: package.json has @tailwindcss/postcss
if grep -q "@tailwindcss/postcss" package.json; then
    echo "✅ package.json has @tailwindcss/postcss"
else
    echo "❌ package.json missing @tailwindcss/postcss"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 All checks passed!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo ""
echo "1. Install dependencies:"
echo "   npm install --legacy-peer-deps"
echo ""
echo "2. Test locally (optional):"
echo "   npm run build && npm run preview"
echo ""
echo "3. Deploy to Vercel:"
echo "   git add . && git commit -m 'Fix CSS' && git push"
echo ""
