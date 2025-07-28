import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowLeft } from "lucide-react";

const Auth = () => {
  const { login, register, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('register');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [currentField, setCurrentField] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);
  
  // Formularios
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

  // Detectar cambios en el viewport (teclado)
  useEffect(() => {
    const handleViewportChange = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        const keyboardHeight = windowHeight - viewportHeight;
        
        setIsKeyboardVisible(keyboardHeight > 150);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      return () => window.visualViewport.removeEventListener('resize', handleViewportChange);
    }
  }, []);

  // Scroll automático cuando cambia el campo activo
  useEffect(() => {
    if (currentField) {
      const fieldElement = document.getElementById(currentField);
      if (fieldElement) {
        fieldElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }
    }
  }, [currentField]);

  const handleFieldFocus = (fieldId: string) => {
    setCurrentField(fieldId);
  };

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
        navigate("/home");
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

  // Función para manejar Enter y navegación automática
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
          (form as HTMLFormElement).requestSubmit();
        }
      }
    }
  };

  // Función para manejar cambios en email
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>, isLogin: boolean = false) => {
    const email = e.target.value;
    
    if (isLogin) {
      setLoginForm({...loginForm, email});
    } else {
      setRegisterForm({...registerForm, email});
    }
  };

  // Función para manejar cambios en contraseña
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>, isLogin: boolean = false) => {
    const password = e.target.value;
    
    if (isLogin) {
      setLoginForm({...loginForm, password});
    } else {
      setRegisterForm({...registerForm, password});
    }
  };

  // Función para manejar cambios en confirmar contraseña
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPassword = e.target.value;
    setRegisterForm({...registerForm, confirmPassword});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1033] via-[#1a1440] to-[#2a0a3c] flex flex-col">
      {/* Header simple */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-cyan-200 hover:text-cosmic-magenta transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Volver</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cosmic-magenta via-purple-500 to-cosmic-gold rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg">Amor Astral</span>
        </div>
      </div>

      {/* Contenido principal simplificado */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md mx-auto">
          {/* Título principal */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Registro
            </h1>
            <p className="text-gray-300 text-base">
              Únete a Amor Astral y encuentra tu conexión cósmica
            </p>
          </div>

          {/* Tabs simplificados */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/10 p-1 rounded-2xl">
              <TabsTrigger 
                value="register" 
                className="text-sm font-medium rounded-xl data-[state=active]:bg-white data-[state=active]:text-cosmic-magenta data-[state=active]:shadow-sm transition-all duration-200 text-white"
              >
                Registrarse
              </TabsTrigger>
              <TabsTrigger 
                value="login" 
                className="text-sm font-medium rounded-xl data-[state=active]:bg-white data-[state=active]:text-cosmic-magenta data-[state=active]:shadow-sm transition-all duration-200 text-white"
              >
                Iniciar Sesión
              </TabsTrigger>
            </TabsList>

            <TabsContent value="register" className="space-y-6">
              {/* Botón de Google Auth */}
              <Button
                type="button"
                variant="outline"
                className="w-full border-2 border-white/20 hover:border-white/40 hover:bg-white/10 h-12 rounded-xl font-medium text-white transition-all duration-200"
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
                  <Separator className="w-full bg-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-gradient-to-br from-[#0a1033] via-[#1a1440] to-[#2a0a3c] px-4 text-gray-300 font-medium">o regístrate con email</span>
                </div>
              </div>

              <form ref={formRef} onSubmit={handleRegister} id="register-form" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-sm font-semibold text-white">Nombre completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Tu nombre"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                      onKeyPress={(e) => handleKeyPress(e, 'register-email')}
                      onFocus={() => handleFieldFocus('register-name')}
                      className="pl-10 h-12 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder-gray-400 focus:border-cosmic-magenta focus:ring-2 focus:ring-cosmic-magenta/20 transition-all duration-200 text-base"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-sm font-semibold text-white">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={registerForm.email}
                      onChange={(e) => handleEmailChange(e, false)}
                      onKeyPress={(e) => handleKeyPress(e, 'register-password')}
                      onFocus={() => handleFieldFocus('register-email')}
                      className="pl-10 h-12 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder-gray-400 focus:border-cosmic-magenta focus:ring-2 focus:ring-cosmic-magenta/20 transition-all duration-200 text-base"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-sm font-semibold text-white">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={registerForm.password}
                      onChange={(e) => handlePasswordChange(e, false)}
                      onKeyPress={(e) => handleKeyPress(e, 'register-confirm-password')}
                      onFocus={() => handleFieldFocus('register-password')}
                      className="pl-10 pr-10 h-12 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder-gray-400 focus:border-cosmic-magenta focus:ring-2 focus:ring-cosmic-magenta/20 transition-all duration-200 text-base"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password" className="text-sm font-semibold text-white">Confirmar contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="register-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirma tu contraseña"
                      value={registerForm.confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      onKeyPress={(e) => handleKeyPress(e)}
                      onFocus={() => handleFieldFocus('register-confirm-password')}
                      className="pl-10 pr-10 h-12 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder-gray-400 focus:border-cosmic-magenta focus:ring-2 focus:ring-cosmic-magenta/20 transition-all duration-200 text-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="login" className="space-y-6">
              {/* Botón de Google Auth */}
              <Button
                type="button"
                variant="outline"
                className="w-full border-2 border-white/20 hover:border-white/40 hover:bg-white/10 h-12 rounded-xl font-medium text-white transition-all duration-200"
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
                  <Separator className="w-full bg-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-gradient-to-br from-[#0a1033] via-[#1a1440] to-[#2a0a3c] px-4 text-gray-300 font-medium">o continúa con email</span>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm font-semibold text-white">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={loginForm.email}
                      onChange={(e) => handleEmailChange(e, true)}
                      onKeyPress={(e) => handleKeyPress(e, 'login-password')}
                      onFocus={() => handleFieldFocus('login-email')}
                      className="pl-10 h-12 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder-gray-400 focus:border-cosmic-magenta focus:ring-2 focus:ring-cosmic-magenta/20 transition-all duration-200 text-base"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm font-semibold text-white">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Tu contraseña"
                      value={loginForm.password}
                      onChange={(e) => handlePasswordChange(e, true)}
                      onKeyPress={(e) => handleKeyPress(e)}
                      onFocus={() => handleFieldFocus('login-password')}
                      className="pl-10 pr-10 h-12 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder-gray-400 focus:border-cosmic-magenta focus:ring-2 focus:ring-cosmic-magenta/20 transition-all duration-200 text-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
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

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 leading-relaxed">
              Al continuar, aceptas nuestros términos de servicio y política de privacidad
            </p>
          </div>
        </div>
      </div>

      {/* Botón flotante siempre visible para registro */}
      {activeTab === 'register' && (
        <div className="sticky bottom-0 bg-gradient-to-br from-[#0a1033] via-[#1a1440] to-[#2a0a3c] border-t border-white/10 p-4">
          <Button
            type="submit"
            form="register-form"
            className="w-full bg-gradient-to-r from-cosmic-magenta to-purple-600 hover:from-cosmic-magenta/90 hover:to-purple-600/90 h-12 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Auth; 