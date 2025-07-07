
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
  initialMode?: 'signin' | 'signup';
}

export const AuthModal = ({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
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
      onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'signin' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Procesando...' : (mode === 'signin' ? 'Iniciar Sesión' : 'Crear Cuenta')}
          </Button>
        </form>
        
        <div className="text-center">
          <button
            type="button"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-sm text-blue-600 hover:underline"
          >
            {mode === 'signin' 
              ? '¿No tienes cuenta? Regístrate' 
              : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
