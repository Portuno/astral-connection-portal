import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Search, Plus, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';
import { useToast } from '@/components/ui/use-toast';

interface ChatConversation {
  id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_avatar?: string;
  last_message: string;
  last_message_date: string;
  unread_count: number;
  is_active: boolean;
}

interface UserChatsListProps {
  onSelectChat: (userId: string, userName: string, userAvatar?: string) => void;
  onNewChat: () => void;
}

export const UserChatsList = ({ onSelectChat, onNewChat }: UserChatsListProps) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadConversations();
      setupRealtimeSubscription();
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Obtener conversaciones con información del otro usuario
      const { data: convs, error } = await supabase
        .from('user_conversations')
        .select(`
          id,
          user1_id,
          user2_id,
          last_message,
          last_message_date,
          is_active,
          profiles!user_conversations_user1_id_fkey (
            id,
            name,
            email
          ),
          profiles_user2:profiles!user_conversations_user2_id_fkey (
            id,
            name,
            email
          )
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .eq('is_active', true)
        .order('last_message_date', { ascending: false });

      if (error) {
        console.error('Error loading conversations:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las conversaciones.",
          variant: "destructive"
        });
        return;
      }

      if (convs) {
        // Procesar conversaciones para obtener información del otro usuario
        const processedConversations = await Promise.all(
          convs.map(async (conv: any) => {
            const otherUserId = conv.user1_id === user.id ? conv.user2_id : conv.user1_id;
            const otherUserProfile = conv.user1_id === user.id ? conv.profiles_user2 : conv.profiles;

            // Contar mensajes no leídos
            const { count: unreadCount } = await supabase
              .from('user_messages')
              .select('*', { count: 'exact', head: true })
              .eq('conversation_id', conv.id)
              .eq('is_read', false)
              .neq('sender_id', user.id);

            return {
              id: conv.id,
              other_user_id: otherUserId,
              other_user_name: otherUserProfile?.name || otherUserProfile?.email || 'Usuario',
              other_user_avatar: undefined, // Podrías agregar avatars en el futuro
              last_message: conv.last_message || 'Sin mensajes',
              last_message_date: conv.last_message_date,
              unread_count: unreadCount || 0,
              is_active: conv.is_active
            } as ChatConversation;
          })
        );

        setConversations(processedConversations);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "Error inesperado al cargar conversaciones.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const channel = supabase
      .channel(`user-conversations-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_conversations',
          filter: `user1_id=eq.${user.id}`
        },
        () => {
          loadConversations();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_conversations',
          filter: `user2_id=eq.${user.id}`
        },
        () => {
          loadConversations();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_messages'
        },
        () => {
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const formatLastMessageTime = (timestamp: string) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInHours < 1) {
      return 'Ahora';
    } else if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInDays < 7) {
      return messageDate.toLocaleDateString('es-ES', {
        weekday: 'short'
      });
    } else {
      return messageDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit'
      });
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.other_user_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <div className="h-10 bg-white/20 rounded-lg animate-pulse"></div>
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="glass-card p-4 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                <div className="h-3 bg-white/10 rounded w-1/2"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/20 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Conversaciones</h2>
          <Button
            onClick={onNewChat}
            size="sm"
            className="stellar-button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar conversaciones..."
            className="bg-white/10 border-white/30 text-white placeholder:text-white/50 pl-10"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <MessageCircle className="h-16 w-16 text-white/30 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              {searchTerm ? 'No se encontraron conversaciones' : 'No tienes conversaciones aún'}
            </h3>
            <p className="text-white/70 mb-6 max-w-xs">
              {searchTerm 
                ? 'Intenta con otro término de búsqueda' 
                : 'Inicia una nueva conversación para conectar con otros usuarios'}
            </p>
            {!searchTerm && (
              <Button
                onClick={onNewChat}
                className="stellar-button"
              >
                <Plus className="h-4 w-4 mr-2" />
                Iniciar conversación
              </Button>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredConversations.map((conversation) => (
              <Card
                key={conversation.id}
                className="glass-card p-4 cursor-pointer hover:bg-white/20 transition-all duration-200 active:scale-95"
                onClick={() => onSelectChat(
                  conversation.other_user_id,
                  conversation.other_user_name,
                  conversation.other_user_avatar
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {conversation.other_user_avatar ? (
                      <img 
                        src={conversation.other_user_avatar} 
                        alt={conversation.other_user_name}
                        className="w-12 h-12 rounded-full object-cover border border-white/20"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                    )}
                    {conversation.unread_count > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">
                          {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white truncate">
                        {conversation.other_user_name}
                      </h3>
                      <span className="text-xs text-white/60 flex-shrink-0">
                        {formatLastMessageTime(conversation.last_message_date)}
                      </span>
                    </div>
                    <p className={`text-sm truncate mt-1 ${
                      conversation.unread_count > 0 ? 'text-white font-medium' : 'text-white/70'
                    }`}>
                      {conversation.last_message}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 