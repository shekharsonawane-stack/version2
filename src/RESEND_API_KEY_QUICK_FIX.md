# 🔑 Quick Fix: Get Your Valid Resend API Key

## The Error You're Seeing

```
❌ API key is invalid (401 validation_error)
```

This means the `RESEND_API_KEY` in your Supabase environment is either:
- Not a real Resend API key
- Has been revoked or expired
- Is formatted incorrectly

---

## ✅ How to Get a Valid API Key (5 Minutes)

### Step 1: Sign Up for Resend

1. Go to **https://resend.com/signup**
2. Sign up with your email (Google/GitHub login also available)
3. **No credit card required** - completely free for testing!

### Step 2: Get Your API Key

1. After signing in, you'll see the dashboard
2. Click **"API Keys"** in the left sidebar
3. Click **"Create API Key"** button
4. Give it a name (e.g., "Vision Studio")
5. Select permissions: **"Sending access"**
6. Click **"Add"**
7. **Copy the key** (starts with `re_` - this is important!)

   Example: `re_123abc456def789ghi012jkl345mno678pqr`

### Step 3: Add to Supabase

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. Select your **project**
3. Navigate to: **Settings** (gear icon) → **Edge Functions**
4. Scroll to **"Secrets"** section
5. Find `RESEND_API_KEY` in the list
6. Click **"Edit"** or **"Update"**
7. **Paste your new API key** from Resend
8. Click **"Save"**

### Step 4: Redeploy Your Backend

After updating the secret, you need to redeploy:

```bash
supabase functions deploy server
```

This makes the new API key available to your edge function.

### Step 5: Test It!

1. Go to your CRM Dashboard
2. Create a test campaign with your own email
3. Click **Send**
4. Check your inbox (should arrive in 1-2 minutes)

---

## 📧 Free Tier Limits

Resend's free tier includes:
- ✅ **3,000 emails per month**
- ✅ **100 emails per day**
- ✅ Perfect for testing and small campaigns
- ✅ No credit card required

---

## 🔍 Verify Your Setup

After following the steps above, you should see in your server logs:

```
🚀 Sending emails via Resend API...
📋 API Key status: Configured (re_123abc4...)
✅ Email sent to: user@example.com
```

Instead of:
```
❌ API KEY ERROR: Your RESEND_API_KEY is invalid
```

---

## 🆘 Still Having Issues?

### Check API Key Format
- Must start with `re_`
- Should be about 32-40 characters long
- No spaces before or after

### Check Supabase Logs
```bash
supabase functions logs server --tail
```

Look for the API key status line to see if it's being read correctly.

### Test API Key Directly
You can test your Resend API key with curl:

```bash
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "your-email@example.com",
    "subject": "Test",
    "html": "<p>Testing Resend</p>"
  }'
```

If this works, your key is valid!

---

## 💡 Pro Tips

1. **Use the test domain first**: `onboarding@resend.dev` (no verification needed)
2. **Verify your domain later** for production use
3. **Keep your API key secret** - never share it publicly
4. **One API key per environment** (dev/staging/production)

---

## ✅ What's Been Fixed

The backend now:
- ✅ Validates API key format (must start with `re_`)
- ✅ Shows better error messages
- ✅ Logs the API key status (first 10 chars only)
- ✅ Provides clear instructions when key is invalid
- ✅ Uses Resend's test domain by default (`onboarding@resend.dev`)

---

## 🚀 Next Steps

Once you have a valid API key:

1. ✅ Get key from https://resend.com/api-keys
2. ✅ Update RESEND_API_KEY in Supabase
3. ✅ Redeploy: `supabase functions deploy server`
4. ✅ Test with your own email
5. ✅ Send campaigns to your users!

---

**Need more help?** Check the full setup guide in `/EMAIL_SETUP_GUIDE.md`
