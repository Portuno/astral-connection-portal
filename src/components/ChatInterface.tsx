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
    if (!isAuthenticated || !user?.isPremium) {
      toast({
        title: "🔒 Acceso Premium Requerido",
        description: "Necesitas una suscripción premium para acceder a los chats",
        variant: "destructive"
      });
      navigate('/home');
      return;
    }
  }, [isAuthenticated, user, navigate, toast, isLoading]);

  // Si está cargando usuario o premium, mostrar loading temático
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cosmic-blue flex items-center justify-center">
        <div className="text-center">
          <Crown className="h-12 w-12 text-cosmic-gold mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl text-white mb-4">Canalizando energías cósmicas...</h2>
          <p className="text-cosmic-gold">Consultando los astros para verificar tu acceso premium</p>
        </div>
      </div>
    );
  }

  // Fallback defensivo: si tras cargar el usuario no es válido, mostrar mensaje y botón
  if (!isLoading && (!isAuthenticated || !user?.isPremium)) {
    return (
      <div className="min-h-screen bg-cosmic-blue flex items-center justify-center">
        <div className="text-center">
          <Crown className="h-12 w-12 text-cosmic-gold mx-auto mb-4 animate-bounce" />
          <h2 className="text-xl text-white mb-4">Acceso restringido</h2>
          <p className="text-cosmic-gold mb-4">No tienes acceso premium o tu sesión expiró.<br />Por favor, vuelve al inicio e inicia sesión nuevamente.</p>
          <Button onClick={() => navigate('/home')} className="bg-cosmic-magenta text-white px-6 py-3 rounded-full font-bold">Volver al inicio</Button>
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
      if (!profileId || !isAuthenticated || !user?.isPremium) return;
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
          // Buscar todos los chats entre ambos usuarios, sin importar el orden
          const { data: existingChats, error: chatError } = await supabase
            .from('chats')
            .select('*')
            .or(`and(user1_id.eq.${myUserId},user2_id.eq.${otherId}),and(user1_id.eq.${otherId},user2_id.eq.${myUserId})`)
            .order('created_at', { ascending: true });
          let chatData = existingChats && existingChats.length > 0 ? existingChats[0] : null;
          if (!chatData) {
            // Solo crear si no existe ninguno
            const { data: newChat, error: createError } = await supabase
              .from('chats')
              .insert({ user1_id: myUserId, user2_id: otherId })
              .select()
              .single();
            if (createError) {
              toast({ title: 'Error', description: 'No se pudo crear el chat', variant: 'destructive' });
              setLoading(false);
              return;
            }
            chatData = newChat;
          }
          setChat(chatData);
          if (chatData) {
            const { data: messagesData, error: messagesError } = await supabase
              .from('messages')
              .select('*')
              .eq('chat_id', chatData.id)
              .order('created_at', { ascending: true });
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
        // Simular respuesta automática
        setTimeout(() => {
          // Generar respuesta automática inline (como en sendAutoReply)
          const replies = [
            `¡Hola! Me alegra mucho chatear contigo 😊`,
            `¿Cómo ha sido tu día? El mío ha sido lleno de energía ${(profile as any)?.sign || ''} ✨`,
            `Me encanta nuestra conexión cósmica, ${user?.name || 'querido/a'} 💫`,
            `¿Has notado la influencia de ${(profile as any)?.moon_sign || ''} en tu Luna? Es fascinante`,
            `Nuestra compatibilidad del ${(profile as any)?.compatibility_score || ''}% se siente muy real 🌟`,
            `Me gusta cómo piensas, definitivamente hay química entre nosotros`,
            `¿Te gustaría que exploremos más nuestra conexión astrológica? 🔮`,
            `Creo que las estrellas nos han unido por una razón especial`
          ];
          const randomReply = replies[Math.floor(Math.random() * replies.length)];
          const autoMsg = {
            id: uuidv4(),
            sender_id: profileId,
            content: randomReply,
            created_at: new Date().toISOString(),
            chat_id: (chat as any).id,
            read_at: null
          };
          const updatedWithAuto = [...updatedMessages, autoMsg];
          setMessages(updatedWithAuto);
          supabase.from('ai_chats' as any).update({ messages: updatedWithAuto }).eq('id', (chat as any).id);
        }, Math.random() * 2000 + 2000);
      } else {
        // Manejar envío de mensajes reales
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
        setNewMessage("");
        // Actualizar última actividad del chat
        await supabase
          .from('chats')
          .update({ last_message_at: new Date().toISOString() })
          .eq('id', chat?.id);
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
    <div className="min-h-screen bg-cosmic-blue flex flex-col">
      <div className="flex items-center p-4 border-b border-cosmic-gold">
        <Button variant="ghost" onClick={() => navigate('/home')} className="text-cosmic-gold">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl text-white ml-2">Chat con {profile?.name || ''}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <ScrollArea className="h-full">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start mb-4 ${message.sender_id === user?.id ? 'justify-end' : ''}`}
            >
              <Avatar className="mr-2">
                <AvatarImage src={message.sender_id === user?.id ? user?.avatar : profile?.avatar} />
                <AvatarFallback>{message.sender_id === user?.id ? user?.name : profile?.name}</AvatarFallback>
              </Avatar>
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender_id === user?.id ? 'bg-cosmic-magenta text-white' : 'bg-cosmic-gold text-black'
                }`}
              >
                <p>{message.content}</p>
                <p className="text-xs text-cosmic-gold mt-1">{new Date(message.created_at).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </div>

      <div className="p-4 border-t border-cosmic-gold">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            className="bg-cosmic-dark-blue text-white placeholder-cosmic-gold"
          />
          <Button onClick={handleSendMessage} disabled={sending || !user}>
            <Send className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;