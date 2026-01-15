import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Eye, ShoppingCart, CheckCircle2, RefreshCw, Play } from 'lucide-react';
import { trackProductView, trackCheckoutComplete, trackAddToCart } from '../utils/journey-tracker';
import { toast } from 'sonner@2.0.3';
import { API_BASE, publicAnonKey } from '../utils/supabase/client';

export function AnalyticsDebugger() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading analytics from server...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_BASE}/analytics`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
        console.log('✅ Analytics Data:', data.analytics);
        toast.success('Analytics loaded successfully!');
      } else {
        console.error('❌ Server error:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('❌ Error details:', errorText);
        toast.error(`Server error: ${response.status} ${response.statusText}`);
      }
    } catch (error: any) {
      // Silent fail for network errors - backend not deployed is expected
      if (error.name === 'AbortError') {
        toast.error('Request timed out - try again');
      } else {
        // Don't show error toast for normal fetch failures (backend not deployed)
      }
      // Set empty analytics on error so UI doesn't break
      setAnalytics({
        totalEvents: 0,
        eventsByType: {},
        recentEvents: []
      });
    } finally {
      setLoading(false);
    }
  };

  const testProductView = async () => {
    console.log('🧪 Testing product view tracking...');
    await trackProductView('test-product-1', 'Test Product', 1500);
    toast.success('Product view tracked! Wait 2 seconds then refresh.');
    setTimeout(loadAnalytics, 2000);
  };

  const testAddToCart = async () => {
    console.log('🧪 Testing add to cart tracking...');
    await trackAddToCart('test-product-1', 'Test Product', 1500, 1);
    toast.success('Add to cart tracked! Wait 2 seconds then refresh.');
    setTimeout(loadAnalytics, 2000);
  };

  const testCheckoutComplete = async () => {
    console.log('🧪 Testing checkout complete tracking...');
    await trackCheckoutComplete('TEST-ORDER-123', 3500, 'Bank Transfer');
    toast.success('Checkout complete tracked! Wait 2 seconds then refresh.');
    setTimeout(loadAnalytics, 2000);
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Analytics Debugger</CardTitle>
            <CardDescription>Test and verify event tracking</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadAnalytics}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test Buttons */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Test Tracking Functions</h3>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={testProductView}
            >
              <Eye className="h-4 w-4" />
              Test Product View
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={testAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              Test Add to Cart
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={testCheckoutComplete}
            >
              <CheckCircle2 className="h-4 w-4" />
              Test Checkout
            </Button>
          </div>
        </div>

        {/* Analytics Overview */}
        {analytics && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {analytics.totalEvents || 0}
                </div>
                <div className="text-sm text-blue-600">Total Events</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {analytics.eventsByType?.product_view || 0}
                </div>
                <div className="text-sm text-green-600">Product Views</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {analytics.eventsByType?.add_to_cart || 0}
                </div>
                <div className="text-sm text-yellow-600">Add to Cart</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {analytics.eventsByType?.checkout_complete || 0}
                </div>
                <div className="text-sm text-purple-600">Checkouts</div>
              </div>
            </div>

            {/* Event Type Breakdown */}
            <div>
              <h3 className="font-semibold text-sm mb-3">All Event Types</h3>
              <div className="space-y-2">
                {analytics.eventsByType && Object.entries(analytics.eventsByType).map(([type, count]: [string, any]) => (
                  <div key={type} className="flex items-center justify-between py-2 px-3 bg-stone-50 rounded">
                    <span className="text-sm capitalize">{type.replace(/_/g, ' ')}</span>
                    <Badge>{count}</Badge>
                  </div>
                ))}
                {(!analytics.eventsByType || Object.keys(analytics.eventsByType).length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    No events tracked yet. Try clicking the test buttons above.
                  </div>
                )}
              </div>
            </div>

            {/* Recent Events */}
            <div>
              <h3 className="font-semibold text-sm mb-3">Recent Events (Last 10)</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {analytics.recentEvents && analytics.recentEvents.length > 0 ? (
                  analytics.recentEvents.slice(0, 10).map((event: any, idx: number) => (
                    <div key={idx} className="p-3 bg-stone-50 rounded text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold capitalize">{event.eventType?.replace(/_/g, ' ')}</span>
                        <Badge variant="outline" className="text-xs">{event.deviceType}</Badge>
                      </div>
                      <div className="text-muted-foreground">{event.eventName}</div>
                      {event.metadata && (
                        <div className="text-muted-foreground font-mono">
                          {JSON.stringify(event.metadata)}
                        </div>
                      )}
                      <div className="text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent events
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}