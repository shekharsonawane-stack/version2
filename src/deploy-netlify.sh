#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║           🚀 DEPLOY TO NETLIFY - QUICK START 🚀           ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }

echo "This script will help you deploy to Netlify!"
echo ""

# Check if netlify.toml exists
if [ -f "netlify.toml" ]; then
    print_success "netlify.toml found"
else
    print_warning "netlify.toml missing! Creating it now..."
    # Create netlify.toml if missing
    cat > netlify.toml << 'EOF'
[build]
  command = "npm run build"
  publish = "dist"
  ignore = "supabase/"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--legacy-peer-deps"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
EOF
    print_success "Created netlify.toml"
fi

# Check if .npmrc exists
if [ -f ".npmrc" ]; then
    print_success ".npmrc found"
else
    print_warning ".npmrc missing! You mentioned you edited it manually."
    echo "Make sure it contains: legacy-peer-deps=true"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Choose deployment method:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  1. Deploy via GitHub (Recommended)"
echo "     - Push to GitHub"
echo "     - Connect on Netlify website"
echo "     - Auto-deploy on every push"
echo ""
echo "  2. Deploy via Netlify CLI"
echo "     - Deploy directly from command line"
echo "     - No GitHub needed"
echo ""
read -p "Choose option (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Option 1: Deploy via GitHub"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    print_info "Step 1: Committing files..."
    git add .
    git commit -m "Add Netlify configuration for deployment"
    
    if [ $? -ne 0 ]; then
        print_warning "Nothing to commit (files already committed)"
    else
        print_success "Files committed"
    fi
    
    echo ""
    print_info "Step 2: Pushing to GitHub..."
    git push
    
    if [ $? -ne 0 ]; then
        print_warning "Git push failed. You might need to pull first:"
        echo "  git pull --rebase origin main"
        echo "  git push"
        exit 1
    fi
    
    print_success "Pushed to GitHub!"
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Step 3: Connect to Netlify"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Now do this:"
    echo ""
    echo "  1. Go to: https://app.netlify.com/"
    echo "  2. Click 'Add new site' → 'Import an existing project'"
    echo "  3. Choose 'GitHub'"
    echo "  4. Find your repository and click on it"
    echo "  5. Netlify will auto-detect settings from netlify.toml"
    echo "  6. Add environment variables:"
    echo "     - VITE_SUPABASE_URL (your Supabase URL)"
    echo "     - VITE_SUPABASE_ANON_KEY (your Supabase anon key)"
    echo "  7. Click 'Deploy site'"
    echo ""
    print_success "Your code is ready on GitHub!"
    echo ""
    read -p "Press Enter to open Netlify in your browser..." 
    
    # Try to open browser
    if command -v open &> /dev/null; then
        open "https://app.netlify.com/"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://app.netlify.com/"
    else
        echo "Visit: https://app.netlify.com/"
    fi
    
elif [ "$choice" = "2" ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Option 2: Deploy via Netlify CLI"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Check if netlify CLI is installed
    if ! command -v netlify &> /dev/null; then
        print_warning "Netlify CLI not found. Installing..."
        npm install -g netlify-cli
        
        if [ $? -ne 0 ]; then
            print_warning "Failed to install. Try manually:"
            echo "  npm install -g netlify-cli"
            exit 1
        fi
        
        print_success "Netlify CLI installed"
    else
        print_success "Netlify CLI found"
    fi
    
    echo ""
    print_info "Step 1: Login to Netlify..."
    netlify login
    
    echo ""
    print_info "Step 2: Building project..."
    npm run build
    
    if [ $? -ne 0 ]; then
        print_warning "Build failed! Check errors above."
        exit 1
    fi
    
    print_success "Build completed"
    
    echo ""
    print_info "Step 3: Deploying to Netlify..."
    echo ""
    echo "Choose what to do:"
    echo "  a) Initialize new site (first time)"
    echo "  b) Deploy to existing site"
    echo ""
    read -p "Choose (a/b): " deploy_choice
    
    if [ "$deploy_choice" = "a" ]; then
        netlify init
    elif [ "$deploy_choice" = "b" ]; then
        netlify deploy --prod
    else
        print_warning "Invalid choice"
        exit 1
    fi
    
    print_success "Deployment complete!"
    
else
    print_warning "Invalid option selected"
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║                  ✅ DEPLOYMENT STARTED! ✅                ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
print_success "Your site will be live in ~2-3 minutes!"
echo ""
echo "After deployment, your site will be at:"
echo "  https://your-site-name.netlify.app"
echo ""
echo "Test diagnostic pages:"
echo "  https://your-site-name.netlify.app/test.html"
echo "  https://your-site-name.netlify.app/diagnostic.html"
echo ""
print_success "Done! 🚀"
echo ""
