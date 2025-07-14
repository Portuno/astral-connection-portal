import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Send, Image, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';
import { useToast } from '@/components/ui/use-toast';

interface UserMessage {
  id: string;
  message_content: string;
  message_type: 'text' | 'image';
  image_url?: string;
  sender_id: string;
  is_read: boolean;
  created_at: string;
}

interface UserChatInterfaceProps {
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar?: string;
  onBack: () => void;
}

export const UserChatInterface = ({ 
  otherUserId, 
  otherUserName, 
  otherUserAvatar,
  onBack 
}: UserChatInterfaceProps) => {
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && otherUserId) {
      initializeChat();
    }
  }, [user, otherUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (conversationId) {
      markMessagesAsRead();
    }
  }, [conversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Obtener o crear conversación
      const { data: convId, error: convError } = await supabase.rpc(
        'get_or_create_user_conversation',
        { other_user_id: otherUserId }
      );

      if (convError) {
        console.error('Error getting conversation:', convError);
        toast({
          title: "Error",
          description: "No se pudo inicializar el chat.",
          variant: "destructive"
        });
        return;
      }

      setConversationId(convId);

      // Cargar mensajes existentes
      const { data: existingMessages, error: msgError } = await supabase
        .from('user_messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (msgError) {
        console.error('Error fetching messages:', msgError);
        return;
      }

      if (existingMessages) {
        setMessages(existingMessages as UserMessage[]);
      }

      // Suscribirse a nuevos mensajes
      const channel = supabase
        .channel(`conversation-${convId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'user_messages',
            filter: `conversation_id=eq.${convId}`
          },
          (payload) => {
            const newMessage = payload.new as UserMessage;
            setMessages(prev => [...prev, newMessage]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };

    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "Error inesperado al inicializar el chat.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    if (!conversationId || !user) return;

    try {
      await supabase.rpc('mark_messages_as_read', {
        conversation_id_param: conversationId
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user) return null;

    try {
      setUploading(true);
      const fileName = `${user.id}/${Date.now()}_${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('chat-images')
        .upload(fileName, file);

      if (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Error",
          description: "No se pudo subir la imagen.",
          variant: "destructive"
        });
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('chat-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Unexpected error uploading image:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const sendMessage = async (messageType: 'text' | 'image' = 'text') => {
    if (!conversationId || sending || uploading) return;
    
    let messageContent = '';
    let imageUrl = null;

    if (messageType === 'text') {
      if (!newMessage.trim()) return;
      messageContent = newMessage.trim();
    } else if (messageType === 'image') {
      if (!selectedImage) return;
      imageUrl = await uploadImage(selectedImage);
      if (!imageUrl) return;
      messageContent = 'Imagen enviada';
    }

    setSending(true);

    try {
      const { data: userMessage, error: userError } = await supabase
        .from('user_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user?.id,
          message_type: messageType,
          message_content: messageContent,
          image_url: imageUrl
        })
        .select()
        .single();

      if (userError) {
        console.error('Error sending message:', userError);
        toast({
          title: "Error",
          description: "No se pudo enviar el mensaje.",
          variant: "destructive"
        });
        return;
      }

      // Limpiar campos
      if (messageType === 'text') {
        setNewMessage('');
      } else {
        clearImageSelection();
      }

      // Actualizar última actividad de la conversación
      await supabase
        .from('user_conversations')
        .update({
          last_message: messageContent,
          last_message_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);

    } catch (error) {
      console.error('Unexpected error sending message:', error);
      toast({
        title: "Error",
        description: "Error inesperado al enviar mensaje.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Archivo inválido",
        description: "Solo se permiten archivos de imagen.",
        variant: "destructive"
      });
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Archivo muy grande",
        description: "La imagen debe ser menor a 5MB.",
        variant: "destructive"
      });
      return;
    }

    setSelectedImage(file);
    
    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImageSelection = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage('text');
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return messageDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="flex items-center gap-3 p-4 border-b border-white/20">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-6 bg-white/20 rounded w-32 animate-pulse"></div>
        </div>
        <div className="flex-1 p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass-card p-3 animate-pulse">
              <div className="h-4 bg-white/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/20 bg-black/20 backdrop-blur-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/10">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3 flex-1">
          {otherUserAvatar && (
            <img 
              src={otherUserAvatar} 
              alt={otherUserName}
              className="w-8 h-8 rounded-full object-cover border border-white/20"
            />
          )}
          <div>
            <h3 className="font-semibold text-white text-sm">{otherUserName}</h3>
            <p className="text-xs text-green-400">En línea</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] ${
              message.sender_id === user?.id ? 'order-2' : 'order-1'
            }`}>
              <Card className={`p-3 ${
                message.sender_id === user?.id 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white ml-auto' 
                  : 'glass-card text-white'
              }`}>
                {message.message_type === 'text' ? (
                  <p className="text-sm break-words">{message.message_content}</p>
                ) : (
                  <div className="space-y-2">
                    {message.image_url && (
                      <img 
                        src={message.image_url} 
                        alt="Imagen enviada"
                        className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(message.image_url, '_blank')}
                      />
                    )}
                    <p className="text-xs opacity-75">{message.message_content}</p>
                  </div>
                )}
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs opacity-70">
                    {formatMessageTime(message.created_at)}
                  </p>
                  {message.sender_id === user?.id && (
                    <span className="text-xs opacity-70">
                      {message.is_read ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </Card>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="p-4 border-t border-white/20 bg-black/20">
          <div className="relative inline-block">
            <img 
              src={imagePreview} 
              alt="Preview"
              className="max-h-20 rounded-lg"
            />
            <Button
              onClick={clearImageSelection}
              size="sm"
              variant="destructive"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
            >
              <X className="h-3 w-3" />
            </Button>
            <Button
              onClick={() => sendMessage('image')}
              disabled={uploading}
              className="ml-2 stellar-button"
              size="sm"
            >
              {uploading ? 'Subiendo...' : 'Enviar imagen'}
            </Button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-white/20 bg-black/20 backdrop-blur-sm">
        <div className="flex gap-2 items-end">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            size="sm"
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 flex-shrink-0"
            disabled={sending || uploading}
          >
            <Image className="h-4 w-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje..."
            className="bg-white/10 border-white/30 text-white placeholder:text-white/50 flex-1"
            disabled={sending || uploading}
          />
          <Button
            onClick={() => sendMessage('text')}
            disabled={!newMessage.trim() || sending || uploading}
            className="stellar-button px-3 flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}; 