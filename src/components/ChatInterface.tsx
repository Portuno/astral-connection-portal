import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, MoreVertical, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthProvider";
import { getProfileById, type Profile } from "@/data/mockProfiles";

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

interface Chat {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  updated_at: string;
  last_message_at: string | null;
}

const ChatInterface = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = localStorage.getItem("sessionId") || "temp_user";

  // Verificar autenticación al cargar
  useEffect(() => {
    if (!isAuthenticated || !user?.isPremium) {
      toast({
        title: "🔐 Acceso Premium Requerido",
        description: "Necesitas una suscripción premium para acceder a los chats",
        variant: "destructive"
      });
      navigate('/home');
      return;
    }
  }, [isAuthenticated, user, navigate, toast]);

  // Scroll automático al final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cargar perfil y chat al montar el componente
  useEffect(() => {
    const loadChatData = async () => {
      if (!profileId || !isAuthenticated || !user?.isPremium) return;
      
      setLoading(true);
      try {
        // Cargar perfil desde mock data
        const profileData = getProfileById(profileId);
        
        if (!profileData) {
          console.error('Profile not found:', profileId);
          toast({
            title: "Error",
            description: "No se pudo encontrar el perfil",
            variant: "destructive"
          });
          navigate('/home');
          return;
        }

        console.log("✅ Perfil cargado:", profileData);
        setProfile(profileData);

        // Usar el ID del usuario autenticado
        const authenticatedUserId = user.id;

        // Buscar o crear chat existente
        const { data: existingChat, error: chatError } = await supabase
          .from('chats')
          .select('*')
          .or(`and(user1_id.eq.${authenticatedUserId},user2_id.eq.${profileId}),and(user1_id.eq.${profileId},user2_id.eq.${authenticatedUserId})`)
          .single();

        let chatData = existingChat;

        // Si no existe el chat, crearlo
        if (chatError && chatError.code === 'PGRST116') {
          console.log("💬 Creando nuevo chat entre:", authenticatedUserId, "y", profileId);
          
          const { data: newChat, error: createError } = await supabase
            .from('chats')
            .insert({
              user1_id: authenticatedUserId,
              user2_id: profileId,
              user1_auth_id: authenticatedUserId,
              user2_auth_id: profileId // En este caso es el mock profile ID
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating chat:', createError);
            toast({
              title: "Error",
              description: "No se pudo crear el chat",
              variant: "destructive"
            });
            return;
          }

          chatData = newChat;
        } else if (chatError) {
          console.error('Error loading chat:', chatError);
          return;
        }

        setChat(chatData);

        // Cargar mensajes del chat
        if (chatData) {
          const { data: messagesData, error: messagesError } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chatData.id)
            .order('created_at', { ascending: true });

          if (messagesError) {
            console.error('Error loading messages:', messagesError);
          } else {
            setMessages(messagesData || []);
          }
        }

      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          title: "Error",
          description: "Ocurrió un error inesperado",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadChatData();
  }, [profileId, isAuthenticated, user, navigate, toast]);

  // Función para enviar respuesta automática del perfil
  const sendAutoReply = async (chatId: string, profileId: string) => {
    if (!profile) return;

    const replies = [
      `¡Hola! Me alegra mucho chatear contigo 😊`,
      `¿Cómo ha sido tu día? El mío ha sido lleno de energía ${profile.sign} ✨`,
      `Me encanta nuestra conexión cósmica, ${user?.name || 'querido/a'} 💫`,
      `¿Has notado la influencia de ${profile.moon_sign} en tu Luna? Es fascinante`,
      `Nuestra compatibilidad del ${profile.compatibility_score}% se siente muy real 🌟`,
      `Me gusta cómo piensas, definitivamente hay química entre nosotros`,
      `¿Te gustaría que exploremos más nuestra conexión astrológica? 🔮`,
      `Creo que las estrellas nos han unido por una razón especial`
    ];

    const randomReply = replies[Math.floor(Math.random() * replies.length)];

    try {
      console.log("🤖 Enviando respuesta automática de", profile.name);
      
      const { error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: profileId,
          sender_auth_id: profileId,
          content: randomReply
        });

      if (error) {
        console.error('Error sending auto reply:', error);
        return;
      }

      // Añadir respuesta a la lista local
      const autoMsg: Message = {
        id: (Date.now() + 1).toString(),
        chat_id: chatId,
        sender_id: profileId,
        content: randomReply,
        created_at: new Date().toISOString(),
        read_at: null
      };

      setMessages(prev => [...prev, autoMsg]);

      // Actualizar última actividad del chat
      await supabase
        .from('chats')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', chatId);

    } catch (error) {
      console.error('Error in auto reply:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chat || sending || !user) return;

    setSending(true);
    try {
      console.log("📤 Enviando mensaje del usuario:", user.email);
      
      const { error } = await supabase
        .from('messages')
        .insert({
          chat_id: chat.id,
          sender_id: user.id,
          sender_auth_id: user.id,
          content: newMessage.trim()
        });

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "No se pudo enviar el mensaje",
          variant: "destructive"
        });
        return;
      }

      // Actualizar la última actividad del chat
      await supabase
        .from('chats')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', chat.id);

      // Añadir mensaje a la lista local
      const newMsg: Message = {
        id: Date.now().toString(),
        chat_id: chat.id,
        sender_id: user.id,
        content: newMessage.trim(),
        created_at: new Date().toISOString(),
        read_at: null
      };

      setMessages(prev => [...prev, newMsg]);
      setNewMessage("");
      
      // Simular respuesta automática del perfil después de 2-4 segundos
      setTimeout(async () => {
        await sendAutoReply(chat.id, profileId);
      }, Math.random() * 2000 + 2000);

    } catch (error) {
      console.error('Unexpected error sending message:', error);
      toast({
        title: "Error",
        description: "Error inesperado al enviar mensaje",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  // Cambiar onKeyPress por onKeyDown
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Si no está autenticado, mostrar loading
  if (!isAuthenticated || !user?.isPremium) {
    return (
      <div className="min-h-screen bg-cosmic-blue flex items-center justify-center">
        <div className="text-center">
          <Crown className="h-12 w-12 text-cosmic-gold mx-auto mb-4" />
          <h2 className="text-xl text-white mb-4">Verificando acceso premium...</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmic-blue flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-cosmic-magenta border-t-transparent"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-cosmic-blue flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-white mb-4">Perfil no encontrado</h2>
          <Button onClick={() => navigate('/home')} variant="outline">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic-blue flex flex-col">
      {/* Header del chat */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/home')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile.photo_url || undefined} alt={profile.name} />
            <AvatarFallback className="bg-cosmic-magenta text-white">
              {profile.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              {profile.name}
              <Crown className="h-4 w-4 text-cosmic-gold" />
            </h2>
            <p className="text-sm text-gray-300">
              {profile.sign} • {profile.compatibility_score}% compatibilidad
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Área de mensajes */}
      <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-cosmic-blue via-indigo-900 to-purple-900">
        <div className="space-y-4 max-w-2xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">💫</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                ¡Inicia tu conversación con {profile.name}!
              </h3>
              <p className="text-gray-300 text-sm">
                Las estrellas han alineado esta conexión especial
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`relative max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-md transition-all duration-200
                  ${message.sender_id === user.id
                    ? 'bg-gradient-to-r from-cosmic-magenta to-purple-600 text-white rounded-br-none'
                    : 'bg-white/30 text-white rounded-bl-none border border-white/20 backdrop-blur-sm'}
                `}>
                  <p className="text-base leading-relaxed break-words">{message.content}</p>
                  <span className="absolute -bottom-5 right-2 text-xs opacity-60 mt-1">
                    {new Date(message.created_at).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input de mensaje */}
      <div className="bg-white/10 backdrop-blur-md border-t border-white/20 p-4 sticky bottom-0 z-10">
        <div className="max-w-2xl mx-auto">
          <form className="flex gap-2" onSubmit={e => { e.preventDefault(); handleSendMessage(); }}>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              className="flex-1 bg-white/30 border-white/20 text-white placeholder-gray-300 focus:border-cosmic-magenta text-base px-4 py-3 rounded-full shadow-md"
              disabled={sending}
              autoFocus
              aria-label="Escribe tu mensaje"
            />
            <Button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="bg-gradient-to-r from-cosmic-magenta to-purple-600 hover:from-cosmic-magenta/90 hover:to-purple-600/90 text-white rounded-full px-5 py-3 text-lg shadow-lg"
              aria-label="Enviar mensaje"
            >
              {sending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 