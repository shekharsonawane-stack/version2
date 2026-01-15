import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { AlertCircle, CheckCircle2, XCircle, Info } from "lucide-react";

export function ConnectionHelp() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Common Issues & Quick Fixes</CardTitle>
          <CardDescription>Solutions to frequently encountered connection problems</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* CORS Errors */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <h3 className="font-semibold text-sm">CORS / "Failed to fetch" Errors</h3>
            </div>
            <div className="pl-6 space-y-1 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Symptoms:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Console shows "CORS policy" errors</li>
                <li>All endpoints fail to connect</li>
                <li>Network tab shows failed requests</li>
              </ul>
              <p className="font-medium text-foreground mt-2">Solutions:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Verify Supabase Edge Function is deployed</li>
                <li>Check CORS headers in <code className="bg-muted px-1 rounded">/supabase/functions/server/index.tsx</code></li>
                <li>Ensure function is accessible from your domain</li>
              </ol>
            </div>
          </div>

          <div className="border-t" />

          {/* 401 Unauthorized */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <h3 className="font-semibold text-sm">401 Unauthorized Errors</h3>
            </div>
            <div className="pl-6 space-y-1 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Symptoms:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Status code 401 on requests</li>
                <li>"Unauthorized" error messages</li>
              </ul>
              <p className="font-medium text-foreground mt-2">Solutions:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Verify <code className="bg-muted px-1 rounded">publicAnonKey</code> is correct</li>
                <li>Check key matches your Supabase project</li>
                <li>Ensure key hasn't been revoked</li>
              </ol>
            </div>
          </div>

          <div className="border-t" />

          {/* 404 Not Found */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <h3 className="font-semibold text-sm">404 Not Found Errors</h3>
            </div>
            <div className="pl-6 space-y-1 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Symptoms:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Status code 404 on specific endpoints</li>
                <li>"Not found" error messages</li>
              </ul>
              <p className="font-medium text-foreground mt-2">Solutions:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Deploy the edge function in Supabase dashboard</li>
                <li>Verify function name is <code className="bg-muted px-1 rounded">make-server-3cbf86a5</code></li>
                <li>Check routes in <code className="bg-muted px-1 rounded">index.tsx</code></li>
              </ol>
            </div>
          </div>

          <div className="border-t" />

          {/* 500 Internal Server Error */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <h3 className="font-semibold text-sm">500 Internal Server Errors</h3>
            </div>
            <div className="pl-6 space-y-1 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Symptoms:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Status code 500 on requests</li>
                <li>"Internal server error" messages</li>
              </ul>
              <p className="font-medium text-foreground mt-2">Solutions:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Check Supabase function logs for errors</li>
                <li>Review error details in diagnostics response</li>
                <li>Verify KV store is accessible</li>
                <li>Check for code errors in backend files</li>
              </ol>
            </div>
          </div>

          <div className="border-t" />

          {/* Slow Response Times */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" />
              <h3 className="font-semibold text-sm">Slow Response Times</h3>
            </div>
            <div className="pl-6 space-y-1 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Symptoms:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Response times &gt; 2000ms</li>
                <li>Requests take several seconds</li>
              </ul>
              <p className="font-medium text-foreground mt-2">Explanation:</p>
              <p className="ml-2">
                First request after idle is slow due to "cold start" - this is normal. 
                Subsequent requests should be faster (&lt;500ms).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <CheckCircle2 className="w-4 h-4" />
        <AlertDescription>
          <span className="font-medium">Tip:</span> Open browser DevTools (F12) and check the Console 
          and Network tabs for detailed error information when running diagnostics.
        </AlertDescription>
      </Alert>
    </div>
  );
}
