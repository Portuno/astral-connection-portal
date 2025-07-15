import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Shield, Users, Zap, Heart } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  paymentOnly?: boolean; // Nuevo prop para mostrar solo el pago
}

const AuthModal = ({ isOpen, onClose, onSuccess, paymentOnly = false }: AuthModalProps) => {
  const { login, register, loginWithGoogle, user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'auth' | 'payment'>(paymentOnly ? 'payment' : 'auth');
  const [activeTab, setActiveTab] = useState('login');
  const [tempUser, setTempUser] = useState<any>(null);
  
  // Formularios
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  // Resetear estado cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(paymentOnly ? 'payment' : 'auth');
      setIsLoading(false);
    }
  }, [isOpen, paymentOnly]);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const success = await loginWithGoogle();
      
      if (!success) {
        toast({
          title: "Error",
          description: "No se pudo conectar con Google. Intenta de nuevo.",
          variant: "destructive"
        });
      }
      // Si es exitoso, el usuario será redirigido automáticamente
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo conectar con Google. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(loginForm.email, loginForm.password);
      if (success) {
        toast({
          title: "¡Bienvenido de vuelta! 🌟",
          description: "Has iniciado sesión correctamente",
        });
        onSuccess();
        onClose();
      } else {
        toast({
          title: "Error de autenticación",
          description: "Email o contraseña incorrectos",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(registerForm.email, registerForm.password, registerForm.name);
      if (success) {
        // Guardar usuario temporal para el paso de pago
        setTempUser({
          email: registerForm.email,
          name: registerForm.name
        });
        setCurrentStep('payment');
        toast({
          title: "¡Registro exitoso! 🎉",
          description: "Ahora completa tu suscripción para acceder a los chats",
        });
      } else {
        toast({
          title: "Error de registro",
          description: "Por favor verifica los datos ingresados",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simular procesamiento de pago con Square
      // En producción aquí iría la integración real con Square
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular pago exitoso (90% de éxito para demo)
      const success = Math.random() > 0.1;

      if (success && user) {
        console.log("💳 Procesando pago premium para usuario:", user.email);
        
        // Actualizar usuario a premium en Supabase
        const { error } = await supabase
          .from('users')
          .update({ is_premium: true })
          .eq('id', user.id);

        if (error) {
          console.error('❌ Error actualizando usuario a premium:', error);
          toast({
            title: "Error",
            description: "No se pudo activar la suscripción",
            variant: "destructive"
          });
          return;
        }
        
        console.log("✅ Pago procesado - Usuario actualizado a premium");
        
        // Refrescar datos del usuario
        await refreshUser();
        
        toast({
          title: "¡Pago procesado exitosamente! 💫",
          description: "Ya puedes acceder a todos los chats premium",
        });
        
        onSuccess();
        onClose();
        resetModal();
      } else {
        toast({
          title: "Error en el pago",
          description: "No se pudo procesar el pago. Intenta de nuevo.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error procesando el pago",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setCurrentStep(paymentOnly ? 'payment' : 'auth');
    setActiveTab('login');
    setTempUser(null);
    setLoginForm({ email: '', password: '' });
    setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
    setPaymentForm({ cardNumber: '', expiryDate: '', cvv: '', cardholderName: '' });
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-md border-white/20">
        {currentStep === 'auth' ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-cosmic-blue">
                🌟 Únete a AstroTarot
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600">
                Inicia sesión o crea tu cuenta para acceder a chats premium
              </DialogDescription>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                {/* Botón de Google Auth */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {isLoading ? "Conectando..." : "Continuar con Google"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">o continúa con email</span>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Tu contraseña"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-cosmic-magenta hover:bg-cosmic-magenta/80"
                    disabled={isLoading}
                  >
                    {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                {/* Botón de Google Auth */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {isLoading ? "Conectando..." : "Registrarse con Google"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">o regístrate con email</span>
                  </div>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nombre completo</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Tu nombre"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirma tu contraseña"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-cosmic-magenta hover:bg-cosmic-magenta/80"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-cosmic-blue">
                💳 Suscripción Premium
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600">
                Completa tu pago para acceder a los chats ilimitados
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Plan Premium */}
              <Card className="border-cosmic-magenta/30 bg-gradient-to-r from-cosmic-magenta/10 to-purple-100">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-cosmic-magenta" />
                    <CardTitle className="text-cosmic-magenta">Plan Premium</CardTitle>
                  </div>
                  <div className="text-3xl font-bold text-cosmic-blue">
                    €29,90
                    <span className="text-sm font-normal text-gray-600">/mes</span>
                  </div>
                  <CardDescription>Acceso completo a todas las funciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Chats ilimitados con todos los perfiles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Análisis de compatibilidad avanzado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Lectura personalizada de carta natal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Soporte prioritario 24/7</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Formulario de pago */}
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardholder-name">Nombre del titular</Label>
                  <Input
                    id="cardholder-name"
                    type="text"
                    placeholder="Nombre como aparece en la tarjeta"
                    value={paymentForm.cardholderName}
                    onChange={(e) => setPaymentForm({...paymentForm, cardholderName: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="card-number">Número de tarjeta</Label>
                  <Input
                    id="card-number"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={paymentForm.cardNumber}
                    onChange={(e) => setPaymentForm({...paymentForm, cardNumber: formatCardNumber(e.target.value)})}
                    maxLength={19}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry-date">Fecha de vencimiento</Label>
                    <Input
                      id="expiry-date"
                      type="text"
                      placeholder="MM/AA"
                      value={paymentForm.expiryDate}
                      onChange={(e) => setPaymentForm({...paymentForm, expiryDate: formatExpiryDate(e.target.value)})}
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="text"
                      placeholder="123"
                      value={paymentForm.cvv}
                      onChange={(e) => setPaymentForm({...paymentForm, cvv: e.target.value.replace(/\D/g, '')})}
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>Pago seguro procesado por Square</span>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-cosmic-magenta hover:bg-cosmic-magenta/80"
                  disabled={isLoading}
                >
                  {isLoading ? "Procesando pago..." : "Pagar €29,90"}
                </Button>
              </form>

              <Button
                variant="ghost"
                onClick={() => setCurrentStep('auth')}
                className="w-full"
                disabled={isLoading}
              >
                ← Volver
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal; 