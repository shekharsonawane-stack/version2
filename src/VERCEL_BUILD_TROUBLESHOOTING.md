# Vercel Build Troubleshooting

## Error: `@jsr/supabase__supabase-js` Not Found

This error occurs when npm tries to install a JSR (JavaScript Registry) package from the npm registry.

### Why This Happens

The `/supabase/functions/server/kv_store.tsx` file contains:
```typescript
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
```

This is **correct for Deno** (Supabase Edge Functions) but **NOT for npm/Vercel builds**.

### Solution

The server files should be **completely excluded** from the Vercel build. Here's how:

---

## ✅ Fixes Applied

### 1. `.vercelignore` File
```
supabase/
*.md
guidelines/
node_modules/
dist/
.vercel/
```

### 2. `tsconfig.json` - Exclude Server Files
```json
{
  "exclude": [
    "node_modules",
    "dist",
    "supabase"
  ]
}
```

### 3. `package.json` - Clean Build Script
```json
{
  "scripts": {
    "build": "vite build"
  }
}
```

**Note**: No TypeScript checking during build to avoid scanning server files.

### 4. `.npmrc` - Force npm Registry
```
registry=https://registry.npmjs.org/
legacy-peer-deps=true
```

---

## 🔍 Verify the Fix

### Step 1: Check Files Are Excluded

The following command should NOT include any `/supabase/` files:

```bash
# List files that will be included in deploy
git ls-files
```

If you see `supabase/functions/` in the list, add them to `.gitignore`:

```bash
echo "supabase/functions/" >> .gitignore
```

### Step 2: Clean Install Locally

```bash
# Remove any cached dependencies
rm -rf node_modules package-lock.json

# Fresh install
npm install

# Should complete without JSR errors
```

### Step 3: Test Build Locally

```bash
npm run build
```

Should complete successfully and create a `/dist` folder.

---

## 🚨 If Build Still Fails on Vercel

### Option 1: Ignore Build Step for TypeScript
Update `vercel.json`:

```json
{
  "build": {
    "env": {
      "SKIP_ENV_VALIDATION": "1"
    }
  },
  "buildCommand": "vite build",
  "framework": "vite"
}
```

### Option 2: Remove TypeScript from Build
Update `package.json`:

```json
{
  "scripts": {
    "build": "vite build --mode production"
  }
}
```

### Option 3: Add Build Override in Vercel Dashboard

1. Go to your project settings in Vercel
2. Navigate to: **Settings** → **General** → **Build & Development Settings**
3. Override the build command:
   ```
   vite build
   ```
4. Set Output Directory:
   ```
   dist
   ```
5. Set Install Command:
   ```
   npm install --legacy-peer-deps
   ```

---

## 🔧 Alternative: Move Server Files Outside Project

If the issue persists, the nuclear option is to move server files to a separate repository:

### 1. Create New Repo for Server

```bash
# In a new directory
mkdir vision-studio-server
cd vision-studio-server

# Copy server files
cp -r ../vision-studio/supabase .

# Initialize Git
git init
git add .
git commit -m "Server functions"
```

### 2. Deploy Server Separately

```bash
# Link to Supabase
supabase link --project-ref YOUR_PROJECT_ID

# Deploy
supabase functions deploy
```

### 3. Remove from Main Project

```bash
# In main vision-studio project
rm -rf supabase/
echo "supabase/" >> .gitignore
```

---

## 🎯 Recommended Solution

**Keep it simple**: The files I've created should work. The key is:

1. ✅ `.vercelignore` excludes `supabase/`
2. ✅ `tsconfig.json` excludes `supabase`
3. ✅ Build command is just `vite build` (no tsc)
4. ✅ No direct imports from server files in frontend

### Verify No Frontend Imports

```bash
# Search for any imports from server files
grep -r "supabase/functions" components/ utils/ contexts/ *.tsx

# Should return: No results
```

---

## 📦 Package.json Final Version

```json
{
  "name": "vision-studio",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.39.0",
    ...other deps
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "typescript": "^5.2.2"
  }
}
```

**Key**: Only `@supabase/supabase-js` from npm, NOT `@jsr/supabase__supabase-js`

---

## ✅ Final Checklist

- [ ] `.vercelignore` excludes `supabase/`
- [ ] `.gitignore` includes `node_modules/` and `dist/`
- [ ] `tsconfig.json` excludes `supabase`
- [ ] `package.json` build script is `vite build` only
- [ ] No imports from `/supabase/functions/` in frontend code
- [ ] Local build works: `npm run build`
- [ ] `@supabase/supabase-js` is from npm (not JSR)

---

## 🆘 Still Having Issues?

Contact Vercel support with this info:

```
Error: npm tries to install @jsr/supabase__supabase-js
Cause: Server files with Deno imports being scanned
Solution: Exclude supabase/ directory from build
Files: .vercelignore, tsconfig.json configured correctly
```

---

## 🎉 Success!

When the build works, you should see:

```
✓ built in XXXms
✓ X modules transformed
✓ rendering chunks...
✓ dist/index.html
✓ dist/assets/...
```

Your app will be deployed to: `https://your-project.vercel.app`
