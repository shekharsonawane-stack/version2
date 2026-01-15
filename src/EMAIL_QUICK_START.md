# 📧 Email Campaigns - Quick Start

## ⚡ 3-Minute Setup

### Step 1: Get Resend API Key (2 min)
1. Visit: **https://resend.com/signup**
2. Create free account
3. Click **API Keys** → **Create API Key**
4. Name it: `Vision Studio`
5. Click **Add**
6. **Copy the key** (starts with `re_`)

### Step 2: Add to Supabase (1 min)
1. Visit: **https://supabase.com/dashboard**
2. Select your project
3. Go to: **Settings** → **Edge Functions** → **Secrets**
4. Find: `RESEND_API_KEY`
5. Click **Edit**
6. **Paste your key**
7. Click **Save**

### Step 3: Deploy & Test
```bash
# Deploy backend
supabase functions deploy server

# Wait 30 seconds for deployment

# Test in your app:
# 1. Go to CRM Dashboard
# 2. Create email campaign
# 3. Target: Custom
# 4. Email: your-email@example.com
# 5. Subject: "Test"
# 6. Message: "Testing email delivery"
# 7. Click Send
# 8. Check your inbox in 1-2 minutes!
```

---

## ✅ Success Indicators

### In App (Toast Notification)
```
✅ 1 email(s) delivered successfully!
Subject: Test
All emails sent to recipient inboxes.
```

### In Browser Console
```
✅ Email sent to: your-email@example.com
📊 Email Send Summary:
   ✅ Successfully sent: 1
   ❌ Failed: 0
```

### In Your Inbox
- Email from: **Vision Studio <onboarding@resend.dev>**
- Professional HTML formatting
- Vision Studio branding
- Your campaign content

---

## ⚠️ Troubleshooting

### "Invalid RESEND_API_KEY format"
**Issue**: Key doesn't start with `re_`  
**Fix**: Get a real key from https://resend.com/api-keys

### "API key is invalid" (401 error)
**Issue**: Key is expired or wrong  
**Fix**: Create a new key in Resend dashboard

### No emails arriving
**Issue**: Backend not deployed  
**Fix**: Run `supabase functions deploy server`

### "Failed to fetch"
**Issue**: Backend not running  
**Fix**: Deploy with `supabase functions deploy server`

---

## 📊 Free Tier Limits

- ✅ **3,000 emails/month**
- ✅ **100 emails/day**
- ✅ **No credit card required**
- ✅ **Perfect for testing**

---

## 🎯 Campaign Types

### Email Campaign
- Delivers to inboxes
- HTML formatted
- Professional template
- Needs valid API key

### Popup Campaign
- Shows in-app
- No API key needed
- Works offline
- Immediate display

---

## 🔗 Quick Links

- **Get API Key**: https://resend.com/api-keys
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Full Setup Guide**: `/EMAIL_SETUP_GUIDE.md`
- **Troubleshooting**: `/ERRORS_FIXED.md`

---

## 💡 Pro Tips

1. **Test with yourself first** - Use your own email before sending to customers
2. **Check spam folder** - First emails from new domains may go to spam
3. **Verify domain later** - For production, verify your domain in Resend
4. **Monitor console logs** - Detailed delivery info in browser console
5. **Keep subjects short** - Better open rates with clear, concise subjects

---

## 🎉 You're Ready!

Once you have your Resend API key configured:
- ✅ Send unlimited campaigns (within free tier)
- ✅ Target users, leads, or custom emails
- ✅ Beautiful HTML templates
- ✅ Real inbox delivery
- ✅ Detailed delivery tracking

**Total setup time: 3 minutes** ⏱️  
**Cost: $0** 💰  
**Email delivery: ∞** 📧

---

**Questions?** Check `/EMAIL_SETUP_GUIDE.md` for the complete guide!
