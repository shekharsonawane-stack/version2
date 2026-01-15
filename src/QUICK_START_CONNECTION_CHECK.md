# 🔍 Quick Start: Supabase Connection Check

## Immediate Actions to Check Your Connection

### Step 1: Visual Status Check (Fastest)
Look at the **top-right corner** of your app:
- ✅ **Green "Backend Connected"** badge → Everything is working!
- ❌ **Red "Backend Offline"** badge → Connection issue detected

### Step 2: Run Full Diagnostics
1. Click the **"Test Connection"** button in the bottom-left corner
2. Click **"Run Connection Tests"** in the dialog
3. Wait 10-15 seconds for all tests to complete
4. Review results:
   - **5/5 tests passing** → Perfect! Backend is fully operational
   - **3-4/5 passing** → Partial connection, check failed endpoints
   - **0-2/5 passing** → Major connection issue, see troubleshooting below

### Step 3: Check Browser Console
1. Press **F12** to open Developer Tools
2. Click **Console** tab
3. Look for error messages in red
4. Common errors and what they mean:
   - `CORS policy` → Edge function not deployed or CORS misconfigured
   - `401 Unauthorized` → Authentication key issue
   - `404 Not Found` → Function route doesn't exist
   - `500 Internal Server Error` → Backend code error

## Common Issues & Instant Fixes

### ❌ All Tests Failing with "Failed to fetch"
**Problem:** Edge function not deployed or not accessible

**Quick Fix:**
1. Go to your Supabase Dashboard
2. Navigate to **Edge Functions**
3. Verify function `make-server-3cbf86a5` is deployed
4. Check deployment logs for errors
5. If not deployed, deploy the function from `/supabase/functions/server/`

### ❌ 401 Unauthorized Errors
**Problem:** Invalid authentication key

**Quick Fix:**
1. Check `/utils/supabase/info.tsx`
2. Verify `publicAnonKey` matches your Supabase project's anon key
3. Get correct key from: Supabase Dashboard → Project Settings → API → anon public key
4. Replace the key if different

### ❌ Some Endpoints Work, Others Don't
**Problem:** Specific routes have errors

**Quick Fix:**
1. Look at the error response in diagnostics
2. Check server logs in Supabase Dashboard
3. Verify the KV store table exists
4. Review `/supabase/functions/server/crm.tsx` for code errors

### ⚠️ Slow Response Times (>2000ms)
**Problem:** Cold start delay

**Quick Fix:**
This is **normal behavior**! First request after idle period takes longer.
- First request: 2-5 seconds
- Subsequent requests: <500ms
- Solution: None needed, this is expected

## Configuration Checklist

Use the diagnostics dialog to verify these values:

- [ ] **Project ID:** Should be `ljljxfgvjhrcocjruzgh`
- [ ] **API Base URL:** Should be `https://ljljxfgvjhrcocjruzgh.supabase.co/functions/v1/make-server-3cbf86a5`
- [ ] **Anon Key:** Should start with `eyJhbGciOiJIUzI1NiIs...`
- [ ] **Health Endpoint:** Returns `{ status: "ok" }`
- [ ] **Stats Endpoint:** Returns CRM statistics object

## Environment Variables Required

These should already be set in your Supabase project:
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `SUPABASE_DB_URL`

If any are missing, the backend won't work properly.

## Testing Endpoints Manually

You can test the health endpoint directly in your browser:

```
https://ljljxfgvjhrcocjruzgh.supabase.co/functions/v1/make-server-3cbf86a5/health
```

Should return:
```json
{"status":"ok"}
```

If you see this, your backend is accessible!

## Next Steps After Connection Confirmed

Once all tests pass:

1. **Seed Demo Data**
   - Click "Seed Data" button (bottom-left)
   - Wait for success message
   - Verify data in Admin Dashboard

2. **Test CRM Features**
   - Click "Admin" button to open CRM Dashboard
   - Review leads, users, and orders
   - Test creating new entries

3. **Test Frontend Integration**
   - Submit a contact form
   - Complete the room questionnaire
   - Create a test order
   - Verify data appears in CRM

## Still Having Issues?

### Check Deployment Status
1. Supabase Dashboard → Edge Functions
2. Check function status and logs
3. Look for deployment errors
4. Redeploy if needed

### Verify Network
1. Check if you can access `supabase.co` in general
2. Verify no firewall blocking requests
3. Try from different network/device

### Review Logs
1. Browser Console (F12)
2. Supabase Function Logs
3. Network tab in DevTools

### Get Detailed Diagnostics
The diagnostics dialog shows:
- Status codes for each endpoint
- Response times
- Full error messages
- Response data preview

## Files You Can Check

If you need to debug code:

**Backend:**
- `/supabase/functions/server/index.tsx` - Main server file
- `/supabase/functions/server/crm.tsx` - CRM business logic
- `/supabase/functions/server/kv_store.tsx` - Database utilities (protected)

**Frontend:**
- `/utils/crm-helpers.ts` - Frontend API helpers
- `/utils/test-supabase-connection.ts` - Connection testing
- `/components/SupabaseConnectionStatus.tsx` - Status indicator
- `/components/SupabaseDiagnostics.tsx` - Diagnostic dialog

**Configuration:**
- `/utils/supabase/info.tsx` - Project credentials

## Success Indicators

You know everything is working when:
- ✅ Green status badge shows "Backend Connected"
- ✅ All 5 diagnostic tests pass
- ✅ Response times < 1000ms (after first request)
- ✅ No errors in browser console
- ✅ Seed data loads successfully
- ✅ Admin dashboard shows data
- ✅ Forms successfully create leads
- ✅ Orders track properly

---

**Need More Help?**
See the full documentation in `/SUPABASE_CONNECTION_GUIDE.md`

**Last Updated:** January 7, 2026
