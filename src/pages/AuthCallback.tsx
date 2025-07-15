import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log("🔐 Iniciando AuthCallback mejorado...");
      
      try {
        // Primero intentar obtener la sesión desde el URL hash
        console.log("🔍 Verificando URL hash para token...");
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        if (accessToken) {
          console.log("✅ Token encontrado en URL, estableciendo sesión...");
          
          // Establecer la sesión manualmente
          const { data: { session }, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });
          
          if (error) {
            console.error('❌ Error estableciendo sesión:', error);
            throw error;
          }
          
          if (session?.user) {
            console.log("✅ Sesión establecida exitosamente:", session.user.email);
            
            // Esperar un poco para que el AuthProvider procese el cambio
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Verificar si el usuario existe en nuestra tabla
            console.log("📊 Verificando usuario en BD...");
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (userError && userError.code === 'PGRST116') {
              // Usuario no existe, crearlo
              console.log("👤 Creando usuario en BD...");
              const { error: insertError } = await supabase
                .from('users')
                .insert({
                  id: session.user.id,
                  email: session.user.email,
                  full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
                  avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
                  is_premium: false,
                  onboarding_completed: false
                });
                
              if (insertError) {
                console.error('❌ Error creando usuario:', insertError);
                // Continuar de todos modos, el trigger podría haberlo creado
              } else {
                console.log("✅ Usuario creado exitosamente");
              }
            }
            
            toast({
              title: "¡Bienvenido a AstroTarot! 🌟", 
              description: `Login exitoso como ${session.user.email}`,
            });
            
            console.log("🏠 Navegando a home...");
            
            // Limpiar URL
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // Navegar a home
            setTimeout(() => {
              navigate('/home');
            }, 1500);
            
            return;
          }
        }
        
        // Fallback: obtener sesión normalmente
        console.log("📡 Fallback: obteniendo sesión normal...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error en auth callback:', error);
          throw error;
        }

        if (session?.user) {
          console.log("✅ Sesión obtenida via fallback:", session.user.email);
          
          toast({
            title: "¡Bienvenido a AstroTarot! 🌟", 
            description: `Login exitoso como ${session.user.email}`,
          });
          
          setTimeout(() => {
            navigate('/home');
          }, 1000);
        } else {
          console.log("❌ No se encontró sesión válida");
          toast({
            title: "Error",
            description: "No se pudo completar la autenticación",
            variant: "destructive"
          });
          navigate('/');
        }
        
      } catch (error) {
        console.error('❌ Error en AuthCallback:', error);
        toast({
          title: "Error de autenticación",
          description: "No se pudo completar el login. Intenta de nuevo.",
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmic-blue flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cosmic-gold mx-auto mb-4"></div>
          <h2 className="text-xl text-white mb-2">Completando autenticación...</h2>
          <p className="text-gray-300">Las estrellas están alineando tu perfil</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback; 