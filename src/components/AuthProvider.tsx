
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { clearSupabaseAuth, handleAuthError, isRefreshTokenError } from '@/lib/auth-utils';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  hasPaidAccess: boolean;
  signOut: () => Promise<void>;
  checkPaymentStatus: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPaidAccess, setHasPaidAccess] = useState(false);

  // Function to clear corrupted auth data
  const clearAuthData = () => {
    clearSupabaseAuth();
    setUser(null);
    setSession(null);
    setHasPaidAccess(false);
    setLoading(false);
  };

  // Authentication functions
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: metadata
      }
    });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
  };

  const checkPaymentStatus = async () => {
    if (!user) {
      setHasPaidAccess(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_payments')
        .select('payment_status')
        .eq('user_id', user.id)
        .eq('payment_status', 'completed')
        .maybeSingle();

      if (error) {
        console.error('Error checking payment status:', error);
        setHasPaidAccess(false);
        return;
      }

      setHasPaidAccess(!!data);
    } catch (error) {
      console.error('Unexpected error checking payment:', error);
      setHasPaidAccess(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener with error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event, session?.user?.id);

        // Handle specific auth events
        switch (event) {
          case 'SIGNED_IN':
            setSession(session);
            setUser(session?.user ?? null);
            break;
          case 'SIGNED_OUT':
            setSession(null);
            setUser(null);
            setHasPaidAccess(false);
            break;
          case 'TOKEN_REFRESHED':
            setSession(session);
            setUser(session?.user ?? null);
            break;
          case 'USER_UPDATED':
            setSession(session);
            setUser(session?.user ?? null);
            break;
          default:
            setSession(session);
            setUser(session?.user ?? null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session with error handling
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          
          // Use the utility function to handle auth errors
          if (isRefreshTokenError(error)) {
            console.log('Clearing corrupted auth data...');
            clearAuthData();
            return;
          }
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Unexpected error during auth initialization:', error);
        if (mounted) {
          await handleAuthError(error);
          clearAuthData();
        }
      }
    };

    initializeAuth();

    // Cleanup function
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Global error handler for Supabase auth errors
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      const error = event.error;
      
      // Use the utility function to check for auth errors
      if (isRefreshTokenError(error)) {
        console.log('Detected refresh token error, clearing auth data...');
        clearAuthData();
      }
    };

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;
      
      if (isRefreshTokenError(error)) {
        console.log('Detected refresh token error in promise rejection, clearing auth data...');
        clearAuthData();
        event.preventDefault(); // Prevent the error from being logged to console
      }
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  useEffect(() => {
    if (user) {
      checkPaymentStatus();
    } else {
      setHasPaidAccess(false);
    }
  }, [user]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error during sign out:', error);
      // Even if sign out fails, clear local data
      if (isRefreshTokenError(error)) {
        clearAuthData();
      }
    } finally {
      // Always clear local state regardless of API response
      setUser(null);
      setSession(null);
      setHasPaidAccess(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    hasPaidAccess,
    signOut,
    checkPaymentStatus,
    signIn,
    signUp,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
