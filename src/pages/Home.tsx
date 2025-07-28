
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Heart, Star, Moon, Sun, Navigation, LogOut, Crown, Sparkles, MapPin, Calendar, X, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import AuthModal from "@/components/AuthModal";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

// Eliminar PremiumModal y toda lógica de showPremiumModal

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, logout, refreshUser } = useAuth();
  const [compatibleProfiles, setCompatibleProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  // Eliminar PremiumModal y toda lógica de showPremiumModal
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedProfileForChat, setSelectedProfileForChat] = useState<{id: string, name: string} | null>(null);


  // Filtros
  const [genderFilter, setGenderFilter] = useState<'hombre' | 'mujer' | 'ambos'>('ambos');
  const [filteredProfiles, setFilteredProfiles] = useState<any[]>([]);

  // Actualizar filtro de género si cambia el perfil del usuario
  useEffect(() => {
    if (userProfile?.gender_preference) {
      setGenderFilter(userProfile.gender_preference);
    }
  }, [userProfile]);

  // Filtrar perfiles según el filtro de género
  useEffect(() => {
    if (genderFilter === 'ambos') {
      setFilteredProfiles(compatibleProfiles);
    } else {
      // Ahora los valores del filtro coinciden con los de la base de datos
      setFilteredProfiles(compatibleProfiles.filter((profile: any) => profile.gender === genderFilter));
    }
  }, [genderFilter, compatibleProfiles]);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const storedProfile = localStorage.getItem("userProfile");
        if (storedProfile) {
          const profile = JSON.parse(storedProfile);
          setUserProfile(profile);
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
      
      let query = supabase
        .from('profiles')
        .select('*')
        .is('is_premium', true);
      
      // Si el usuario está autenticado, usar OR para incluir perfiles artificiales Y perfiles reales de otros usuarios
      if (isAuthenticated && user?.id) {
        query = query.or(`user_id.is.null,user_id.neq.${user.id}`);
      }
      
      const { data, error } = await query;
      
      if (!error && data) {
        setCompatibleProfiles(data);
      } else {
        setCompatibleProfiles([]);
      }
      setLoading(false);
    };
    
    fetchProfiles();
  }, [isAuthenticated, user?.id]);

  

  const handleChatClick = async (profile: any) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    if (!user?.isPremium) {
      navigate('/premium');
      return;
    }
    navigate(`/chat/${profile.id}`);
  };

  const handleActivatePremium = () => {
    navigate('/premium');
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
  // Eliminar PremiumModal y toda lógica de showPremiumModal

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

  // Fondo galáctico global
  const GalacticBackground = () => (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 w-full h-full bg-gradient-to-br from-[#0a1033] via-[#1a1440] to-[#2a0a3c]">
      {/* Estrellas */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        <defs>
          <radialGradient id="star-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Estrellas grandes */}
        {[...Array(18)].map((_, i) => (
          <circle
            key={i}
            cx={Math.random() * 100 + '%'}
            cy={Math.random() * 100 + '%'}
            r={Math.random() * 1.2 + 0.6}
            fill="url(#star-glow)"
            opacity={0.7}
          />
        ))}
        {/* Estrellas pequeñas */}
        {[...Array(80)].map((_, i) => (
          <circle
            key={100 + i}
            cx={Math.random() * 100 + '%'}
            cy={Math.random() * 100 + '%'}
            r={Math.random() * 0.4 + 0.2}
            fill="#fff"
            opacity={0.3 + Math.random() * 0.5}
          />
        ))}
        {/* Constelaciones sutiles (líneas) */}
        <polyline points="10,20 30,40 50,20 70,60" stroke="#6ee7ff" strokeWidth="0.3" opacity="0.18" fill="none" />
        <polyline points="80,80 90,60 100,90" stroke="#a78bfa" strokeWidth="0.3" opacity="0.13" fill="none" />
      </svg>
    </div>
  );

  return (
    <>
      <GalacticBackground />
      {/* Header sticky */}
      <header className="sticky top-0 z-40 w-full bg-transparent shadow flex items-center justify-between px-3 sm:px-4 py-2 backdrop-blur-md border-b border-white/10">
        <a href="/home" className="font-extrabold text-xl sm:text-2xl text-white tracking-wide hover:text-yellow-300 transition-colors drop-shadow-[0_2px_8px_rgba(255,255,255,0.12)]" tabIndex={0} aria-label="Ir a inicio">Amor Astral</a>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Botón Mis chats arriba a la izquierda */}
          {isAuthenticated && user?.isPremium && (
            <Button
              onClick={handleViewChats}
              className="bg-cosmic-magenta hover:bg-fuchsia-600 text-white font-semibold px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-cosmic-magenta border border-white/20 text-xs sm:text-sm"
              tabIndex={0}
              aria-label="Ver mis chats"
            >
              Mis chats
            </Button>
          )}
          {/* Botón Activar Premium en header */}
          {isAuthenticated && !user?.isPremium && (
            <Button
              onClick={handleActivatePremium}
              className="bg-gradient-to-r from-yellow-400 to-cosmic-gold text-cosmic-dark-blue font-bold px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl shadow border border-yellow-200/40 hover:from-yellow-300 hover:to-yellow-400 transition-all text-xs sm:text-sm"
              tabIndex={0}
              aria-label="Activar Premium"
            >
              <Crown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Activar Premium</span>
              <span className="sm:hidden">Premium</span>
            </Button>
          )}
          {/* Botón/perfil de usuario */}
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-cosmic-magenta to-fuchsia-500 hover:from-fuchsia-600 hover:to-cosmic-magenta text-white font-bold px-3 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-cosmic-magenta border-0 transition-all duration-200 drop-shadow-[0_2px_8px_rgba(168,139,250,0.18)] text-xs sm:text-sm"
                  tabIndex={0}
                  aria-label="Mi perfil"
                  style={{ boxShadow: '0 0 12px 2px #a78bfa55' }}
                >
                  <Avatar className="w-5 h-5 sm:w-7 sm:h-7">
                    <AvatarImage src={user?.avatar_url || ''} alt={user?.name || 'Avatar'} />
                    <AvatarFallback className="text-xs sm:text-sm">{user?.name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">Mi perfil</span>
                  <span className="sm:hidden">Perfil</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEditProfile} tabIndex={0} aria-label="Editar perfil">Editar perfil</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogoutClick} tabIndex={0} aria-label="Cerrar sesión">Cerrar sesión</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {!isAuthenticated && (
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-gradient-to-r from-cosmic-magenta to-cyan-400 hover:from-cosmic-magenta/90 hover:to-cyan-400/90 text-white font-extrabold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-cosmic-magenta border-2 border-cyan-200 text-xs sm:text-sm"
              tabIndex={0}
              aria-label="Iniciar Sesión"
            >
              <span className="hidden sm:inline">Iniciar Sesión</span>
              <span className="sm:hidden">Login</span>
            </button>
          )}
        </div>
      </header>
      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
                 {/* Mi perfil */}
         {isAuthenticated && user && userProfile && (
           <div className="flex justify-center mb-6 sm:mb-8">
             <div className="rounded-2xl sm:rounded-3xl bg-[#a78bfa]/30 p-4 sm:p-6 shadow-lg flex flex-col items-center">
               <Avatar className="w-12 h-12 sm:w-16 sm:h-16 mb-2">
                 <AvatarImage src={userProfile?.avatar_url || ''} alt={userProfile?.full_name || 'Avatar'} />
                 <AvatarFallback className="text-sm sm:text-base">{userProfile?.full_name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
               </Avatar>
               <p className="text-white font-bold text-base sm:text-lg">{userProfile?.full_name}</p>
               <p className="text-gray-300 text-xs sm:text-sm">{userProfile?.birth_place}</p>
               <Button
                 onClick={handleEditProfile}
                 className="mt-3 sm:mt-4 bg-cosmic-magenta hover:bg-cosmic-magenta/80 text-white text-xs sm:text-sm px-3 py-1.5"
               >
                 Editar perfil
               </Button>
               {/* Botón Activar Premium en sección de perfil */}
               {!user?.isPremium && (
                 <Button
                   onClick={handleActivatePremium}
                   className="mt-2 bg-gradient-to-r from-yellow-400 to-cosmic-gold text-cosmic-dark-blue font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl shadow border border-yellow-200/40 hover:from-yellow-300 hover:to-yellow-400 transition-all text-xs sm:text-sm"
                   tabIndex={0}
                   aria-label="Activar Premium"
                 >
                   <Crown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                   <span className="hidden sm:inline">Activar Premium</span>
                   <span className="sm:hidden">Premium</span>
                 </Button>
               )}
             </div>
           </div>
         )}
        {/* Filtro mejorado */}
        <div className="mb-4 flex items-center justify-center w-full">
          <div className="flex flex-row items-center gap-2 sm:gap-3 bg-gradient-to-r from-[#2a0a3c]/80 to-[#1a1440]/80 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl shadow-lg">
            <label className="text-white font-semibold mr-1 sm:mr-2 text-sm">Ver:</label>
            <select
              value={genderFilter}
              onChange={e => setGenderFilter(e.target.value as any)}
              className="rounded-lg px-2 sm:px-3 py-1 bg-[#1a1440] text-white border border-cosmic-magenta focus:outline-none focus:ring-2 focus:ring-cosmic-magenta text-xs sm:text-sm"
              aria-label="Filtrar por género"
            >
              <option value="ambos">Ambos</option>
              <option value="hombre">Hombres</option>
              <option value="mujer">Mujeres</option>
            </select>
          </div>
        </div>
        {/* Título principal */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
            Tu Conexión Cósmica Perfecta
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-gray-300 px-2">
            Perfiles seleccionados especialmente para ti basados en tu carta natal
          </p>
        </div>

        {/* Grid de perfiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProfiles.map((profile, idx) => (
            <div
              key={profile.id}
              className="relative flex flex-col justify-between h-full rounded-xl sm:rounded-2xl bg-[rgba(20,20,40,0.85)] shadow-[0_0_16px_4px_rgba(0,255,255,0.13)] border border-cyan-400/20 backdrop-blur-md overflow-hidden group hover:shadow-[0_0_32px_8px_rgba(80,200,255,0.25)] transition-shadow duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cosmic-magenta"
              style={{ boxShadow: '0 0 24px 4px #38bdf855, 0 0 64px 8px #a78bfa22' }}
              onClick={() => navigate(`/profile/${profile.id}`)}
              tabIndex={0}
              aria-label={`Ver perfil de ${profile.name}`}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/profile/${profile.id}`); }}
            >
              <div className="px-3 sm:px-4">
                <CardHeader className="p-3 sm:p-4 lg:p-6 pb-2 sm:pb-3">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${profile.compatibility_score >= 85 ? 'bg-green-400' : profile.compatibility_score >= 70 ? 'bg-yellow-400' : 'bg-orange-400'}`}></div>
                      <Badge 
                        variant="secondary" 
                        className="bg-cosmic-gold/20 text-cosmic-gold text-xs"
                      >
                        {profile.compatibility_score ? `${profile.compatibility_score}% compatible` : '% compatible'}
                      </Badge>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); handleLikeClick(profile.name); }}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                      tabIndex={0}
                      aria-label={`Dar like a ${profile.name}`}
                    >
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                  <Avatar className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 border-2 border-cosmic-gold/30">
                    <AvatarImage src={profile.photo_url} alt={profile.name} />
                    <AvatarFallback className="bg-cosmic-magenta text-white font-bold text-sm sm:text-base">
                      {profile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-white text-sm sm:text-base lg:text-lg">
                      {profile.name}
                    </CardTitle>
                    <p className="text-xs sm:text-sm text-gray-300">
                      {profile.age ? `${profile.age} años` : 'años'} • {profile.location || ''}
                    </p>
                  </div>
                </CardHeader>
                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-300">
                    <Sun className="w-3 h-3 sm:w-4 sm:h-4 text-cosmic-gold" />
                    <span>{profile.sign}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-300">
                    <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-cosmic-magenta" />
                    <span>{translateLookingFor(profile.looking_for)}</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4 text-justify line-clamp-2">
                  {profile.description}
                </p>
              </div>
              <div className="mt-auto">
                <Button
                  onClick={e => { e.stopPropagation(); handleChatClick(profile); }}
                  className="w-full bg-gradient-to-r from-cosmic-magenta to-pink-400 hover:from-fuchsia-600 hover:to-pink-500 text-white text-xs sm:text-sm py-2 rounded-b-xl sm:rounded-b-2xl"
                  tabIndex={0}
                  aria-label={`Iniciar chat con ${profile.name}`}
                >
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Iniciar Chat
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de autenticación */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Eliminar PremiumModal y toda lógica de showPremiumModal */}
    </>
  );
};

export default Home;
