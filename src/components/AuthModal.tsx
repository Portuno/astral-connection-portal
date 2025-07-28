import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "./AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Sparkles, Heart } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const { login, register, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('register'); // Cambiar a registro por defecto
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Formularios
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

  // Resetear estado cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setIsLoading(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
      setLoginForm({ email: '', password: '' });
      setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
      setActiveTab('register'); // Siempre empezar en registro
    }
  }, [isOpen]);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      console.log("🔄 Iniciando autenticación con Google...");
      const success = await loginWithGoogle();
      
      if (success) {
        console.log("✅ Redirigiendo a Google...");
        toast({
          title: "Redirigiendo a Google...",
          description: "Te estamos llevando a la página de Google",
        });
      } else {
        console.log("❌ Error en loginWithGoogle");
        toast({
          title: "Error",
          description: "No se pudo conectar con Google. Intenta de nuevo.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("❌ Error en handleGoogleAuth:", error);
      toast({
        title: "Error",
        description: "No se pudo conectar con Google. Intenta de nuevo.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

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
    
    if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Las contraseñas no coinciden",
        description: "Verifica que ambas contraseñas sean iguales",
        variant: "destructive"
      });
      return;
    }

    if (registerForm.password.length < 6) {
      toast({
        title: "Contraseña muy corta",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await register(registerForm.email, registerForm.password, registerForm.name);
      if (success) {
        toast({
          title: "¡Cuenta creada exitosamente! 🎉",
          description: "Preparando tu experiencia astral...",
        });
        onClose();
        // Redirigir directamente a la página de loading de registro
        navigate("/registration-loading");
      } else {
        toast({
          title: "Error al crear la cuenta",
          description: "Verifica que el email no esté en uso",
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

  // Función mejorada para manejar Enter y navegación automática
  const handleKeyPress = (e: React.KeyboardEvent, nextFieldId?: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextFieldId) {
        const nextField = document.getElementById(nextFieldId);
        if (nextField) {
          nextField.focus();
        }
      } else {
        // Si es el último campo, enviar el formulario
        const form = e.currentTarget.closest('form');
        if (form) {
          form.requestSubmit();
        }
      }
    }
  };

  // Función para navegar al siguiente campo
  const handleNextField = (currentFieldId: string, nextFieldId?: string) => {
    if (nextFieldId) {
      const nextField = document.getElementById(nextFieldId);
      if (nextField) {
        nextField.focus();
      }
    } else {
      // Si no hay siguiente campo, enviar el formulario
      const form = document.querySelector('form[data-form="register"]');
      if (form) {
        (form as HTMLFormElement).requestSubmit();
      }
    }
  };

  // Función para manejar cambios en email (sin navegación automática)
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>, isLogin: boolean = false) => {
    const email = e.target.value;
    
    if (isLogin) {
      setLoginForm({...loginForm, email});
    } else {
      setRegisterForm({...registerForm, email});
    }
    // No navegación automática - el usuario debe navegar manualmente
  };

  // Función para manejar cambios en contraseña (sin navegación automática)
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>, isLogin: boolean = false) => {
    const password = e.target.value;
    
    if (isLogin) {
      setLoginForm({...loginForm, password});
    } else {
      setRegisterForm({...registerForm, password});
    }
    // No navegación automática - el usuario debe navegar manualmente
  };

  // Función para manejar cambios en confirmar contraseña (sin navegación automática)
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPassword = e.target.value;
    setRegisterForm({...registerForm, confirmPassword});
    // No navegación automática - el usuario debe navegar manualmente
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto bg-white border-0 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-center mb-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cosmic-magenta via-purple-500 to-cosmic-gold rounded-full shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900 mb-2">
            Únete a Amor Astral
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 text-sm leading-relaxed">
            Descubre tu conexión cósmica perfecta
          </DialogDescription>
        </DialogHeader>

        <div className="px-2 pb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1 rounded-2xl">
              <TabsTrigger 
                value="register" 
                className="text-sm font-medium rounded-xl data-[state=active]:bg-white data-[state=active]:text-cosmic-magenta data-[state=active]:shadow-sm transition-all duration-200 text-gray-600"
              >
                Registrarse
              </TabsTrigger>
              <TabsTrigger 
                value="login" 
                className="text-sm font-medium rounded-xl data-[state=active]:bg-white data-[state=active]:text-cosmic-magenta data-[state=active]:shadow-sm transition-all duration-200 text-gray-600"
              >
                Iniciar Sesión
              </TabsTrigger>
            </TabsList>

            <TabsContent value="register" className="space-y-4">
              {/* Botón de Google Auth */}
              <Button
                type="button"
                variant="outline"
                className="w-full border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 h-12 rounded-2xl font-medium text-gray-700 transition-all duration-200"
                onClick={handleGoogleAuth}
                disabled={isLoading}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
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
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-500 font-medium">o regístrate con email</span>
                </div>
              </div>

              <form onSubmit={handleRegister} data-form="register" className="space-y-3" style={{ paddingBottom: '120px' }}>
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-sm font-semibold text-gray-800">Nombre completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Tu nombre"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                      onKeyPress={(e) => handleKeyPress(e, 'register-email')}
                      className="pl-10 h-12 rounded-xl border-2 border-gray-200 focus:border-cosmic-magenta focus:ring-2 focus:ring-cosmic-magenta/20 transition-all duration-200 text-base text-gray-900 bg-white"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-sm font-semibold text-gray-800">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={registerForm.email}
                      onChange={(e) => handleEmailChange(e, false)}
                      onKeyPress={(e) => handleKeyPress(e, 'register-password')}
                      className="pl-10 h-12 rounded-xl border-2 border-gray-200 focus:border-cosmic-magenta focus:ring-2 focus:ring-cosmic-magenta/20 transition-all duration-200 text-base text-gray-900 bg-white"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-sm font-semibold text-gray-800">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={registerForm.password}
                      onChange={(e) => handlePasswordChange(e, false)}
                      onKeyPress={(e) => handleKeyPress(e, 'register-confirm-password')}
                      className="pl-10 pr-10 h-12 rounded-xl border-2 border-gray-200 focus:border-cosmic-magenta focus:ring-2 focus:ring-cosmic-magenta/20 transition-all duration-200 text-base text-gray-900 bg-white"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password" className="text-sm font-semibold text-gray-800">Confirmar contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      id="register-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirma tu contraseña"
                      value={registerForm.confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      onKeyPress={(e) => handleKeyPress(e)}
                      className="pl-10 pr-10 h-12 rounded-xl border-2 border-gray-200 focus:border-cosmic-magenta focus:ring-2 focus:ring-cosmic-magenta/20 transition-all duration-200 text-base text-gray-900 bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cosmic-magenta to-purple-600 hover:from-cosmic-magenta/90 hover:to-purple-600/90 h-12 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="login" className="space-y-4">
              {/* Botón de Google Auth */}
              <Button
                type="button"
                variant="outline"
                className="w-full border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 h-12 rounded-2xl font-medium text-gray-700 transition-all duration-200"
                onClick={handleGoogleAuth}
                disabled={isLoading}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
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
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-500 font-medium">o continúa con email</span>
                </div>
              </div>

              <form onSubmit={handleLogin} data-form="login" className="space-y-3" style={{ paddingBottom: '120px' }}>
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm font-semibold text-gray-800">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={loginForm.email}
                      onChange={(e) => handleEmailChange(e, true)}
                      onKeyPress={(e) => handleKeyPress(e, 'login-password')}
                      className="pl-10 h-12 rounded-xl border-2 border-gray-200 focus:border-cosmic-magenta focus:ring-2 focus:ring-cosmic-magenta/20 transition-all duration-200 text-base text-gray-900 bg-white"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm font-semibold text-gray-800">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Tu contraseña"
                      value={loginForm.password}
                      onChange={(e) => handlePasswordChange(e, true)}
                      onKeyPress={(e) => handleKeyPress(e)}
                      className="pl-10 pr-10 h-12 rounded-xl border-2 border-gray-200 focus:border-cosmic-magenta focus:ring-2 focus:ring-cosmic-magenta/20 transition-all duration-200 text-base text-gray-900 bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cosmic-magenta to-purple-600 hover:from-cosmic-magenta/90 hover:to-purple-600/90 h-12 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-600 leading-relaxed">
              Al continuar, aceptas nuestros términos de servicio y política de privacidad
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal; 