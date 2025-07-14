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
          toast({
            title: "¡Bienvenido!",
            description: "Has iniciado sesión correctamente con Google.",
          });
          // Redirigir a la página principal
          navigate('/');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Unexpected auth error:', error);
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
      </div>
    </div>
  );
};

export default AuthCallback; 