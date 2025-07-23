
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Heart, Star, Moon, Sun, Navigation, LogOut, Crown, Sparkles, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import AuthModal from "@/components/AuthModal";
import { supabase } from "@/integrations/supabase/client";
import PremiumCheckout from "@/components/PremiumCheckout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, logout, upgradeToPremiumFree, refreshUser } = useAuth();
  const [compatibleProfiles, setCompatibleProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedProfileForChat, setSelectedProfileForChat] = useState<{id: string, name: string} | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Filtros
  const [genderFilter, setGenderFilter] = useState<'hombre' | 'mujer' | 'ambos'>('ambos');

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
    const fetchProfiles = async () => {
      setLoading(true);
      // Solo mostrar perfiles premium
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_premium', true);
      if (!error && data) {
        setCompatibleProfiles(data);
      } else {
        setCompatibleProfiles([]);
      }
      setLoading(false);
    };
    fetchProfiles();
  }, []);

  const handleChatClick = async (profile: any) => {
    if (!user?.isPremium) {
      setShowPremiumModal(true);
      return;
    }
    if (!isAuthenticated) {
      setSelectedProfileForChat({ id: profile.id, name: profile.name });
      setShowAuthModal(true);
      return;
    }

    navigate(`/chat/${profile.id}`);
  };

  const handleAuthSuccess = () => {
    if (selectedProfileForChat) {
      toast({
        title: "🎉 ¡Bienvenido a Amor Astral!",
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
    if (!isAuthenticated) {
      setShowAuthModal(true);
      toast({
        title: "🔐 Acceso Premium Requerido",
        description: "Necesitas una suscripción premium para ver tus chats",
      });
      return;
    }
    navigate('/chats');
  };

  const handleEditProfile = () => {
    navigate('/profile-edit');
  };
  const handleLogoutClick = async () => {
    await logout();
    navigate('/');
  };
  const handleActivatePremium = () => {
    toast({
      title: 'Función premium',
      description: 'Aquí iría el flujo de activación premium.',
    });
  };

  const handleGoToPremiumPayment = () => {
    setShowPremiumModal(false);
    navigate('/premium');
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
    <>
      {/* Header sticky */}
      <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-cosmic-magenta/80 to-purple-700/80 shadow flex items-center justify-between px-4 py-2">
        <a href="/home" className="font-extrabold text-2xl text-white tracking-wide hover:text-yellow-300 transition-colors" tabIndex={0} aria-label="Ir a inicio">Amor Astral</a>
        <div className="flex items-center gap-3">
          {!user?.isPremium && (
            <button
              onClick={handleActivatePremium}
              className="bg-yellow-400 hover:bg-yellow-500 text-cosmic-magenta font-bold px-4 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-yellow-300"
              tabIndex={0}
              aria-label="Activar Premium"
            >
              Activar Premium
            </button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 bg-white/80 hover:bg-white text-cosmic-magenta font-semibold px-4 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-cosmic-magenta"
                tabIndex={0}
                aria-label="Mi perfil"
              >
                <Avatar className="w-7 h-7">
                  <AvatarImage src={user?.avatar_url || ''} alt={user?.name || 'Avatar'} />
                  <AvatarFallback>{user?.name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                </Avatar>
                Mi perfil
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEditProfile} tabIndex={0} aria-label="Editar perfil">Editar perfil</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogoutClick} tabIndex={0} aria-label="Cerrar sesión">Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
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
                  <span>{translateLookingFor(profile.looking_for)}</span>
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

      {/* Modal premium para usuarios free */}
      <Dialog open={showPremiumModal} onOpenChange={setShowPremiumModal}>
        <DialogContent className="max-w-md mx-auto rounded-2xl p-6 bg-white/95">
          <DialogHeader>
            <DialogTitle className="text-cosmic-magenta text-2xl font-bold mb-2">Hazte Premium y desbloquea conversaciones cósmicas</DialogTitle>
            <DialogDescription className="text-gray-700 mb-4">Accede a todas las funciones exclusivas de Amor Astral:</DialogDescription>
          </DialogHeader>
          <ul className="mb-4 space-y-2">
            <li className="flex items-center gap-2"><span className="text-cosmic-magenta font-bold">🔓</span> Desbloquear conversaciones cósmicas</li>
            <li className="flex items-center gap-2"><span className="text-cosmic-magenta font-bold">💬</span> Acceso ilimitado a chats</li>
            <li className="flex items-center gap-2"><span className="text-cosmic-magenta font-bold">🌟</span> Funciones exclusivas y soporte prioritario</li>
            <li className="flex items-center gap-2"><span className="text-cosmic-magenta font-bold">🚫</span> Sin anuncios</li>
          </ul>
          <DialogFooter>
            <button
              onClick={handleGoToPremiumPayment}
              className="w-full bg-gradient-to-r from-cosmic-magenta to-purple-600 hover:from-cosmic-magenta/90 hover:to-purple-600/90 text-white font-bold py-3 rounded-xl shadow-lg text-lg"
              tabIndex={0}
              aria-label="Activar Premium"
            >
              Activar Premium
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Home;
