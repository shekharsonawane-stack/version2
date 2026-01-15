# ✅ Vercel Deployment Checklist

Use this checklist to ensure a smooth deployment to Vercel.

## Pre-Deployment

- [ ] Node.js 18+ installed locally
- [ ] Supabase project is set up and running
- [ ] All environment variables documented
- [ ] Code tested locally with `npm run dev`
- [ ] Build tested locally with `npm run build`
- [ ] Git repository initialized (if using Git integration)

## Environment Variables Ready

### Frontend (Vercel)
- [ ] `VITE_SUPABASE_URL` - Your Supabase project URL
- [ ] `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

### Backend (Supabase Edge Functions)
- [ ] `SUPABASE_URL` - Your Supabase project URL
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Your service role key
- [ ] `SUPABASE_ANON_KEY` - Your anon key
- [ ] `RESEND_API_KEY` - (Optional) For email campaigns

## Vercel Setup

### Option 1: CLI Deployment
- [ ] Vercel CLI installed: `npm install -g vercel`
- [ ] Logged into Vercel: `vercel login`
- [ ] Ran initial deploy: `vercel`
- [ ] Environment variables added via CLI
- [ ] Production deploy: `vercel --prod`

### Option 2: Git Integration
- [ ] Code pushed to GitHub/GitLab/Bitbucket
- [ ] Repository imported to Vercel
- [ ] Framework preset set to "Vite"
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variables added in Vercel dashboard
- [ ] Deployed successfully

## Supabase Edge Functions

- [ ] Supabase CLI installed: `npm install -g supabase`
- [ ] Logged into Supabase: `supabase login`
- [ ] Project linked: `supabase link --project-ref YOUR_PROJECT_ID`
- [ ] Functions deployed: `supabase functions deploy`
- [ ] Environment secrets set for functions
- [ ] Function health check passes

## Post-Deployment Testing

### Frontend Tests
- [ ] Homepage loads correctly
- [ ] All pages accessible (About, Services, Contact, etc.)
- [ ] Language toggle works (English/Malay)
- [ ] Product catalog displays
- [ ] Product details pages work
- [ ] Search functionality works
- [ ] Mobile responsive design works

### User Features
- [ ] User registration works
- [ ] Login/logout works
- [ ] Password reset flow works
- [ ] User profile loads
- [ ] Favorites/wishlist saves correctly

### E-Commerce Flow
- [ ] Add to cart works
- [ ] Cart updates properly
- [ ] Checkout flow (all 5 steps)
- [ ] Payment method selection
- [ ] Order placement successful
- [ ] Order confirmation displayed
- [ ] Order appears in user dashboard

### Admin Features
- [ ] CRM Dashboard accessible
- [ ] Leads display correctly
- [ ] Orders display correctly
- [ ] Analytics data shows
- [ ] Campaign creation works
- [ ] Auto-refresh works (2 minutes)

### API Health Check
```bash
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-3cbf86a5/health
# Should return: {"status":"ok"}
```
- [ ] Health check passes

### Database Check
- [ ] New users save to database
- [ ] Orders save to database
- [ ] Analytics events tracked
- [ ] Journey logs recorded

## Performance & SEO

- [ ] Lighthouse score > 90
- [ ] Page load time < 3 seconds
- [ ] Images optimized
- [ ] Meta tags present
- [ ] Mobile-friendly test passes

## Security

- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Environment variables secure
- [ ] Service role key NOT in frontend code
- [ ] CORS configured correctly
- [ ] API endpoints protected where needed
- [ ] No sensitive data in client-side code

## Monitoring Setup

### Vercel Dashboard
- [ ] Analytics enabled
- [ ] Build logs reviewed
- [ ] No deployment errors
- [ ] Custom domain configured (if applicable)

### Supabase Dashboard
- [ ] Database backups enabled
- [ ] Function logs accessible
- [ ] Auth users visible
- [ ] Storage buckets created (if needed)

## Documentation

- [ ] README.md updated with live URLs
- [ ] Environment variables documented
- [ ] Deployment guide shared with team
- [ ] Admin credentials documented securely

## Go-Live

- [ ] All tests passing
- [ ] Stakeholders notified
- [ ] Custom domain configured (if applicable)
- [ ] DNS records updated (if applicable)
- [ ] SSL certificate valid
- [ ] Monitoring alerts set up

## Post-Launch

- [ ] Monitor error logs daily (first week)
- [ ] Check analytics for issues
- [ ] Test all payment methods
- [ ] Gather user feedback
- [ ] Performance monitoring active

---

## 🚨 Common Issues & Solutions

### Build Fails
**Problem**: Vite build fails with module errors
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment Variables Not Working
**Problem**: App can't connect to Supabase
**Solution**: 
1. Check variables are set in Vercel dashboard
2. Variable names must start with `VITE_` for frontend
3. Redeploy after adding variables

### 404 on Page Refresh
**Problem**: Direct URL access returns 404
**Solution**: Already configured in `vercel.json` with rewrites

### API Calls Failing
**Problem**: Frontend can't reach backend
**Solution**:
1. Verify Edge Functions deployed to Supabase
2. Check function logs: `supabase functions logs server`
3. Test health endpoint directly

### Images Not Loading
**Problem**: Images broken in production
**Solution**:
1. Check image paths are relative
2. Verify images committed to Git
3. Test `figma:asset` imports converted properly

---

## 📞 Need Help?

- **Vercel Support**: https://vercel.com/support
- **Supabase Support**: https://supabase.com/support
- **Deployment Guide**: See [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)

---

## ✅ Deployment Complete!

Once all items are checked, your Vision Studio e-commerce platform is live! 🎉

**Live URLs:**
- Frontend: `https://your-project.vercel.app`
- API: `https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-3cbf86a5`

**Next Steps:**
1. Monitor logs for the first 24 hours
2. Test with real users
3. Set up analytics tracking
4. Configure custom domain (optional)
5. Enable Vercel Analytics Pro (optional)
