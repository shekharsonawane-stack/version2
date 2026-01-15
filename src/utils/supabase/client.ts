/* 
 * Supabase Client Configuration
 * Safe for both build-time and runtime
 */

import { projectId, publicAnonKey } from './info';

// Safe API base URL that works during build and runtime
export const getApiBase = (): string => {
  // During build time, return a placeholder
  if (typeof window === 'undefined') {
    return '';
  }
  
  // During runtime, return the actual API URL
  if (!projectId) {
    console.warn('⚠️ Supabase projectId not configured');
    return '';
  }
  
  return `https://${projectId}.supabase.co/functions/v1/make-server-3cbf86a5`;
};

// Export as constant for convenience
export const API_BASE = getApiBase();

// Safe check for Supabase availability
export const isSupabaseAvailable = (): boolean => {
  return typeof window !== 'undefined' && !!projectId && !!publicAnonKey;
};

// Export the keys
export { projectId, publicAnonKey };
