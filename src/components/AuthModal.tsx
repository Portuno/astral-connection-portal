
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from './AuthProvider';
import { useToast } from '@/components/ui/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal = ({ isOpen, onClose, onSuccess, initialMode = 'signin' }: AuthModalProps) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(formData.email, formData.password);
        toast({
          title: "¡Bienvenido de vuelta!",
          description: "Has iniciado sesión correctamente.",
        });
      } else {
        await signUp(formData.email, formData.password, { name: formData.name });
        toast({
          title: "¡Cuenta creada!",
          description: "Por favor verifica tu email para continuar.",
        });
      }
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Algo salió mal. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      console.log('[AuthModal] Initiating Google OAuth from modal...');
      console.log('[AuthModal] Current window location:', window.location.href);
      console.log('[AuthModal] User agent:', navigator.userAgent);
      
      // Verificar que signInWithGoogle existe
      if (typeof signInWithGoogle !== 'function') {
        throw new Error('signInWithGoogle is not a function');
      }
      
      console.log('[AuthModal] Calling signInWithGoogle...');
      await signInWithGoogle();
      
      console.log('[AuthModal] Google OAuth initiated successfully, user will be redirected...');
      
    } catch (error: any) {
      console.error('[AuthModal] Error in handleGoogleSignIn:', error);
      console.error('[AuthModal] Error stack:', error.stack);
      console.error('[AuthModal] signInWithGoogle type:', typeof signInWithGoogle);
      
      let errorMessage = "No se pudo iniciar sesión con Google.";
      
      // Mensajes de error más específicos
      if (error.message?.includes('not a function')) {
        errorMessage = "Error interno de la aplicación. Recarga la página e inténtalo de nuevo.";
      } else if (error.message?.includes('fetch')) {
        errorMessage = "Error de conexión. Verifica tu internet e inténtalo de nuevo.";
      } else if (error.message?.includes('popup')) {
        errorMessage = "Error con la ventana emergente. Verifica que no esté bloqueada.";
      } else if (error.message?.includes('redirect')) {
        errorMessage = "Error de configuración. Contacta al administrador.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error de Autenticación",
        description: errorMessage,
        variant: "destructive"
      });
      
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-card" aria-describedby="auth-modal-description">
        <DialogHeader>
          <DialogTitle className="text-center text-white text-xl font-bold">
            {mode === 'signin' ? 'Despertar tu Magia Interior' : 'Unirse al Cosmos'}
          </DialogTitle>
          <p id="auth-modal-description" className="text-white/70 text-center text-sm mt-2">
            {mode === 'signin' 
              ? 'Inicia sesión para acceder a tu destino cósmico' 
              : 'Crea tu cuenta para comenzar tu viaje astral'
            }
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white hover:bg-white/90 text-gray-900 font-semibold py-3 rounded-2xl border-2 border-white/20 shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-white/70">o continúa con email</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Nombre Cósmico</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder-white/50 rounded-2xl"
                  placeholder="Tu nombre en el universo"
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email Celestial</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder-white/50 rounded-2xl"
                placeholder="tu@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Código Secreto</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder-white/50 rounded-2xl"
                placeholder="••••••••"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-2xl shadow-xl" 
              disabled={loading}
            >
              {loading ? 'Conectando con el cosmos...' : (mode === 'signin' ? 'Despertar Magia ✨' : 'Unirse al Cosmos 🌟')}
            </Button>
          </form>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-sm text-purple-300 hover:text-purple-200 transition-colors"
            >
              {mode === 'signin' 
                ? '¿Primera vez en nuestro cosmos? ¡Únete aquí!' 
                : '¿Ya formas parte del cosmos? ¡Despierta tu magia!'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
