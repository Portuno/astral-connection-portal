import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  subscriptionDate?: string;
  onboardingCompleted?: boolean;
  birth_date?: string;
  birth_time?: string;
  birth_place?: string;
  gender?: string;
  looking_for?: string;
  isPremium?: boolean;
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

  // Función simplificada para crear usuario desde datos de Supabase
  const createUserFromSupabase = (supabaseUser: SupabaseUser, userData?: any): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: userData?.full_name || supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Usuario',
      avatar_url: userData?.avatar_url || supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
      isPremium: userData?.is_premium || false,
      onboardingCompleted: userData?.onboarding_completed || false,
      subscriptionDate: userData?.created_at,
      birth_date: userData?.birth_date,
      birth_time: userData?.birth_time,
      birth_place: userData?.birth_place,
      gender: userData?.gender,
      looking_for: userData?.looking_for
    };
  };

  // Función para cargar usuario (mejorada: no sobrescribe isPremium a false si falla la consulta, y no crea usuario nuevo si no hay prevUser)
  const loadUser = async (supabaseUser: SupabaseUser, prevUser?: User | null): Promise<User | null> => {
    try {
      console.log("📊 Cargando usuario:", supabaseUser.email);
      // Intentar obtener datos adicionales de la BD con timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Database timeout')), 3000);
      });
      const queryPromise = supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id as any)
        .single();
      try {
        const { data: userData, error } = await Promise.race([queryPromise, timeoutPromise]);
        if (userData && !error) {
          console.log("✅ Datos de usuario encontrados en BD");
          return createUserFromSupabase(supabaseUser, userData);
        }
      } catch (dbError) {
        console.log("⚠️ Error/timeout en BD, usando datos básicos y manteniendo usuario anterior si existe:", dbError);
      }
      // Si no se puede cargar desde BD:
      if (prevUser) {
        // Mantener usuario anterior
        return prevUser;
      } else {
        // No hay datos, no actualizar el usuario
        return null;
      }
    } catch (error) {
      console.error('❌ Error cargando usuario:', error);
      if (prevUser) {
        return prevUser;
      } else {
        return null;
      }
    }
  };

  // Función para refrescar usuario (mejorada: solo actualiza si hay datos válidos)
  const refreshUser = async (): Promise<void> => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession?.user) {
        console.log("🔄 Refrescando datos del usuario...");
        const userData = await loadUser(currentSession.user, user); // pasar usuario anterior
        if (userData) {
          setUser(userData);
          setSession(currentSession);
          console.log("✅ Usuario refrescado:", userData.email);
        } else {
          // No actualizar el usuario si no hay datos válidos
          console.warn("⚠️ No se pudo refrescar el usuario, manteniendo el estado anterior");
        }
      } else {
        console.log("❌ No hay sesión activa para refrescar");
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error('❌ Error refrescando usuario:', error);
    }
  };

  // Inicialización del AuthProvider
  useEffect(() => {
    let mounted = true;
    const initializeAuth = async () => {
      try {
        console.log("🔄 Inicializando AuthProvider...");
        // Obtener sesión actual
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession?.user && mounted) {
          console.log("✅ Sesión encontrada:", currentSession.user.email);
          const userData = await loadUser(currentSession.user, user); // pasar usuario anterior
          if (userData) {
            setUser(userData);
            setSession(currentSession);
          } else {
            // No actualizar el usuario si no hay datos válidos
            console.warn("⚠️ No se pudo inicializar el usuario, manteniendo el estado anterior");
          }
        } else {
          console.log("ℹ️ No hay sesión activa");
          setUser(null);
          setSession(null);
        }
      } catch (error) {
        console.error('❌ Error inicializando auth:', error);
        setUser(null);
        setSession(null);
      } finally {
        if (mounted) {
          setIsLoading(false);
          console.log("✅ AuthProvider inicializado");
        }
      }
    };
    initializeAuth();
    // Listener para cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        console.log("🔄 Cambio de estado de auth:", event, session?.user?.email);
        if (event === 'SIGNED_IN' && session?.user) {
          console.log("✅ Usuario logueado:", session.user.email);
          const userData = await loadUser(session.user, user); // pasar usuario anterior
          if (userData) {
            setUser(userData);
            setSession(session);
          } else {
            console.warn("⚠️ No se pudo refrescar el usuario tras login, manteniendo el estado anterior");
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("🚪 Usuario deslogueado");
          setUser(null);
          setSession(null);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log("🔄 Token refrescado");
          const userData = await loadUser(session.user, user); // pasar usuario anterior
          if (userData) {
            setUser(userData);
            setSession(session);
          } else {
            console.warn("⚠️ No se pudo refrescar el usuario tras token refresh, manteniendo el estado anterior");
          }
        }
        setIsLoading(false);
      }
    );
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Refrescar usuario al montar y periódicamente
  useEffect(() => {
    refreshUser(); // Refrescar al montar
    const interval = setInterval(() => {
      refreshUser();
    }, 2 * 60 * 1000); // Cada 2 minutos
    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("🔐 Intentando login con email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ Login error:', error.message);
        return false;
      }

      console.log("✅ Login exitoso:", data.user?.email);
      return !!data.user;
    } catch (error) {
      console.error('❌ Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      console.log("📝 Registrando usuario:", email);
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
        console.error('❌ Registration error:', error.message);
        return false;
      }

      console.log("✅ Registro exitoso:", data.user?.email);
      return !!data.user;
    } catch (error) {
      console.error('❌ Registration error:', error);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      console.log("🔄 Iniciando login con Google...");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('❌ Google login error:', error.message);
        return false;
      }

      console.log("✅ Redirigiendo a Google...");
      return true; // El usuario será redirigido a Google
    } catch (error) {
      console.error('❌ Google login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log("🚪 Cerrando sesión...");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Logout error:', error.message);
      } else {
        console.log("✅ Sesión cerrada exitosamente");
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      console.log("🔄 Actualizando perfil...");
      const updateData = Object.fromEntries(
        Object.entries({
          full_name: updates.name,
          avatar_url: updates.avatar_url,
          birth_date: updates.birth_date,
          birth_time: updates.birth_time,
          birth_place: updates.birth_place,
          gender: updates.gender,
          looking_for: updates.looking_for,
          onboarding_completed: updates.onboardingCompleted
        }).filter(([_, v]) => v !== undefined)
      );
      const { error } = await supabase
        .from('users')
        .update(updateData as any)
        .eq('id', user.id as any);

      if (error) {
        console.error('❌ Error actualizando perfil:', error);
        return false;
      }

      // Actualizar estado local
      setUser(prev => prev ? { ...prev, ...updates } : null);
      console.log("✅ Perfil actualizado");
      return true;
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      return false;
    }
  };

  const isAuthenticated = !!user && !!session;

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated,
    isLoading,
    login,
    register,
    loginWithGoogle,
    logout,
    updateProfile,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 