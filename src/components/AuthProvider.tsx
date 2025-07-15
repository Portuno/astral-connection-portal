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
      console.log("📊 Cargando datos completos del usuario desde BD...", supabaseUser.email);
      
      // Timeout para la consulta - máximo 5 segundos
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Database query timeout')), 5000);
      });
      
      const queryPromise = supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();
      
      const { data: userData, error } = await Promise.race([queryPromise, timeoutPromise]);

      if (error) {
        console.error('❌ Error consultando datos del usuario:', error.message, error.code);
        
        // Si es error de tabla no encontrada o permisos, intentar crear el usuario
        if (error.code === 'PGRST116' || error.code === '42P01' || error.message.includes('relation "public.users" does not exist')) {
          console.log("🔧 Tabla users no existe o usuario no encontrado, creando usuario básico...");
          // Intentar crear el usuario en la tabla
          try {
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: supabaseUser.id,
                email: supabaseUser.email,
                full_name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name,
                avatar_url: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
                is_premium: false,
                onboarding_completed: false
              });
              
            if (insertError) {
              console.error('❌ Error creando usuario:', insertError);
            } else {
              console.log("✅ Usuario creado en la BD");
            }
          } catch (insertErr) {
            console.error('❌ Error en inserción:', insertErr);
          }
        }
        
        // Fallback: usuario básico
        const fallbackUser = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Usuario',
          avatar_url: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
          isPremium: false,
          onboardingCompleted: false
        };
        console.log("🔧 Usando usuario básico como fallback:", fallbackUser);
        return fallbackUser;
      }

      if (!userData) {
        console.error('❌ No se encontró el usuario en la tabla users');
        const fallbackUser = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Usuario',
          avatar_url: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
          isPremium: false,
          onboardingCompleted: false
        };
        console.log("🔧 Usuario no encontrado, usando fallback:", fallbackUser);
        return fallbackUser;
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
      const fallbackUser = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Usuario',
        avatar_url: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
        isPremium: false,
        onboardingCompleted: false
      };
      console.log("🔧 Error manejado, usando fallback:", fallbackUser);
      return fallbackUser;
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
          setSession(initialSession);
          
          // Crear usuario básico INMEDIATAMENTE para evitar loading infinito
          const basicUser = {
            id: initialSession.user.id,
            email: initialSession.user.email || '',
            name: initialSession.user.user_metadata?.full_name || initialSession.user.user_metadata?.name || initialSession.user.email?.split('@')[0] || 'Usuario',
            avatar_url: initialSession.user.user_metadata?.avatar_url || initialSession.user.user_metadata?.picture,
            isPremium: false,
            onboardingCompleted: false
          };
          setUser(basicUser);
          setIsLoading(false);
          console.log("👤 Usuario básico creado inmediatamente:", basicUser);
          
          // Intentar cargar datos completos en background (sin bloquear)
          loadUserFromDatabase(initialSession.user)
            .then(fullUser => {
              setUser(fullUser);
              console.log("👤 Usuario actualizado con datos de BD:", fullUser);
            })
            .catch(e => {
              console.error("❌ Error cargando desde BD (background):", e);
              // Mantener el usuario básico que ya tenemos
            });
        } else {
          console.log("❌ No hay sesión activa");
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading initial session:', error);
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Timeout de seguridad: nunca más de 6 segundos en loading
    timeoutId = setTimeout(() => {
      if (isLoading) {
        console.error("⏰ Timeout: loading demasiado largo en AuthProvider");
        setIsLoading(false);
      }
    }, 6000);

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 Auth state change:", event, session?.user?.email);
        setSession(session);

        if (session?.user) {
          // No cargar desde BD si es la misma sesión que ya tenemos
          if (session.user.id === user?.id) {
            console.log("👤 Misma sesión, saltando carga de BD");
            return;
          }
          
          // Crear usuario básico INMEDIATAMENTE
          const basicUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuario',
            avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
            isPremium: false,
            onboardingCompleted: false
          };
          setUser(basicUser);
          console.log("👤 Usuario básico por auth change:", basicUser);
          
          // Intentar cargar desde BD en background
          loadUserFromDatabase(session.user)
            .then(fullUser => {
              setUser(fullUser);
              console.log("👤 Usuario actualizado por auth change desde BD:", fullUser);
            })
            .catch(e => {
              console.error("❌ Error en loadUserFromDatabase (auth change, background):", e);
              // Mantener el usuario básico que ya tenemos
            });
        } else {
          setUser(null);
          console.log("❌ Usuario deslogueado");
        }
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