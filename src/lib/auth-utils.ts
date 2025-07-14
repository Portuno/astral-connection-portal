/**
 * Utilities for handling authentication errors and token management
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Clears all Supabase authentication data from localStorage
 */
export const clearSupabaseAuth = (): void => {
  try {
    // Get all localStorage keys
    const keys = Object.keys(localStorage);
    
    // Remove all Supabase-related keys
    keys.forEach(key => {
      if (key.startsWith('sb-')) {
        localStorage.removeItem(key);
        console.log(`Removed corrupted auth key: ${key}`);
      }
    });
    
    console.log('✅ Supabase auth data cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing Supabase auth data:', error);
  }
};

/**
 * Checks if an error is related to refresh token issues
 */
export const isRefreshTokenError = (error: any): boolean => {
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorName = error?.name?.toLowerCase() || '';
  
  return (
    errorMessage.includes('invalid refresh token') ||
    errorMessage.includes('refresh token not found') ||
    errorMessage.includes('refresh_token') ||
    errorMessage.includes('token_refreshed') ||
    errorName.includes('authapierror')
  );
};

/**
 * Handles authentication errors gracefully
 */
export const handleAuthError = async (error: any): Promise<void> => {
  console.error('🔐 Auth error detected:', error);
  
  if (isRefreshTokenError(error)) {
    console.log('🔄 Handling refresh token error...');
    
    // Clear corrupted auth data
    clearSupabaseAuth();
    
    // Sign out to ensure clean state
    try {
      await supabase.auth.signOut();
    } catch (signOutError) {
      console.log('Sign out error (expected):', signOutError);
    }
    
    // Optionally reload the page to start fresh
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
};

/**
 * Validates current session and handles errors
 */
export const validateSession = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      await handleAuthError(error);
      return false;
    }
    
    return !!session;
  } catch (error) {
    await handleAuthError(error);
    return false;
  }
};

/**
 * Safe session refresh with error handling
 */
export const safeRefreshSession = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    
    if (error) {
      await handleAuthError(error);
      return false;
    }
    
    return !!session;
  } catch (error) {
    await handleAuthError(error);
    return false;
  }
};

/**
 * Manual cleanup function that users can call from browser console
 */
export const resetAuth = (): void => {
  console.log('🔄 Manual auth reset initiated...');
  clearSupabaseAuth();
  window.location.reload();
};

// Make resetAuth available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).resetAuth = resetAuth;
  console.log('🔧 Debug: Use resetAuth() in console to manually reset authentication');
} 