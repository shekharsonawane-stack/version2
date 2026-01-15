import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { CheckCircle2, XCircle, AlertCircle, Loader2, Database, Server, Link as LinkIcon } from "lucide-react";
import { API_BASE, publicAnonKey, projectId } from "../utils/supabase/client";

interface EndpointTest {
  name: string;
  endpoint: string;
  status: "pending" | "testing" | "success" | "error";
  statusCode?: number;
  responseTime?: number;
  error?: string;
  data?: any;
}

export function SupabaseDiagnostics({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [isTesting, setIsTesting] = useState(false);
  const [endpoints, setEndpoints] = useState<EndpointTest[]>([
    { name: "Health Check", endpoint: "/health", status: "pending" },
    { name: "CRM Stats", endpoint: "/stats", status: "pending" },
    { name: "Get Leads", endpoint: "/leads", status: "pending" },
    { name: "Get Users", endpoint: "/users", status: "pending" },
    { name: "Get Orders", endpoint: "/orders", status: "pending" },
  ]);

  const testEndpoint = async (endpoint: EndpointTest): Promise<EndpointTest> => {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${API_BASE}${endpoint.endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });

      const endTime = Date.now();
      const data = await response.json();

      return {
        ...endpoint,
        status: response.ok ? "success" : "error",
        statusCode: response.status,
        responseTime: endTime - startTime,
        data: response.ok ? data : undefined,
        error: !response.ok ? JSON.stringify(data) : undefined,
      };
    } catch (error) {
      const endTime = Date.now();
      return {
        ...endpoint,
        status: "error",
        responseTime: endTime - startTime,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  };

  const runAllTests = async () => {
    setIsTesting(true);
    const results: EndpointTest[] = [];

    for (const endpoint of endpoints) {
      // Update status to testing
      setEndpoints((prev) =>
        prev.map((e) => (e.endpoint === endpoint.endpoint ? { ...e, status: "testing" } : e))
      );

      // Run test
      const result = await testEndpoint(endpoint);
      results.push(result);

      // Update with result
      setEndpoints((prev) =>
        prev.map((e) => (e.endpoint === endpoint.endpoint ? result : e))
      );
    }

    setIsTesting(false);
  };

  const getStatusIcon = (status: EndpointTest["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "testing":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: EndpointTest["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500">Success</Badge>;
      case "error":
        return <Badge variant="destructive">Failed</Badge>;
      case "testing":
        return <Badge className="bg-blue-500">Testing...</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const successCount = endpoints.filter((e) => e.status === "success").length;
  const errorCount = endpoints.filter((e) => e.status === "error").length;
  const overallHealth = errorCount === 0 && successCount === endpoints.length ? "healthy" : errorCount > 0 && successCount > 0 ? "degraded" : "offline";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Supabase Backend Diagnostics
          </DialogTitle>
          <DialogDescription>
            Comprehensive connection and API endpoint testing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Configuration Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Server className="w-4 h-4" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                <span className="text-muted-foreground">Project ID:</span>
                <code className="bg-muted px-2 py-1 rounded text-xs">{projectId}</code>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                <span className="text-muted-foreground">API Base:</span>
                <code className="bg-muted px-2 py-1 rounded text-xs break-all">{API_BASE}</code>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                <span className="text-muted-foreground">Anon Key:</span>
                <code className="bg-muted px-2 py-1 rounded text-xs break-all">
                  {publicAnonKey ? `${publicAnonKey.substring(0, 20)}...` : "Missing"}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Overall Status */}
          {successCount > 0 || errorCount > 0 ? (
            <Alert className={overallHealth === "healthy" ? "border-green-500" : overallHealth === "degraded" ? "border-yellow-500" : "border-red-500"}>
              <AlertDescription className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {overallHealth === "healthy" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : overallHealth === "degraded" ? (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="font-medium">
                    {overallHealth === "healthy" && "All systems operational"}
                    {overallHealth === "degraded" && "Some endpoints failing"}
                    {overallHealth === "offline" && "Backend connection issues"}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {successCount}/{endpoints.length} passing
                </div>
              </AlertDescription>
            </Alert>
          ) : null}

          {/* Test Button */}
          <Button onClick={runAllTests} disabled={isTesting} className="w-full">
            {isTesting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <LinkIcon className="w-4 h-4 mr-2" />
                Run Connection Tests
              </>
            )}
          </Button>

          {/* Endpoint Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">API Endpoints</CardTitle>
              <CardDescription>Testing all CRM backend endpoints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {endpoints.map((endpoint, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(endpoint.status)}
                      <span className="font-medium">{endpoint.name}</span>
                    </div>
                    {getStatusBadge(endpoint.status)}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <code className="bg-muted px-2 py-1 rounded">{endpoint.endpoint}</code>
                  </div>

                  {endpoint.status !== "pending" && (
                    <div className="space-y-1 text-xs">
                      {endpoint.statusCode && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Status Code:</span>
                          <code className={`px-2 py-0.5 rounded ${endpoint.statusCode >= 200 && endpoint.statusCode < 300 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {endpoint.statusCode}
                          </code>
                        </div>
                      )}
                      {endpoint.responseTime !== undefined && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Response Time:</span>
                          <span>{endpoint.responseTime}ms</span>
                        </div>
                      )}
                      {endpoint.error && (
                        <div className="mt-2">
                          <span className="text-red-600 font-medium">Error:</span>
                          <pre className="mt-1 p-2 bg-red-50 rounded text-xs overflow-x-auto">
                            {endpoint.error}
                          </pre>
                        </div>
                      )}
                      {endpoint.data && endpoint.status === "success" && (
                        <div className="mt-2">
                          <span className="text-green-600 font-medium">Response:</span>
                          <pre className="mt-1 p-2 bg-green-50 rounded text-xs overflow-x-auto max-h-32 overflow-y-auto">
                            {JSON.stringify(endpoint.data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Troubleshooting Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Troubleshooting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="space-y-1">
                <p className="font-medium">If tests are failing:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                  <li>Check that the Supabase project is active and deployed</li>
                  <li>Verify environment variables are set correctly</li>
                  <li>Check browser console for detailed error messages</li>
                  <li>Ensure CORS is properly configured on the server</li>
                  <li>Verify the edge function is deployed and running</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}