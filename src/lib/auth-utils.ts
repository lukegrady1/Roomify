import { supabase, isSupabaseReady, mockAuthUser } from './supabase';

/**
 * Check if user is authenticated and redirect to login if not
 * @param redirectTo - The path to redirect to after authentication
 * @returns Promise<User | null> - Returns user if authenticated, null if not
 */
export const requireAuth = async () => {
  if (!isSupabaseReady()) {
    console.warn('Supabase not configured, using mock auth');
    return mockAuthUser;
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return null;
  }
};

/**
 * Generate auth redirect URL
 * @param redirectPath - Path to redirect to after authentication
 * @returns string - Complete redirect URL
 */
export const getAuthRedirectUrl = (redirectPath: string) => {
  return `/auth?redirect=${encodeURIComponent(redirectPath)}`;
};

/**
 * Get the current route for redirect purposes
 * @returns string - Current pathname for redirect
 */
export const getCurrentRoute = () => {
  return window.location.pathname;
};

/**
 * Validate redirect URL to prevent open redirects
 * @param redirectUrl - URL to validate
 * @returns boolean - True if safe to redirect
 */
export const isSafeRedirect = (redirectUrl: string): boolean => {
  // Only allow relative URLs that start with /
  return redirectUrl.startsWith('/') && !redirectUrl.startsWith('//');
};

/**
 * Auth state listener for real-time auth changes
 * @param callback - Function to call when auth state changes
 * @returns Function to unsubscribe
 */
export const onAuthStateChange = (callback: (user: any) => void) => {
  if (!isSupabaseReady()) {
    // In development mode, simulate auth state
    callback(mockAuthUser);
    return () => {}; // No cleanup needed
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
    callback(session?.user || null);
  });

  return () => subscription.unsubscribe();
};

/**
 * Sign out user
 */
export const signOut = async () => {
  if (!isSupabaseReady()) {
    console.warn('Supabase not configured, mock sign out');
    return;
  }

  await supabase.auth.signOut();
};