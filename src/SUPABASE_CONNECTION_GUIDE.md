# Supabase Connection Diagnostic Guide

This guide explains the connection testing tools added to your Vision Studio application and how to use them to diagnose backend issues.

## What Was Added

### 1. Connection Test Utilities (`/utils/test-supabase-connection.ts`)

Two utility functions for testing Supabase connectivity:

- **`testSupabaseConnection()`** - Comprehensive test that checks all endpoints
- **`quickConnectionCheck()`** - Fast health check for status monitoring

### 2. Connection Status Indicator (`/components/SupabaseConnectionStatus.tsx`)

A visual indicator in the top-right corner that shows:
- ✅ **Green "Backend Connected"** - All systems operational
- ❌ **Red "Backend Offline"** - Connection issues detected
- 🔄 **"Checking..."** - Currently testing connection

**Features:**
- Auto-checks on page load
- Re-checks every 30 seconds
- Non-intrusive badge design

### 3. Comprehensive Diagnostics Dialog (`/components/SupabaseDiagnostics.tsx`)

A detailed diagnostic panel accessible via the "Test Connection" button (bottom-left).

**Features:**
- Configuration display (Project ID, API Base URL, Auth Keys)
- Individual endpoint testing for all 5 CRM endpoints:
  - Health Check (`/health`)
  - CRM Stats (`/stats`)
  - Get Leads (`/leads`)
  - Get Users (`/users`)
  - Get Orders (`/orders`)
- Response time tracking
- Status code display
- Error message details
- Success response preview
- Overall system health indicator
- Troubleshooting tips

### 4. Quick Access Buttons

Two buttons in the bottom-left corner:
1. **"Test Connection"** - Opens the diagnostics dialog
2. **"Seed Data"** (existing) - Populates demo data

## How to Use

### Quick Check

1. Look at the **top-right corner** for the connection status badge
2. Green = Everything's working
3. Red = There's a problem

### Detailed Diagnostics

1. Click the **"Test Connection"** button (bottom-left)
2. Click **"Run Connection Tests"** in the dialog
3. Watch as each endpoint is tested in sequence
4. Review the results:
   - ✅ Green checkmark = Working
   - ❌ Red X = Failed
   - Status codes, response times, and error details shown

### Understanding Results

#### All Tests Pass (5/5)
```
Status: All systems operational
```
Your backend is fully connected and working.

#### Some Tests Pass (e.g., 3/5)
```
Status: Some endpoints failing
```
Backend is partially working. Check which endpoints failed and their error messages.

#### All Tests Fail (0/5)
```
Status: Backend connection issues
```
Complete connection failure. See troubleshooting below.

## Common Issues & Solutions

### Issue: "Failed to fetch" or CORS errors

**Cause:** Supabase Edge Function not deployed or CORS misconfigured

**Solution:**
1. Check Supabase dashboard to ensure edge function is deployed
2. Verify CORS headers in `/supabase/functions/server/index.tsx`
3. Ensure the function is accessible at the URL shown in diagnostics

### Issue: 401 Unauthorized

**Cause:** Invalid or missing authentication key

**Solution:**
1. Check that `publicAnonKey` is correctly set in `/utils/supabase/info.tsx`
2. Verify the key matches your Supabase project's anon key
3. Ensure the key hasn't expired

### Issue: 404 Not Found

**Cause:** Route doesn't exist or function not deployed

**Solution:**
1. Verify the edge function is deployed in Supabase dashboard
2. Check that all routes are properly defined in `/supabase/functions/server/index.tsx`
3. Ensure the function name matches `make-server-3cbf86a5`

### Issue: 500 Internal Server Error

**Cause:** Backend code error

**Solution:**
1. Check Supabase logs in the dashboard
2. Look for error details in the diagnostics response
3. Verify KV store is working correctly
4. Check for code errors in `/supabase/functions/server/crm.tsx`

### Issue: Slow Response Times (>2000ms)

**Cause:** Cold start or database performance

**Solution:**
1. First request after idle period is slower (cold start - normal)
2. Subsequent requests should be faster
3. Check Supabase dashboard for performance metrics

## Testing Workflow

### Before Making Changes
1. Run diagnostics to establish baseline
2. Note which endpoints are working
3. Record response times

### After Making Changes
1. Re-run diagnostics
2. Compare with baseline
3. Verify all previously working endpoints still work
4. Check that changes didn't introduce new errors

### When Debugging
1. Open browser DevTools Console (F12)
2. Run diagnostics
3. Check Console for detailed error messages
4. Look at Network tab for failed requests
5. Review response bodies for error details

## API Endpoint Reference

All endpoints use the base URL:
```
https://{projectId}.supabase.co/functions/v1/make-server-3cbf86a5
```

### Health Check
```
GET /health
Returns: { status: "ok" }
```

### CRM Statistics
```
GET /stats
Returns: { success: true, stats: {...} }
```

### Lead Management
```
GET /leads
GET /leads?status=new
GET /leads/:id
POST /leads
PUT /leads/:id
POST /leads/:id/convert
```

### User Management
```
GET /users
GET /users/:id
GET /users/email/:email
POST /users
PUT /users/:id
POST /users/:id/login
```

### Order Management
```
GET /orders
GET /orders?status=pending-payment
GET /orders/:id
GET /users/:userId/orders
POST /orders
PUT /orders/:id
POST /orders/:id/timeline
```

## Environment Variables

The following environment variables must be set in Supabase:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Public anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-side only)
- `SUPABASE_DB_URL` - Database connection string

## Console Logging

When you click "Test Connection", detailed logs are written to the browser console:

```
========================================
SUPABASE CONNECTION TEST
========================================
🔍 Testing Supabase Connection...
Project ID: ljljxfgvjhrcocjruzgh
API Base: https://ljljxfgvjhrcocjruzgh.supabase.co/functions/v1/make-server-3cbf86a5
Public Anon Key: ✅ Present

📡 Test 1: Health Check Endpoint
Status: 200
Response: { status: "ok" }
✅ Health check passed

... etc ...
```

## Quick Diagnostic Checklist

- [ ] Status badge shows green
- [ ] Health endpoint returns 200
- [ ] Stats endpoint returns data
- [ ] Leads endpoint returns array
- [ ] Users endpoint returns array
- [ ] Orders endpoint returns array
- [ ] Response times < 1000ms
- [ ] No CORS errors in console
- [ ] No 401/403 auth errors

## Support

If all diagnostics fail and you've tried the solutions above:

1. Check the Supabase status page
2. Verify your Supabase project is active
3. Review Supabase function logs
4. Check for outages or maintenance windows
5. Contact Supabase support if needed

## Files Modified

- `/App.tsx` - Added diagnostics dialog and status indicator
- `/utils/test-supabase-connection.ts` - Connection testing utilities (NEW)
- `/components/SupabaseConnectionStatus.tsx` - Status badge component (NEW)
- `/components/SupabaseDiagnostics.tsx` - Diagnostics dialog (NEW)
- `/SUPABASE_CONNECTION_GUIDE.md` - This documentation (NEW)

---

**Last Updated:** January 7, 2026  
**Version:** 1.0.0
