import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requireAuth, getAuthRedirectUrl, getCurrentRoute, onAuthStateChange } from './auth-utils';

/**
 * Custom hook for authentication state management
 */
export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading, setUser };
};

/**
 * Custom hook that requires authentication and redirects to login if not authenticated
 * @param redirectTo - Optional path to redirect to after login (defaults to current path)
 */
export const useRequireAuth = (redirectTo?: string) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const authenticatedUser = await requireAuth();
      
      if (authenticatedUser) {
        setUser(authenticatedUser);
      } else {
        const currentPath = redirectTo || getCurrentRoute();
        navigate(getAuthRedirectUrl(currentPath));
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [navigate, redirectTo]);

  return { user, loading };
};

/**
 * Custom hook for protected routes - shows loading while checking auth
 * @param redirectTo - Optional path to redirect to after login
 * @returns Object with user, loading state, and whether to show the protected content
 */
export const useProtectedRoute = (redirectTo?: string) => {
  const { user, loading } = useRequireAuth(redirectTo);
  
  // Only show content if user is authenticated and not loading
  const shouldShowContent = !loading && user;
  
  return {
    user,
    loading,
    shouldShowContent
  };
};