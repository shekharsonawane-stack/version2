// Centralized Database Logging System
// Organizes logs into three separate sections: Journey, User, Order

import { API_BASE, publicAnonKey } from './supabase/client';

// ============================================
// JOURNEY LOGS - Analytics & Tracking Events
// Prefix: journey:event:
// ============================================

export interface JourneyLog {
  eventType: 'page_view' | 'button_click' | 'product_view' | 'add_to_cart' | 'remove_from_cart' | 'cart_cleared' | 'cart_abandoned' | 'checkout_start' | 'checkout_complete' | 'search' | 'filter' | 'click' | 'custom';
  eventName: string;
  userId?: string;
  sessionId: string;
  metadata?: Record<string, any>;
  timestamp: string;
  page?: string;
  referrer?: string;
  deviceType?: string;
}

export const logJourneyEvent = async (log: JourneyLog): Promise<boolean> => {
  try {
    console.log('📊 [JOURNEY LOG] Tracking:', log.eventType, log.eventName);
    const response = await fetch(`${API_BASE}/logs/journey`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(log)
    });

    if (!response.ok) {
      console.error('❌ [JOURNEY LOG] Server error:', response.status);
      return false;
    }

    const result = await response.json();
    console.log('✅ [JOURNEY LOG] Saved:', result.logId);
    return true;
  } catch (error) {
    console.error('❌ [JOURNEY LOG] Failed:', error);
    return false;
  }
};

// ============================================
// USER LOGS - User Activity & Auth Events
// Prefix: user:log:
// ============================================

export interface UserLog {
  userId: string;
  email: string;
  action: 'signup' | 'login' | 'logout' | 'profile_update' | 'password_change' | 'preferences_update' | 'questionnaire_complete' | 'account_delete';
  details?: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export const logUserActivity = async (log: UserLog): Promise<boolean> => {
  try {
    console.log('👤 [USER LOG] Activity:', log.action, 'for', log.email);
    const response = await fetch(`${API_BASE}/logs/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(log)
    });

    if (!response.ok) {
      console.error('❌ [USER LOG] Server error:', response.status);
      return false;
    }

    const result = await response.json();
    console.log('✅ [USER LOG] Saved:', result.logId);
    return true;
  } catch (error) {
    console.error('❌ [USER LOG] Failed:', error);
    return false;
  }
};

// ============================================
// ORDER LOGS - Order Lifecycle Events
// Prefix: order:log:
// ============================================

export interface OrderLog {
  orderId: string;
  userId?: string;
  email?: string;
  action: 'created' | 'payment_pending' | 'payment_confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'failed';
  details?: Record<string, any>;
  timestamp: string;
  orderTotal?: number;
  paymentMethod?: string;
}

export const logOrderEvent = async (log: OrderLog): Promise<boolean> => {
  try {
    console.log('📦 [ORDER LOG] Event:', log.action, 'for order', log.orderId);
    const response = await fetch(`${API_BASE}/logs/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(log)
    });

    if (!response.ok) {
      console.error('❌ [ORDER LOG] Server error:', response.status);
      return false;
    }

    const result = await response.json();
    console.log('✅ [ORDER LOG] Saved:', result.logId);
    return true;
  } catch (error) {
    console.error('❌ [ORDER LOG] Failed:', error);
    return false;
  }
};

// ============================================
// HELPER FUNCTIONS - Quick Access Logging
// ============================================

// Journey helpers
export const trackPageView = (page: string, sessionId: string, userId?: string) => {
  return logJourneyEvent({
    eventType: 'page_view',
    eventName: `Viewed ${page}`,
    sessionId,
    userId,
    page,
    timestamp: new Date().toISOString(),
    deviceType: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop'
  });
};

export const trackProductView = (productId: string, productName: string, price: number, sessionId: string, userId?: string) => {
  return logJourneyEvent({
    eventType: 'product_view',
    eventName: 'Product Viewed',
    sessionId,
    userId,
    metadata: { productId, productName, price },
    timestamp: new Date().toISOString(),
    page: window.location.pathname,
    deviceType: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop'
  });
};

export const trackCartAction = (action: 'add_to_cart' | 'remove_from_cart' | 'cart_cleared' | 'cart_abandoned', metadata: any, sessionId: string, userId?: string) => {
  return logJourneyEvent({
    eventType: action,
    eventName: action.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    sessionId,
    userId,
    metadata,
    timestamp: new Date().toISOString(),
    page: window.location.pathname,
    deviceType: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop'
  });
};

// User helpers
export const logUserSignup = (userId: string, email: string, method: string) => {
  return logUserActivity({
    userId,
    email,
    action: 'signup',
    details: { method },
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  });
};

export const logUserLogin = (userId: string, email: string, method: string) => {
  return logUserActivity({
    userId,
    email,
    action: 'login',
    details: { method },
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  });
};

export const logUserLogout = (userId: string, email: string) => {
  return logUserActivity({
    userId,
    email,
    action: 'logout',
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  });
};

export const logPreferencesUpdate = (userId: string, email: string, preferences: any) => {
  return logUserActivity({
    userId,
    email,
    action: 'preferences_update',
    details: { preferences },
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  });
};

// Order helpers
export const logOrderCreated = (orderId: string, orderTotal: number, paymentMethod: string, userId?: string, email?: string) => {
  return logOrderEvent({
    orderId,
    userId,
    email,
    action: 'created',
    orderTotal,
    paymentMethod,
    timestamp: new Date().toISOString()
  });
};

export const logOrderStatusChange = (orderId: string, status: 'payment_pending' | 'payment_confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'failed', details?: any) => {
  return logOrderEvent({
    orderId,
    action: status,
    details,
    timestamp: new Date().toISOString()
  });
};
