import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, MoreVertical, Crown, RefreshCw, Wifi, WifiOff } from "lucide-react";
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
  const [profile, setProfile] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = user?.id || localStorage.getItem("sessionId") || "temp_user";
  const [isArtificial, setIsArtificial] = useState(false);
  
  // Estados para manejo de conectividad
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [realtimeError, setRealtimeError] = useState<string | null>(null);
  const [usePolling, setUsePolling] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageTimestampRef = useRef<string>('');

  // Verificar autenticación al cargar
  useEffect(() => {
    if (isLoading) return;
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

  // Función para cargar mensajes manualmente (fallback)
  const loadMessages = useCallback(async () => {
    if (!chat?.id || isArtificial) return;
    
    try {
      console.log('[Polling] Cargando mensajes para chat:', chat.id);
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chat.id as any)
        .order('created_at', { ascending: true });
      
      if (messagesError) {
        console.error('[Polling] Error cargando mensajes:', messagesError);
        return;
      }
      
      let validMessages: Message[] = [];
      if (Array.isArray(messagesData)) {
        validMessages = messagesData.filter((msg: any) =>
          msg && typeof msg === 'object' &&
          !('error' in msg) &&
          'id' in msg && 'chat_id' in msg && 'sender_id' in msg && 'content' in msg && 'created_at' in msg
        );
      }
      if (validMessages.length > 0) {
        const lastMessage = validMessages[validMessages.length - 1];
        if (lastMessage.created_at !== lastMessageTimestampRef.current) {
          console.log('[Polling] Nuevos mensajes detectados:', validMessages.length);
          setMessages(validMessages);
          lastMessageTimestampRef.current = lastMessage.created_at;
        }
      } else if (Array.isArray(messagesData) && messagesData.length === 0) {
        setMessages([]);
        lastMessageTimestampRef.current = '';
      }
    } catch (error) {
      console.error('[Polling] Error inesperado cargando mensajes:', error);
    }
  }, [chat?.id, isArtificial]);

  // Iniciar polling cuando Realtime falla
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    
    console.log('[Polling] Iniciando polling cada 3 segundos');
    setUsePolling(true);
    pollingIntervalRef.current = setInterval(loadMessages, 3000);
  }, [loadMessages]);

  // Detener polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setUsePolling(false);
  }, []);

  // Función de reconexión para Realtime
  const reconnectRealtime = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    console.log('[Realtime] Intentando reconexión en 5 segundos...');
    reconnectTimeoutRef.current = setTimeout(() => {
      console.log('[Realtime] Reintentando conexión...');
      // Forzar re-render del useEffect de Realtime
      setIsRealtimeConnected(false);
      setRealtimeError(null);
    }, 5000);
  }, []);

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

    // Limpiar polling si existe
    stopPolling();
    
    // Forzar uso de polling por ahora para evitar problemas de Realtime
    console.log('[Realtime] Usando polling en lugar de Realtime para evitar problemas');
    startPolling();
    return;
    
    console.log(`[Realtime] Subscribiendo a canal: messages-chat-${chat.id}`);
    
    // Crear canal con configuración más robusta
    const channel = supabase.channel(`messages-chat-${chat.id}`, {
      config: {
        presence: {
          key: user?.id,
        },
      },
    })
      .on(
        'postgres_changes',
        {
          event: '*', // Escuchar todos los eventos (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chat.id}`,
        },
        (payload) => {
          console.log('[Realtime] Recibido payload:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newMsg = payload.new;
            
            // Validar que el mensaje tenga los campos requeridos
            if (!newMsg || !newMsg.id || !newMsg.chat_id || !newMsg.sender_id || !newMsg.content || !newMsg.created_at) {
              console.log('[Realtime] Mensaje recibido inválido:', newMsg);
              return;
            }
            
            setMessages((prev) => {
              // Filtrar duplicados por id
              if (prev.some((m) => m.id === newMsg.id)) {
                console.log('[Realtime] Mensaje duplicado por id:', newMsg.id);
                return prev;
              }
              console.log('[Realtime] Mensaje nuevo agregado:', newMsg);
              return [...prev, newMsg as Message];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedMsg = payload.new;
            setMessages((prev) => {
              return prev.map((msg) => 
                msg.id === updatedMsg.id ? { ...msg, ...updatedMsg } : msg
              );
            });
          } else if (payload.eventType === 'DELETE') {
            const deletedMsg = payload.old;
            setMessages((prev) => {
              return prev.filter((msg) => msg.id !== deletedMsg.id);
            });
          }
        }
      )
      .on('system', { event: 'error' }, (error) => {
        console.error('[Realtime] Error en canal:', error);
        setRealtimeError(error.message || 'Error de conexión');
        setIsRealtimeConnected(false);
        
        // Cambiar a polling inmediatamente en caso de error
        if (!usePolling) {
          startPolling();
        }
      })
      .on('system', { event: 'close' }, () => {
        console.log('[Realtime] Canal cerrado');
        setIsRealtimeConnected(false);
        
        // Intentar reconexión automática
        reconnectRealtime();
      })
      .subscribe((status) => {
        console.log('[Realtime] Estado de suscripción:', status);
        if (status === 'SUBSCRIBED') {
          console.log('[Realtime] Suscripción exitosa');
          setIsRealtimeConnected(true);
          setRealtimeError(null);
          stopPolling(); // Detener polling si Realtime funciona
        } else if (status === 'CHANNEL_ERROR') {
          console.error('[Realtime] Error en canal');
          setIsRealtimeConnected(false);
          setRealtimeError('Error de canal');
          
          // Cambiar a polling
          if (!usePolling) {
            startPolling();
          }
        } else if (status === 'TIMED_OUT') {
          console.error('[Realtime] Timeout de conexión');
          setIsRealtimeConnected(false);
          setRealtimeError('Timeout de conexión');
          
          // Cambiar a polling
          if (!usePolling) {
            startPolling();
          }
        }
      });
    
    return () => {
      console.log(`[Realtime] Desuscribiendo canal: messages-chat-${chat.id}`);
      supabase.removeChannel(channel);
      stopPolling();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [chat?.id, isArtificial, user?.id, usePolling, startPolling, stopPolling, reconnectRealtime]);

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
        .eq('chat_id', chat.id as any)
        .eq('read_at', null)
        .neq('sender_id', user.id as any);
      if (unreadMessages && Array.isArray(unreadMessages) && unreadMessages.length > 0) {
        const ids = unreadMessages.map((m: any) => m.id);
        await supabase
          .from('messages')
          .update({ read_at: new Date().toISOString() } as any)
          .in('id', ids as any);
        // Refrescar mensajes
        const { data: refreshed } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chat.id as any)
          .order('created_at', { ascending: true });
        let validRefreshed: Message[] = [];
        if (Array.isArray(refreshed)) {
          validRefreshed = refreshed.filter((msg: any) =>
            msg && typeof msg === 'object' &&
            !('error' in msg) &&
            'id' in msg && 'chat_id' in msg && 'sender_id' in msg && 'content' in msg && 'created_at' in msg
          );
        }
        setMessages(validRefreshed);
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
          .eq('id', profileId as any)
          .single();
        if (!profileData || (profileData as any).error) {
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
        const otherId = isArtificialProfile ? (profileData as any).id : (profileData as any).user_id;

        if (isArtificialProfile) {
          // Buscar o crear chat artificial en ai_chats (sin cambios)
          let aiChat: AIChat | null = null;
          const { data: existingAiChat } = await supabase
            .from('ai_chats' as any)
            .select('*')
            .eq('user_id', user.id as any)
            .eq('profile_id', profileId as any)
            .single();
          if (existingAiChat && !(existingAiChat as any).error) {
            aiChat = existingAiChat as unknown as AIChat;
          } else {
            const { data: newAiChat, error: aiChatError } = await supabase
              .from('ai_chats' as any)
              .insert({ user_id: user.id, profile_id: profileId, messages: [] } as any)
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
          if (Array.isArray(existingChats)) {
            const validChats = existingChats.filter((chat: any) => chat && typeof chat === 'object' && !('error' in chat) && 'user1_id' in chat && 'user2_id' in chat);
            chatData = validChats.find((chat: any) =>
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
              .insert({ user1_id: myUserId, user2_id: otherId } as any)
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
              .eq('chat_id', chatData.id as any)
              .order('created_at', { ascending: true });
            if (messagesError) {
              console.error('[Chat] Error cargando mensajes:', messagesError);
            }
            let validMessages: Message[] = [];
            if (Array.isArray(messagesData)) {
              validMessages = messagesData.filter((msg: any) =>
                msg && typeof msg === 'object' &&
                !('error' in msg) &&
                'id' in msg && 'chat_id' in msg && 'sender_id' in msg && 'content' in msg && 'created_at' in msg
              );
            }
            console.log('[Chat] Mensajes cargados:', validMessages.length);
            setMessages(validMessages);
            // Guardar timestamp del último mensaje para polling
            if (validMessages.length > 0) {
              lastMessageTimestampRef.current = validMessages[validMessages.length - 1].created_at;
            }
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

  // Redirigir a premium si el usuario no es premium
  useEffect(() => {
    if (!isLoading && isAuthenticated && user && !user.isPremium) {
      toast({
        title: 'Funcionalidad Premium',
        description: 'Necesitas ser usuario premium para chatear.',
        variant: 'destructive',
      });
      navigate('/premium');
    }
  }, [isLoading, isAuthenticated, user, navigate, toast]);

  // Debug: log ids relevantes
  useEffect(() => {
    console.log('[Debug] user.id:', user?.id, 'profileId:', profileId, 'chat?.id:', chat?.id, 'isArtificial:', isArtificial);
  }, [user?.id, profileId, chat?.id, isArtificial]);

  // Función para recargar mensajes manualmente
  const reloadMessages = async () => {
    if (!chat?.id || isArtificial) return;
    
    try {
      console.log('[Reload] Recargando mensajes para chat:', chat.id);
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chat.id as any)
        .order('created_at', { ascending: true });
      if (messagesError) {
        console.error('[Reload] Error recargando mensajes:', messagesError);
        return;
      }
      let validMessages: Message[] = [];
      if (Array.isArray(messagesData)) {
        validMessages = messagesData.filter((msg: any) =>
          msg && typeof msg === 'object' &&
          !('error' in msg) &&
          'id' in msg && 'chat_id' in msg && 'sender_id' in msg && 'content' in msg && 'created_at' in msg
        );
      }
      console.log('[Reload] Mensajes recargados:', validMessages.length);
      setMessages(validMessages);
      // Actualizar timestamp del último mensaje
      if (validMessages.length > 0) {
        lastMessageTimestampRef.current = validMessages[validMessages.length - 1].created_at;
      }
    } catch (error) {
      console.error('[Reload] Error inesperado recargando mensajes:', error);
    }
  };

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
          .update({ messages: updatedMessages } as any)
          .eq('id', (chat as any).id as any);
                 // No enviar respuesta automática - el usuario artificial no responde
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
          } as any);
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
        try {
          console.log('[Chat] Actualizando last_message_at para chat:', chat?.id);
          const { error: updateError } = await supabase
            .from('chats')
            .update({ last_message_at: new Date().toISOString() } as any)
            .eq('id', chat?.id as any);
          if (updateError) {
            console.error('[Chat] Error actualizando last_message_at:', updateError);
            // No mostrar error al usuario, solo log
          } else {
            console.log('[Chat] last_message_at actualizado exitosamente');
          }
        } catch (updateError) {
          console.error('[Chat] Error inesperado actualizando chat:', updateError);
        }
        // Si no está conectado a Realtime, recargar mensajes inmediatamente
        if (!isRealtimeConnected && !isArtificial) {
          setTimeout(() => {
            loadMessages();
          }, 500);
        }
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

  // Limpiar intervalos al desmontar
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

     return (
     <div className="h-screen bg-gradient-to-br from-[#1a1440] via-[#2a0a3c] to-[#0a1033] flex flex-col overflow-hidden">
       {/* Header con botón de volver - FIXED */}
       <div className="flex items-center p-4 border-b border-cosmic-gold/30 bg-white/5 backdrop-blur-md flex-shrink-0">
         <button
           onClick={() => navigate('/home')}
           className="flex items-center gap-2 text-cosmic-gold hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-cosmic-gold rounded-full p-2"
           tabIndex={0}
           aria-label="Volver a Home"
         >
           <ArrowLeft className="h-6 w-6" />
           <span className="font-semibold hidden sm:inline">Volver</span>
         </button>
                   <button
            onClick={() => navigate(`/profile/${profile?.id}`)}
            className="text-xl text-white ml-4 font-bold drop-shadow hover:text-cosmic-gold transition-colors cursor-pointer"
            tabIndex={0}
            aria-label={`Ver perfil de ${profile?.name}`}
          >
            {profile?.name || ''}
          </button>
         
         {/* Indicador de estado de conexión */}
         <div className="ml-auto flex items-center gap-2">
           {!isArtificial && (
             <>
               <div className="flex items-center gap-1 text-xs">
                 {isRealtimeConnected ? (
                   <Wifi className="h-4 w-4 text-green-400" />
                 ) : (
                   <WifiOff className="h-4 w-4 text-yellow-400" />
                 )}
                 <span className={`text-xs ${isRealtimeConnected ? 'text-green-400' : 'text-yellow-400'}`}>
                   {isRealtimeConnected ? 'En línea' : usePolling ? 'Sincronizando...' : 'Desconectado'}
                 </span>
               </div>
               <button
                 onClick={reloadMessages}
                 className="flex items-center gap-2 text-cosmic-gold hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-cosmic-gold rounded-full p-2"
                 tabIndex={0}
                 aria-label="Recargar mensajes"
               >
                 <RefreshCw className="h-5 w-5" />
                 <span className="font-semibold hidden sm:inline">Recargar</span>
               </button>
             </>
           )}
         </div>
       </div>

       {/* Área de mensajes - SCROLLABLE */}
       <div className="flex-1 overflow-hidden p-4">
         <ScrollArea className="h-full">
           {messages.map((message) => (
             <div
               key={message.id}
               className={`flex mb-4 ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
             >
                               {message.sender_id !== user?.id && (
                  <Avatar className="mr-2 w-8 h-8">
                    <AvatarImage src={profile?.photo_url} />
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

       {/* Input de mensaje mejorado - FIXED */}
       <div className="p-4 border-t border-cosmic-gold/30 bg-white/5 backdrop-blur-md flex-shrink-0">
         {user?.isPremium ? (
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
         ) : (
           <div className="w-full text-center text-cosmic-gold font-semibold py-4">
             Debes ser <span className="text-cosmic-magenta font-bold">usuario premium</span> para enviar mensajes.
           </div>
         )}
       </div>
     </div>
   );
};

export default ChatInterface;