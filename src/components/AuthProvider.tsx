import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  hasPaidAccess: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  checkPaymentStatus: () => Promise<void>;
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

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    
    if (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    // Detectar si estamos en desarrollo o producción
    const isLocalhost = window.location.hostname === 'localhost';
    
    let redirectUrl;
    if (isLocalhost) {
      redirectUrl = `${window.location.origin}/auth/callback`;
    } else {
      // Usar la URL correcta de Vercel para producción
      redirectUrl = 'https://astral-connection-portal.vercel.app/auth/callback';
    }

    console.log('Redirect URL:', redirectUrl); // Para debug

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });
    
    if (error) {
      throw error;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      checkPaymentStatus();
    } else {
      setHasPaidAccess(false);
    }
  }, [user]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setHasPaidAccess(false);
  };

  const value = {
    user,
    session,
    loading,
    hasPaidAccess,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    checkPaymentStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
