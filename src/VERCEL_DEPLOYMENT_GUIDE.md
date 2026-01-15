# Vision Studio - Vercel Deployment Guide

This guide will help you deploy your Vision Studio furniture e-commerce site to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com
2. **Supabase Project**: Your existing Supabase project (already set up)
3. **GitHub/GitLab/Bitbucket**: Repository hosting (optional but recommended)
4. **Node.js**: Version 18+ installed locally (for testing)

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login to Vercel
```bash
vercel login
```

#### 3. Deploy from your project directory
```bash
# Navigate to your project folder
cd vision-studio

# Deploy to Vercel
vercel
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Your account
- **Link to existing project?** No
- **What's your project's name?** vision-studio (or your preferred name)
- **In which directory is your code located?** ./ (current directory)
- **Want to override settings?** No

#### 4. Set Environment Variables

After deployment, add your Supabase environment variables:

```bash
vercel env add SUPABASE_URL
# Paste your Supabase URL when prompted

vercel env add SUPABASE_ANON_KEY
# Paste your Supabase anon key when prompted

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Paste your Supabase service role key when prompted
```

Or set them in the Vercel dashboard:
1. Go to your project on Vercel
2. Settings → Environment Variables
3. Add these variables:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

#### 5. Redeploy with Environment Variables
```bash
vercel --prod
```

---

### Option 2: Deploy via Git Integration (Easiest)

#### 1. Push to GitHub/GitLab/Bitbucket

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit for Vercel deployment"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/vision-studio.git

# Push to main branch
git push -u origin main
```

#### 2. Import to Vercel

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your Git provider (GitHub/GitLab/Bitbucket)
4. Choose your repository
5. Configure your project:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### 3. Add Environment Variables

In the Vercel import screen, add these environment variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

#### 4. Deploy

Click "Deploy" and wait for the build to complete.

---

## 🔧 Deploy Supabase Edge Functions Separately

**Important**: The Supabase Edge Functions in `/supabase/functions/` cannot be deployed to Vercel. They must be deployed to Supabase.

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link to Your Project

```bash
supabase link --project-ref YOUR_PROJECT_ID
```

Replace `YOUR_PROJECT_ID` with your Supabase project reference ID (found in your Supabase dashboard URL).

### 4. Deploy Edge Functions

```bash
# Deploy all functions
supabase functions deploy

# Or deploy specific function
supabase functions deploy server
```

### 5. Set Environment Variables for Edge Functions

```bash
supabase secrets set SUPABASE_URL=your_supabase_url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
supabase secrets set SUPABASE_ANON_KEY=your_anon_key
```

---

## 🌐 Update Frontend to Use Production URLs

After deploying, your app will be available at:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-3cbf86a5`

The frontend should automatically use the correct Supabase URL from the environment variables.

---

## ✅ Verify Deployment

### Test Frontend
1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Browse the site and check all pages load correctly
3. Test user registration and login
4. Test adding items to cart
5. Test checkout flow

### Test Backend API
```bash
# Health check
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-3cbf86a5/health

# Should return: {"status":"ok"}
```

---

## 🐛 Troubleshooting

### Build Fails with "Cannot find module"
- Make sure all dependencies are in `package.json`
- Run `npm install` locally to verify
- Check the build logs in Vercel dashboard

### Environment Variables Not Working
- Ensure you've set all required environment variables in Vercel
- Redeploy after adding environment variables
- Variables must be set for all environments (Production, Preview, Development)

### API Calls Failing
- Verify Supabase Edge Functions are deployed
- Check Supabase Function logs: `supabase functions logs server`
- Verify CORS settings in the Edge Function

### Images Not Loading
- Make sure all image imports are correct
- Check that `figma:asset` imports are converted to actual image URLs
- Verify image files are in the repository

---

## 📊 Monitor Your Deployment

### Vercel Dashboard
- **Analytics**: Track page views and performance
- **Logs**: View build and runtime logs
- **Deployments**: See deployment history

### Supabase Dashboard
- **Edge Functions**: Monitor function logs and invocations
- **Database**: Check data integrity
- **Auth**: Monitor user authentication

---

## 🔄 Continuous Deployment

With Git integration, every push to your main branch will automatically deploy to Vercel:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel automatically builds and deploys
```

---

## 💰 Cost Considerations

### Vercel
- **Free Tier**: 100GB bandwidth, unlimited deployments
- **Pro Tier**: $20/month for more bandwidth and features

### Supabase
- **Free Tier**: 500MB database, 2GB bandwidth, 500K Edge Function invocations
- **Pro Tier**: $25/month for more resources

---

## 🎉 You're Done!

Your Vision Studio e-commerce site should now be live on Vercel with the backend running on Supabase Edge Functions.

**Live URLs:**
- Frontend: `https://your-project.vercel.app`
- API: `https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-3cbf86a5`

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Vite Docs**: https://vitejs.dev/guide/

---

## 🔒 Security Checklist

- ✅ Environment variables set correctly
- ✅ Service role key never exposed to frontend
- ✅ CORS configured properly
- ✅ API endpoints protected with authentication
- ✅ HTTPS enabled (automatic with Vercel)
