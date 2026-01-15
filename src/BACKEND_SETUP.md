# Backend Setup Instructions

## ⚠️ Connection Error: "Failed to fetch"

If you see this error, it means the backend Edge Functions haven't been deployed to Supabase yet.

## How to Fix

The Vision Studio app uses Supabase Edge Functions for the backend. The code is ready in `/supabase/functions/server/`, but it needs to be deployed.

### Option 1: Auto-Deploy (Recommended for Figma Make)
Figma Make should automatically deploy the Edge Functions when you preview or publish your app. If you're seeing errors:

1. **Refresh the page** - Sometimes the functions take a moment to deploy
2. **Wait 30 seconds** and check the "Backend Connected" badge in the top right
3. If it stays red, the functions may not have deployed properly

### Option 2: Manual Deploy (If you have Supabase CLI installed)
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref ljljxfgvjhrcocjruzgh

# Deploy the Edge Function
supabase functions deploy server
```

### Option 3: Use Demo/Offline Mode
The app is designed to work even without backend:
- Lead capture will log to console but not save to database
- Orders can still be placed (they just won't persist)
- You can use the "Seed Data" button to populate demo data locally

## What's in the Backend?

The backend provides:
- **Lead Management**: Capture and track leads from forms, chatbot, newsletter
- **User Management**: Store user accounts, preferences, order history
- **Order Processing**: Handle checkout, order tracking, delivery updates
- **CRM Analytics**: Calculate stats, conversion rates, revenue

All data is stored in the Supabase KV store table: `kv_store_3cbf86a5`

## Checking Connection Status

1. Look for the **"Backend Connected"** badge in the top-right corner
   - 🟢 Green = Backend is running
   - 🔴 Red = Backend is offline

2. Click **"Test Connection"** button in bottom-left for detailed diagnostics

3. Open **CRM Dashboard** → Click **"Check Data Sync"** to verify

## Error Messages Explained

| Error | Meaning | Solution |
|-------|---------|----------|
| `Failed to fetch` | Backend not responding | Wait for deployment or refresh page |
| `Backend Offline` | Edge Function not deployed | See deployment options above |
| `Connection timeout` | Request took too long | Check internet connection, try again |

## Still Having Issues?

1. Check browser console (F12) for detailed error logs
2. Verify project ID is correct in `/utils/supabase/info.tsx`
3. Make sure Supabase project is active (not paused)
4. Try the "Test Connection" button for diagnostics

## Developer Notes

The backend server code is in:
- `/supabase/functions/server/index.tsx` - Main API routes
- `/supabase/functions/server/crm.tsx` - CRM business logic
- `/supabase/functions/server/kv_store.tsx` - Database operations (READ-ONLY)

All API calls include 10-second timeouts and error handling.
