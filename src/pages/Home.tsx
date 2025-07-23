
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Heart, Star, Moon, Sun, Navigation, LogOut, Crown, Sparkles, MapPin, Calendar, X } from "lucide-react";
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
  // Estado para los chats del usuario
  const [userChats, setUserChats] = useState<any[]>([]);

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
      setFilteredProfiles(compatibleProfiles.filter((profile: any) => profile.gender === genderFilter));
    }
  }, [genderFilter, compatibleProfiles]);

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
      // Solo mostrar perfiles premium y excluir al usuario actual
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('is_premium', true);
      
      // Si el usuario está autenticado, excluir su propio perfil
      if (isAuthenticated && user?.id) {
        // Primero intentar excluir por user_id
        query = query.neq('user_id', user.id);
        
        // También excluir si el perfil actual del usuario coincide con algún perfil
        if (userProfile?.id) {
          console.log("🚫 Excluyendo perfil del usuario actual:", userProfile.id);
          query = query.neq('id', userProfile.id);
        }
      }
      
      const { data, error } = await query;
      console.log("📋 Perfiles encontrados después del filtrado:", data?.length || 0);
      if (!error && data) {
        // Filtro adicional para excluir el perfil actual del usuario
        let filteredData = data;
        if (userProfile?.id) {
          filteredData = data.filter((profile: any) => profile.id !== userProfile.id);
          console.log("🚫 Perfiles después del filtro adicional:", filteredData.length);
        }
        setCompatibleProfiles(filteredData);
      } else {
        setCompatibleProfiles([]);
      }
      setLoading(false);
    };
    fetchProfiles();
  }, [isAuthenticated, user?.id, userProfile?.id]);

  // Cargar chats del usuario
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;
    const loadChats = async () => {
      try {
        console.log("🔄 Cargando chats para usuario:", user.id);
        const { data: chatsData, error: chatsError } = await supabase
          .from('chats')
          .select('*')
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
          .order('last_message_at', { ascending: false, nullsFirst: false });
        
        if (chatsError) {
          console.error("❌ Error cargando chats:", chatsError);
          return;
        }
        
        console.log("📋 Chats encontrados:", chatsData?.length || 0, chatsData);
        
        if (!chatsData || chatsData.length === 0) {
          setUserChats([]);
          return;
        }
        
        // Obtener perfil y último mensaje de cada chat
        const chatsWithProfiles = await Promise.all(
          chatsData.map(async (chat: any) => {
            try {
              const otherUserId = chat.user1_id === user.id ? chat.user2_id : chat.user1_id;
              console.log("👤 Buscando perfil para:", otherUserId);
              
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', otherUserId)
                .single();
              
              if (profileError) {
                console.error("❌ Error cargando perfil:", profileError, "para usuario:", otherUserId);
                return null;
              }
              
              const { data: lastMessage, error: messageError } = await supabase
                .from('messages')
                .select('content, created_at, sender_id')
                .eq('chat_id', chat.id)
                .order('created_at', { ascending: false })
                .limit(1);
              
              if (messageError) {
                console.error("❌ Error cargando último mensaje:", messageError);
              }
              
              return {
                ...chat,
                profile,
                lastMessage: lastMessage?.[0] || null,
              };
            } catch (error) {
              console.error("❌ Error procesando chat:", error);
              return null;
            }
          })
        );
        
        const validChats = chatsWithProfiles.filter(Boolean);
        console.log("✅ Chats procesados:", validChats.length, validChats);
        setUserChats(validChats);
      } catch (error) {
        console.error("❌ Error general cargando chats:", error);
        setUserChats([]);
      }
    };
    loadChats();
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
      <header className="sticky top-0 z-40 w-full bg-transparent shadow flex items-center justify-between px-4 py-2 backdrop-blur-md border-b border-white/10">
        <a href="/home" className="font-extrabold text-2xl text-white tracking-wide hover:text-yellow-300 transition-colors drop-shadow-[0_2px_8px_rgba(255,255,255,0.12)]" tabIndex={0} aria-label="Ir a inicio">Amor Astral</a>
        <div className="flex items-center gap-3">
          {/* Botón Mis chats arriba a la izquierda */}
          {isAuthenticated && (
            <Button
              onClick={handleViewChats}
              className="bg-cosmic-magenta hover:bg-fuchsia-600 text-white font-semibold px-4 py-2 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-cosmic-magenta border border-white/20 mr-2"
              tabIndex={0}
              aria-label="Ver mis chats"
            >
              Mis chats
            </Button>
          )}
          {/* Botón/perfil de usuario */}
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 bg-gradient-to-r from-cosmic-magenta to-fuchsia-500 hover:from-fuchsia-600 hover:to-cosmic-magenta text-white font-bold px-5 py-2 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-cosmic-magenta border-0 transition-all duration-200 drop-shadow-[0_2px_8px_rgba(168,139,250,0.18)]"
                  tabIndex={0}
                  aria-label="Mi perfil"
                  style={{ boxShadow: '0 0 12px 2px #a78bfa55' }}
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
          )}
          {!isAuthenticated && (
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-gradient-to-r from-cosmic-magenta to-cyan-400 hover:from-cosmic-magenta/90 hover:to-cyan-400/90 text-white font-extrabold px-4 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-cosmic-magenta border-2 border-cyan-200"
              tabIndex={0}
              aria-label="Iniciar Sesión"
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      </header>
      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Fila horizontal: Mis chats + Mi perfil */}
        {isAuthenticated && user && (
          <div className="flex flex-row gap-4 w-full mb-8">
            {/* Mis chats */}
            <div className="rounded-2xl bg-gradient-to-br from-[#2a0a3c]/80 to-[#1a1440]/80 p-4 w-[320px] min-w-[200px] max-h-[400px] overflow-y-auto shadow-lg">
              <h3 className="text-lg font-bold text-white mb-3">Mis chats</h3>
              {userChats.length === 0 ? (
                <p className="text-gray-400 text-sm">No tienes chats activos.</p>
              ) : (
                userChats.map(chat => (
                  <div
                    key={chat.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition"
                    onClick={() => navigate(`/chat/${chat.profile.id}`)}
                    tabIndex={0}
                    aria-label={`Abrir chat con ${chat.profile.name}`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={chat.profile.photo_url || undefined} alt={chat.profile.name} />
                      <AvatarFallback className="bg-cosmic-magenta text-white">
                        {chat.profile.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-semibold truncate">{chat.profile.name}</span>
                      </div>
                      <span className="text-xs text-gray-300 truncate block">
                        {chat.lastMessage ? (chat.lastMessage.sender_id === user.id ? "Tú: " : "") + chat.lastMessage.content : "Chat iniciado"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* Mi perfil */}
            {userProfile && (
            <div className="rounded-3xl bg-[#a78bfa]/30 p-6 flex-1 shadow-lg flex flex-col items-center">
              <Avatar className="w-16 h-16 mb-2">
                <AvatarImage src={userProfile?.avatar_url || ''} alt={userProfile?.full_name || 'Avatar'} />
                <AvatarFallback>{userProfile?.full_name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
              </Avatar>
              <p className="text-white font-bold text-lg">{userProfile?.full_name}</p>
              <p className="text-gray-300 text-sm">{userProfile?.birth_place}</p>
              <Button
                onClick={handleEditProfile}
                className="mt-4 bg-cosmic-magenta hover:bg-cosmic-magenta/80 text-white"
              >
                Editar perfil
              </Button>
            </div>
            )}
          </div>
        )}
        {/* Filtro mejorado */}
        <div className="mb-4 flex items-center justify-center w-full">
          <div className="flex flex-row items-center gap-3 bg-gradient-to-r from-[#2a0a3c]/80 to-[#1a1440]/80 px-4 py-2 rounded-xl shadow-lg">
            <label className="text-white font-semibold mr-2">Ver:</label>
            <select
              value={genderFilter}
              onChange={e => setGenderFilter(e.target.value as any)}
              className="rounded-lg px-3 py-1 bg-[#1a1440] text-white border border-cosmic-magenta focus:outline-none focus:ring-2 focus:ring-cosmic-magenta"
              aria-label="Filtrar por género"
            >
              <option value="ambos">Ambos</option>
              <option value="hombre">Hombres</option>
              <option value="mujer">Mujeres</option>
            </select>
          </div>
        </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProfiles.map((profile, idx) => (
            <div
              key={profile.id}
              className="relative flex flex-col justify-between h-full rounded-2xl bg-[rgba(20,20,40,0.85)] shadow-[0_0_16px_4px_rgba(0,255,255,0.13)] border border-cyan-400/20 backdrop-blur-md overflow-hidden group hover:shadow-[0_0_32px_8px_rgba(80,200,255,0.25)] transition-shadow duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cosmic-magenta"
              style={{ boxShadow: '0 0 24px 4px #38bdf855, 0 0 64px 8px #a78bfa22' }}
              onClick={() => navigate(`/profile/${profile.id}`)}
              tabIndex={0}
              aria-label={`Ver perfil de ${profile.name}`}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/profile/${profile.id}`); }}
            >
              <div className="px-4">
                <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${profile.compatibility_score >= 85 ? 'bg-green-400' : profile.compatibility_score >= 70 ? 'bg-yellow-400' : 'bg-orange-400'}`}></div>
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
                      {profile.age ? `${profile.age} años` : 'años'} • {profile.location || ''}
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
                <p className="text-xs sm:text-sm text-gray-300 mb-4 text-justify line-clamp-2">
                  {profile.description}
                </p>
              </div>
              <div className="mt-auto">
                <Button
                  onClick={e => { e.stopPropagation(); handleChatClick(profile); }}
                  className="w-full bg-gradient-to-r from-cosmic-magenta to-pink-400 hover:from-fuchsia-600 hover:to-pink-500 text-white text-sm py-2 rounded-b-2xl"
                  tabIndex={0}
                  aria-label={`Iniciar chat con ${profile.name}`}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Iniciar Chat
                </Button>
              </div>
            </div>
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

      {/* Eliminar PremiumModal y toda lógica de showPremiumModal */}
    </>
  );
};

export default Home;
