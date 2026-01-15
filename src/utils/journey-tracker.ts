// User Journey Tracking System
import { getApiBase, publicAnonKey, isSupabaseAvailable } from './supabase/client';

// Lazy-load API_BASE to avoid build-time execution
const getAPI_BASE = () => getApiBase();

export interface JourneyEvent {
  eventType: string;
  eventName: string;
  userId?: string;
  sessionId: string;
  metadata?: Record<string, any>;
  timestamp: string;
  page?: string;
  referrer?: string;
  deviceType?: string;
}

// Generate or retrieve session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('journey_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('journey_session_id', sessionId);
  }
  return sessionId;
};

// Get device type
const getDeviceType = (): string => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Track a journey event
export const trackEvent = async (
  eventType: 'page_view' | 'button_click' | 'form_submit' | 'product_view' | 'add_to_cart' | 'remove_from_cart' | 'cart_cleared' | 'cart_abandoned' | 'checkout_start' | 'checkout_complete' | 'search' | 'filter' | 'signup' | 'login' | 'logout' | 'click' | 'custom',
  eventName: string,
  metadata?: Record<string, any>
): Promise<void> => {
  try {
    const userId = localStorage.getItem('user_id') || undefined;
    const sessionId = getSessionId();

    const event: JourneyEvent = {
      eventType,
      eventName,
      userId,
      sessionId,
      metadata,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      referrer: document.referrer,
      deviceType: getDeviceType()
    };

    // Send to backend - using BOTH old and new logging systems for migration
    console.log('📡 [JOURNEY TRACKER] Sending event to backend:', eventType, eventName);
    
    try {
      // New organized logging system
      const newResponse = await fetch(`${getAPI_BASE()}/logs/journey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(event)
      });
      
      if (newResponse.ok) {
        const newResult = await newResponse.json();
        console.log('✅ [JOURNEY TRACKER] Event tracked successfully:', newResult.logId);
      } else {
        const errorText = await newResponse.text().catch(() => 'Unknown error');
        console.warn('⚠️ [JOURNEY TRACKER] Could not save to new system:', newResponse.status, errorText);
      }
    } catch (error) {
      // Silently fail - journey tracking shouldn't break the app
      console.debug('⚠️ [JOURNEY TRACKER] New system unavailable:', error instanceof Error ? error.message : 'Unknown error');
    }
    
    try {
      // Keep old system for backward compatibility
      const response = await fetch(`${getAPI_BASE()}/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(event)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ [JOURNEY TRACKER] Legacy event tracked:', result.eventId);
      } else {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.debug('⚠️ [JOURNEY TRACKER] Legacy system returned:', response.status, errorText);
      }
    } catch (error) {
      // Silently fail - journey tracking shouldn't break the app
      console.debug('⚠️ [JOURNEY TRACKER] Legacy system unavailable:', error instanceof Error ? error.message : 'Unknown error');
    }
  } catch (error) {
    console.error('❌ Failed to track journey event:', eventType, error);
    console.error('❌ Full error:', error);
  }
};

// Convenience tracking functions
export const trackPageView = (pageName: string) => {
  trackEvent('page_view', pageName);
};

export const trackButtonClick = (buttonName: string, metadata?: Record<string, any>) => {
  trackEvent('button_click', buttonName, metadata);
};

export const trackProductView = (productId: string, productName: string, price: number) => {
  trackEvent('product_view', 'Product Viewed', { productId, productName, price });
};

export const trackAddToCart = (productId: string, productName: string, price: number, quantity: number) => {
  trackEvent('add_to_cart', 'Added to Cart', { productId, productName, price, quantity });
};

export const trackCheckoutStart = (cartTotal: number, itemCount: number) => {
  trackEvent('checkout_start', 'Checkout Started', { cartTotal, itemCount });
};

export const trackCheckoutComplete = (orderId: string, total: number, paymentMethod: string) => {
  trackEvent('checkout_complete', 'Order Completed', { orderId, total, paymentMethod });
};

export const trackSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent('search', 'Search Performed', { searchTerm, resultsCount });
};

export const trackSignup = (method: string) => {
  trackEvent('signup', 'User Signed Up', { method });
};

export const trackLogin = (method: string) => {
  trackEvent('login', 'User Logged In', { method });
};

export const trackRemoveFromCart = (productId: string, productName: string, price: number, quantity: number) => {
  console.log('🗑️ Tracking cart item removal:', productName, quantity);
  trackEvent('remove_from_cart', 'Removed from Cart', { productId, productName, price, quantity });
};

export const trackCartCleared = (itemCount: number, cartTotal: number) => {
  console.log('🧹 Tracking cart cleared:', itemCount, 'items, B$', cartTotal);
  trackEvent('cart_cleared', 'Cart Cleared', { itemCount, cartTotal });
};

export const trackCartAbandoned = (itemCount: number, cartTotal: number, itemsInCart: any[]) => {
  console.log('🛒💔 Tracking cart abandonment:', itemCount, 'items, B$', cartTotal);
  console.log('📝 Event details:', {
    itemCount,
    cartTotal,
    items: itemsInCart.map(item => ({
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: item.quantity
    }))
  });
  trackEvent('cart_abandoned', 'Cart Abandoned', { 
    itemCount, 
    cartTotal,
    items: itemsInCart.map(item => ({
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: item.quantity
    }))
  });
};

// Start tracking page views automatically
export const initJourneyTracking = () => {
  // Track initial page view
  trackPageView(window.location.pathname);

  // Track page changes for SPAs
  let lastPath = window.location.pathname;
  setInterval(() => {
    const currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      trackPageView(currentPath);
      lastPath = currentPath;
    }
  }, 1000);

  // Track all clicks globally
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    
    // Get meaningful element identifier
    const elementId = target.id || target.className || target.tagName;
    const elementText = target.textContent?.slice(0, 50) || '';
    const elementType = target.tagName.toLowerCase();
    
    // Track the click
    trackEvent('click', 'Element Clicked', {
      elementId,
      elementText,
      elementType,
      x: e.clientX,
      y: e.clientY
    });
  }, true); // Use capture phase to catch all clicks
};