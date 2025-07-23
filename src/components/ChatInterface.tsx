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
import { v4 as uuidv4 } from 'uuid';

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

// Añadir tipo para chat artificial (ai_chats)
type AIChat = {
  id: string;
  user_id: string;
  profile_id: string;
  messages: Array<{
    id: string;
    sender_id: string;
    content: string;
    created_at: string;
  }>;
};

const ChatInterface = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [profile, setProfile] = useState<any | null>(null); // Changed type to any as Profile is removed
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = user?.id || localStorage.getItem("sessionId") || "temp_user";
  const [isArtificial, setIsArtificial] = useState(false);

  // Verificar autenticación al cargar
  useEffect(() => {
    if (isLoading) return; // Esperar a que cargue el usuario
    if (!isAuthenticated) {
      toast({
        title: "🔒 Acceso Requerido",
        description: "Necesitas iniciar sesión para acceder a los chats",
        variant: "destructive"
      });
      navigate('/home');
      return;
    }
  }, [isAuthenticated, user, navigate, toast, isLoading]);

  // Si está cargando usuario, mostrar loading temático
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cosmic-blue flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-white mb-4">Canalizando energías cósmicas...</h2>
          <p className="text-cosmic-gold">Consultando los astros para verificar tu acceso</p>
        </div>
      </div>
    );
  }

  // Scroll automático al final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Suscripción realtime a mensajes del chat actual
  useEffect(() => {
    if (!chat?.id) {
      console.log('[Realtime] No chat.id disponible, no se subscribe');
      return;
    }
    if (isArtificial) {
      console.log('[Realtime] Chat artificial, no se subscribe a realtime');
      return;
    }
    console.log(`[Realtime] Subscribiendo a canal: messages-chat-${chat.id}`);
    const channel = supabase.channel(`messages-chat-${chat.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chat.id}`,
        },
        (payload) => {
          const newMsg = payload.new;
          console.log('[Realtime] Recibido payload:', payload);
          // Validar que el mensaje tenga los campos requeridos
          if (!newMsg || !newMsg.id || !newMsg.chat_id || !newMsg.sender_id || !newMsg.content || !newMsg.created_at) {
            console.log('[Realtime] Mensaje recibido inválido:', newMsg);
            return;
          }
          setMessages((prev) => {
            // Filtrar duplicados por id y por contenido+timestamp
            if (prev.some((m) => m.id === newMsg.id)) {
              console.log('[Realtime] Mensaje duplicado por id:', newMsg.id);
              return prev;
            }
            if (prev.some((m) => m.content === newMsg.content && m.created_at === newMsg.created_at && m.sender_id === newMsg.sender_id)) {
              console.log('[Realtime] Mensaje duplicado por contenido+timestamp:', newMsg.content);
              return prev;
            }
            console.log('[Realtime] Mensaje nuevo agregado:', newMsg);
            return [...prev, newMsg as Message];
          });
        }
      )
      .subscribe();
    return () => {
      console.log(`[Realtime] Desuscribiendo canal: messages-chat-${chat.id}`);
      supabase.removeChannel(channel);
    };
  }, [chat?.id, isArtificial]);

  // Marcar mensajes recibidos como leídos al abrir el chat
  useEffect(() => {
    if (!chat?.id || !user?.id) return;
    async function markAsRead() {
      // Solo para chats reales
      if (isArtificial) return;
      // Buscar mensajes recibidos no leídos
      const { data: unreadMessages } = await supabase
        .from('messages')
        .select('id')
        .eq('chat_id', chat.id)
        .eq('read_at', null)
        .neq('sender_id', user.id);
      if (unreadMessages && unreadMessages.length > 0) {
        const ids = unreadMessages.map((m: any) => m.id);
        await supabase
          .from('messages')
          .update({ read_at: new Date().toISOString() })
          .in('id', ids);
        // Refrescar mensajes
        const { data: refreshed } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chat.id)
          .order('created_at', { ascending: true });
        setMessages(refreshed || []);
      }
    }
    markAsRead();
  }, [chat?.id, isArtificial, user?.id]);

  // Cargar perfil y chat al montar el componente
  useEffect(() => {
    const loadChatData = async () => {
      if (!profileId || !isAuthenticated) return;
      setLoading(true);
      try {
        // Cargar perfil desde Supabase
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single();
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
        setProfile(profileData);

        // Detectar si el perfil es artificial (no tiene user_id en profiles)
        const isArtificialProfile = !(profileData as any).user_id;
        setIsArtificial(isArtificialProfile);
        // Definir identificadores correctos
        const myUserId = user.id; // siempre el id de users
        const otherId = isArtificialProfile ? profileData.id : (profileData as any).user_id;

        if (isArtificialProfile) {
          // Buscar o crear chat artificial en ai_chats (sin cambios)
          let aiChat: AIChat | null = null;
          const { data: existingAiChat } = await supabase
            .from('ai_chats' as any)
            .select('*')
            .eq('user_id', user.id)
            .eq('profile_id', profileId)
            .single();
          if (existingAiChat) {
            aiChat = existingAiChat as unknown as AIChat;
          } else {
            const { data: newAiChat, error: aiChatError } = await supabase
              .from('ai_chats' as any)
              .insert({ user_id: user.id, profile_id: profileId, messages: [] })
              .select()
              .single();
            if (aiChatError) {
              toast({ title: 'Error', description: 'No se pudo crear el chat', variant: 'destructive' });
              setLoading(false);
              return;
            }
            aiChat = newAiChat as unknown as AIChat;
          }
          setChat(aiChat as any); // chat artificial, solo para mantener la API
          setMessages((aiChat.messages || []).map((msg) => ({
            id: msg.id || uuidv4(),
            chat_id: aiChat!.id,
            sender_id: msg.sender_id,
            content: msg.content,
            created_at: msg.created_at,
            read_at: null // para cumplir el tipo Message
          })));
        } else {
          // Chat real (matching por user.id de ambos)
          // Buscar chat existente entre ambos usuarios
          console.log('[Chat] Buscando chat entre:', myUserId, 'y', otherId);
          const { data: existingChats, error: chatError } = await supabase
            .from('chats')
            .select('*')
            .or(`user1_id.eq.${myUserId},user1_id.eq.${otherId}`)
            .or(`user2_id.eq.${myUserId},user2_id.eq.${otherId}`);
          
          console.log('[Chat] Chats existentes encontrados:', existingChats);
          
          // Filtrar para encontrar el chat específico entre estos dos usuarios
          let chatData = null;
          if (existingChats) {
            chatData = existingChats.find(chat => 
              (chat.user1_id === myUserId && chat.user2_id === otherId) ||
              (chat.user1_id === otherId && chat.user2_id === myUserId)
            );
          }
          
          console.log('[Chat] Chat encontrado:', chatData);
          if (!chatData) {
            console.log('[Chat] Creando nuevo chat entre:', myUserId, 'y', otherId);
            // Solo crear si no existe ninguno
            const { data: newChat, error: createError } = await supabase
              .from('chats')
              .insert({ user1_id: myUserId, user2_id: otherId })
              .select()
              .single();
            if (createError) {
              console.error('[Chat] Error creando chat:', createError);
              toast({ title: 'Error', description: 'No se pudo crear el chat', variant: 'destructive' });
              setLoading(false);
              return;
            }
            chatData = newChat;
            console.log('[Chat] Nuevo chat creado:', chatData);
          }
          setChat(chatData);
          if (chatData) {
            console.log('[Chat] Cargando mensajes para chat:', chatData.id);
            const { data: messagesData, error: messagesError } = await supabase
              .from('messages')
              .select('*')
              .eq('chat_id', chatData.id)
              .order('created_at', { ascending: true });
            if (messagesError) {
              console.error('[Chat] Error cargando mensajes:', messagesError);
            }
            console.log('[Chat] Mensajes cargados:', messagesData?.length || 0);
            setMessages(messagesData || []);
          }
        }
      } catch (error) {
        toast({ title: 'Error', description: 'Ocurrió un error inesperado', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    loadChatData();
  }, [profileId, isAuthenticated, user, navigate, toast]);

  // Debug: log ids relevantes
  useEffect(() => {
    console.log('[Debug] user.id:', user?.id, 'profileId:', profileId, 'chat?.id:', chat?.id, 'isArtificial:', isArtificial);
  }, [user?.id, profileId, chat?.id, isArtificial]);

  // Función para enviar respuesta automática del perfil
  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending || !user) return;
    setSending(true);
    try {
      if (isArtificial && chat) {
        // Guardar mensaje en ai_chats
        const newMsg = {
          id: uuidv4(),
          sender_id: user.id,
          content: newMessage.trim(),
          created_at: new Date().toISOString(),
          chat_id: (chat as any).id,
          read_at: null
        };
        const updatedMessages = [...(messages || []), newMsg];
        setMessages(updatedMessages);
        setNewMessage("");
        // Actualizar en Supabase
        await supabase
          .from('ai_chats' as any)
          .update({ messages: updatedMessages })
          .eq('id', (chat as any).id);
        // No enviar respuesta automática - el usuario artificial no responde
        toast({
          title: "💬 Mensaje enviado",
          description: "Tu mensaje ha sido guardado. Este perfil no responde automáticamente.",
        });
      } else {
        // Manejar envío de mensajes reales
        console.log('[Send] Enviando mensaje real a chat:', chat?.id);
        console.log('[Send] Contenido:', newMessage.trim());
        console.log('[Send] Sender ID:', user.id);
        
        const { error } = await supabase
          .from('messages')
          .insert({
            chat_id: chat?.id,
            sender_id: user.id,
            content: newMessage.trim(),
          });

        if (error) {
          console.error('Error sending message:', error);
          toast({
            title: "Error al enviar mensaje",
            description: "No se pudo enviar el mensaje. Inténtalo de nuevo.",
            variant: "destructive"
          });
          return;
        }
        console.log('[Send] Mensaje enviado exitosamente');
        setNewMessage("");
        // Actualizar última actividad del chat
        await supabase
          .from('chats')
          .update({ last_message_at: new Date().toISOString() })
          .eq('id', chat?.id);
        toast({
          title: "💬 Mensaje enviado",
          description: "Tu mensaje ha sido enviado correctamente.",
        });
      }
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      toast({
        title: "Error al enviar mensaje",
        description: "Ocurrió un error inesperado al enviar el mensaje.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1440] via-[#2a0a3c] to-[#0a1033] flex flex-col">
      {/* Header con botón de volver */}
      <div className="flex items-center p-4 border-b border-cosmic-gold/30 bg-white/5 backdrop-blur-md">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-cosmic-gold hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-cosmic-gold rounded-full p-2"
          tabIndex={0}
          aria-label="Volver a Home"
        >
          <ArrowLeft className="h-6 w-6" />
          <span className="font-semibold hidden sm:inline">Volver</span>
        </button>
        <h2 className="text-xl text-white ml-4 font-bold drop-shadow">Chat con {profile?.name || ''}</h2>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4">
        <ScrollArea className="h-full">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender_id !== user?.id && (
                <Avatar className="mr-2 w-8 h-8">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback>{profile?.name?.[0]}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md text-sm break-words ${
                  message.sender_id === user?.id
                    ? 'bg-gradient-to-br from-cosmic-magenta to-fuchsia-500 text-white rounded-br-none'
                    : 'bg-gradient-to-br from-cosmic-gold/80 to-yellow-200 text-cosmic-dark-blue rounded-bl-none'
                }`}
                tabIndex={0}
                aria-label={`Mensaje de ${message.sender_id === user?.id ? 'tú' : profile?.name}`}
              >
                <span>{message.content}</span>
                <div className="text-[10px] text-right mt-1 opacity-60">
                  {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {message.sender_id === user?.id && (
                <Avatar className="ml-2 w-8 h-8">
                  <AvatarImage src={user?.avatar_url} />
                  <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </div>

      {/* Input de mensaje mejorado */}
      <div className="p-4 border-t border-cosmic-gold/30 bg-white/5 backdrop-blur-md">
        <form
          className="flex items-center gap-2"
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <input
            type="text"
            placeholder="Escribe un mensaje cósmico..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            className="flex-1 bg-gradient-to-r from-[#2a0a3c]/60 to-[#a78bfa]/20 text-white placeholder-cosmic-gold rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cosmic-magenta border border-cosmic-magenta/30 shadow"
            tabIndex={0}
            aria-label="Escribir mensaje"
            autoComplete="off"
          />
          <button
            type="submit"
            className="bg-cosmic-magenta hover:bg-fuchsia-600 text-white rounded-full p-3 shadow transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-cosmic-magenta"
            disabled={sending || !user || !newMessage.trim()}
            aria-label="Enviar mensaje"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;