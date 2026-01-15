# 🚀 Deploy to Netlify - Complete Guide

## ✅ Why Netlify?

**Benefits over Vercel:**
- ✅ **Simpler build process** - Better handling of monorepo structures
- ✅ **More forgiving** - Doesn't scan server folders aggressively
- ✅ **Better caching** - Faster subsequent builds
- ✅ **Generous free tier** - 100GB bandwidth/month
- ✅ **Great DX** - Excellent developer experience

---

## 📋 Prerequisites

All configuration files are ready:
- ✅ `netlify.toml` - Netlify configuration
- ✅ `.npmrc` - npm configuration
- ✅ `.gitignore` - Git ignores
- ✅ `postcss.config.js` - Tailwind CSS processor
- ✅ `package.json` - Dependencies

---

## 🚀 Deployment Steps

### Option 1: Deploy from Git (Recommended)

#### Step 1: Push to GitHub

```bash
git add .
git commit -m "Add Netlify configuration"
git push
```

#### Step 2: Connect to Netlify

1. Go to **https://app.netlify.com/**
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub**
4. Find your repository: **furniture-showcase-site-7** (or your repo name)
5. Click on it

#### Step 3: Configure Build Settings

Netlify should **auto-detect** these settings from `netlify.toml`:

```
Build command:        npm run build
Publish directory:    dist
```

**If not auto-detected, enter them manually.**

#### Step 4: Add Environment Variables

Click **"Show advanced"** → **"New variable"**

Add these variables (from your Supabase project):

| Variable Name | Value | Where to Find |
|---------------|-------|---------------|
| `VITE_SUPABASE_URL` | Your Supabase URL | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Your anon key | Supabase Dashboard → Settings → API |

**Note:** The Supabase service role key stays in Supabase Edge Functions, NOT in Netlify!

#### Step 5: Deploy!

Click **"Deploy site"**

⏱️ **Wait 2-3 minutes**

You'll get a URL like: `https://random-name-123456.netlify.app`

---

### Option 2: Deploy with Netlify CLI

#### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### Step 2: Login to Netlify

```bash
netlify login
```

This opens your browser to authenticate.

#### Step 3: Initialize Netlify

```bash
netlify init
```

Follow the prompts:
- **Create & configure a new site**
- Choose your team
- Site name: `vision-studio-furniture` (or whatever you want)

#### Step 4: Deploy

```bash
# Build locally first
npm run build

# Deploy
netlify deploy --prod
```

---

## ✅ What Happens During Deployment

### Build Process:

```
1. Netlify clones your repo
   ↓
2. Reads netlify.toml
   ↓
3. Sets NODE_VERSION=18
   ↓
4. Runs: npm install --legacy-peer-deps
   ↓
5. Ignores supabase/ folder (doesn't scan it)
   ↓
6. No JSR errors! ✅
   ↓
7. Runs: npm run build
   ↓
8. Vite builds frontend → dist/
   ↓
9. PostCSS processes Tailwind CSS
   ↓
10. Netlify deploys dist/ folder
    ↓
11. Site is live! 🎉
```

---

## 🔍 Verify Deployment

### 1. Check Build Logs

In Netlify Dashboard:
- Click **"Deploys"**
- Click the latest deployment
- View **build log**

**Look for:**
```
✅ Installing dependencies
✅ @tailwindcss/postcss@4.0.0
✅ Running build command
✅ vite v5.x.x building for production...
✅ dist/index.html
✅ Build succeeded
✅ Deploy succeeded
```

### 2. Test Your Site

Visit your Netlify URL (something like `https://xxx.netlify.app`)

**Should see:**
- ✅ Full styling (colors, fonts, layout)
- ✅ All components working
- ✅ Images loading
- ✅ Navigation working
- ✅ No console errors

### 3. Test Diagnostic Pages

After deployment, test:
- `https://your-site.netlify.app/test.html`
- `https://your-site.netlify.app/diagnostic.html`

Both should work and show ✅ for all tests.

---

## 🎯 Custom Domain (Optional)

### Add Your Own Domain

1. In Netlify Dashboard → **Domain settings**
2. Click **"Add custom domain"**
3. Enter your domain: `visionstudio.com`
4. Follow DNS setup instructions
5. Netlify auto-provisions SSL certificate (free!)

**DNS Setup:**
- Add CNAME: `www` → `your-site.netlify.app`
- Add ALIAS/ANAME: `@` → `your-site.netlify.app`

---

## 🔧 Configuration Details

### netlify.toml Explained

```toml
[build]
  command = "npm run build"        # Build your Vite app
  publish = "dist"                 # Serve files from dist/
  ignore = "supabase/"             # Don't scan server files!

[build.environment]
  NODE_VERSION = "18"              # Use Node 18
  NPM_FLAGS = "--legacy-peer-deps" # Avoid peer dep conflicts

[[redirects]]
  from = "/*"                      # All routes
  to = "/index.html"               # Go to SPA
  status = 200                     # Internal rewrite (not redirect)
```

This prevents the JSR error because Netlify won't scan `supabase/` folder!

---

## 🆘 Troubleshooting

### Issue 1: Build Fails with JSR Error

**Error:**
```
npm ERR! 404 Not Found - @jsr/supabase__supabase-js
```

**Fix:**

Option A - Update `netlify.toml`:
```toml
[build]
  ignore = "supabase/"
```

Option B - Create `.npmignore`:
```bash
echo "supabase/" > .npmignore
```

Then redeploy:
```bash
git add .
git commit -m "Fix JSR error"
git push
```

### Issue 2: CSS Not Loading

**Symptom:** Site loads but no colors/styling

**Fix:**

Check that `@tailwindcss/postcss` is installed:
```bash
npm list @tailwindcss/postcss
# Should show: @tailwindcss/postcss@4.0.0
```

If missing:
```bash
npm install --save-dev @tailwindcss/postcss@4.0.0 --legacy-peer-deps
git add package.json package-lock.json
git commit -m "Add Tailwind PostCSS"
git push
```

### Issue 3: Environment Variables Not Working

**Symptom:** Supabase connection fails

**Fix:**

1. Netlify Dashboard → **Site settings** → **Environment variables**
2. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Click **"Trigger deploy"** to redeploy with new vars

### Issue 4: 404 on Routes

**Symptom:** `/about` shows 404 error

**Fix:**

Ensure `netlify.toml` has:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Then redeploy.

---

## 🔄 Automatic Deployments

Once connected to GitHub, Netlify automatically deploys when you push:

```bash
git add .
git commit -m "Update feature"
git push
# ✅ Netlify auto-deploys! (2-3 minutes)
```

**Deploy Contexts:**
- `main` branch → Production (your live site)
- `develop` branch → Preview (test environment)
- Pull requests → Deploy previews

---

## 🎨 Site Name

### Change Your Site Name

Default: `random-name-123456.netlify.app`

**To customize:**

1. Netlify Dashboard → **Site settings**
2. Click **"Change site name"**
3. Enter: `vision-studio-furniture`
4. New URL: `https://vision-studio-furniture.netlify.app`

---

## 📊 Netlify Features You Get Free

- ✅ **Automatic HTTPS** - Free SSL certificates
- ✅ **Global CDN** - Fast worldwide
- ✅ **Instant rollbacks** - One-click revert
- ✅ **Deploy previews** - Test PRs before merge
- ✅ **Split testing** - A/B testing built-in
- ✅ **Form handling** - No backend needed
- ✅ **Analytics** - Basic site analytics
- ✅ **100GB bandwidth** - Free tier
- ✅ **300 build minutes/month** - Free tier

---

## 🚀 Deploy Now!

### Quick Start (3 Steps):

```bash
# Step 1: Commit Netlify config
git add netlify.toml
git commit -m "Add Netlify configuration"
git push

# Step 2: Go to Netlify
# https://app.netlify.com/

# Step 3: Click "Add new site" → Import from Git → Select repo → Deploy!
```

**That's it!** 🎉

---

## 📋 Deployment Checklist

Before deploying, verify:

- [x] `netlify.toml` exists
- [x] `postcss.config.js` exists
- [x] `package.json` has `@tailwindcss/postcss`
- [x] `.npmrc` has `legacy-peer-deps=true`
- [x] `/styles/globals.css` has `@import "tailwindcss"`
- [x] Git repo is pushed to GitHub
- [x] Supabase project exists (for backend)

All checked? **Deploy now!**

---

## 🆚 Netlify vs Vercel

| Feature | Netlify | Vercel |
|---------|---------|--------|
| Build handling | ✅ More forgiving | Can be strict |
| JSR error issue | ✅ Easier to fix | Requires workarounds |
| Free bandwidth | ✅ 100GB | 100GB |
| Build minutes | ✅ 300/month | 100/month |
| Custom domains | ✅ Unlimited | Unlimited |
| Edge functions | ✅ Yes | ✅ Yes |
| Learning curve | ✅ Easier | Slightly steeper |

**Both are great!** Netlify is just a bit more forgiving for complex setups.

---

## 🎯 Next Steps After Deployment

1. ✅ Verify site works at `https://your-site.netlify.app`
2. ✅ Add custom domain (optional)
3. ✅ Set up automatic deployments (already done!)
4. ✅ Share your link! 🎉

---

## 📞 Support

**Netlify Issues:**
- Netlify Docs: https://docs.netlify.com
- Netlify Support: https://answers.netlify.com

**Build Issues:**
- Run `/diagnostic.html` on deployed site
- Send me the results
- I'll help fix it!

---

**Ready to deploy? Just push to GitHub and connect to Netlify!** 🚀

```bash
git add .
git commit -m "Deploy to Netlify"
git push
```

Then visit: **https://app.netlify.com/** and click **"Add new site"**!
