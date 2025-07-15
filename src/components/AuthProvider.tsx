import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  isPremium: boolean;
  subscriptionDate?: string;
  onboardingCompleted?: boolean;
  birth_date?: string;
  birth_time?: string;
  birth_place?: string;
  gender?: string;
  looking_for?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  checkSubscription: () => Promise<boolean>;
  upgradeToPremiumFree: () => Promise<boolean>;
  refreshUser: () => Promise<void>;
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
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Función para cargar usuario completo desde la base de datos
  const loadUserFromDatabase = async (supabaseUser: SupabaseUser): Promise<User> => {
    try {
      console.log("📊 Cargando datos completos del usuario desde BD...");
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('❌ Error consultando datos del usuario:', error);
        // Fallback: usuario básico
        return {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Usuario',
          avatar_url: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
          isPremium: false,
          onboardingCompleted: false
        };
      }

      if (!userData) {
        console.error('❌ No se encontró el usuario en la tabla users');
        return {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Usuario',
          avatar_url: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
          isPremium: false,
          onboardingCompleted: false
        };
      }

      // Usuario real de la BD
      const user: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: userData.full_name || supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Usuario',
        avatar_url: userData.avatar_url || supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
        isPremium: userData.is_premium || false,
        onboardingCompleted: userData.onboarding_completed || false
      };
      console.log("✅ Usuario cargado desde BD:", user);
      return user;
    } catch (error) {
      console.error('❌ Error cargando usuario desde BD:', error);
      // Fallback: usuario básico
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Usuario',
        avatar_url: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
        isPremium: false,
        onboardingCompleted: false
      };
    }
  };

  // Cargar sesión inicial
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const getInitialSession = async () => {
      setIsLoading(true);
      try {
        console.log("🔍 Verificando sesión inicial de Supabase...");
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        console.log("🔍 Resultado de getSession:", initialSession, error);

        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          return;
        }

        if (initialSession?.user) {
          console.log("✅ Sesión encontrada:", initialSession.user.email);
          try {
            const fullUser = await loadUserFromDatabase(initialSession.user);
            setUser(fullUser);
            setSession(initialSession);
            console.log("👤 Usuario cargado:", fullUser);
          } catch (e) {
            console.error("❌ Error en loadUserFromDatabase:", e);
          }
        } else {
          console.log("❌ No hay sesión activa");
        }
      } catch (error) {
        console.error('Error loading initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Timeout de seguridad: nunca más de 8 segundos en loading
    timeoutId = setTimeout(() => {
      if (isLoading) {
        console.error("⏰ Timeout: loading demasiado largo en AuthProvider");
        setIsLoading(false);
      }
    }, 8000);

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 Auth state change:", event, session?.user?.email);
        setSession(session);

        if (session?.user) {
          try {
            const fullUser = await loadUserFromDatabase(session.user);
            setUser(fullUser);
            console.log("👤 Usuario actualizado por auth change:", fullUser);
          } catch (e) {
            console.error("❌ Error en loadUserFromDatabase (auth change):", e);
          }
        } else {
          setUser(null);
          console.log("❌ Usuario deslogueado");
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      return !!data.user;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });

      if (error) {
        console.error('Registration error:', error.message);
        return false;
      }

      return !!data.user;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Google login error:', error.message);
        return false;
      }

      return true; // El usuario será redirigido a Google
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log("🚪 Cerrando sesión...");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error.message);
      } else {
        console.log("✅ Sesión cerrada exitosamente");
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      // Actualizar perfil en Supabase
      const { error } = await supabase
        .from('users')
        .update({
          full_name: updates.name,
          avatar_url: updates.avatar_url,
          birth_date: updates.birth_date,
          birth_time: updates.birth_time,
          birth_place: updates.birth_place,
          gender: updates.gender,
          looking_for: updates.looking_for,
          onboarding_completed: updates.onboardingCompleted
        })
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error.message);
        return false;
      }

      // Actualizar estado local
      setUser(prevUser => prevUser ? { ...prevUser, ...updates } : null);
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  const checkSubscription = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data } = await supabase
        .rpc('user_has_active_subscription', { user_uuid: user.id });

      const hasPremium = !!data;
      
      // Actualizar estado local si cambió
      if (user.isPremium !== hasPremium) {
        setUser(prevUser => prevUser ? { ...prevUser, isPremium: hasPremium } : null);
      }

      return hasPremium;
    } catch (error) {
      console.error('Subscription check error:', error);
      return false;
    }
  };

  const upgradeToPremiumFree = async (): Promise<boolean> => {
    if (!user) {
      console.log("❌ No hay usuario logueado para upgrade");
      return false;
    }

    try {
      console.log("🎁 Iniciando upgrade premium gratuito para usuario:", user.email);
      
      // Actualizar directamente el campo is_premium en la tabla users
      const { error } = await supabase
        .from('users')
        .update({ is_premium: true })
        .eq('id', user.id);

      if (error) {
        console.error('❌ Error actualizando usuario a premium:', error);
        return false;
      }

      console.log("✅ Usuario actualizado a premium en Supabase");

      // Refrescar datos del usuario desde la base de datos
      await refreshUser();
      
      console.log("✅ Estado actualizado - Usuario ahora es premium");
      return true;
    } catch (error) {
      console.error('❌ Error en free upgrade:', error);
      return false;
    }
  };

  const refreshUser = async (): Promise<void> => {
    if (!session?.user) return;
    
    try {
      console.log("🔄 Refrescando datos del usuario...");
      const updatedUser = await loadUserFromDatabase(session.user);
      setUser(updatedUser);
      console.log("✅ Usuario refrescado:", updatedUser);
    } catch (error) {
      console.error('Error refrescando usuario:', error);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    loginWithGoogle,
    logout,
    updateProfile,
    checkSubscription,
    upgradeToPremiumFree,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 