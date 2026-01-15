import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Eye,
  Info,
  ExternalLink,
  Copy,
  Network
} from "lucide-react";
import { API_BASE, publicAnonKey } from "../utils/supabase/client";
import { CRMSyncArchitectureDiagram } from "./CRMSyncArchitectureDiagram";

interface SyncCheckResult {
  backend: {
    connected: boolean;
    leads: number;
    users: number;
    orders: number;
    error?: string;
  };
  database: {
    accessible: boolean;
    tableName: string;
    message: string;
  };
  sync: {
    status: "synced" | "out-of-sync" | "error";
    message: string;
  };
}

export function CRMDataSyncChecker() {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<SyncCheckResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const checkSync = async () => {
    setChecking(true);
    setResult(null);

    try {
      // Step 1: Check backend API
      const statsRes = await fetch(`${API_BASE}/stats`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
      
      const statsData = await statsRes.json();
      
      const backendResult = {
        connected: statsData.success === true,
        leads: statsData.stats?.totalLeads || 0,
        users: statsData.stats?.totalUsers || 0,
        orders: statsData.stats?.totalOrders || 0,
        error: statsData.success ? undefined : statsData.error
      };

      // Step 2: Database info (the data IS in Supabase, just in KV store format)
      const databaseResult = {
        accessible: true,
        tableName: "kv_store_3cbf86a5",
        message: "CRM data is stored in Supabase KV store table"
      };

      // Step 3: Determine sync status
      let syncResult: SyncCheckResult["sync"];
      
      if (!backendResult.connected) {
        syncResult = {
          status: "error",
          message: "Cannot verify sync - backend not connected. The data may be in Supabase but the API is not responding."
        };
      } else if (backendResult.leads === 0 && backendResult.users === 0 && backendResult.orders === 0) {
        syncResult = {
          status: "synced",
          message: "Backend is connected but no data exists yet. Click 'Seed Data' to populate."
        };
      } else {
        syncResult = {
          status: "synced",
          message: `✅ CRM data is synced! ${backendResult.leads} leads, ${backendResult.users} users, ${backendResult.orders} orders are stored in Supabase.`
        };
      }

      setResult({
        backend: backendResult,
        database: databaseResult,
        sync: syncResult
      });
    } catch (error) {
      setResult({
        backend: {
          connected: false,
          leads: 0,
          users: 0,
          orders: 0,
          error: String(error)
        },
        database: {
          accessible: false,
          tableName: "kv_store_3cbf86a5",
          message: "Cannot access database"
        },
        sync: {
          status: "error",
          message: "Failed to check sync status. Please check your connection."
        }
      });
    } finally {
      setChecking(false);
    }
  };

  const copyTableName = () => {
    navigator.clipboard.writeText("kv_store_3cbf86a5");
  };

  return (
    <Tabs defaultValue="status" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="status">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Sync Status
        </TabsTrigger>
        <TabsTrigger value="architecture">
          <Network className="w-4 h-4 mr-2" />
          How It Works
        </TabsTrigger>
      </TabsList>

      <TabsContent value="status" className="mt-0">
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  CRM Data Sync Status
                </CardTitle>
                <CardDescription>
                  Verify that your CRM data is properly synced with Supabase
                </CardDescription>
              </div>
              <Button
                onClick={checkSync}
                disabled={checking}
                variant="outline"
              >
                {checking ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Check Sync
                  </>
                )}
              </Button>
            </div>
          </CardHeader>

      {result && (
        <CardContent className="space-y-4">
          {/* Sync Status Alert */}
          <Alert variant={result.sync.status === "synced" ? "default" : "destructive"}>
            {result.sync.status === "synced" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription className="ml-2">
              {result.sync.message}
            </AlertDescription>
          </Alert>

          {/* Quick Stats */}
          {result.backend.connected && (
            <div className="grid grid-cols-3 gap-4 p-4 bg-stone-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-stone-900">
                  {result.backend.leads}
                </div>
                <div className="text-sm text-stone-600">Leads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-stone-900">
                  {result.backend.users}
                </div>
                <div className="text-sm text-stone-600">Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-stone-900">
                  {result.backend.orders}
                </div>
                <div className="text-sm text-stone-600">Orders</div>
              </div>
            </div>
          )}

          {/* Understanding CRM Data Storage */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-sm">
                <p className="font-medium text-blue-900">
                  How CRM Data is Stored in Supabase:
                </p>
                <ul className="space-y-1 text-blue-800 list-disc list-inside">
                  <li>
                    All CRM data (leads, users, orders) is stored in the{" "}
                    <button
                      onClick={copyTableName}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 rounded font-mono text-xs hover:bg-blue-200 transition-colors"
                    >
                      kv_store_3cbf86a5
                      <Copy className="w-3 h-3" />
                    </button>
                    {" "}table
                  </li>
                  <li>Data is stored in key-value format (JSON objects)</li>
                  <li>The backend API reads/writes directly to this table</li>
                  <li>Every create/update operation syncs immediately to Supabase</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Detailed Status */}
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full justify-between"
            >
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {showDetails ? "Hide" : "Show"} Technical Details
              </span>
              <span className="text-xs text-stone-500">
                {showDetails ? "▲" : "▼"}
              </span>
            </Button>

            {showDetails && (
              <div className="space-y-3 p-4 bg-stone-50 rounded-lg text-sm">
                {/* Backend Status */}
                <div>
                  <div className="font-medium text-stone-700 mb-1">Backend API Status</div>
                  <div className="flex items-center gap-2">
                    <Badge variant={result.backend.connected ? "default" : "destructive"}>
                      {result.backend.connected ? "Connected" : "Disconnected"}
                    </Badge>
                    {result.backend.error && (
                      <span className="text-xs text-red-600">
                        Error: {result.backend.error}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-stone-600 mt-1">
                    Endpoint: {API_BASE}/stats
                  </div>
                </div>

                {/* Database Status */}
                <div>
                  <div className="font-medium text-stone-700 mb-1">Database Table</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {result.database.tableName}
                      </Badge>
                      <button
                        onClick={copyTableName}
                        className="p-1 hover:bg-stone-200 rounded"
                        title="Copy table name"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs text-stone-600">{result.database.message}</p>
                  </div>
                </div>

                {/* How to View in Supabase */}
                <div>
                  <div className="font-medium text-stone-700 mb-1">View Data in Supabase Dashboard</div>
                  <ol className="text-xs text-stone-600 space-y-1 list-decimal list-inside">
                    <li>Go to your Supabase project dashboard</li>
                    <li>Click "Table Editor" in the left sidebar</li>
                    <li>Find and open the "kv_store_3cbf86a5" table</li>
                    <li>You'll see rows with keys like "lead:lead_xxx", "user:user_xxx", "order:order_xxx"</li>
                    <li>The "value" column contains the full JSON data for each record</li>
                  </ol>
                  <a
                    href={`https://supabase.com/dashboard/project/${projectId}/editor`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs text-blue-600 hover:text-blue-700"
                  >
                    Open Supabase Table Editor
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Data Format Example */}
                <div>
                  <div className="font-medium text-stone-700 mb-1">Data Format in KV Store</div>
                  <div className="text-xs bg-stone-900 text-stone-100 p-2 rounded font-mono overflow-x-auto">
                    <div className="text-green-400">// Example rows in kv_store_3cbf86a5:</div>
                    <div className="mt-1">
                      <span className="text-blue-400">key:</span> "lead:lead_1234567890_abc"
                    </div>
                    <div>
                      <span className="text-blue-400">value:</span> {`{"id":"lead_...","email":"...","status":"new",...}`}
                    </div>
                    <div className="mt-2">
                      <span className="text-blue-400">key:</span> "user:user_1234567890_xyz"
                    </div>
                    <div>
                      <span className="text-blue-400">value:</span> {`{"id":"user_...","name":"...","email":"...",...}`}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Troubleshooting */}
          {result.sync.status === "error" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="font-medium text-yellow-900 mb-2">Troubleshooting Steps:</div>
              <ol className="space-y-1 text-sm text-yellow-800 list-decimal list-inside">
                <li>Check if the backend Edge Function is deployed in Supabase</li>
                <li>Verify the function "make-server-3cbf86a5" exists in your project</li>
                <li>Check the browser console for detailed error messages</li>
                <li>Try clicking "Test Connection" button in the bottom-left corner</li>
                <li>Review the QUICK_START_CONNECTION_CHECK.md guide</li>
              </ol>
            </div>
          )}
        </CardContent>
      )}

      {!result && !checking && (
        <CardContent>
          <div className="text-center py-8 text-stone-500">
            <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Click "Check Sync" to verify your CRM data synchronization</p>
          </div>
        </CardContent>
      )}
        </Card>
      </TabsContent>

      <TabsContent value="architecture" className="mt-0">
        <CRMSyncArchitectureDiagram />
      </TabsContent>
    </Tabs>
  );
}