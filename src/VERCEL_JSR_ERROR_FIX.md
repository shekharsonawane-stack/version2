# 🔧 Fix: JSR Import Error on Vercel

## The Problem

```
npm error 404 Not Found - GET https://registry.npmjs.org/@jsr%2fsupabase__supabase-js
```

**Root Cause**: npm is scanning the `/supabase/functions/server/kv_store.tsx` file which contains:
```typescript
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
```

This is a **Deno JSR import** (for Supabase Edge Functions) but npm thinks it's an npm package.

---

## ✅ Solution Options

### Option 1: Don't Commit Server Files to Git (Recommended)

If deploying via Git integration:

#### Step 1: Add supabase to .gitignore

```bash
echo "supabase/" >> .gitignore
```

#### Step 2: Remove from Git tracking

```bash
git rm -r --cached supabase/
git commit -m "Remove server files from frontend repo"
git push
```

#### Step 3: Deploy to Vercel

Now Vercel won't see the server files at all!

#### Step 4: Deploy Server Separately

```bash
# Keep server files locally, deploy directly to Supabase
supabase functions deploy
```

**Pros**: Clean separation, no conflicts
**Cons**: Server files not version controlled with frontend

---

### Option 2: Use .vercelignore (If deploying via CLI)

If deploying via `vercel` CLI (not Git):

The `.vercelignore` file already excludes `supabase/`, so:

```bash
# Deploy directly
vercel
```

The supabase folder won't be uploaded to Vercel.

**Pros**: Keeps files in one repo
**Cons**: Only works with CLI deployment

---

### Option 3: Separate Repositories

Create two separate repos:

#### Frontend Repo (vision-studio)
```
vision-studio/
├── components/
├── utils/
├── App.tsx
└── (no supabase folder)
```

#### Backend Repo (vision-studio-server)
```
vision-studio-server/
└── supabase/
    └── functions/
        └── server/
```

**Pros**: Complete separation, clear boundaries
**Cons**: More repos to manage

---

## 🎯 Quick Fix (Choose One)

### For Git Deployment:

```bash
# Add supabase to .gitignore
echo "supabase/" >> .gitignore

# Remove from Git
git rm -r --cached supabase/
git add .gitignore
git commit -m "Exclude server files"
git push

# Deploy via Vercel dashboard
# (Import from GitHub, server files won't be included)
```

### For CLI Deployment:

```bash
# Just deploy - .vercelignore handles it
vercel

# Server files won't be uploaded
```

---

## 🧪 Verify the Fix

After applying the fix:

### Test 1: Check what's being deployed

```bash
# If using Git
git ls-files | grep supabase
# Should return: No results

# If using CLI
vercel --debug
# Watch for "Uploading files" - shouldn't include supabase/
```

### Test 2: Local build

```bash
npm install --legacy-peer-deps
npm run build
```

Should complete without errors.

### Test 3: Deploy

```bash
vercel
```

Should deploy successfully!

---

## 📋 Recommended Approach

**Best Practice**: Keep frontend and backend separate

1. ✅ Add `supabase/` to `.gitignore`
2. ✅ Remove from Git: `git rm -r --cached supabase/`
3. ✅ Keep server files locally
4. ✅ Deploy frontend to Vercel via Git
5. ✅ Deploy server to Supabase via CLI

### Why This Works:
- Frontend repo has no server files → npm never sees JSR imports
- Server deployed directly to Supabase → works perfectly
- Clean separation of concerns
- No conflicts or workarounds needed

---

## 🔄 Deployment Workflow

### Frontend (Vercel):
```bash
git add .
git commit -m "Update frontend"
git push
# Vercel auto-deploys
```

### Backend (Supabase):
```bash
cd /path/to/project
supabase functions deploy
# Or specific function:
supabase functions deploy server
```

---

## ⚠️ Important Notes

1. **Server files are NOT needed in the frontend build**
   - They run on Supabase Edge Functions
   - Frontend only needs to call the API endpoints

2. **Keep a backup of server files**
   - Before removing from Git
   - Consider a separate repo or local backup

3. **Update your team**
   - Let them know server files are deployed separately
   - Document the deployment process

---

## 🆘 If Still Failing

### Check 1: Files Actually Excluded

```bash
# For Git deployment
git ls-files | grep supabase

# For CLI deployment  
cat .vercelignore
```

### Check 2: Clean Build

```bash
# Remove all cached files
rm -rf node_modules package-lock.json .vercel
npm install --legacy-peer-deps
npm run build
vercel
```

### Check 3: Vercel Build Logs

1. Go to Vercel dashboard
2. Open your project
3. Click on failed deployment
4. Check "Build Logs"
5. Look for what files are being scanned

---

## ✅ Success Indicators

Build succeeds when you see:

```
✓ Uploading files...
✓ Installing dependencies...
✓ Building...
✓ Deployment ready!
```

**No JSR errors!** 🎉

---

## 📖 Related Docs

- **Setup Guide**: `VERCEL_DEPLOYMENT_GUIDE.md`
- **Troubleshooting**: `VERCEL_BUILD_TROUBLESHOOTING.md`
- **Checklist**: `DEPLOYMENT_CHECKLIST.md`

---

## 💡 Summary

The fix is simple:

**Don't deploy server files to Vercel!**

Either:
- Remove from Git (add to `.gitignore`)
- Use `.vercelignore` (CLI deployment only)
- Use separate repositories

The server runs on Supabase, not Vercel. Keeping them separate solves everything.
