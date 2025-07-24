import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, MessageCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { useRef } from "react";

interface ChatWithProfile {
  id: string;
  user1_id?: string;
  user2_id?: string;
  user_id?: string;
  profile_id?: string;
  created_at: string;
  updated_at: string;
  last_message_at?: string | null;
  type: 'real' | 'ai';
  profile: {
    id: string;
    name: string;
    age: number;
    sign: string;
    moon_sign: string;
    rising_sign: string;
    description: string;
    photo_url: string | null;
    compatibility_score: number;
  };
  lastMessage?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unreadCount?: number;
  lastUnreadAt?: string | null;
}

const Chats = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [chats, setChats] = useState<ChatWithProfile[]>([]);
  const [filteredChats, setFilteredChats] = useState<ChatWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  // Usar el id del usuario autenticado si existe, si no, fallback a sessionId local
  const currentUserId = user?.id || localStorage.getItem("sessionId") || "temp_user";
  const chatsLoadedRef = useRef(false);

  // Cargar chats del usuario solo si user está cargado
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;
    const loadChats = async () => {
      setLoading(true);
      try {
        // Obtener todos los chats reales del usuario
        const { data: realChatsData, error: realChatsError } = await supabase
          .from('chats')
          .select('*')
          .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`)
          .order('last_message_at', { ascending: false, nullsFirst: false });

        if (realChatsError) {
          console.error('Error loading real chats:', realChatsError);
        }

        // Obtener todos los chats artificiales del usuario
        const { data: aiChatsData, error: aiChatsError } = await supabase
          .from('ai_chats')
          .select('*')
          .eq('user_id', currentUserId)
          .order('updated_at', { ascending: false });

        if (aiChatsError) {
          console.error('Error loading AI chats:', aiChatsError);
        }

        // Combinar ambos tipos de chats
        const allChats = [
          ...(realChatsData || []).map(chat => ({ ...chat, type: 'real' })),
          ...(aiChatsData || []).map(chat => ({ ...chat, type: 'ai' }))
        ];

        if (allChats.length === 0) {
          setChats([]);
          setFilteredChats([]);
          setLoading(false);
          return;
        }

        // Para cada chat, obtener el perfil del otro usuario y el último mensaje
        const chatsWithProfiles = await Promise.all(
          allChats.map(async (chat) => {
            if (chat.type === 'real') {
              // Chat real
              const otherUserId = chat.user1_id === currentUserId ? chat.user2_id : chat.user1_id;
              
              // Obtener perfil usando user_id (no id)
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', otherUserId)
                .single();

              if (profileError) {
                console.error('Error loading profile:', profileError);
                return null;
              }

              // Obtener último mensaje
              const { data: lastMessage, error: messageError } = await supabase
                .from('messages')
                .select('content, created_at, sender_id')
                .eq('chat_id', chat.id)
                .order('created_at', { ascending: false })
                .limit(1);

              if (messageError) {
                console.error('Error loading last message:', messageError);
              }

              // Obtener mensajes no leídos
              const { data: unreadMessages, error: unreadError } = await supabase
                .from('messages')
                .select('id, created_at')
                .eq('chat_id', chat.id)
                .eq('read_at', null)
                .neq('sender_id', currentUserId);
              let unreadCount = 0;
              let lastUnreadAt = null;
              if (unreadMessages && unreadMessages.length > 0) {
                unreadCount = unreadMessages.length;
                lastUnreadAt = unreadMessages[unreadMessages.length - 1].created_at;
              }

              return {
                ...chat,
                profile,
                lastMessage: lastMessage?.[0] || null,
                unreadCount,
                lastUnreadAt
              };
            } else {
              // Chat artificial
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', chat.profile_id)
                .single();

              if (profileError) {
                console.error('Error loading AI profile:', profileError);
                return null;
              }

              // Para chats artificiales, usar los mensajes almacenados en el chat
              const messages = chat.messages || [];
              const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
              
              // Los chats artificiales no tienen mensajes no leídos por ahora
              const unreadCount = 0;
              const lastUnreadAt = null;

              return {
                ...chat,
                profile,
                lastMessage: lastMessage ? {
                  content: lastMessage.content,
                  created_at: lastMessage.created_at,
                  sender_id: lastMessage.sender_id
                } : null,
                unreadCount,
                lastUnreadAt
              };
            }
          })
        );

        // Filtrar chats nulos y ordenar por actividad
        const validChats = chatsWithProfiles
          .filter((chat): chat is ChatWithProfile => chat !== null)
          .sort((a, b) => {
            const aTime = a.type === 'real' ? (a.last_message_at || a.created_at) : a.updated_at;
            const bTime = b.type === 'real' ? (b.last_message_at || b.created_at) : b.updated_at;
            return new Date(bTime).getTime() - new Date(aTime).getTime();
          });

        setChats(validChats);
        setFilteredChats(validChats);

      } catch (error) {
        console.error('Unexpected error loading chats:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los chats",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
        chatsLoadedRef.current = true;
      }
    };

    loadChats();
  }, [currentUserId, toast, isAuthenticated, user?.id]);

  // Suscripción realtime a mensajes para actualizar los badges
  useEffect(() => {
    if (!chatsLoadedRef.current) return;
    const channel = supabase.channel('messages-realtime-badge')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          // Solo recargar si el mensaje es para un chat del usuario
          const newMsg = payload.new;
          if (!newMsg) return;
          // Si el usuario es parte del chat, recargar chats
          if (chats.some(chat => chat.id === newMsg.chat_id)) {
            // Recargar chats (no poner loading para no parpadear la UI)
            (async () => {
              const { data: chatsData } = await supabase
                .from('chats')
                .select('*')
                .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`)
                .order('last_message_at', { ascending: false, nullsFirst: false });
              if (!chatsData) return;
              const chatsWithProfiles = await Promise.all(
                chatsData.map(async (chat) => {
                  const otherUserId = chat.user1_id === currentUserId ? chat.user2_id : chat.user1_id;
                  const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', otherUserId)
                    .single();
                  const { data: lastMessage } = await supabase
                    .from('messages')
                    .select('content, created_at, sender_id')
                    .eq('chat_id', chat.id)
                    .order('created_at', { ascending: false })
                    .limit(1);
                  const { data: unreadMessages } = await supabase
                    .from('messages')
                    .select('id, created_at')
                    .eq('chat_id', chat.id)
                    .eq('read_at', null)
                    .neq('sender_id', currentUserId);
                  let unreadCount = 0;
                  let lastUnreadAt = null;
                  if (unreadMessages && unreadMessages.length > 0) {
                    unreadCount = unreadMessages.length;
                    lastUnreadAt = unreadMessages[unreadMessages.length - 1].created_at;
                  }
                  return {
                    ...chat,
                    profile,
                    lastMessage: lastMessage?.[0] || null,
                    unreadCount,
                    lastUnreadAt
                  };
                })
              );
              const validChats = chatsWithProfiles
                .filter((chat): chat is ChatWithProfile => chat !== null)
                .sort((a, b) => {
                  const aTime = a.last_message_at || a.created_at;
                  const bTime = b.last_message_at || b.created_at;
                  return new Date(bTime).getTime() - new Date(aTime).getTime();
                });
              setChats(validChats);
              setFilteredChats(validChats);
            })();
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [chats, currentUserId]);

  // Filtrar chats por búsqueda
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredChats(chats);
      return;
    }

    const filtered = chats.filter(chat =>
      chat.profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.profile.sign.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredChats(filtered);
  }, [searchQuery, chats]);

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      if (diffInMinutes < 1) return 'Ahora';
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInDays === 1) {
      return 'Ayer';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString('es-ES', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit'
      });
    }
  };

  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  const handleChatClick = (profileId: string) => {
    navigate(`/chat/${profileId}`);
  };

  if (loading || isLoading || !isAuthenticated || !user?.id) {
    return (
      <div className="min-h-screen bg-cosmic-blue flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-cosmic-magenta border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic-blue">
             {/* Header */}
       <div className="bg-white/5 backdrop-blur-md border-b border-white/10 p-6">
         <div className="max-w-4xl mx-auto">
           <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-4">
               <Button
                 variant="ghost"
                 size="icon"
                 onClick={() => navigate('/home')}
                 className="text-white hover:bg-white/10 rounded-full p-2"
               >
                 <ArrowLeft className="h-5 w-5" />
               </Button>
               <div>
                 <h1 className="text-2xl font-bold text-white">Mis Chats</h1>
                 <p className="text-gray-300 text-sm">
                   {chats.length} conversacion{chats.length !== 1 ? 'es' : ''} activa{chats.length !== 1 ? 's' : ''}
                 </p>
               </div>
             </div>
           </div>
           
           {/* Barra de búsqueda */}
           <div className="relative">
             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
             <Input
               placeholder="Buscar por nombre..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-12 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-cosmic-magenta rounded-xl h-12"
             />
           </div>
         </div>
       </div>

             {/* Lista de chats */}
       <div className="max-w-4xl mx-auto p-6">
        {filteredChats.length === 0 ? (
          <div className="text-center py-12">
            {chats.length === 0 ? (
              <>
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No tienes chats activos
                </h3>
                <p className="text-gray-300 mb-6">
                  Ve a la página principal y comienza a chatear con tus conexiones cósmicas
                </p>
                <Button
                  onClick={() => navigate('/home')}
                  className="bg-cosmic-magenta hover:bg-cosmic-magenta/80 text-white"
                >
                  Explorar Perfiles
                </Button>
              </>
            ) : (
              <>
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  No se encontraron chats
                </h3>
                <p className="text-gray-300">
                  Intenta con otro término de búsqueda
                </p>
              </>
            )}
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-200px)]">
                         <div className="space-y-3">
              {filteredChats.map((chat) => (
                                 <Card
                   key={chat.id}
                   className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer rounded-xl"
                   onClick={() => handleChatClick(chat.profile.id)}
                 >
                   <CardContent className="p-5">
                     <div className="flex items-center gap-4">
                                             {/* Avatar */}
                       <Avatar className="h-14 w-14 flex-shrink-0 border-2 border-white/20">
                         <AvatarImage 
                           src={chat.profile.photo_url || undefined} 
                           alt={chat.profile.name} 
                         />
                         <AvatarFallback className="bg-gradient-to-br from-cosmic-magenta to-fuchsia-500 text-white font-semibold text-lg">
                           {chat.profile.name.charAt(0)}
                         </AvatarFallback>
                       </Avatar>

                                             {/* Información del chat */}
                       <div className="flex-1 min-w-0">
                         <div className="flex items-center justify-between mb-2">
                           <h3 className="font-semibold text-white truncate text-base">
                             {chat.profile.name}
                           </h3>
                           <div className="flex items-center gap-2">
                             <span className="text-xs text-gray-400 flex-shrink-0">
                               {chat.lastMessage 
                                 ? formatMessageTime(chat.lastMessage.created_at)
                                 : formatMessageTime(chat.created_at)
                               }
                             </span>
                             {chat.unreadCount && chat.unreadCount > 0 && (
                               <div className="w-2 h-2 bg-cosmic-magenta rounded-full animate-pulse flex-shrink-0"></div>
                             )}
                           </div>
                         </div>
                         
                         <div className="flex-1 min-w-0">
                           {chat.lastMessage ? (
                             <p className={`text-sm truncate ${
                               chat.unreadCount && chat.unreadCount > 0 
                                 ? 'text-white font-medium' 
                                 : 'text-gray-300'
                             }`}>
                               {chat.lastMessage.sender_id === currentUserId ? "Tú: " : ""}
                               {truncateMessage(chat.lastMessage.content, 60)}
                             </p>
                           ) : (
                             <p className="text-sm text-gray-400 italic">
                               Chat iniciado
                             </p>
                           )}
                         </div>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

// Helper para mostrar "hace X min/h" en vez de hora exacta
function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'menos de 1 min';
  if (diffMin < 60) return `${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} h`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD} d`;
}

export default Chats; 