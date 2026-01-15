import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowDown, Database, Server, Monitor, Check } from "lucide-react";

/**
 * Visual diagram explaining how CRM data syncs with Supabase
 * Can be used in documentation or as a standalone educational component
 */
export function CRMSyncArchitectureDiagram() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CRM Data Sync Architecture</CardTitle>
        <CardDescription>
          How your data flows from the frontend to Supabase database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Layer 1: Frontend */}
          <div className="relative">
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-blue-900">Frontend Layer</div>
                  <div className="text-sm text-blue-700">React Components</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <Badge variant="outline" className="justify-center">CRM Dashboard</Badge>
                <Badge variant="outline" className="justify-center">Forms</Badge>
                <Badge variant="outline" className="justify-center">Admin Panel</Badge>
              </div>
              <div className="mt-3 text-xs text-blue-800 bg-blue-100 p-2 rounded">
                <strong>Actions:</strong> Create leads, users, orders • View data • Update records
              </div>
            </div>
            
            {/* Arrow */}
            <div className="flex justify-center my-2">
              <div className="flex flex-col items-center">
                <ArrowDown className="w-6 h-6 text-stone-400" />
                <span className="text-xs text-stone-600 bg-stone-100 px-2 py-1 rounded">
                  API Calls (fetch)
                </span>
              </div>
            </div>
          </div>

          {/* Layer 2: Backend */}
          <div className="relative">
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <Server className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-green-900">Backend Layer</div>
                  <div className="text-sm text-green-700">Supabase Edge Function</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <Badge variant="outline" className="justify-center">API Routes</Badge>
                <Badge variant="outline" className="justify-center">CRM Logic</Badge>
                <Badge variant="outline" className="justify-center">KV Operations</Badge>
              </div>
              <div className="mt-3 text-xs text-green-800 bg-green-100 p-2 rounded">
                <strong>Processing:</strong> Validate data • Generate IDs • Execute KV store operations
              </div>
            </div>
            
            {/* Arrow */}
            <div className="flex justify-center my-2">
              <div className="flex flex-col items-center">
                <ArrowDown className="w-6 h-6 text-stone-400" />
                <span className="text-xs text-stone-600 bg-stone-100 px-2 py-1 rounded">
                  Direct Write/Read
                </span>
              </div>
            </div>
          </div>

          {/* Layer 3: Database */}
          <div className="relative">
            <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-purple-900">Database Layer</div>
                  <div className="text-sm text-purple-700">Supabase Postgres</div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <Badge variant="outline" className="justify-center font-mono">
                  kv_store_3cbf86a5
                </Badge>
              </div>
              <div className="mt-3 text-xs text-purple-800 bg-purple-100 p-2 rounded">
                <strong>Storage:</strong> Key-value pairs • JSON data • Persistent & durable
              </div>
            </div>
          </div>

          {/* Data Flow Summary */}
          <div className="bg-stone-100 border border-stone-300 rounded-lg p-4">
            <div className="flex items-start gap-2 mb-3">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <strong className="text-stone-900">Synchronous Operation:</strong>
                <p className="text-stone-700 mt-1">
                  Every operation (create, read, update, delete) happens <strong>immediately and directly</strong> on the Supabase database. There is no caching, no queue, and no sync delay.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3 text-xs">
              <div className="bg-white p-2 rounded border">
                <div className="font-semibold text-stone-700 mb-1">Write</div>
                <div className="text-stone-600">Frontend → API → DB ✅</div>
              </div>
              <div className="bg-white p-2 rounded border">
                <div className="font-semibold text-stone-700 mb-1">Read</div>
                <div className="text-stone-600">DB → API → Frontend ✅</div>
              </div>
              <div className="bg-white p-2 rounded border">
                <div className="font-semibold text-stone-700 mb-1">Update</div>
                <div className="text-stone-600">Frontend → API → DB ✅</div>
              </div>
            </div>
          </div>

          {/* Example Data Structure */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
            <div className="text-sm font-semibold text-stone-800 mb-2">
              Example: Creating a New Lead
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="bg-blue-100 p-2 rounded">
                <span className="text-blue-700">1. Frontend:</span>{" "}
                <span className="text-blue-900">captureLead({`{email: "test@example.com"}`})</span>
              </div>
              <div className="bg-green-100 p-2 rounded">
                <span className="text-green-700">2. Backend:</span>{" "}
                <span className="text-green-900">POST /leads → createLead()</span>
              </div>
              <div className="bg-purple-100 p-2 rounded">
                <span className="text-purple-700">3. Database:</span>{" "}
                <span className="text-purple-900">SET "lead:lead_xxx" = {`{...data}`}</span>
              </div>
              <div className="bg-stone-200 p-2 rounded">
                <span className="text-stone-700">4. Result:</span>{" "}
                <span className="text-stone-900">Data immediately in Supabase ✓</span>
              </div>
            </div>
          </div>

          {/* Key Points */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
              <div>
                <strong>Real-time sync</strong> - No delay between operations
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
              <div>
                <strong>Persistent storage</strong> - Data survives page refresh
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
              <div>
                <strong>Single source of truth</strong> - Supabase is the database
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
              <div>
                <strong>No manual sync</strong> - Automatic on every operation
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
