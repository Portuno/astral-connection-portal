
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Heart, Star, Moon, Sun, Navigation, LogOut, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import AuthModal from "@/components/AuthModal";
import { mockProfiles, type Profile } from "@/data/mockProfiles";
import { supabase } from "@/integrations/supabase/client";



const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, logout, upgradeToPremiumFree, refreshUser } = useAuth();
  const [compatibleProfiles, setCompatibleProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalPaymentOnly, setAuthModalPaymentOnly] = useState(false);
  const [selectedProfileForChat, setSelectedProfileForChat] = useState<{id: string, name: string} | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Obtener información del usuario desde localStorage
        const onboardingData = localStorage.getItem("onboardingData");
        if (onboardingData) {
          setUserProfile(JSON.parse(onboardingData));
        }

        // Simular un pequeño delay para mostrar el loading
        await new Promise(resolve => setTimeout(resolve, 500));

        // Usar mock data en lugar de cargar desde la base de datos
        setCompatibleProfiles(mockProfiles);

      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChatClick = (profileId: string, profileName: string) => {
    // Verificar si el usuario está autenticado y tiene premium
    if (!isAuthenticated) {
      // Usuario NO logueado - mostrar modal completo
      setSelectedProfileForChat({ id: profileId, name: profileName });
      setAuthModalPaymentOnly(false);
      setShowAuthModal(true);
      
      toast({
        title: "🔐 Acceso Requerido",
        description: "Inicia sesión para chatear con tu conexión cósmica",
      });
      return;
    }

    if (!user?.isPremium) {
      // Usuario logueado pero NO premium - mostrar solo pago
      setSelectedProfileForChat({ id: profileId, name: profileName });
      setAuthModalPaymentOnly(true);
      setShowAuthModal(true);
      
      toast({
        title: "🔐 Acceso Premium Requerido",
        description: `Suscríbete para chatear con ${profileName}`,
      });
      return;
    }

    // Si está autenticado y tiene premium, navegar al chat
    navigate(`/chat/${profileId}`);
    
    toast({
      title: "💫 Chat iniciado",
      description: `Conectando con ${profileName}...`,
    });
  };

  const handleAuthSuccess = () => {
    // Después del login/pago exitoso, navegar al chat si había uno seleccionado
    if (selectedProfileForChat) {
      toast({
        title: "🎉 ¡Bienvenido a AstroTarot Premium!",
        description: `Ahora puedes chatear con ${selectedProfileForChat.name}`,
      });
      
      // Navegar al chat después de un breve delay
      setTimeout(() => {
        navigate(`/chat/${selectedProfileForChat.id}`);
      }, 1000);
      
      setSelectedProfileForChat(null);
    }
  };

  const handleLikeClick = (profileName: string) => {
    toast({
      title: "💖 ¡Like enviado!",
      description: `Le has dado like a ${profileName}`,
    });
  };

  const handleViewChats = () => {
    if (!isAuthenticated || !user?.isPremium) {
      setShowAuthModal(true);
      toast({
        title: "🔐 Acceso Premium Requerido",
        description: "Necesitas una suscripción premium para ver tus chats",
      });
      return;
    }
    navigate('/chats');
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    });
  };

  const translateLookingFor = (lookingFor: string) => {
    const translations: { [key: string]: string } = {
      "relacion-seria": "Relación seria",
      "conexion-especial": "Conexión especial",
      "amistad-profunda": "Amistad profunda",
      "explorar": "Explorar"
    };
    return translations[lookingFor] || lookingFor;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmic-blue flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cosmic-gold mx-auto mb-4"></div>
          <p className="text-white">Calculando compatibilidades cósmicas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic-blue">
      {/* Header mejorado */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                ✨ AstroTarot
              </h1>
              {userProfile && (
                <p className="text-gray-300">
                  Hola {userProfile.full_name}, encuentra tu conexión cósmica perfecta
                </p>
              )}
            </div>
            
            <div className="flex gap-3 items-center">
              {/* Estado de usuario */}
              {isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-white text-sm font-medium flex items-center gap-1">
                      {user.isPremium && <Crown className="h-4 w-4 text-cosmic-gold" />}
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {user.isPremium ? "Premium" : "Usuario gratuito"}
                    </p>
                  </div>
                  
                  <Button
                    onClick={handleViewChats}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Mis Chats
                  </Button>
                  
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    title="Cerrar sesión"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowAuthModal(true)}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Iniciar Sesión
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/onboarding')}
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    Crear Perfil
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Información del usuario */}
        {userProfile && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
            <CardHeader>
              <CardTitle className="text-cosmic-gold flex items-center gap-2">
                🌟 Tu Perfil Cósmico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-white">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-cosmic-gold" />
                  <span>Nacimiento: {userProfile.birth_date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-cosmic-magenta" />
                  <span>Lugar: {userProfile.birth_place}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span>Buscando: {translateLookingFor(userProfile.looking_for || '')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mensaje premium para usuarios no autenticados */}
        {(!isAuthenticated || !user?.isPremium) && (
          <Card className="bg-gradient-to-r from-cosmic-magenta/20 to-purple-200/20 border-cosmic-magenta/30 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Crown className="h-8 w-8 text-cosmic-gold" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    ¡Desbloquea el poder del cosmos! ✨
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Suscríbete al plan premium por solo €29,90/mes y chatea con todas tus conexiones cósmicas
                  </p>
                </div>
                <Button
                  onClick={() => {
                    if (isAuthenticated) {
                      // Usuario logueado - mostrar solo pago
                      setAuthModalPaymentOnly(true);
                      setShowAuthModal(true);
                    } else {
                      // Usuario NO logueado - mostrar modal completo
                      setAuthModalPaymentOnly(false);
                      setShowAuthModal(true);
                    }
                  }}
                  className="bg-cosmic-gold hover:bg-cosmic-gold/80 text-cosmic-blue font-semibold"
                >
                  Obtener Premium
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Título de perfiles compatibles */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            🔮 Tus Conexiones Cósmicas
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Hemos analizado la compatibilidad astrológica y encontrado estas almas gemelas que resuenan con tu energía
          </p>
        </div>

        {/* Grid de perfiles compatibles */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {compatibleProfiles.map((profile) => (
            <Card 
              key={profile.id} 
              className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage 
                      src={profile.photo_url || undefined} 
                      alt={profile.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-cosmic-magenta text-white text-lg">
                      {profile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-white text-xl mb-1">
                      {profile.name}, {profile.age}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-cosmic-gold/20 text-cosmic-gold border-cosmic-gold/30">
                        <Star className="w-3 h-3 mr-1" />
                        {profile.compatibility_score}% compatible
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400">📍 {profile.location}</p>
                      <p className="text-xs text-gray-400">💫 Busca: {translateLookingFor(profile.lookingFor)}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {/* Signos astrológicos */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1 text-sm text-gray-300">
                    <Sun className="w-4 h-4 text-cosmic-gold" />
                    <span>{profile.sign}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-300">
                    <Moon className="w-4 h-4 text-blue-300" />
                    <span>{profile.moon_sign}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-300">
                    <Navigation className="w-4 h-4 text-purple-300" />
                    <span>{profile.rising_sign}</span>
                  </div>
                </div>

                {/* Descripción */}
                <p className="text-gray-300 text-sm mb-6 line-clamp-3">
                  {profile.description}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-cosmic-magenta hover:bg-cosmic-magenta/80 text-white relative"
                    onClick={() => handleChatClick(profile.id, profile.name)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chatear
                    {(!isAuthenticated || !user?.isPremium) && (
                      <Crown className="w-3 h-3 ml-1 text-cosmic-gold" />
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={() => handleLikeClick(profile.name)}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Botones de Testing Premium */}
        {isAuthenticated && (
          <div className="text-center mt-8 space-y-4">
            {!user?.isPremium ? (
              <Button
                onClick={async () => {
                  const success = await upgradeToPremiumFree();
                  if (success) {
                    toast({
                      title: "🎉 ¡Premium Gratis Activado!",
                      description: "Ahora tienes acceso completo a todos los chats",
                    });
                  } else {
                    toast({
                      title: "Error",
                      description: "No se pudo activar el premium gratis",
                      variant: "destructive"
                    });
                  }
                }}
                variant="outline"
                className="border-cosmic-gold text-cosmic-gold hover:bg-cosmic-gold hover:text-cosmic-blue mr-4"
              >
                🎁 Premium Gratis
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-cosmic-gold font-medium">
                  ✨ Ya tienes Premium activado
                </p>
                <Button
                  onClick={async () => {
                    try {
                      // Quitar premium para testing
                      const { error } = await supabase
                        .from('users')
                        .update({ is_premium: false })
                        .eq('id', user.id);

                      if (!error) {
                        // Refrescar usuario usando el método del AuthProvider
                        await refreshUser();
                        
                        toast({
                          title: "🔄 Premium Removido",
                          description: "Premium removido para testing",
                        });
                      } else {
                        toast({
                          title: "Error",
                          description: "No se pudo remover el premium",
                          variant: "destructive"
                        });
                      }
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "No se pudo remover el premium",
                        variant: "destructive"
                      });
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                >
                  🧪 Quitar Premium (Testing)
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de autenticación */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setSelectedProfileForChat(null);
          setAuthModalPaymentOnly(false);
        }}
        onSuccess={handleAuthSuccess}
        paymentOnly={authModalPaymentOnly}
      />
    </div>
  );
};

export default Home;
