import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { getAuthConfig, logAuthDebug } from '@/lib/auth-config';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const authConfig = getAuthConfig();
        logAuthDebug('AuthCallback started', {
          location: window.location.href,
          hash: window.location.hash,
          search: window.location.search,
          config: authConfig
        });

        // Check for error in URL parameters first
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        const errorParam = urlParams.get('error') || hashParams.get('error');
        const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');
        
        if (errorParam) {
          logAuthDebug('OAuth error detected', { error: errorParam, description: errorDescription });
          setError(errorDescription || errorParam);
          toast({
            title: "Error de autenticación",
            description: errorDescription || "Error en la autenticación con Google",
            variant: "destructive"
          });
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        // Múltiples estrategias para establecer la sesión
        let session = null;
        let attempts = 0;
        const maxAttempts = 5;

        while (!session && attempts < maxAttempts) {
          attempts++;
          logAuthDebug(`Session attempt ${attempts}/${maxAttempts}`);

          // Estrategia 1: Verificar si hay código de autorización en la URL
          if (attempts === 1) {
            const urlParams = new URLSearchParams(window.location.search);
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            
            const authCode = urlParams.get('code') || hashParams.get('code');
            const accessToken = hashParams.get('access_token');
            
            if (authCode || accessToken) {
              logAuthDebug('Auth code or token found in URL', { 
                hasCode: !!authCode, 
                hasToken: !!accessToken 
              });
              // Dar más tiempo para que Supabase procese automáticamente
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }

          // Estrategia 2: Esperar y usar getSession
          const waitTime = attempts * 1000; // 1s, 2s, 3s, 4s, 5s
          logAuthDebug(`Waiting ${waitTime}ms before getSession attempt...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));

          try {
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) {
              logAuthDebug(`Session error on attempt ${attempts}`, sessionError);
            } else if (sessionData?.session) {
              session = sessionData.session;
              logAuthDebug(`Session obtained on attempt ${attempts}`, session.user?.email);
              break;
            } else {
              logAuthDebug(`No session on attempt ${attempts}`);
            }
          } catch (error) {
            logAuthDebug(`getSession threw error on attempt ${attempts}`, error);
          }
        }

        if (!session) {
          throw new Error('No se pudo establecer la sesión después de múltiples intentos');
        }

        const user = session.user;
        logAuthDebug('User authenticated successfully', user.email);
        
        // Check if user has profile
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', user.id)
            .maybeSingle();

          logAuthDebug('Profile check', { profile, error: profileError });
        } catch (profileCheckError) {
          logAuthDebug('Profile check failed', profileCheckError);
          // No fallar por esto, continuar
        }

        toast({
          title: "¡Bienvenido! ✨",
          description: `Has iniciado sesión correctamente como ${user.user_metadata?.name || user.email}.`,
        });
        
        // Clear URL and redirect
        window.history.replaceState(null, '', '/');
        
        // Small delay to ensure toast shows
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1500);
          
      } catch (error: any) {
        logAuthDebug('Auth callback error', error);
        setError(error.message || 'Error desconocido');
        
        toast({
          title: "Error de autenticación",
          description: error.message || "Hubo un problema al procesar la autenticación. Inténtalo de nuevo.",
          variant: "destructive"
        });
        
        // Redirect after showing error
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 4000);
        
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center border border-red-400">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-white">Error de Autenticación</h2>
          <p className="text-red-300 text-sm">{error}</p>
          <p className="text-white/70 text-sm">Serás redirigido en unos segundos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center animate-pulse-glow">
          <span className="text-2xl animate-bounce">✨</span>
        </div>
        <h2 className="text-xl font-bold text-white">Conectando con las estrellas...</h2>
        <p className="text-white/70">Un momento mientras completamos tu ingreso cósmico</p>
        
        {isProcessing && (
          <div className="mt-4">
            <div className="w-8 h-8 mx-auto border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <p className="text-xs text-white/50 mt-2">Estableciendo conexión cósmica...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback; 