import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import * as crm from "./crm.tsx";

console.log("🚀 Server starting - imports loaded");

// Password hashing utilities using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hash = await hashPassword(password);
  return hash === hashedPassword;
}

console.log("🔧 Initializing Hono app");
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-3cbf86a5/health", (c) => {
  return c.json({ status: "ok" });
});

// ============================================
// LEAD MANAGEMENT ROUTES
// ============================================

// Create a new lead
app.post("/make-server-3cbf86a5/leads", async (c) => {
  try {
    const body = await c.req.json();
    const lead = await crm.createLead(body);
    return c.json({ success: true, lead }, 201);
  } catch (error) {
    console.log("Error creating lead:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all leads
app.get("/make-server-3cbf86a5/leads", async (c) => {
  try {
    const status = c.req.query("status");
    const leads = status 
      ? await crm.getLeadsByStatus(status as any)
      : await crm.getAllLeads();
    return c.json({ success: true, leads });
  } catch (error) {
    console.log("Error fetching leads:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get a specific lead
app.get("/make-server-3cbf86a5/leads/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const lead = await crm.getLead(id);
    if (!lead) {
      return c.json({ success: false, error: "Lead not found" }, 404);
    }
    return c.json({ success: true, lead });
  } catch (error) {
    console.log("Error fetching lead:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update a lead
app.put("/make-server-3cbf86a5/leads/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const lead = await crm.updateLead(id, body);
    if (!lead) {
      return c.json({ success: false, error: "Lead not found" }, 404);
    }
    return c.json({ success: true, lead });
  } catch (error) {
    console.log("Error updating lead:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Convert lead to user
app.post("/make-server-3cbf86a5/leads/:id/convert", async (c) => {
  try {
    const id = c.req.param("id");
    const { userId } = await c.req.json();
    await crm.convertLeadToUser(id, userId);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error converting lead:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// USER MANAGEMENT ROUTES
// ============================================

// Create a new user (signup)
app.post("/make-server-3cbf86a5/users", async (c) => {
  try {
    const body = await c.req.json();
    
    // Check if user already exists
    const existingUser = await crm.getUserByEmail(body.email);
    if (existingUser) {
      return c.json({ success: false, error: "User already exists" }, 409);
    }
    
    // Hash the password before storing
    const hashedPassword = await hashPassword(body.password);
    const user = await crm.createUser({ ...body, password: hashedPassword });
    return c.json({ success: true, user }, 201);
  } catch (error) {
    console.log("Error creating user:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all users
app.get("/make-server-3cbf86a5/users", async (c) => {
  try {
    const users = await crm.getAllUsers();
    return c.json({ success: true, users });
  } catch (error) {
    console.log("Error fetching users:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get a specific user
app.get("/make-server-3cbf86a5/users/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const user = await crm.getUser(id);
    if (!user) {
      return c.json({ success: false, error: "User not found" }, 404);
    }
    return c.json({ success: true, user });
  } catch (error) {
    console.log("Error fetching user:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get user by email
app.get("/make-server-3cbf86a5/users/email/:email", async (c) => {
  try {
    const email = c.req.param("email");
    const user = await crm.getUserByEmail(email);
    if (!user) {
      return c.json({ success: false, error: "User not found" }, 404);
    }
    return c.json({ success: true, user });
  } catch (error) {
    console.log("Error fetching user by email:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update user profile
app.put("/make-server-3cbf86a5/users/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const user = await crm.updateUser(id, body);
    if (!user) {
      return c.json({ success: false, error: "User not found" }, 404);
    }
    return c.json({ success: true, user });
  } catch (error) {
    console.log("Error updating user:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update last login
app.post("/make-server-3cbf86a5/users/:id/login", async (c) => {
  try {
    const id = c.req.param("id");
    await crm.updateUserLastLogin(id);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error updating last login:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete a user
app.delete("/make-server-3cbf86a5/users/:id", async (c) => {
  try {
    const id = c.req.param("id");
    console.log("🗑️ Deleting user:", id);
    
    const success = await crm.deleteUser(id);
    if (!success) {
      return c.json({ success: false, error: "User not found" }, 404);
    }
    
    console.log("✅ User deleted successfully:", id);
    return c.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.log("❌ Error deleting user:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// AUTHENTICATION ROUTE
// ============================================

// Authenticate user (login)
app.post("/make-server-3cbf86a5/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    console.log("🔐 Login attempt for:", email);
    
    // Find user by email
    const user = await crm.getUserByEmail(email);
    if (!user) {
      console.log("❌ User not found:", email);
      return c.json({ 
        success: false, 
        error: "Invalid email or password" 
      }, 401);
    }
    
    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      console.log("❌ Invalid password for:", email);
      return c.json({ 
        success: false, 
        error: "Invalid email or password" 
      }, 401);
    }
    
    // Update last login
    await crm.updateUserLastLogin(user.id);
    
    console.log("✅ Login successful for:", email);
    
    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    return c.json({ 
      success: true, 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.log("❌ Login error:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Request password reset
app.post("/make-server-3cbf86a5/auth/forgot-password", async (c) => {
  try {
    const { email } = await c.req.json();
    
    console.log("🔑 Password reset requested for:", email);
    
    // Find user by email
    const user = await crm.getUserByEmail(email);
    if (!user) {
      console.log("❌ User not found:", email);
      // Don't reveal if user exists or not for security
      return c.json({ 
        success: true, 
        message: "If an account exists with this email, a reset code has been generated." 
      });
    }
    
    // Generate a 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store reset code with expiration (15 minutes)
    const resetData = {
      userId: user.id,
      email: user.email,
      code: resetCode,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`password-reset:${email}`, resetData);
    
    console.log("✅ Reset code generated for:", email, "- Code:", resetCode);
    
    // In production, this would send an email
    // For demo purposes, return the code in the response
    return c.json({ 
      success: true, 
      resetCode: resetCode, // Only for demo - would be sent via email in production
      message: "Password reset code generated successfully." 
    });
  } catch (error) {
    console.log("❌ Password reset request error:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Reset password with code
app.post("/make-server-3cbf86a5/auth/reset-password", async (c) => {
  try {
    const { email, code, newPassword } = await c.req.json();
    
    console.log("🔄 Password reset attempt for:", email);
    
    // Get reset data
    const resetData = await kv.get<{
      userId: string;
      email: string;
      code: string;
      expiresAt: string;
      createdAt: string;
    }>(`password-reset:${email}`);
    
    if (!resetData) {
      console.log("❌ No reset request found for:", email);
      return c.json({ 
        success: false, 
        error: "Invalid or expired reset code." 
      }, 400);
    }
    
    // Check if code has expired
    if (new Date() > new Date(resetData.expiresAt)) {
      console.log("❌ Reset code expired for:", email);
      await kv.del(`password-reset:${email}`);
      return c.json({ 
        success: false, 
        error: "Reset code has expired. Please request a new one." 
      }, 400);
    }
    
    // Verify code
    if (resetData.code !== code) {
      console.log("❌ Invalid reset code for:", email);
      return c.json({ 
        success: false, 
        error: "Invalid reset code." 
      }, 400);
    }
    
    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    
    // Update user password
    const user = await crm.getUserByEmail(email);
    if (!user) {
      return c.json({ 
        success: false, 
        error: "User not found." 
      }, 404);
    }
    
    await crm.updateUser(user.id, { password: hashedPassword });
    
    // Delete reset data
    await kv.del(`password-reset:${email}`);
    
    console.log("✅ Password reset successful for:", email);
    
    return c.json({ 
      success: true, 
      message: "Password has been reset successfully." 
    });
  } catch (error) {
    console.log("❌ Password reset error:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// ORDER MANAGEMENT ROUTES
// ============================================

// Create a new order
app.post("/make-server-3cbf86a5/orders", async (c) => {
  try {
    const body = await c.req.json();
    const order = await crm.createOrder(body);
    return c.json({ success: true, order }, 201);
  } catch (error) {
    console.log("Error creating order:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all orders
app.get("/make-server-3cbf86a5/orders", async (c) => {
  try {
    const status = c.req.query("status");
    const orders = status
      ? await crm.getOrdersByStatus(status as any)
      : await crm.getAllOrders();
    return c.json({ success: true, orders });
  } catch (error) {
    console.log("Error fetching orders:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get a specific order
app.get("/make-server-3cbf86a5/orders/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const order = await crm.getOrder(id);
    if (!order) {
      return c.json({ success: false, error: "Order not found" }, 404);
    }
    return c.json({ success: true, order });
  } catch (error) {
    console.log("Error fetching order:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update an order
app.put("/make-server-3cbf86a5/orders/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const order = await crm.updateOrder(id, body);
    if (!order) {
      return c.json({ success: false, error: "Order not found" }, 404);
    }
    return c.json({ success: true, order });
  } catch (error) {
    console.log("Error updating order:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Add timeline entry to order
app.post("/make-server-3cbf86a5/orders/:id/timeline", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const order = await crm.addOrderTimeline(id, body);
    if (!order) {
      return c.json({ success: false, error: "Order not found" }, 404);
    }
    return c.json({ success: true, order });
  } catch (error) {
    console.log("Error adding timeline entry:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete an order
app.delete("/make-server-3cbf86a5/orders/:id", async (c) => {
  try {
    const id = c.req.param("id");
    console.log("🗑️ Deleting order:", id);
    
    const success = await crm.deleteOrder(id);
    if (!success) {
      return c.json({ success: false, error: "Order not found" }, 404);
    }
    
    console.log("✅ Order deleted successfully:", id);
    return c.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.log("❌ Error deleting order:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update order status
app.patch("/make-server-3cbf86a5/orders/:id/status", async (c) => {
  try {
    const id = c.req.param("id");
    const { status } = await c.req.json();
    
    console.log("📦 Updating order status:", id, "to", status);
    
    // Map simple status to actual order status
    const statusMap: Record<string, any> = {
      "pending": "processing",
      "shipped": "in-transit",
      "delayed": "processing", // We'll use processing but add a note
      "delivered": "delivered"
    };
    
    const validStatuses = ["pending-payment", "processing", "ready-to-ship", "in-transit", "arriving", "out-for-delivery", "delivered", "cancelled", "refunded"];
    
    let finalStatus = status;
    
    // If it's a simplified status, map it
    if (statusMap[status]) {
      finalStatus = statusMap[status];
    }
    
    // Validate the final status
    if (!validStatuses.includes(finalStatus)) {
      return c.json({ 
        success: false, 
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` 
      }, 400);
    }
    
    // Determine if order should be marked as completed
    const completed = ["delivered", "cancelled", "refunded"].includes(finalStatus);
    
    // Update order with new status and completed flag
    const order = await crm.updateOrder(id, { 
      status: finalStatus,
      completed: completed,
      ...(finalStatus === "delivered" && { actualDelivery: new Date().toISOString() })
    });
    if (!order) {
      return c.json({ success: false, error: "Order not found" }, 404);
    }
    
    // Add timeline entry for status change
    const statusMessages: Record<string, string> = {
      "pending": "Order is being processed",
      "shipped": "Order has been shipped and is in transit",
      "delayed": "Order processing has been delayed",
      "delivered": "Order has been successfully delivered",
      "processing": "Order is being processed",
      "in-transit": "Order is in transit",
      "ready-to-ship": "Order is ready to ship",
      "arriving": "Order is arriving soon",
      "out-for-delivery": "Order is out for delivery",
      "cancelled": "Order has been cancelled",
      "refunded": "Order has been refunded"
    };
    
    await crm.addOrderTimeline(id, {
      status: finalStatus,
      description: statusMessages[status] || statusMessages[finalStatus] || `Order status changed to ${finalStatus}`,
      date: new Date().toISOString(),
      completed: ["delivered", "cancelled", "refunded"].includes(finalStatus),
    });
    
    console.log("✅ Order status updated successfully:", id, "->", finalStatus);
    return c.json({ success: true, order });
  } catch (error) {
    console.log("❌ Error updating order status:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get user's orders
app.get("/make-server-3cbf86a5/users/:userId/orders", async (c) => {
  try {
    const userId = c.req.param("userId");
    const orders = await crm.getUserOrders(userId);
    return c.json({ success: true, orders });
  } catch (error) {
    console.log("Error fetching user orders:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get orders by user email
app.get("/make-server-3cbf86a5/users/:email/orders", async (c) => {
  try {
    const email = decodeURIComponent(c.req.param("email"));
    console.log("📦 Fetching orders for user:", email);
    
    // First, find the user by email
    const user = await crm.getUserByEmail(email);
    if (!user) {
      console.log("⚠️ User not found:", email);
      return c.json({ success: true, orders: [] }); // Return empty array instead of error
    }
    
    // Get all orders for this user
    const allOrders = await crm.getAllOrders();
    const userOrders = allOrders.filter(order => order.userId === user.id);
    
    console.log(`✅ Found ${userOrders.length} orders for user ${email}`);
    return c.json({ success: true, orders: userOrders });
  } catch (error) {
    console.log("Error fetching user orders:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// ANALYTICS & STATS ROUTES
// ============================================

// Get CRM statistics
app.get("/make-server-3cbf86a5/stats", async (c) => {
  try {
    const stats = await crm.getCRMStats();
    return c.json({ success: true, stats });
  } catch (error) {
    console.log("Error fetching CRM stats:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Track a journey event
app.post("/make-server-3cbf86a5/analytics/track", async (c) => {
  try {
    const event = await c.req.json();
    console.log("📥 Received tracking event:", event.eventType, event.eventName);
    
    const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const eventWithId = { ...event, id: eventId };
    
    console.log("💾 Saving event with ID:", eventId);
    await kv.set(`journey-event:${eventId}`, eventWithId);
    
    // Also store by session for easier querying
    const sessionEvents = await kv.get<string[]>(`session-events:${event.sessionId}`) || [];
    sessionEvents.push(eventId);
    await kv.set(`session-events:${event.sessionId}`, sessionEvents);
    
    console.log("✅ Event saved successfully:", eventId);
    
    // Special logging for cart_abandoned events
    if (event.eventType === 'cart_abandoned') {
      console.log("🛒💔 ABANDONED CART EVENT SAVED!");
      console.log("  - Event ID:", eventId);
      console.log("  - Items:", event.metadata?.itemCount || 0);
      console.log("  - Total: B$" + (event.metadata?.cartTotal || 0));
      console.log("  - Session:", event.sessionId);
    }
    
    return c.json({ success: true, eventId });
  } catch (error) {
    console.log("❌ Error tracking event:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get analytics data
app.get("/make-server-3cbf86a5/analytics", async (c) => {
  try {
    console.log("📊 Fetching analytics data...");
    
    // Get events from BOTH old and new logging systems for migration period
    // Add timeout protection and limit results
    const fetchWithTimeout = async (prefix: string, timeout = 5000) => {
      return Promise.race([
        kv.getByPrefix<any>(prefix),
        new Promise<any[]>((_, reject) => 
          setTimeout(() => reject(new Error(`Timeout fetching ${prefix}`)), timeout)
        )
      ]).catch(error => {
        console.warn(`⚠️ Warning: ${error.message}, returning empty array`);
        return [];
      });
    };
    
    const oldEvents = await fetchWithTimeout("journey-event:", 5000) || [];
    const newEvents = await fetchWithTimeout("journey:event:", 5000) || [];
    
    console.log("📊 Old system events fetched:", oldEvents.length);
    console.log("📊 New system events fetched:", newEvents.length);
    
    // Combine and deduplicate events (prefer new system)
    const allEventsMap = new Map();
    
    // Add old events first
    oldEvents.forEach(event => {
      if (event && event.id) {
        allEventsMap.set(event.timestamp + event.eventType, event);
      }
    });
    
    // Add new events (will overwrite old ones with same timestamp+type)
    newEvents.forEach(event => {
      if (event && event.id) {
        allEventsMap.set(event.timestamp + event.eventType, event);
      }
    });
    
    const events = Array.from(allEventsMap.values());
    
    console.log("📊 Total combined events:", events.length);
    
    // Calculate analytics metrics
    const totalEvents = events.length;
    const uniqueSessions = new Set(events.map(e => e.sessionId)).size;
    const uniqueUsers = new Set(events.filter(e => e.userId).map(e => e.userId)).size;
    
    // Events by type
    const eventsByType: Record<string, number> = {};
    events.forEach(event => {
      eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;
    });
    
    console.log("📊 Events by type:", eventsByType);
    console.log("🛒 Abandoned carts found:", eventsByType['cart_abandoned'] || 0);
    
    // Device breakdown
    const deviceBreakdown: Record<string, number> = {};
    events.forEach(event => {
      const device = event.deviceType || 'unknown';
      deviceBreakdown[device] = (deviceBreakdown[device] || 0) + 1;
    });
    
    // Top pages
    const pageViews: Record<string, number> = {};
    events.filter(e => e.eventType === 'page_view').forEach(event => {
      const page = event.page || 'unknown';
      pageViews[page] = (pageViews[page] || 0) + 1;
    });
    
    // Calculate conversion funnel
    const pageViewCount = eventsByType['page_view'] || 0;
    const productViewCount = eventsByType['product_view'] || 0;
    const addToCartCount = eventsByType['add_to_cart'] || 0;
    const checkoutStartCount = eventsByType['checkout_start'] || 0;
    const checkoutCompleteCount = eventsByType['checkout_complete'] || 0;
    
    const conversionFunnel = {
      pageViews: pageViewCount,
      productViews: productViewCount,
      addToCart: addToCartCount,
      checkoutStart: checkoutStartCount,
      checkoutComplete: checkoutCompleteCount,
      conversionRate: pageViewCount > 0 ? ((checkoutCompleteCount / pageViewCount) * 100).toFixed(2) : '0.00'
    };
    
    // Recent events (last 50)
    const recentEvents = events.slice(-50).reverse();
    
    return c.json({ 
      success: true, 
      analytics: {
        totalEvents,
        uniqueSessions,
        uniqueUsers,
        eventsByType,
        deviceBreakdown,
        pageViews,
        conversionFunnel,
        recentEvents
      }
    });
  } catch (error) {
    console.log("Error fetching analytics:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// ORGANIZED DATABASE LOGGING ROUTES
// ============================================

// Journey Logs - Analytics & Tracking Events
app.post("/make-server-3cbf86a5/logs/journey", async (c) => {
  try {
    const log = await c.req.json();
    console.log("📊 [JOURNEY LOG] Received:", log.eventType, log.eventName);
    
    const logId = `journey:event:${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const logWithId = { ...log, id: logId, savedAt: new Date().toISOString() };
    
    await kv.set(logId, logWithId);
    
    // Also index by session
    const sessionKey = `journey:session:${log.sessionId}`;
    const sessionLogs = await kv.get<string[]>(sessionKey) || [];
    sessionLogs.push(logId);
    await kv.set(sessionKey, sessionLogs);
    
    // Index by user if available
    if (log.userId) {
      const userKey = `journey:user:${log.userId}`;
      const userLogs = await kv.get<string[]>(userKey) || [];
      userLogs.push(logId);
      await kv.set(userKey, userLogs);
    }
    
    console.log("✅ [JOURNEY LOG] Saved:", logId);
    
    if (log.eventType === 'cart_abandoned') {
      console.log("🛒💔 [JOURNEY LOG] Abandoned cart tracked!");
    }
    
    return c.json({ success: true, logId });
  } catch (error) {
    console.log("❌ [JOURNEY LOG] Error:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// User Logs - User Activity & Auth Events
app.post("/make-server-3cbf86a5/logs/user", async (c) => {
  try {
    const log = await c.req.json();
    console.log("👤 [USER LOG] Received:", log.action, "for", log.email);
    
    const logId = `user:log:${log.userId}:${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const logWithId = { ...log, id: logId, savedAt: new Date().toISOString() };
    
    await kv.set(logId, logWithId);
    
    // Index by user
    const userIndexKey = `user:logs:${log.userId}`;
    const userLogs = await kv.get<string[]>(userIndexKey) || [];
    userLogs.push(logId);
    await kv.set(userIndexKey, userLogs);
    
    console.log("✅ [USER LOG] Saved:", logId);
    
    return c.json({ success: true, logId });
  } catch (error) {
    console.log("❌ [USER LOG] Error:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Order Logs - Order Lifecycle Events
app.post("/make-server-3cbf86a5/logs/order", async (c) => {
  try {
    const log = await c.req.json();
    console.log("📦 [ORDER LOG] Received:", log.action, "for order", log.orderId);
    
    const logId = `order:log:${log.orderId}:${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const logWithId = { ...log, id: logId, savedAt: new Date().toISOString() };
    
    await kv.set(logId, logWithId);
    
    // Index by order
    const orderIndexKey = `order:logs:${log.orderId}`;
    const orderLogs = await kv.get<string[]>(orderIndexKey) || [];
    orderLogs.push(logId);
    await kv.set(orderIndexKey, orderLogs);
    
    // Index by user if available
    if (log.userId) {
      const userOrderKey = `order:user-logs:${log.userId}`;
      const userOrderLogs = await kv.get<string[]>(userOrderKey) || [];
      userOrderLogs.push(logId);
      await kv.set(userOrderKey, userOrderLogs);
    }
    
    console.log("✅ [ORDER LOG] Saved:", logId);
    
    return c.json({ success: true, logId });
  } catch (error) {
    console.log("❌ [ORDER LOG] Error:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get Journey Logs (with filtering)
app.get("/make-server-3cbf86a5/logs/journey", async (c) => {
  try {
    const sessionId = c.req.query("sessionId");
    const userId = c.req.query("userId");
    const eventType = c.req.query("eventType");
    
    let logs;
    
    if (sessionId) {
      const sessionKey = `journey:session:${sessionId}`;
      const logIds = await kv.get<string[]>(sessionKey) || [];
      logs = await Promise.all(logIds.map(id => kv.get(id)));
    } else if (userId) {
      const userKey = `journey:user:${userId}`;
      const logIds = await kv.get<string[]>(userKey) || [];
      logs = await Promise.all(logIds.map(id => kv.get(id)));
    } else {
      logs = await kv.getByPrefix("journey:event:");
    }
    
    // Filter by event type if specified
    if (eventType && logs) {
      logs = logs.filter((log: any) => log?.eventType === eventType);
    }
    
    console.log("📊 [JOURNEY LOG] Retrieved", logs?.length || 0, "logs");
    
    return c.json({ success: true, logs: logs || [] });
  } catch (error) {
    console.log("❌ [JOURNEY LOG] Retrieval error:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get User Logs
app.get("/make-server-3cbf86a5/logs/user/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userIndexKey = `user:logs:${userId}`;
    const logIds = await kv.get<string[]>(userIndexKey) || [];
    const logs = await Promise.all(logIds.map(id => kv.get(id)));
    
    console.log("👤 [USER LOG] Retrieved", logs.length, "logs for user", userId);
    
    return c.json({ success: true, logs });
  } catch (error) {
    console.log("❌ [USER LOG] Retrieval error:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get Order Logs
app.get("/make-server-3cbf86a5/logs/order/:orderId", async (c) => {
  try {
    const orderId = c.req.param("orderId");
    const orderIndexKey = `order:logs:${orderId}`;
    const logIds = await kv.get<string[]>(orderIndexKey) || [];
    const logs = await Promise.all(logIds.map(id => kv.get(id)));
    
    console.log("📦 [ORDER LOG] Retrieved", logs.length, "logs for order", orderId);
    
    return c.json({ success: true, logs });
  } catch (error) {
    console.log("❌ [ORDER LOG] Retrieval error:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all logs for analytics (backward compatible)
app.get("/make-server-3cbf86a5/logs/all", async (c) => {
  try {
    const journeyLogs = await kv.getByPrefix("journey:event:");
    const userLogs = await kv.getByPrefix("user:log:");
    const orderLogs = await kv.getByPrefix("order:log:");
    
    console.log("📋 [ALL LOGS] Retrieved:", {
      journey: journeyLogs?.length || 0,
      user: userLogs?.length || 0,
      order: orderLogs?.length || 0
    });
    
    return c.json({
      success: true,
      logs: {
        journey: journeyLogs || [],
        user: userLogs || [],
        order: orderLogs || []
      },
      counts: {
        journey: journeyLogs?.length || 0,
        user: userLogs?.length || 0,
        order: orderLogs?.length || 0,
        total: (journeyLogs?.length || 0) + (userLogs?.length || 0) + (orderLogs?.length || 0)
      }
    });
  } catch (error) {
    console.log("❌ [ALL LOGS] Retrieval error:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// CAMPAIGN MANAGEMENT ROUTES
// ============================================

// Create a campaign
app.post("/make-server-3cbf86a5/campaigns", async (c) => {
  try {
    const body = await c.req.json();
    const campaignId = `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const campaign = {
      id: campaignId,
      ...body,
      status: body.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sentCount: 0,
      openCount: 0,
      clickCount: 0
    };
    
    await kv.set(`campaign:${campaignId}`, campaign);
    
    console.log("✅ Campaign created:", campaignId);
    return c.json({ success: true, campaign }, 201);
  } catch (error) {
    console.log("Error creating campaign:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all campaigns
app.get("/make-server-3cbf86a5/campaigns", async (c) => {
  try {
    const campaigns = await kv.getByPrefix<any>("campaign:") || [];
    return c.json({ success: true, campaigns: campaigns.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ) });
  } catch (error) {
    console.log("Error fetching campaigns:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Send campaign
app.post("/make-server-3cbf86a5/campaigns/:id/send", async (c) => {
  try {
    const id = c.req.param("id");
    const campaign = await kv.get<any>(`campaign:${id}`);
    
    if (!campaign) {
      return c.json({ success: false, error: "Campaign not found" }, 404);
    }
    
    // Update campaign status
    campaign.status = 'sent';
    campaign.sentAt = new Date().toISOString();
    campaign.updatedAt = new Date().toISOString();
    
    // Get target audience
    let recipients: string[] = [];
    let recipientDetails: any[] = [];
    
    if (campaign.audienceType === 'all-users') {
      const users = await crm.getAllUsers();
      recipients = users.map(u => u.email);
      recipientDetails = users.map(u => ({ name: u.name, email: u.email, type: 'user' }));
    } else if (campaign.audienceType === 'all-leads') {
      const leads = await crm.getAllLeads();
      recipients = leads.map(l => l.email);
      recipientDetails = leads.map(l => ({ name: l.name, email: l.email, type: 'lead' }));
    } else if (campaign.audienceType === 'custom') {
      recipients = campaign.customEmails || [];
      recipientDetails = recipients.map(email => ({ name: 'Custom', email, type: 'custom' }));
    }
    
    campaign.sentCount = recipients.length;
    await kv.set(`campaign:${id}`, campaign);
    
    // Log detailed email preview
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📧 EMAIL CAMPAIGN SENT - ${campaign.name}`);
    console.log(`${'='.repeat(80)}`);
    console.log(`Campaign ID: ${id}`);
    console.log(`Type: ${campaign.type}`);
    console.log(`Subject: ${campaign.subject || 'N/A'}`);
    console.log(`Recipients: ${recipients.length}`);
    console.log(`\nRecipient List:`);
    recipientDetails.forEach((r, idx) => {
      console.log(`  ${idx + 1}. ${r.name} <${r.email}> [${r.type}]`);
    });
    console.log(`\n${'-'.repeat(80)}`);
    console.log(`Email Content Preview:`);
    console.log(`${'-'.repeat(80)}`);
    console.log(campaign.content || campaign.message || 'No content');
    console.log(`${'='.repeat(80)}\n`);
    
    // Send actual emails via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    let emailSendResults = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };
    
    // Check if we should attempt to send real emails
    const shouldSendEmails = resendApiKey && resendApiKey.trim() !== '' && campaign.type === 'email';
    
    if (shouldSendEmails) {
      // Validate API key format
      if (!resendApiKey.startsWith('re_')) {
        console.log('⚠️  RESEND_API_KEY is configured but has invalid format');
        console.log('   Expected format: API key must start with "re_"');
        console.log('   Current value starts with:', resendApiKey.substring(0, 3));
        console.log('   📋 Get a valid API key from: https://resend.com/api-keys');
        console.log('   ℹ️  Campaign will be marked as sent, but emails will NOT be delivered to inboxes.\n');
        
        // Don't block the campaign, just skip email sending
        campaign.sentCount = recipients.length;
        await kv.set(`campaign:${id}`, campaign);
        
        return c.json({ 
          success: true, 
          campaign,
          recipients: recipientDetails,
          emailSendResults: null,
          emailPreview: {
            subject: campaign.subject,
            content: campaign.content || campaign.message,
            recipientCount: recipients.length
          },
          warning: 'Invalid RESEND_API_KEY format. Get a valid key from https://resend.com/api-keys',
          message: `Campaign prepared for ${recipients.length} recipient(s). Configure valid RESEND_API_KEY to send real emails.` 
        });
      }
      
      console.log('🚀 Sending emails via Resend API...');
      console.log('📋 API Key status:', resendApiKey ? `Configured (${resendApiKey.substring(0, 10)}...)` : 'Not configured');
      
      // Prepare HTML email content
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${campaign.subject || 'Vision Studio'}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Vision Studio</h1>
          </div>
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <div style="white-space: pre-wrap; margin: 20px 0;">
              ${campaign.content || campaign.message || ''}
            </div>
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
              <p>© ${new Date().getFullYear()} Vision Studio. All rights reserved.</p>
              <p>Premium furniture for your dream space</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      // Send emails to all recipients (batch in groups of 10 for better reliability)
      const batchSize = 10;
      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        
        await Promise.all(batch.map(async (email) => {
          try {
            const response = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                from: 'Vision Studio <onboarding@resend.dev>',
                to: [email],
                subject: campaign.subject || 'Message from Vision Studio',
                html: htmlContent
              })
            });
            
            const responseData = await response.json();
            
            if (response.ok) {
              emailSendResults.success++;
              console.log(`✅ Email sent to: ${email}`);
            } else {
              emailSendResults.failed++;
              const errorMessage = responseData.message || responseData.error || 'Unknown error';
              emailSendResults.errors.push(`${email}: ${errorMessage}`);
              console.error(`❌ Failed to send to ${email}:`, responseData);
              
              // Special handling for domain verification error (403)
              if (responseData.statusCode === 403 && responseData.name === 'validation_error') {
                console.error('\n🔒 RESEND FREE TIER LIMITATION:');
                console.error('   You can only send to your verified email address in free tier.');
                console.error('   Your verified email: Check the error message above');
                console.error('\n   📌 To send to ANY email address:');
                console.error('   1. Verify a domain at: https://resend.com/domains');
                console.error('   2. Update the "from" address to: yourname@yourdomain.com');
                console.error('\n   📌 OR for testing:');
                console.error('   Just send campaigns to your own verified email address\n');
              }
              // Special handling for API key errors (401)
              else if (responseData.statusCode === 401) {
                console.error('\n🔑 API KEY ERROR: Your RESEND_API_KEY is invalid or expired.');
                console.error('   👉 Get a new API key at: https://resend.com/api-keys');
                console.error('   👉 Update it in Supabase: Dashboard → Settings → Edge Functions → Secrets\n');
              }
            }
          } catch (error) {
            emailSendResults.failed++;
            emailSendResults.errors.push(`${email}: ${error}`);
            console.error(`❌ Exception sending to ${email}:`, error);
          }
        }));
        
        // Small delay between batches to avoid rate limiting
        if (i + batchSize < recipients.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      console.log(`\n📊 Email Send Summary:`);
      console.log(`   ✅ Successfully sent: ${emailSendResults.success}`);
      console.log(`   ❌ Failed: ${emailSendResults.failed}`);
      if (emailSendResults.errors.length > 0) {
        console.log(`\n   Errors:`);
        emailSendResults.errors.forEach(err => console.log(`     - ${err}`));
      }
      console.log(`\n${'='.repeat(80)}\n`);
    } else if (!resendApiKey || resendApiKey.trim() === '') {
      console.log('⚠️  RESEND_API_KEY not configured - emails not sent to actual inboxes');
      console.log('💡 To send real emails, add your Resend API key in the Supabase dashboard');
      console.log('   Visit: https://resend.com/api-keys to get your API key\n');
    }
    
    // In production, this would send actual emails via SendGrid, Mailgun, etc.
    // For demo/development, we log the email details
    return c.json({ 
      success: true, 
      campaign,
      recipients: recipientDetails,
      emailSendResults: resendApiKey ? emailSendResults : null,
      emailPreview: {
        subject: campaign.subject,
        content: campaign.content || campaign.message,
        recipientCount: recipients.length
      },
      message: resendApiKey 
        ? `📧 Campaign "${campaign.name}" sent to ${emailSendResults.success} of ${recipients.length} recipient(s)${emailSendResults.failed > 0 ? ` (${emailSendResults.failed} failed)` : ''}` 
        : `📧 Campaign "${campaign.name}" prepared for ${recipients.length} recipient(s). Configure RESEND_API_KEY to send real emails.` 
    });
  } catch (error) {
    console.log("Error sending campaign:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get active popup campaigns
app.get("/make-server-3cbf86a5/campaigns/active-popups", async (c) => {
  try {
    const campaigns = await kv.getByPrefix<any>("campaign:") || [];
    const activePopups = campaigns.filter(c => 
      c.type === 'popup' && 
      c.status === 'active' &&
      (!c.endDate || new Date(c.endDate) > new Date())
    );
    
    return c.json({ success: true, campaigns: activePopups });
  } catch (error) {
    console.log("Error fetching active popups:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete campaign
app.delete("/make-server-3cbf86a5/campaigns/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const campaign = await kv.get(`campaign:${id}`);
    
    if (!campaign) {
      return c.json({ success: false, error: "Campaign not found" }, 404);
    }
    
    await kv.del(`campaign:${id}`);
    console.log("✅ Campaign deleted:", id);
    
    return c.json({ success: true, message: "Campaign deleted successfully" });
  } catch (error) {
    console.log("Error deleting campaign:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== SURVEY ROUTES ====================

// Create survey
app.post("/make-server-3cbf86a5/surveys", async (c) => {
  try {
    const surveyData = await c.req.json();
    const surveyId = `survey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const survey = {
      id: surveyId,
      ...surveyData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responseCount: 0
    };
    
    await kv.set(`survey:${surveyId}`, survey);
    console.log("✅ Survey created:", surveyId);
    
    return c.json({ success: true, survey });
  } catch (error) {
    console.log("Error creating survey:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all surveys
app.get("/make-server-3cbf86a5/surveys", async (c) => {
  try {
    const surveys = await kv.getByPrefix<any>("survey:") || [];
    
    // Sort by creation date (newest first)
    surveys.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return c.json({ success: true, surveys });
  } catch (error) {
    console.log("Error fetching surveys:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get active survey for platform
app.get("/make-server-3cbf86a5/surveys/active", async (c) => {
  try {
    const platform = c.req.query("platform") || "web";
    const surveys = await kv.getByPrefix<any>("survey:") || [];
    
    const activeSurvey = surveys.find(s => 
      s.status === 'active' && 
      (s.targetPlatform === 'all' || s.targetPlatform === platform)
    );
    
    return c.json({ success: true, survey: activeSurvey || null });
  } catch (error) {
    console.log("Error fetching active survey:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update survey
app.put("/make-server-3cbf86a5/surveys/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    const survey = await kv.get<any>(`survey:${id}`);
    
    if (!survey) {
      return c.json({ success: false, error: "Survey not found" }, 404);
    }
    
    const updatedSurvey = {
      ...survey,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`survey:${id}`, updatedSurvey);
    console.log("✅ Survey updated:", id);
    
    return c.json({ success: true, survey: updatedSurvey });
  } catch (error) {
    console.log("Error updating survey:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete survey
app.delete("/make-server-3cbf86a5/surveys/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const survey = await kv.get(`survey:${id}`);
    
    if (!survey) {
      return c.json({ success: false, error: "Survey not found" }, 404);
    }
    
    await kv.del(`survey:${id}`);
    
    // Delete all responses for this survey
    const responses = await kv.getByPrefix<any>(`survey-response:${id}:`) || [];
    for (const response of responses) {
      await kv.del(`survey-response:${id}:${response.id}`);
    }
    
    console.log("✅ Survey deleted:", id);
    
    return c.json({ success: true, message: "Survey deleted successfully" });
  } catch (error) {
    console.log("Error deleting survey:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Submit survey response
app.post("/make-server-3cbf86a5/surveys/:id/responses", async (c) => {
  try {
    const surveyId = c.req.param("id");
    const responseData = await c.req.json();
    const responseId = `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const response = {
      id: responseId,
      surveyId,
      ...responseData,
      timestamp: new Date().toISOString()
    };
    
    await kv.set(`survey-response:${surveyId}:${responseId}`, response);
    
    // Update response count
    const survey = await kv.get<any>(`survey:${surveyId}`);
    if (survey) {
      survey.responseCount = (survey.responseCount || 0) + 1;
      await kv.set(`survey:${surveyId}`, survey);
    }
    
    console.log("✅ Survey response submitted:", responseId);
    
    return c.json({ success: true, response });
  } catch (error) {
    console.log("Error submitting survey response:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get survey analytics
app.get("/make-server-3cbf86a5/surveys/:id/analytics", async (c) => {
  try {
    const surveyId = c.req.param("id");
    const survey = await kv.get<any>(`survey:${surveyId}`);
    
    if (!survey) {
      return c.json({ success: false, error: "Survey not found" }, 404);
    }
    
    const responses = await kv.getByPrefix<any>(`survey-response:${surveyId}:`) || [];
    
    // Calculate analytics
    const analytics: any = {
      totalResponses: responses.length,
      platformBreakdown: {
        web: 0,
        ios: 0,
        android: 0
      },
      questionResults: {}
    };
    
    // Platform breakdown
    responses.forEach(r => {
      if (r.platform) {
        analytics.platformBreakdown[r.platform]++;
      }
    });
    
    // Process each question
    survey.questions.forEach((question: any) => {
      const questionId = question.id;
      const questionType = question.type;
      
      analytics.questionResults[questionId] = {
        count: 0
      };
      
      if (questionType === 'rating' || questionType === 'nps') {
        let total = 0;
        let count = 0;
        responses.forEach(r => {
          if (r.answers[questionId] !== undefined) {
            total += r.answers[questionId];
            count++;
          }
        });
        analytics.questionResults[questionId].average = count > 0 ? total / count : 0;
        analytics.questionResults[questionId].count = count;
      } else if (questionType === 'multiple-choice') {
        const options: Record<string, number> = {};
        question.options?.forEach((opt: string) => {
          options[opt] = 0;
        });
        responses.forEach(r => {
          const answer = r.answers[questionId];
          if (answer && options[answer] !== undefined) {
            options[answer]++;
          }
        });
        analytics.questionResults[questionId].options = options;
        analytics.questionResults[questionId].count = responses.filter(r => r.answers[questionId]).length;
      } else if (questionType === 'yes-no') {
        let yes = 0;
        let no = 0;
        responses.forEach(r => {
          const answer = r.answers[questionId];
          if (answer === 'yes') yes++;
          if (answer === 'no') no++;
        });
        analytics.questionResults[questionId].yes = yes;
        analytics.questionResults[questionId].no = no;
        analytics.questionResults[questionId].count = yes + no;
      } else if (questionType === 'text') {
        const textResponses = responses
          .filter(r => r.answers[questionId])
          .map(r => r.answers[questionId]);
        analytics.questionResults[questionId].responses = textResponses;
        analytics.questionResults[questionId].count = textResponses.length;
      }
    });
    
    return c.json({ success: true, analytics });
  } catch (error) {
    console.log("Error fetching survey analytics:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// FAVORITES/WISHLIST ROUTES
// ============================================

// Add product to favorites
app.post("/make-server-3cbf86a5/favorites", async (c) => {
  try {
    const { userId, productId, productName, price, image, category } = await c.req.json();
    
    if (!userId || !productId) {
      return c.json({ success: false, error: "userId and productId are required" }, 400);
    }
    
    console.log("❤️ Adding to favorites:", { userId, productId, productName });
    
    // Get existing favorites
    const favoritesKey = `user:favorites:${userId}`;
    const favorites = await kv.get<any[]>(favoritesKey) || [];
    
    // Check if already favorited
    const existingIndex = favorites.findIndex(fav => fav.productId === productId);
    if (existingIndex !== -1) {
      return c.json({ success: true, message: "Already in favorites", favorites });
    }
    
    // Add new favorite
    const newFavorite = {
      productId,
      productName,
      price,
      image,
      category,
      addedAt: new Date().toISOString()
    };
    
    favorites.push(newFavorite);
    await kv.set(favoritesKey, favorites);
    
    // Log the event in journey logs
    const eventId = `journey:event:${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const journeyLog = {
      id: eventId,
      eventType: 'custom',
      eventName: 'Product Favorited',
      userId,
      metadata: { productId, productName, price, category },
      timestamp: new Date().toISOString()
    };
    await kv.set(eventId, journeyLog);
    
    console.log("✅ Added to favorites successfully");
    return c.json({ success: true, favorites });
  } catch (error) {
    console.log("❌ Error adding to favorites:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Remove product from favorites
app.delete("/make-server-3cbf86a5/favorites", async (c) => {
  try {
    const { userId, productId } = await c.req.json();
    
    if (!userId || !productId) {
      return c.json({ success: false, error: "userId and productId are required" }, 400);
    }
    
    console.log("💔 Removing from favorites:", { userId, productId });
    
    // Get existing favorites
    const favoritesKey = `user:favorites:${userId}`;
    const favorites = await kv.get<any[]>(favoritesKey) || [];
    
    // Remove the favorite
    const updatedFavorites = favorites.filter(fav => fav.productId !== productId);
    await kv.set(favoritesKey, updatedFavorites);
    
    // Log the event
    const eventId = `journey:event:${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const journeyLog = {
      id: eventId,
      eventType: 'custom',
      eventName: 'Product Unfavorited',
      userId,
      metadata: { productId },
      timestamp: new Date().toISOString()
    };
    await kv.set(eventId, journeyLog);
    
    console.log("✅ Removed from favorites successfully");
    return c.json({ success: true, favorites: updatedFavorites });
  } catch (error) {
    console.log("❌ Error removing from favorites:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get user's favorites
app.get("/make-server-3cbf86a5/favorites/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    console.log("📋 Fetching favorites for user:", userId);
    
    const favoritesKey = `user:favorites:${userId}`;
    const favorites = await kv.get<any[]>(favoritesKey) || [];
    
    console.log("✅ Retrieved", favorites.length, "favorites");
    return c.json({ success: true, favorites });
  } catch (error) {
    console.log("❌ Error fetching favorites:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all favorites analytics (for admin)
app.get("/make-server-3cbf86a5/favorites/analytics/all", async (c) => {
  try {
    console.log("📊 Fetching all favorites analytics");
    
    // Get all user favorites
    const allFavorites = await kv.getByPrefix("user:favorites:");
    
    // Calculate analytics
    const productFavoriteCount: Record<string, { count: number; productName: string; price: number; lastAdded: string }> = {};
    let totalFavorites = 0;
    
    allFavorites.forEach((favorites: any) => {
      if (Array.isArray(favorites)) {
        favorites.forEach(fav => {
          totalFavorites++;
          if (!productFavoriteCount[fav.productId]) {
            productFavoriteCount[fav.productId] = {
              count: 0,
              productName: fav.productName,
              price: fav.price,
              lastAdded: fav.addedAt
            };
          }
          productFavoriteCount[fav.productId].count++;
          if (fav.addedAt > productFavoriteCount[fav.productId].lastAdded) {
            productFavoriteCount[fav.productId].lastAdded = fav.addedAt;
          }
        });
      }
    });
    
    // Convert to array and sort by count
    const topFavorites = Object.entries(productFavoriteCount)
      .map(([productId, data]) => ({ productId, ...data }))
      .sort((a, b) => b.count - a.count);
    
    console.log("✅ Favorites analytics:", { totalFavorites, uniqueProducts: topFavorites.length });
    return c.json({
      success: true,
      analytics: {
        totalFavorites,
        uniqueProducts: topFavorites.length,
        topFavorites,
        usersWithFavorites: allFavorites.length
      }
    });
  } catch (error) {
    console.log("❌ Error fetching favorites analytics:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

console.log("✅ All routes configured successfully");
console.log("🚀 Starting Deno server...");
Deno.serve(app.fetch);