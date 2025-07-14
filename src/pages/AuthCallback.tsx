import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if we have hash params (from OAuth redirect)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        
        if (accessToken) {
          // If we have access token in URL, this is a direct OAuth redirect
          // Let Supabase handle the session automatically
          console.log('OAuth redirect detected, processing...');
          
          // Wait a moment for Supabase to process the session
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast({
            title: "Error de autenticación",
            description: "Hubo un problema al iniciar sesión. Inténtalo de nuevo.",
            variant: "destructive"
          });
          navigate('/');
          return;
        }

        if (data.session) {
          console.log('Session established successfully:', data.session.user.email);
          toast({
            title: "¡Bienvenido!",
            description: `Has iniciado sesión correctamente como ${data.session.user.user_metadata?.name || data.session.user.email}.`,
          });
          
          // Clear the hash from URL and redirect to home
          window.history.replaceState(null, '', window.location.pathname);
          navigate('/', { replace: true });
        } else {
          console.log('No session found, redirecting to home');
          navigate('/');
        }
      } catch (error) {
        console.error('Unexpected auth error:', error);
        toast({
          title: "Error inesperado",
          description: "Ocurrió un error al procesar la autenticación.",
          variant: "destructive"
        });
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center animate-pulse-glow">
          <span className="text-2xl animate-bounce">✨</span>
        </div>
        <h2 className="text-xl font-bold text-white">Conectando con las estrellas...</h2>
        <p className="text-white/70">Un momento mientras completamos tu ingreso cósmico</p>
        <div className="mt-4">
          <div className="w-8 h-8 mx-auto border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback; 