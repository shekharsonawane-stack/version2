# Email Campaign Setup Guide

## Overview
Your Vision Studio CRM now has **real email sending capabilities** integrated with Resend, a modern transactional email API. Emails will be delivered to actual recipient inboxes once configured.

---

## ✅ Setup Instructions

### Step 1: Get Your Resend API Key

1. **Visit Resend**: Go to [https://resend.com/signup](https://resend.com/signup)
2. **Sign Up**: Create a free account (no credit card required for testing)
3. **Get API Key**: 
   - Navigate to **API Keys** in the dashboard
   - Click **Create API Key**
   - Name it (e.g., "Vision Studio")
   - Select "Sending access" permission
   - Click "Add"
   - **Copy your API key** (starts with `re_`) - Save it immediately!
   
   ⚠️ **Important**: The key will only be shown once, so copy it now!

### Step 2: Configure the API Key in Supabase

1. **Deploy Your Backend** (if not already deployed):
   ```bash
   supabase functions deploy server
   ```

2. **Add the Secret**:
   - Go to your Supabase dashboard: [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project
   - Navigate to **Settings** → **Edge Functions** → **Secrets**
   - Click **Add new secret**
   - Name: `RESEND_API_KEY`
   - Value: Paste your Resend API key
   - Click **Save**

### Step 3: Verify Domain (Optional but Recommended)

For production use, verify your domain in Resend:

1. Go to **Domains** in your Resend dashboard
2. Click **Add Domain**
3. Enter your domain (e.g., `visionstudio.com`)
4. Follow the DNS configuration instructions
5. Update the `from` field in `/supabase/functions/server/index.tsx`:
   ```typescript
   from: 'Vision Studio <campaigns@yourdomain.com>',
   ```

---

## 🚀 How It Works

### Email Campaign Flow

1. **Create Campaign**: 
   - Admin creates an email campaign in the CRM dashboard
   - Selects target audience (all users, all leads, or custom emails)
   - Writes subject and content

2. **Send Campaign**:
   - Click the **Send** button
   - Backend processes recipients
   - Sends emails via Resend API in batches of 10
   - Returns delivery results

3. **Delivery Feedback**:
   - Success: Green toast with delivery count
   - Partial failure: Warning toast with counts
   - Complete failure: Error toast with details
   - Console logs include detailed error information

### Email Template

Emails are sent with a beautiful HTML template featuring:
- Vision Studio branded header with gradient
- Clean, readable content area
- Professional footer with copyright
- Responsive design for mobile devices

---

## 📧 Testing Email Delivery

### Quick Test

1. **Create a test campaign**:
   - Name: "Test Email"
   - Type: Email
   - Audience: Custom
   - Custom emails: Your own email address
   - Subject: "Test from Vision Studio"
   - Content: "This is a test email to verify delivery."

2. **Send the campaign**:
   - Click the Send button
   - Check the toast notification for delivery status
   - Check browser console for detailed logs
   - Check your inbox (may take 1-2 minutes)

3. **Verify receipt**:
   - Email should arrive from `campaigns@visionstudio.com`
   - HTML formatting should display correctly
   - Check spam folder if not in inbox

---

## ⚡ API Limits & Best Practices

### Resend Free Tier
- **3,000 emails/month** free
- **100 emails/day** limit
- Sufficient for testing and small campaigns

### Rate Limiting
- Backend batches emails in groups of 10
- 100ms delay between batches
- Prevents API rate limit errors

### Best Practices
1. **Test with small audiences first**
2. **Monitor delivery results in console logs**
3. **Verify domain for better deliverability**
4. **Keep email content professional and spam-free**
5. **Include unsubscribe option for compliance** (recommended for production)

---

## 🐛 Troubleshooting

### Emails Not Sending

1. **Check API Key**:
   - Verify `RESEND_API_KEY` is set in Supabase secrets
   - Ensure it starts with `re_` and has no extra spaces
   - Redeploy edge function after adding secret

2. **Check Logs**:
   ```bash
   supabase functions logs server
   ```
   Look for email send errors

3. **Verify Domain** (if using custom domain):
   - Check DNS records are properly configured
   - Wait for DNS propagation (can take 24-48 hours)

### Emails Going to Spam

1. **Verify your domain** in Resend
2. **Add SPF, DKIM, and DMARC records** as provided by Resend
3. **Avoid spam trigger words** in subject/content
4. **Don't send too many emails at once** from new domains

### API Errors

Common error codes:
- `403`: Invalid API key
- `429`: Rate limit exceeded (wait and retry)
- `422`: Invalid email address format
- `500`: Resend service issue (check status page)

---

## 🔒 Security Notes

- ✅ API key is stored securely as an environment variable
- ✅ Never exposed to frontend code
- ✅ All requests are server-side only
- ✅ Emails batched to prevent abuse
- ⚠️ Consider adding user preferences for email opt-out in production

---

## 📊 Monitoring

### Campaign Metrics
The system tracks:
- Total campaigns created
- Campaigns sent
- Recipient counts
- Success/failure rates

### Logs
Check detailed logs in:
- **Browser console**: Frontend feedback
- **Supabase logs**: Backend email API calls
  ```bash
  supabase functions logs server --tail
  ```

---

## 🎯 Next Steps

1. ✅ Add your Resend API key
2. ✅ Test with a small campaign
3. ✅ Verify domain for production use
4. 📋 Consider adding email templates for different campaign types
5. 📋 Add unsubscribe functionality
6. 📋 Implement open/click tracking

---

## 📚 Resources

- **Resend Documentation**: [https://resend.com/docs](https://resend.com/docs)
- **Resend Status**: [https://status.resend.com](https://status.resend.com)
- **Supabase Edge Functions**: [https://supabase.com/docs/guides/functions](https://supabase.com/docs/guides/functions)

---

## 💡 Tips

- Use **test mode** for development (send to your own email)
- **Segment your audience** for targeted campaigns
- **Personalize content** with recipient names when available
- **Schedule campaigns** during business hours for better engagement
- **A/B test** different subject lines and content

---

**Need help?** Check the console logs for detailed error messages and delivery status!