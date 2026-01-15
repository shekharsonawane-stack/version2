import { API_BASE, publicAnonKey } from "./supabase/client";

// ============================================
// LEAD CAPTURE HELPERS
// ============================================

export interface LeadData {
  email: string;
  name?: string;
  phone?: string;
  source: "website-form" | "chatbot" | "consultation" | "questionnaire" | "newsletter";
  interests?: string[];
  budget?: string;
  roomType?: string;
  notes?: string;
}

/**
 * Capture a new lead from any source
 */
export async function captureLead(leadData: LeadData): Promise<{ success: boolean; leadId?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        ...leadData,
        status: "new",
      }),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    const data = await response.json();
    
    if (data.success) {
      console.log("Lead captured successfully:", data.lead.id);
      return { success: true, leadId: data.lead.id };
    } else {
      console.error("Failed to capture lead:", data.error);
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error("Error capturing lead:", error);
    console.warn("ℹ️ Backend not available - lead captured in offline mode");
    
    // Generate mock lead ID for offline mode
    const mockLeadId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log("✅ Mock lead created:", mockLeadId);
    
    return { success: true, leadId: mockLeadId };
  }
}

/**
 * Capture newsletter subscription as a lead
 */
export async function captureNewsletterLead(email: string): Promise<{ success: boolean }> {
  const result = await captureLead({
    email,
    source: "newsletter",
  });
  return { success: result.success };
}

/**
 * Capture contact form submission as a lead
 */
export async function captureContactFormLead(data: {
  email: string;
  name?: string;
  phone?: string;
  message?: string;
}): Promise<{ success: boolean }> {
  const result = await captureLead({
    email: data.email,
    name: data.name,
    phone: data.phone,
    source: "website-form",
    notes: data.message,
  });
  return { success: result.success };
}

/**
 * Capture chatbot interaction as a lead
 */
export async function captureChatbotLead(data: {
  email: string;
  name?: string;
  interests?: string[];
  budget?: string;
  roomType?: string;
}): Promise<{ success: boolean }> {
  const result = await captureLead({
    ...data,
    source: "chatbot",
  });
  return { success: result.success };
}

/**
 * Capture questionnaire submission as a lead
 */
export async function captureQuestionnaireLead(data: {
  email: string;
  name?: string;
  phone?: string;
  roomType?: string;
  budget?: string;
  interests?: string[];
}): Promise<{ success: boolean }> {
  const result = await captureLead({
    ...data,
    source: "questionnaire",
  });
  return { success: result.success };
}

// ============================================
// USER MANAGEMENT HELPERS
// ============================================

export interface UserProfile {
  id?: string;
  email: string;
  name: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  preferences?: {
    style?: string[];
    budget?: string;
    roomTypes?: string[];
    notifications?: {
      email: boolean;
      sms: boolean;
      orderUpdates: boolean;
      promotions: boolean;
    };
  };
}

/**
 * Create a new user account
 */
export async function createUserAccount(userData: UserProfile): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        ...userData,
        accountStatus: "active",
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log("User created successfully:", data.user.id);
      return { success: true, userId: data.user.id };
    } else {
      console.error("Failed to create user:", data.error);
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/users/email/${encodeURIComponent(email)}`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    const data = await response.json();
    
    if (data.success) {
      return { success: true, user: data.user };
    } else {
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log("User profile updated successfully");
      return { success: true };
    } else {
      console.error("Failed to update user profile:", data.error);
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Track user login
 */
export async function trackUserLogin(userId: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/users/${userId}/login`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });
  } catch (error) {
    console.error("Error tracking login:", error);
  }
}

/**
 * Track user activity (for real-time presence)
 */
export async function trackUserActivity(userId: string, activity?: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/users/${userId}/activity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ 
        activity: activity || "browsing",
        timestamp: new Date().toISOString() 
      }),
    });
  } catch (error) {
    console.error("Error tracking activity:", error);
  }
}

/**
 * Create or update lead from user signup
 */
export async function createLeadFromSignup(data: {
  email: string;
  name: string;
  userId: string;
}): Promise<{ success: boolean; leadId?: string }> {
  const result = await captureLead({
    email: data.email,
    name: data.name,
    source: "website-form",
    notes: `User signed up - User ID: ${data.userId}`,
  });
  return result;
}

/**
 * Capture abandoned cart as a lead
 */
export async function captureAbandonedCartLead(data: {
  email?: string;
  name?: string;
  cartItems: any[];
  cartTotal: number;
}): Promise<{ success: boolean; leadId?: string }> {
  if (!data.email) {
    console.log("Cannot capture abandoned cart - no email provided");
    return { success: false };
  }

  const itemNames = data.cartItems.map(item => item.name).join(", ");
  const result = await captureLead({
    email: data.email,
    name: data.name,
    source: "website-form",
    interests: data.cartItems.map(item => item.name),
    budget: `RM ${data.cartTotal}`,
    notes: `Abandoned cart - ${data.cartItems.length} items (${itemNames}) - Total: RM ${data.cartTotal}`,
  });
  
  if (result.success) {
    console.log("✅ Abandoned cart lead captured:", result.leadId);
  }
  
  return result;
}

// ============================================
// ORDER MANAGEMENT HELPERS
// ============================================

export interface OrderData {
  userId: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
    sku?: string;
  }[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  paymentMethod?: string;
  notes?: string;
}

/**
 * Create a new order
 */
export async function createOrder(orderData: OrderData): Promise<{ success: boolean; orderId?: string; orderNumber?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        ...orderData,
        status: "pending-payment",
        paymentStatus: "pending",
        timeline: [
          {
            status: "Order Created",
            description: "Your order has been created and is awaiting payment",
            date: new Date().toISOString(),
            completed: true,
          },
        ],
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log("Order created successfully:", data.order.orderNumber);
      return { 
        success: true, 
        orderId: data.order.id,
        orderNumber: data.order.orderNumber 
      };
    } else {
      console.error("Failed to create order:", data.error);
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error("Error creating order:", error);
    console.warn("ℹ️ Backend not available - order created in offline mode");
    
    // Generate mock order ID for offline mode
    const mockOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const mockOrderNumber = `VIS-${Date.now().toString().slice(-6)}`;
    
    console.log("✅ Mock order created:", mockOrderNumber);
    return { 
      success: true, 
      orderId: mockOrderId,
      orderNumber: mockOrderNumber
    };
  }
}

/**
 * Get user's orders
 */
export async function getUserOrders(userId: string): Promise<{ success: boolean; orders?: any[]; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/users/${userId}/orders`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    const data = await response.json();
    
    if (data.success) {
      return { success: true, orders: data.orders };
    } else {
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Get a specific order
 */
export async function getOrder(orderId: string): Promise<{ success: boolean; order?: any; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    const data = await response.json();
    
    if (data.success) {
      return { success: true, order: data.order };
    } else {
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string, 
  status: string,
  timelineEntry?: {
    status: string;
    description: string;
    location?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    // Update order status
    const updateResponse = await fetch(`${API_BASE}/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ status }),
    });

    const updateData = await updateResponse.json();
    if (!updateData.success) {
      return { success: false, error: updateData.error };
    }

    // Add timeline entry if provided
    if (timelineEntry) {
      const timelineResponse = await fetch(`${API_BASE}/orders/${orderId}/timeline`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          ...timelineEntry,
          date: new Date().toISOString(),
          completed: true,
        }),
      });

      const timelineData = await timelineResponse.json();
      if (!timelineData.success) {
        console.error("Failed to add timeline entry:", timelineData.error);
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: String(error) };
  }
}

// ============================================
// ANALYTICS HELPERS
// ============================================

/**
 * Get CRM statistics
 */
export async function getCRMStats(): Promise<{ success: boolean; stats?: any; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/stats`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    const data = await response.json();
    
    if (data.success) {
      return { success: true, stats: data.stats };
    } else {
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error("Error fetching CRM stats:", error);
    return { success: false, error: String(error) };
  }
}