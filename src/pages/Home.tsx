
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Heart, Star, Moon, Sun, Navigation, LogOut, Crown, Sparkles, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import AuthModal from "@/components/AuthModal";
import type { Profile } from "@/data/mockProfiles";
import { supabase } from "@/integrations/supabase/client";

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, logout, upgradeToPremiumFree, refreshUser } = useAuth();
  const [compatibleProfiles, setCompatibleProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedProfileForChat, setSelectedProfileForChat] = useState<{id: string, name: string} | null>(null);

  // Filtros
  const [genderFilter, setGenderFilter] = useState<'hombre' | 'mujer' | 'ambos'>(
    userProfile?.gender_preference || 'ambos'
  );
  const [minCompatibility, setMinCompatibility] = useState(60);
  // Estructura para lejanía (no implementada la lógica real)
  const [distance, setDistance] = useState(50); // km

  // Actualizar filtro de género si cambia el perfil del usuario
  useEffect(() => {
    if (userProfile?.gender_preference) {
      setGenderFilter(userProfile.gender_preference);
    }
  }, [userProfile]);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // Intentar cargar desde localStorage primero
        const storedProfile = localStorage.getItem("userProfile");
        if (storedProfile) {
          const profile = JSON.parse(storedProfile);
          setUserProfile(profile);
          console.log("✅ Perfil cargado desde localStorage:", profile);
        }
        
        // Si hay usuario autenticado, intentar cargar desde BD
        if (isAuthenticated && user) {
          try {
            const { data: profiles, error } = await supabase
              .from('temporary_profiles')
              .select('*')
              .eq('session_id', user.id)
              .limit(1);
            
            if (profiles && profiles.length > 0) {
              setUserProfile(profiles[0]);
              console.log("✅ Perfil cargado desde BD:", profiles[0]);
            }
          } catch (error) {
            console.log("⚠️ Error cargando perfil desde BD:", error);
          }
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
      }
    };

    loadUserProfile();
  }, [isAuthenticated, user]);

  useEffect(() => {
    const loadCompatibleProfiles = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('profiles')
          .select('id, name, age, sign, description, photo_url, compatibility_score, location, lookingFor, gender')
          .eq('is_premium', true)
          .gte('compatibility_score', minCompatibility);
        // Aplica el filtro de género solo si corresponde
        let realProfiles, error;
        if (genderFilter !== 'ambos') {
          // @ts-expect-error: Suppress deep type instantiation error
          ({ data: realProfiles, error } = await query.eq('gender', genderFilter));
        } else {
          ({ data: realProfiles, error } = await query);
        }
        let profilesWithCompatibility = [];
        if (error) {
          console.error('Error loading real profiles:', error);
        }
        if (realProfiles && realProfiles.length > 0) {
          profilesWithCompatibility = realProfiles;
        } else {
          profilesWithCompatibility = [];
        }
        setCompatibleProfiles(profilesWithCompatibility);
      } catch (error) {
        console.error("Error loading profiles:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los perfiles compatibles",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    loadCompatibleProfiles();
  }, [toast, genderFilter, minCompatibility, userProfile]);

  const handleChatClick = async (profile: Profile) => {
    if (!isAuthenticated) {
      setSelectedProfileForChat({ id: profile.id, name: profile.name });
      setShowAuthModal(true);
      return;
    }

    if (!user?.isPremium) {
      toast({
        title: "�� Desbloquea el chat premium",
        description: "Debes activar tu suscripción premium para chatear.",
        action: (
          <Button
            onClick={() => navigate('/premium')}
            className="bg-cosmic-magenta hover:bg-cosmic-magenta/80"
          >
            Ir a Pago Premium
          </Button>
        )
      });
      return;
    }

    navigate(`/chat/${profile.id}`);
  };

  const handleAuthSuccess = () => {
    if (selectedProfileForChat) {
      toast({
        title: "🎉 ¡Bienvenido a AstroTarot!",
        description: `Ahora puedes chatear con ${selectedProfileForChat.name}`,
      });
      
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
      {/* Header mejorado para móvil */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-cosmic-magenta to-cosmic-gold rounded-full">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white">
                  AstroTarot
                </h1>
                {userProfile && (
                  <p className="text-xs sm:text-sm text-gray-300 hidden sm:block">
                    Hola {userProfile.full_name}, encuentra tu conexión cósmica
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 sm:gap-3 items-center">
              {isAuthenticated && user ? (
                <>
                  <div className="hidden sm:block text-right">
                    <p className="text-white text-sm font-medium flex items-center gap-1">
                      {user.isPremium && <Crown className="h-4 w-4 text-cosmic-gold" />}
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {user.isPremium ? "Premium" : "Usuario gratuito"}
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate('/profile-edit')}
                    size="sm"
                    variant="secondary"
                    className="bg-cosmic-magenta text-white font-semibold hover:bg-cosmic-magenta/80"
                    aria-label="Editar perfil"
                    tabIndex={0}
                  >
                    Editar Perfil
                  </Button>
                  {!user.isPremium && (
                    <Button
                      onClick={() => navigate('/premium')}
                      size="sm"
                      className="bg-gradient-to-r from-cosmic-gold to-yellow-500 text-black font-semibold hover:from-yellow-400 hover:to-cosmic-gold"
                    >
                      <Crown className="w-4 h-4 mr-1" />
                      Activar Premium
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleViewChats}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <MessageCircle className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Mis Chats</span>
                  </Button>
                  
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    title="Cerrar sesión"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowAuthModal(true)}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <span className="hidden sm:inline">Iniciar Sesión</span>
                    <span className="sm:hidden">Login</span>
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/onboarding')}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <span className="hidden sm:inline">Crear Perfil</span>
                    <span className="sm:hidden">Registro</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Filtros */}
        <div className="mb-8 flex flex-wrap gap-6 items-center justify-center bg-white/10 p-4 rounded-lg">
          <div className="flex flex-col items-start">
            <label className="text-white font-semibold mb-1">Ver:</label>
            <select
              value={genderFilter}
              onChange={e => setGenderFilter(e.target.value as any)}
              className="rounded px-2 py-1"
            >
              <option value="ambos">Ambos</option>
              <option value="hombre">Hombres</option>
              <option value="mujer">Mujeres</option>
            </select>
          </div>
          <div className="flex flex-col items-start">
            <label className="text-white font-semibold mb-1">% Compatibilidad mínima:</label>
            <input
              type="range"
              min={0}
              max={100}
              value={minCompatibility}
              onChange={e => setMinCompatibility(Number(e.target.value))}
              className="w-40"
            />
            <span className="text-white mt-1">{minCompatibility}%</span>
          </div>
          <div className="flex flex-col items-start">
            <label className="text-white font-semibold mb-1">Distancia máxima (próximamente):</label>
            <input
              type="range"
              min={1}
              max={500}
              value={distance}
              onChange={e => setDistance(Number(e.target.value))}
              className="w-40"
              disabled
            />
            <span className="text-white mt-1">{distance} km</span>
          </div>
        </div>
        {/* Información del usuario móvil */}
        {userProfile && (
          <div className="sm:hidden mb-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-cosmic-magenta to-cosmic-gold rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {userProfile.full_name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{userProfile.full_name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <MapPin className="w-3 h-3" />
                      <span>{userProfile.birth_place}</span>
                    </div>
                  </div>
                  {user?.isPremium ? (
                    <Crown className="w-5 h-5 text-cosmic-gold" />
                  ) : (
                    <Button
                      onClick={() => navigate('/premium')}
                      size="sm"
                      className="bg-gradient-to-r from-cosmic-gold to-yellow-500 text-black font-semibold hover:from-yellow-400 hover:to-cosmic-gold text-xs px-2 py-1"
                    >
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Título principal */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Tu Conexión Cósmica Perfecta
          </h2>
          <p className="text-sm sm:text-base text-gray-300">
            Perfiles seleccionados especialmente para ti basados en tu carta natal
          </p>
        </div>

        {/* Grid de perfiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {compatibleProfiles.map((profile) => (
            <Card
              key={profile.id}
              className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 overflow-hidden group cursor-pointer"
              onClick={() => navigate(`/profile/${profile.id}`)}
            >
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${profile.compatibility_score >= 85 ? 'bg-green-400' : profile.compatibility_score >= 70 ? 'bg-yellow-400' : 'bg-orange-400'}`}></div>
                    <Badge 
                      variant="secondary" 
                      className="bg-cosmic-gold/20 text-cosmic-gold text-xs"
                    >
                      {profile.compatibility_score}% compatible
                    </Badge>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); handleLikeClick(profile.name); }}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
                
                <Avatar className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-cosmic-gold/30">
                  <AvatarImage src={profile.photo_url} alt={profile.name} />
                  <AvatarFallback className="bg-cosmic-magenta text-white font-bold">
                    {profile.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-white text-base sm:text-lg">
                    {profile.name}
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-gray-300">
                    {profile.age} años • {profile.location}
                  </p>
                </div>
              </CardHeader>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                  <Sun className="w-4 h-4 text-cosmic-gold" />
                  <span>{profile.sign}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                  <Heart className="w-4 h-4 text-cosmic-magenta" />
                  <span>{translateLookingFor(profile.lookingFor)}</span>
                </div>
              </div>
              
              <p className="text-xs sm:text-sm text-gray-300 mb-4 line-clamp-2">
                {profile.description}
              </p>
              
              <Button
                onClick={e => { e.stopPropagation(); handleChatClick(profile); }}
                className="w-full bg-cosmic-magenta hover:bg-cosmic-magenta/80 text-white text-sm py-2"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Iniciar Chat
              </Button>
            </Card>
          ))}
        </div>

        {/* CTA para más perfiles */}
        <div className="text-center mt-8 sm:mt-12">
          <p className="text-gray-300 mb-4 text-sm sm:text-base">
            ¿Quieres ver más perfiles compatibles?
          </p>
          <Button
            onClick={() => navigate('/onboarding')}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Refinar mi búsqueda
          </Button>
        </div>
      </div>

      {/* Modal de autenticación */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Home;
