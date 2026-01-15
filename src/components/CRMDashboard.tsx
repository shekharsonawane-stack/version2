import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";
import { AnalyticsDebugger } from "./AnalyticsDebugger";
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  ShoppingCart,
  ShoppingBag, 
  Package, 
  DollarSign,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Edit,
  Send,
  Tag,
  RefreshCw,
  Trash2,
  BarChart3,
  Monitor,
  Smartphone,
  Tablet,
  MousePointerClick,
  Bell,
  Plus,
  Target,
  Zap,
  MessageSquare
} from "lucide-react";
import { API_BASE, publicAnonKey } from "../utils/supabase/client";
import { SurveyManager } from "./SurveyManager";

interface Lead {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  source: string;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  interests?: string[];
  budget?: string;
  roomType?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  accountStatus: "active" | "inactive" | "suspended";
  signupDate: string;
  lastLogin?: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  tags?: string[];
}

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  estimatedDelivery?: string;
  items: any[];
  subtotal?: number;
  tax?: number;
  shipping?: number;
  discount?: number;
  paymentMethod?: string;
  shippingAddress?: {
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  trackingNumber?: string;
  customerName?: string;
  customerEmail?: string;
}

interface CRMStats {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  conversionRate: number;
}

export function CRMDashboard() {
  const [stats, setStats] = useState<CRMStats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Analytics state
  const [analytics, setAnalytics] = useState<any>(null);
  const [favoritesAnalytics, setFavoritesAnalytics] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [campaignType, setCampaignType] = useState<'email' | 'popup'>('email');

  useEffect(() => {
    loadDashboardData();
    loadAnalytics();
    loadFavoritesAnalytics();
    loadCampaigns();
  }, []);

  // Auto-refresh every 30 seconds when enabled
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      console.log("🔄 Auto-refreshing CRM data...");
      loadDashboardData();
      loadAnalytics();
      loadFavoritesAnalytics();
      loadCampaigns();
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add timeout to prevent hanging
      const fetchWithTimeout = (url: string, timeout = 20000) => {
        return Promise.race([
          fetch(url, {
            headers: { Authorization: `Bearer ${publicAnonKey}` }
          }),
          new Promise<Response>((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), timeout)
          )
        ]);
      };

      const [statsRes, leadsRes, usersRes, ordersRes] = await Promise.all([
        fetchWithTimeout(`${API_BASE}/stats`),
        fetchWithTimeout(`${API_BASE}/leads`),
        fetchWithTimeout(`${API_BASE}/users`),
        fetchWithTimeout(`${API_BASE}/orders`)
      ]);

      const [statsData, leadsData, usersData, ordersData] = await Promise.all([
        statsRes.json(),
        leadsRes.json(),
        usersRes.json(),
        ordersRes.json()
      ]);

      if (statsData.success) setStats(statsData.stats);
      if (leadsData.success) setLeads(leadsData.leads);
      if (usersData.success) setUsers(usersData.users);
      if (ordersData.success) setOrders(ordersData.orders);
      
      setLastUpdated(new Date());
      console.log("✅ CRM dashboard data loaded successfully");
    } catch (error) {
      // Silent fail - backend not deployed is expected behavior
      
      // Use mock data when backend is unavailable
      setStats({
        totalLeads: 0,
        newLeads: 0,
        qualifiedLeads: 0,
        convertedLeads: 0,
        totalUsers: 0,
        activeUsers: 0,
        newUsersThisMonth: 0,
        totalOrders: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        conversionRate: 0
      });
      setLeads([]);
      setUsers([]);
      setOrders([]);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout
      
      const res = await fetch(`${API_BASE}/analytics`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.analytics);
        console.log("✅ Analytics data loaded successfully");
        console.log("📊 Events by type:", data.analytics.eventsByType);
        console.log("🛒 Cart events:", {
          add_to_cart: data.analytics.eventsByType?.add_to_cart || 0,
          remove_from_cart: data.analytics.eventsByType?.remove_from_cart || 0,
          cart_cleared: data.analytics.eventsByType?.cart_cleared || 0,
          cart_abandoned: data.analytics.eventsByType?.cart_abandoned || 0
        });
      } else {
        // Silent - backend not deployed
      }
    } catch (error) {
      // Silent fail - backend not deployed is expected behavior
      // Use mock analytics data
      setAnalytics({
        totalEvents: 0,
        uniqueSessions: 0,
        uniqueUsers: 0,
        eventsByType: {},
        deviceBreakdown: {},
        pageViews: [],
        conversionFunnel: {
          pageViews: 0,
          productViews: 0,
          addToCart: 0,
          checkoutStart: 0,
          checkoutComplete: 0,
          conversionRate: '0.00'
        },
        recentEvents: []
      });
    }
  };

  const loadFavoritesAnalytics = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);
      
      const res = await fetch(`${API_BASE}/favorites/analytics/all`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const data = await res.json();
      if (data.success) {
        setFavoritesAnalytics(data.analytics);
        console.log("✅ Favorites analytics loaded:", data.analytics);
      }
    } catch (error) {
      // Silent fail
      setFavoritesAnalytics({
        totalFavorites: 0,
        uniqueProducts: 0,
        topFavorites: [],
        usersWithFavorites: 0
      });
    }
  };

  const loadCampaigns = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout
      
      const res = await fetch(`${API_BASE}/campaigns`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const data = await res.json();
      if (data.success) {
        setCampaigns(data.campaigns);
        console.log("✅ Campaigns data loaded successfully");
      }
    } catch (error) {
      // Silent fail - backend not deployed is expected behavior
      // Use empty campaigns array
      setCampaigns([]);
    }
  };

  const createCampaign = async (campaignData: any) => {
    try {
      const res = await fetch(`${API_BASE}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(campaignData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Campaign created successfully');
        loadCampaigns();
        setShowCampaignDialog(false);
        return true;
      }
    } catch (error) {
      console.error('Failed to create campaign:', error);
      toast.error('Failed to create campaign');
    }
    return false;
  };

  const sendCampaign = async (campaignId: string) => {
    try {
      const res = await fetch(`${API_BASE}/campaigns/${campaignId}/send`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${publicAnonKey}` }
      });
      const data = await res.json();
      if (data.success) {
        // Show detailed toast with recipient information and email status
        const recipientCount = data.recipients?.length || data.campaign?.sentCount || 0;
        const emailResults = data.emailSendResults;
        
        // Check if there's a warning (invalid API key format)
        if (data.warning) {
          toast.warning(
            `⚠️ Campaign prepared but not sent`,
            {
              description: data.warning + '\n\nCampaign marked as sent in CRM, but no emails were delivered.',
              duration: 10000
            }
          );
        } else if (emailResults) {
          // Real emails were sent
          if (emailResults.success > 0 && emailResults.failed === 0) {
            toast.success(
              `✅ ${emailResults.success} email(s) delivered successfully!`,
              {
                description: `Subject: ${data.emailPreview?.subject || 'N/A'}\nAll emails sent to recipient inboxes.`,
                duration: 6000
              }
            );
          } else if (emailResults.success > 0 && emailResults.failed > 0) {
            toast.warning(
              `⚠️ ${emailResults.success} sent, ${emailResults.failed} failed`,
              {
                description: `Check console for error details. Some emails were delivered successfully.`,
                duration: 8000
              }
            );
          } else {
            toast.error(
              `❌ Failed to send emails`,
              {
                description: `All ${emailResults.failed} email(s) failed. Check console for details.`,
                duration: 8000
              }
            );
          }
        } else {
          // No real emails sent (API key not configured)
          toast.info(
            `Campaign prepared for ${recipientCount} recipient(s)`,
            {
              description: '⚠️ Configure RESEND_API_KEY to send real emails to inboxes.\nCheck server logs for email preview.',
              duration: 8000
            }
          );
        }
        
        // Log detailed information to console
        console.log('\n📧 EMAIL CAMPAIGN - Frontend Details');
        console.log('==========================================');
        console.log(`Campaign: ${data.campaign?.name}`);
        console.log(`Recipients (${recipientCount}):`);
        if (data.recipients && data.recipients.length > 0) {
          data.recipients.forEach((r: any, idx: number) => {
            console.log(`  ${idx + 1}. ${r.name} <${r.email}> [${r.type}]`);
          });
        }
        if (emailResults) {
          console.log('\n📊 Email Delivery Results:');
          console.log(`   ✅ Successfully sent: ${emailResults.success}`);
          console.log(`   ❌ Failed: ${emailResults.failed}`);
          if (emailResults.errors && emailResults.errors.length > 0) {
            console.log('\n   Errors:');
            emailResults.errors.forEach((err: string) => console.log(`     - ${err}`));
          }
        }
        if (data.emailPreview) {
          console.log('\n📝 Email Preview:');
          console.log(`   Subject: ${data.emailPreview.subject}`);
          console.log(`   Content: ${data.emailPreview.content}`);
        }
        console.log('==========================================\n');
        
        loadCampaigns();
      }
    } catch (error) {
      console.error('Failed to send campaign:', error);
      toast.error('Failed to send campaign', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    
    try {
      const res = await fetch(`${API_BASE}/campaigns/${campaignId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${publicAnonKey}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Campaign deleted');
        loadCampaigns();
      }
    } catch (error) {
      console.error('Failed to delete campaign:', error);
      toast.error('Failed to delete campaign');
    }
  };

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      const res = await fetch(`${API_BASE}/leads/${leadId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ status })
      });

      const data = await res.json();
      if (data.success) {
        setLeads(leads.map(l => l.id === leadId ? data.lead : l));
        if (selectedLead?.id === leadId) setSelectedLead(data.lead);
        toast.success("Lead status updated");
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Failed to update lead");
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`
        }
      });

      const data = await res.json();
      if (data.success) {
        setUsers(users.filter(u => u.id !== userId));
        toast.success("User deleted successfully");
        loadDashboardData(); // Refresh to update stats
      } else {
        toast.error(data.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`
        }
      });

      const data = await res.json();
      if (data.success) {
        setOrders(orders.filter(o => o.id !== orderId));
        toast.success("Order deleted successfully");
        loadDashboardData(); // Refresh to update stats
      } else {
        toast.error(data.error || "Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  const updateOrderStatus = async (orderId: string, status: "pending" | "shipped" | "delayed" | "delivered") => {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ status })
      });

      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => o.id === orderId ? data.order : o));
        if (selectedOrder?.id === orderId) setSelectedOrder(data.order);
        toast.success(`Order status updated to ${status}${status === "delivered" ? " - Order marked as complete!" : ""}`);
      } else {
        toast.error(data.error || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      new: "default",
      contacted: "secondary",
      qualified: "outline",
      converted: "default",
      lost: "destructive",
      active: "default",
      inactive: "secondary",
      suspended: "destructive",
      processing: "secondary",
      "in-transit": "outline",
      delivered: "default",
      cancelled: "destructive"
    };

    return <Badge variant={variants[status] || "default"}>{status.replace("-", " ")}</Badge>;
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !searchTerm || 
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || lead.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || user.accountStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600">Loading CRM Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">CRM Dashboard</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-stone-600">Manage leads, users, and orders</p>
              <span className="text-xs text-stone-400">
                • Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setAutoRefresh(!autoRefresh);
                toast.success(autoRefresh ? "Auto-refresh disabled" : "Auto-refresh enabled (30s)");
              }}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
              {autoRefresh ? "Auto-Refresh ON" : "Auto-Refresh OFF"}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                loadDashboardData();
                toast.success("Dashboard data refreshed");
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Now
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                <UserPlus className="h-4 w-4 text-stone-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalLeads}</div>
                <p className="text-xs text-stone-600 mt-1">
                  {stats.newLeads} new this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-stone-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
                <p className="text-xs text-stone-600 mt-1">
                  {stats.newUsersThisMonth} new signups
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-stone-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-stone-600 mt-1">
                  {stats.pendingOrders} pending
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-stone-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">BND {stats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-stone-600 mt-1">
                  Avg: BND {Math.round(stats.averageOrderValue).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="leads" className="space-y-4">
          <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-stone-100 p-1 text-stone-500">
            <TabsTrigger value="leads" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-stone-950 data-[state=active]:shadow-sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Leads ({leads.length})
            </TabsTrigger>
            <TabsTrigger value="users" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-stone-950 data-[state=active]:shadow-sm">
              <Users className="w-4 h-4 mr-2" />
              Users ({users.length})
            </TabsTrigger>
            <TabsTrigger value="orders" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-stone-950 data-[state=active]:shadow-sm">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-stone-950 data-[state=active]:shadow-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="surveys" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-stone-950 data-[state=active]:shadow-sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Surveys
            </TabsTrigger>
          </TabsList>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Lead Management</CardTitle>
                    <CardDescription>Track and manage potential customers</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
                      <Input
                        placeholder="Search leads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contact</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Interest</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-stone-500 py-8">
                          No leads found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLeads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{lead.name || "No name"}</div>
                              <div className="text-sm text-stone-500">{lead.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{lead.source}</Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(lead.status)}</TableCell>
                          <TableCell className="text-sm">{lead.roomType || "—"}</TableCell>
                          <TableCell className="text-sm text-stone-500">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setSelectedLead(lead)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Lead Details</DialogTitle>
                                  <DialogDescription>
                                    Manage and update lead information
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedLead && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-xs text-stone-500">Name</Label>
                                        <p className="font-medium">{selectedLead.name || "—"}</p>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-stone-500">Email</Label>
                                        <p className="font-medium">{selectedLead.email}</p>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-stone-500">Phone</Label>
                                        <p className="font-medium">{selectedLead.phone || "—"}</p>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-stone-500">Source</Label>
                                        <p className="font-medium">{selectedLead.source}</p>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-stone-500">Room Type</Label>
                                        <p className="font-medium">{selectedLead.roomType || "—"}</p>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-stone-500">Budget</Label>
                                        <p className="font-medium">{selectedLead.budget || "—"}</p>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <Label className="text-xs text-stone-500">Update Status</Label>
                                      <Select 
                                        value={selectedLead.status}
                                        onValueChange={(value) => updateLeadStatus(selectedLead.id, value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="new">New</SelectItem>
                                          <SelectItem value="contacted">Contacted</SelectItem>
                                          <SelectItem value="qualified">Qualified</SelectItem>
                                          <SelectItem value="converted">Converted</SelectItem>
                                          <SelectItem value="lost">Lost</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {selectedLead.notes && (
                                      <div>
                                        <Label className="text-xs text-stone-500">Notes</Label>
                                        <p className="text-sm">{selectedLead.notes}</p>
                                      </div>
                                    )}

                                    <div className="flex gap-2 pt-4">
                                      <Button className="flex-1">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Send Email
                                      </Button>
                                      <Button variant="outline" className="flex-1">
                                        <Phone className="w-4 h-4 mr-2" />
                                        Call
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage registered customers</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-stone-500 py-8">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-stone-500">{user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(user.accountStatus)}</TableCell>
                          <TableCell>{user.totalOrders}</TableCell>
                          <TableCell className="font-medium">BND {user.totalSpent.toLocaleString()}</TableCell>
                          <TableCell className="text-sm text-stone-500">
                            {new Date(user.signupDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setSelectedUser(user)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>User Profile</DialogTitle>
                                  <DialogDescription>
                                    View and manage user details
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedUser && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-xs text-stone-500">Name</Label>
                                        <p className="font-medium">{selectedUser.name}</p>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-stone-500">Email</Label>
                                        <p className="font-medium">{selectedUser.email}</p>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-stone-500">Phone</Label>
                                        <p className="font-medium">{selectedUser.phone || "—"}</p>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-stone-500">Status</Label>
                                        <div>{getStatusBadge(selectedUser.accountStatus)}</div>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-stone-500">Total Orders</Label>
                                        <p className="font-medium">{selectedUser.totalOrders}</p>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-stone-500">Total Spent</Label>
                                        <p className="font-medium">BND {selectedUser.totalSpent.toLocaleString()}</p>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-stone-500">Loyalty Points</Label>
                                        <p className="font-medium">{selectedUser.loyaltyPoints}</p>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-stone-500">Last Login</Label>
                                        <p className="text-sm">
                                          {selectedUser.lastLogin 
                                            ? new Date(selectedUser.lastLogin).toLocaleDateString()
                                            : "Never"
                                          }
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteUser(user.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Order Management</CardTitle>
                    <CardDescription>Track and manage customer orders</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
                      <Input
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="in-transit">In Transit</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order Number</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-stone-500 py-8">
                          No orders found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.orderNumber}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>{order.items.length} items</TableCell>
                          <TableCell className="font-medium">BND {order.total.toLocaleString()}</TableCell>
                          <TableCell className="text-sm text-stone-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setSelectedOrder(order)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Order Details - {order.orderNumber}</DialogTitle>
                                  <DialogDescription>
                                    Complete order information and status
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedOrder && (
                                  <div className="space-y-6">
                                    {/* Order Status Overview */}
                                    <div className="grid grid-cols-3 gap-4">
                                      <Card>
                                        <CardContent className="pt-6">
                                          <div className="text-center">
                                            <Package className="w-8 h-8 mx-auto mb-2 text-stone-600" />
                                            <p className="text-xs text-stone-500 mb-1">Order Status</p>
                                            <div className="flex justify-center">
                                              {getStatusBadge(selectedOrder.status)}
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                      <Card>
                                        <CardContent className="pt-6">
                                          <div className="text-center">
                                            <DollarSign className="w-8 h-8 mx-auto mb-2 text-stone-600" />
                                            <p className="text-xs text-stone-500 mb-1">Payment Status</p>
                                            <div className="flex justify-center">
                                              {getStatusBadge(selectedOrder.paymentStatus)}
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                      <Card>
                                        <CardContent className="pt-6">
                                          <div className="text-center">
                                            <Calendar className="w-8 h-8 mx-auto mb-2 text-stone-600" />
                                            <p className="text-xs text-stone-500 mb-1">Order Date</p>
                                            <p className="text-sm font-medium">
                                              {new Date(selectedOrder.createdAt).toLocaleDateString()}
                                            </p>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>

                                    {/* Customer Information */}
                                    <div>
                                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        Customer Information
                                      </h3>
                                      <div className="bg-stone-50 rounded-lg p-4 space-y-2">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label className="text-xs text-stone-500">Name</Label>
                                            <p className="font-medium">{selectedOrder.customerName || selectedOrder.shippingAddress?.name || "—"}</p>
                                          </div>
                                          <div>
                                            <Label className="text-xs text-stone-500">Email</Label>
                                            <p className="font-medium">{selectedOrder.customerEmail || "—"}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Shipping Address */}
                                    {selectedOrder.shippingAddress && (
                                      <div>
                                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                                          <MapPin className="w-4 h-4" />
                                          Shipping Address
                                        </h3>
                                        <div className="bg-stone-50 rounded-lg p-4">
                                          <p className="font-medium">{selectedOrder.shippingAddress.name}</p>
                                          <p className="text-sm text-stone-600 mt-1">{selectedOrder.shippingAddress.street}</p>
                                          <p className="text-sm text-stone-600">
                                            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                                          </p>
                                          <p className="text-sm text-stone-600">{selectedOrder.shippingAddress.country}</p>
                                          <p className="text-sm text-stone-600 mt-2 flex items-center gap-1">
                                            <Phone className="w-3 h-3" />
                                            {selectedOrder.shippingAddress.phone}
                                          </p>
                                        </div>
                                      </div>
                                    )}

                                    {/* Order Items */}
                                    <div>
                                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <ShoppingCart className="w-4 h-4" />
                                        Order Items ({selectedOrder.items.length})
                                      </h3>
                                      <div className="border rounded-lg overflow-hidden">
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>Item</TableHead>
                                              <TableHead className="text-center">Quantity</TableHead>
                                              <TableHead className="text-right">Price</TableHead>
                                              <TableHead className="text-right">Subtotal</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {selectedOrder.items.map((item: any, index: number) => (
                                              <TableRow key={index}>
                                                <TableCell>
                                                  <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    {item.variant && (
                                                      <p className="text-xs text-stone-500">
                                                        {item.variant.color}
                                                        {item.variant.material && ` • ${item.variant.material}`}
                                                      </p>
                                                    )}
                                                    {item.size && (
                                                      <p className="text-xs text-stone-500">{item.size.label}</p>
                                                    )}
                                                  </div>
                                                </TableCell>
                                                <TableCell className="text-center">{item.quantity}</TableCell>
                                                <TableCell className="text-right">BND {item.price.toLocaleString()}</TableCell>
                                                <TableCell className="text-right font-medium">
                                                  BND {(item.price * item.quantity).toLocaleString()}
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div>
                                      <h3 className="font-semibold mb-3">Order Summary</h3>
                                      <div className="bg-stone-50 rounded-lg p-4 space-y-2">
                                        {selectedOrder.subtotal !== undefined && (
                                          <div className="flex justify-between text-sm">
                                            <span className="text-stone-600">Subtotal</span>
                                            <span className="font-medium">BND {selectedOrder.subtotal.toLocaleString()}</span>
                                          </div>
                                        )}
                                        {selectedOrder.shipping !== undefined && (
                                          <div className="flex justify-between text-sm">
                                            <span className="text-stone-600">Shipping</span>
                                            <span className="font-medium">BND {selectedOrder.shipping.toLocaleString()}</span>
                                          </div>
                                        )}
                                        {selectedOrder.tax !== undefined && (
                                          <div className="flex justify-between text-sm">
                                            <span className="text-stone-600">Tax</span>
                                            <span className="font-medium">BND {selectedOrder.tax.toLocaleString()}</span>
                                          </div>
                                        )}
                                        {selectedOrder.discount !== undefined && selectedOrder.discount > 0 && (
                                          <div className="flex justify-between text-sm text-green-600">
                                            <span>Discount</span>
                                            <span className="font-medium">-BND {selectedOrder.discount.toLocaleString()}</span>
                                          </div>
                                        )}
                                        <div className="border-t pt-2 mt-2">
                                          <div className="flex justify-between">
                                            <span className="font-semibold">Total</span>
                                            <span className="font-bold text-lg">BND {selectedOrder.total.toLocaleString()}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Additional Information */}
                                    <div className="grid grid-cols-2 gap-4">
                                      {selectedOrder.paymentMethod && (
                                        <div>
                                          <Label className="text-xs text-stone-500">Payment Method</Label>
                                          <p className="font-medium capitalize">{selectedOrder.paymentMethod}</p>
                                        </div>
                                      )}
                                      {selectedOrder.trackingNumber && (
                                        <div>
                                          <Label className="text-xs text-stone-500">Tracking Number</Label>
                                          <p className="font-medium font-mono text-sm">{selectedOrder.trackingNumber}</p>
                                        </div>
                                      )}
                                      {selectedOrder.estimatedDelivery && (
                                        <div>
                                          <Label className="text-xs text-stone-500">Estimated Delivery</Label>
                                          <p className="font-medium">
                                            {new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}
                                          </p>
                                        </div>
                                      )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-4 pt-4 border-t">
                                      <div>
                                        <Label className="text-sm font-semibold mb-2 block">Update Order Status</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                          <Button 
                                            variant={selectedOrder.status === "pending-payment" || selectedOrder.status === "processing" ? "default" : "outline"} 
                                            size="sm"
                                            onClick={() => updateOrderStatus(selectedOrder.id, "pending")}
                                            className="flex-1"
                                          >
                                            <Clock className="w-4 h-4 mr-2" />
                                            Pending
                                          </Button>
                                          <Button 
                                            variant={selectedOrder.status === "in-transit" ? "default" : "outline"} 
                                            size="sm"
                                            onClick={() => updateOrderStatus(selectedOrder.id, "shipped")}
                                            className="flex-1"
                                          >
                                            <Package className="w-4 h-4 mr-2" />
                                            Shipped
                                          </Button>
                                          <Button 
                                            variant={selectedOrder.status === "delayed" ? "default" : "outline"} 
                                            size="sm"
                                            onClick={() => updateOrderStatus(selectedOrder.id, "delayed")}
                                            className="flex-1"
                                          >
                                            <AlertCircle className="w-4 h-4 mr-2" />
                                            Delayed
                                          </Button>
                                          <Button 
                                            variant={selectedOrder.status === "delivered" ? "default" : "outline"} 
                                            size="sm"
                                            onClick={() => updateOrderStatus(selectedOrder.id, "delivered")}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white border-green-600 data-[state=active]:bg-green-600"
                                            disabled={selectedOrder.status === "delivered"}
                                          >
                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                            Delivered
                                          </Button>
                                        </div>
                                        {selectedOrder.status === "delivered" && (
                                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                                            <div className="flex items-start gap-2">
                                              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                              <div>
                                                <p className="text-sm font-medium text-green-900">Order Completed</p>
                                                <p className="text-xs text-green-700 mt-1">
                                                  This order has been successfully delivered and marked as complete.
                                                  {selectedOrder.actualDelivery && ` Delivered on ${new Date(selectedOrder.actualDelivery).toLocaleDateString()}.`}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex gap-2">
                                        <Button className="flex-1">
                                          <Mail className="w-4 h-4 mr-2" />
                                          Email Customer
                                        </Button>
                                        <Button variant="outline" className="flex-1">
                                          <Download className="w-4 h-4 mr-2" />
                                          Download Invoice
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteOrder(order.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Debugger - NEW */}
            <AnalyticsDebugger />

            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <MousePointerClick className="h-4 w-4 text-stone-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalEvents || 0}</div>
                  <p className="text-xs text-stone-600 mt-1">Tracked actions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sessions</CardTitle>
                  <Users className="h-4 w-4 text-stone-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.uniqueSessions || 0}</div>
                  <p className="text-xs text-stone-600 mt-1">Unique visitors</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-stone-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.conversionFunnel?.conversionRate || '0.00'}%</div>
                  <p className="text-xs text-stone-600 mt-1">View to purchase</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                  <Target className="h-4 w-4 text-stone-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{campaigns.filter(c => c.status === 'active').length}</div>
                  <p className="text-xs text-stone-600 mt-1">Running now</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Abandoned Carts</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{analytics?.eventsByType?.cart_abandoned || 0}</div>
                  <p className="text-xs text-stone-600 mt-1">
                    {analytics?.conversionFunnel?.addToCart > 0
                      ? `${(((analytics?.eventsByType?.cart_abandoned || 0) / analytics.conversionFunnel.addToCart) * 100).toFixed(1)}% abandonment rate`
                      : 'No carts yet'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* User Journey Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Funnel</CardTitle>
                  <CardDescription>User journey from view to purchase</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics?.conversionFunnel && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Page Views</span>
                          <span className="font-medium">{analytics.conversionFunnel.pageViews}</span>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-3">
                          <div className="bg-blue-500 h-3 rounded-full" style={{ width: "100%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Product Views</span>
                          <span className="font-medium">{analytics.conversionFunnel.productViews}</span>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-3">
                          <div 
                            className="bg-green-500 h-3 rounded-full" 
                            style={{ 
                              width: `${analytics.conversionFunnel.pageViews > 0 
                                ? (analytics.conversionFunnel.productViews / analytics.conversionFunnel.pageViews) * 100 
                                : 0}%` 
                            }} 
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Add to Cart</span>
                          <span className="font-medium">{analytics.conversionFunnel.addToCart}</span>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-3">
                          <div 
                            className="bg-yellow-500 h-3 rounded-full" 
                            style={{ 
                              width: `${analytics.conversionFunnel.pageViews > 0 
                                ? (analytics.conversionFunnel.addToCart / analytics.conversionFunnel.pageViews) * 100 
                                : 0}%` 
                            }} 
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Checkout Start</span>
                          <span className="font-medium">{analytics.conversionFunnel.checkoutStart}</span>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-3">
                          <div 
                            className="bg-orange-500 h-3 rounded-full" 
                            style={{ 
                              width: `${analytics.conversionFunnel.pageViews > 0 
                                ? (analytics.conversionFunnel.checkoutStart / analytics.conversionFunnel.pageViews) * 100 
                                : 0}%` 
                            }} 
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Purchase Complete</span>
                          <span className="font-medium">{analytics.conversionFunnel.checkoutComplete}</span>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-3">
                          <div 
                            className="bg-purple-500 h-3 rounded-full" 
                            style={{ 
                              width: `${analytics.conversionFunnel.pageViews > 0 
                                ? (analytics.conversionFunnel.checkoutComplete / analytics.conversionFunnel.pageViews) * 100 
                                : 0}%` 
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cart Analytics</CardTitle>
                  <CardDescription>Cart behavior and abandonment tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Items Added to Cart</span>
                        <span className="font-medium">{analytics?.conversionFunnel?.addToCart || 0}</span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-3">
                        <div className="bg-green-500 h-3 rounded-full" style={{ width: "100%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Items Removed</span>
                        <span className="font-medium text-orange-600">
                          {analytics?.eventsByType?.remove_from_cart || 0}
                        </span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-3">
                        <div 
                          className="bg-orange-500 h-3 rounded-full" 
                          style={{ 
                            width: `${analytics?.conversionFunnel?.addToCart > 0 
                              ? ((analytics?.eventsByType?.remove_from_cart || 0) / analytics.conversionFunnel.addToCart) * 100 
                              : 0}%` 
                          }} 
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Carts Abandoned</span>
                        <span className="font-medium text-red-600">
                          {analytics?.eventsByType?.cart_abandoned || 0}
                        </span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-3">
                        <div 
                          className="bg-red-500 h-3 rounded-full" 
                          style={{ 
                            width: `${analytics?.conversionFunnel?.checkoutStart > 0 
                              ? ((analytics?.eventsByType?.cart_abandoned || 0) / analytics.conversionFunnel.checkoutStart) * 100 
                              : 0}%` 
                          }} 
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Carts Cleared</span>
                        <span className="font-medium text-gray-600">
                          {analytics?.eventsByType?.cart_cleared || 0}
                        </span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-3">
                        <div 
                          className="bg-gray-500 h-3 rounded-full" 
                          style={{ 
                            width: `${analytics?.conversionFunnel?.addToCart > 0 
                              ? ((analytics?.eventsByType?.cart_cleared || 0) / analytics.conversionFunnel.addToCart) * 100 
                              : 0}%` 
                          }} 
                        />
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Cart Abandonment Rate</span>
                        <span className="text-lg font-bold text-red-600">
                          {analytics?.conversionFunnel?.addToCart > 0
                            ? (((analytics?.eventsByType?.cart_abandoned || 0) / analytics.conversionFunnel.addToCart) * 100).toFixed(1)
                            : '0.0'}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Cart-to-Checkout Rate</span>
                        <span className="text-lg font-bold text-green-600">
                          {analytics?.conversionFunnel?.addToCart > 0
                            ? (((analytics?.conversionFunnel?.checkoutStart || 0) / analytics.conversionFunnel.addToCart) * 100).toFixed(1)
                            : '0.0'}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Device Breakdown</CardTitle>
                  <CardDescription>Traffic by device type</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics?.deviceBreakdown && (
                    <div className="space-y-4">
                      {Object.entries(analytics.deviceBreakdown as Record<string, number>).map(([device, count]) => (
                        <div key={device} className="flex items-center gap-4">
                          <div className="flex items-center gap-2 flex-1">
                            {device === 'desktop' && <Monitor className="w-4 h-4 text-stone-600" />}
                            {device === 'mobile' && <Smartphone className="w-4 h-4 text-stone-600" />}
                            {device === 'tablet' && <Tablet className="w-4 h-4 text-stone-600" />}
                            <span className="text-sm capitalize">{device}</span>
                          </div>
                          <span className="font-medium">{count}</span>
                          <div className="w-32 bg-stone-200 rounded-full h-2">
                            <div 
                              className="bg-stone-900 h-2 rounded-full" 
                              style={{ 
                                width: `${analytics.totalEvents > 0 ? (count / analytics.totalEvents) * 100 : 0}%` 
                              }} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Abandoned Cart Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-red-600" />
                  Abandoned Carts Details
                </CardTitle>
                <CardDescription>Recent cart abandonment events with items</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics?.recentEvents && (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {analytics.recentEvents
                      .filter((event: any) => event.eventType === 'cart_abandoned')
                      .slice(0, 10)
                      .map((event: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-lg border border-red-200 bg-red-50/50">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                                Cart Abandoned
                              </Badge>
                              <span className="text-xs text-stone-600">
                                Session: {event.sessionId?.slice(0, 12)}...
                              </span>
                            </div>
                            <p className="text-sm text-stone-600">
                              {new Date(event.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-red-600">
                              B${event.metadata?.cartTotal?.toLocaleString() || '0'}
                            </p>
                            <p className="text-xs text-stone-600">
                              {event.metadata?.itemCount || 0} {event.metadata?.itemCount === 1 ? 'item' : 'items'}
                            </p>
                          </div>
                        </div>
                        {event.metadata?.items && event.metadata.items.length > 0 && (
                          <div className="space-y-2 mt-3 pt-3 border-t border-red-200">
                            <p className="text-xs font-medium text-stone-700 mb-2">Items in cart:</p>
                            {event.metadata.items.map((item: any, itemIdx: number) => (
                              <div key={itemIdx} className="flex items-center justify-between text-sm bg-white p-2 rounded">
                                <div className="flex-1">
                                  <p className="font-medium text-stone-900">{item.productName}</p>
                                  <p className="text-xs text-stone-600">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-medium text-stone-700">B${item.price?.toLocaleString()}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        {event.deviceType && (
                          <div className="mt-3 pt-3 border-t border-red-200">
                            <div className="flex items-center gap-4 text-xs text-stone-600">
                              <span className="flex items-center gap-1">
                                {event.deviceType === 'desktop' && <Monitor className="w-3 h-3" />}
                                {event.deviceType === 'mobile' && <Smartphone className="w-3 h-3" />}
                                {event.deviceType === 'tablet' && <Tablet className="w-3 h-3" />}
                                {event.deviceType}
                              </span>
                              {event.page && <span>Page: {event.page}</span>}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {analytics.recentEvents.filter((e: any) => e.eventType === 'cart_abandoned').length === 0 && (
                      <div className="text-center py-8 text-stone-500">
                        <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>No abandoned carts yet</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Click Tracking & Event Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Activity Events</CardTitle>
                  <CardDescription>Recent interactions and cart events</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics?.recentEvents && (
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {analytics.recentEvents
                        .filter((event: any) => 
                          event.eventType === 'click' || 
                          event.eventType === 'add_to_cart' || 
                          event.eventType === 'remove_from_cart' || 
                          event.eventType === 'cart_cleared' ||
                          event.eventType === 'product_view'
                        )
                        .slice(0, 20)
                        .map((event: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            {event.eventType === 'add_to_cart' && <ShoppingCart className="w-4 h-4 text-green-600" />}
                            {event.eventType === 'remove_from_cart' && <Trash2 className="w-4 h-4 text-red-600" />}
                            {event.eventType === 'cart_cleared' && <Trash2 className="w-4 h-4 text-orange-600" />}
                            {event.eventType === 'product_view' && <Eye className="w-4 h-4 text-blue-600" />}
                            {event.eventType === 'click' && <MousePointerClick className="w-4 h-4 text-purple-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium capitalize">{event.eventType.replace('_', ' ')}</span>
                              <Badge variant="outline" className="text-xs">
                                {event.deviceType || 'unknown'}
                              </Badge>
                            </div>
                            <p className="text-xs text-stone-600 truncate">
                              {event.productName || event.page || event.elementId || 'Unknown'}
                            </p>
                            <p className="text-xs text-stone-400 mt-1">
                              {new Date(event.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {(!analytics.recentEvents || analytics.recentEvents.filter((e: any) => 
                        e.eventType === 'click' || e.eventType === 'add_to_cart' || e.eventType === 'product_view'
                      ).length === 0) && (
                        <p className="text-sm text-stone-500 text-center py-8">No click activity yet</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Event Type Distribution</CardTitle>
                  <CardDescription>Breakdown by action type</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics?.eventsByType && (
                    <div className="space-y-3">
                      {Object.entries(analytics.eventsByType as Record<string, number>)
                        .sort(([,a], [,b]) => (b as number) - (a as number))
                        .slice(0, 8)
                        .map(([type, count]) => {
                          const percentage = analytics.totalEvents > 0 ? ((count / analytics.totalEvents) * 100).toFixed(1) : '0.0';
                          const colors: Record<string, string> = {
                            page_view: 'bg-blue-500',
                            product_view: 'bg-green-500',
                            add_to_cart: 'bg-yellow-500',
                            checkout_start: 'bg-orange-500',
                            checkout_complete: 'bg-purple-500',
                            click: 'bg-pink-500',
                          };
                          const color = colors[type] || 'bg-stone-500';
                          
                          return (
                            <div key={type}>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm capitalize">{type.replace(/_/g, ' ')}</span>
                                <span className="text-sm font-medium">{count} ({percentage}%)</span>
                              </div>
                              <div className="w-full bg-stone-200 rounded-full h-2">
                                <div 
                                  className={`${color} h-2 rounded-full transition-all`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Campaign Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Campaign Management</CardTitle>
                    <CardDescription>Create and manage email & popup campaigns</CardDescription>
                  </div>
                  <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Campaign
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Campaign</DialogTitle>
                        <DialogDescription>
                          Send targeted emails or display in-app popups
                        </DialogDescription>
                      </DialogHeader>
                      <CampaignForm 
                        onSubmit={createCampaign}
                        campaignType={campaignType}
                        setCampaignType={setCampaignType}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Audience</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-stone-500 py-8">
                          No campaigns yet. Create your first campaign!
                        </TableCell>
                      </TableRow>
                    ) : (
                      campaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{campaign.name}</div>
                              <div className="text-sm text-stone-500">{campaign.title}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {campaign.type === 'email' ? <Mail className="w-3 h-3 mr-1" /> : <Bell className="w-3 h-3 mr-1" />}
                              {campaign.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{campaign.audienceType?.replace('-', ' ') || 'custom'}</TableCell>
                          <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                          <TableCell>{campaign.sentCount || 0}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {campaign.status === 'draft' && (
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => sendCampaign(campaign.id)}
                                >
                                  <Send className="w-4 h-4" />
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => deleteCampaign(campaign.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Recent Events */}
            <Card>
              <CardHeader>
                <CardTitle>Recent User Events</CardTitle>
                <CardDescription>Live activity tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {analytics?.recentEvents && analytics.recentEvents.length > 0 ? (
                      analytics.recentEvents.map((event: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg text-sm">
                          <Badge variant="outline">{event.eventType}</Badge>
                          <span className="flex-1">{event.eventName}</span>
                          <span className="text-xs text-stone-500">{event.deviceType}</span>
                          <span className="text-xs text-stone-500">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-stone-500 py-8">No events tracked yet</p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Surveys Tab */}
          <TabsContent value="surveys" className="space-y-6">
            <SurveyManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Campaign Form Component
function CampaignForm({ 
  onSubmit, 
  campaignType, 
  setCampaignType 
}: { 
  onSubmit: (data: any) => Promise<boolean>; 
  campaignType: 'email' | 'popup';
  setCampaignType: (type: 'email' | 'popup') => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    message: '',
    buttonText: '',
    buttonLink: '',
    audienceType: 'all-users',
    customEmails: '',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    position: 'center',
    delay: 3000,
    showOnce: true,
    productImageUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const campaignData: any = {
      type: campaignType,
      name: formData.name,
      title: formData.title,
      message: formData.message,
      audienceType: formData.audienceType,
    };

    if (campaignType === 'email') {
      campaignData.buttonText = formData.buttonText;
      campaignData.buttonLink = formData.buttonLink;
      if (formData.audienceType === 'custom') {
        campaignData.customEmails = formData.customEmails.split(',').map(e => e.trim());
      }
    } else {
      // Popup specific fields
      campaignData.buttonText = formData.buttonText;
      campaignData.buttonLink = formData.buttonLink;
      campaignData.backgroundColor = formData.backgroundColor;
      campaignData.textColor = formData.textColor;
      campaignData.position = formData.position;
      campaignData.delay = formData.delay;
      campaignData.showOnce = formData.showOnce;
      campaignData.image = formData.productImageUrl; // Add product image URL
      campaignData.status = 'active'; // Popups are active immediately
    }

    await onSubmit(campaignData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Campaign Type */}
      <div>
        <Label>Campaign Type</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Button
            type="button"
            variant={campaignType === 'email' ? 'default' : 'outline'}
            onClick={() => setCampaignType('email')}
            className="w-full"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
          <Button
            type="button"
            variant={campaignType === 'popup' ? 'default' : 'outline'}
            onClick={() => setCampaignType('popup')}
            className="w-full"
          >
            <Bell className="w-4 h-4 mr-2" />
            In-App Popup
          </Button>
        </div>
      </div>

      {/* Basic Fields */}
      <div>
        <Label htmlFor="name">Campaign Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Summer Sale 2024"
          required
        />
      </div>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Get 20% Off All Furniture"
          required
        />
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Your campaign message..."
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="buttonText">Button Text</Label>
          <Input
            id="buttonText"
            value={formData.buttonText}
            onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
            placeholder="Shop Now"
          />
        </div>
        <div>
          <Label htmlFor="buttonLink">Button Link</Label>
          <Input
            id="buttonLink"
            value={formData.buttonLink}
            onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
            placeholder="/products"
          />
        </div>
      </div>

      {/* Audience */}
      <div>
        <Label htmlFor="audience">Target Audience</Label>
        <Select value={formData.audienceType} onValueChange={(value) => setFormData({ ...formData, audienceType: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-users">All Users</SelectItem>
            <SelectItem value="all-leads">All Leads</SelectItem>
            <SelectItem value="custom">Custom Email List</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.audienceType === 'custom' && campaignType === 'email' && (
        <div>
          <Label htmlFor="customEmails">Custom Email List (comma-separated)</Label>
          <Textarea
            id="customEmails"
            value={formData.customEmails}
            onChange={(e) => setFormData({ ...formData, customEmails: e.target.value })}
            placeholder="email1@example.com, email2@example.com"
            rows={3}
          />
        </div>
      )}

      {/* Popup Specific Options */}
      {campaignType === 'popup' && (
        <>
          <div>
            <Label htmlFor="productImageUrl">Product Image URL</Label>
            <Input
              id="productImageUrl"
              value={formData.productImageUrl}
              onChange={(e) => setFormData({ ...formData, productImageUrl: e.target.value })}
              placeholder="https://example.com/product-image.jpg"
            />
            <p className="text-xs text-stone-500 mt-1">Optional: Add a product image to display in the popup</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="backgroundColor">Background Color</Label>
              <Input
                id="backgroundColor"
                type="color"
                value={formData.backgroundColor}
                onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="textColor">Text Color</Label>
              <Input
                id="textColor"
                type="color"
                value={formData.textColor}
                onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="position">Position</Label>
            <Select value={formData.position} onValueChange={(value) => setFormData({ ...formData, position: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="bottom-right">Bottom Right</SelectItem>
                <SelectItem value="bottom-left">Bottom Left</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="delay">Show After (milliseconds)</Label>
            <Input
              id="delay"
              type="number"
              value={formData.delay}
              onChange={(e) => setFormData({ ...formData, delay: parseInt(e.target.value) })}
              min="0"
              step="1000"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showOnce"
              checked={formData.showOnce}
              onChange={(e) => setFormData({ ...formData, showOnce: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="showOnce" className="cursor-pointer">Show only once per user</Label>
          </div>
        </>
      )}

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          <Zap className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>
    </form>
  );
}