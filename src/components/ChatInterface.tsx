
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  message: string;
  sender_type: 'user' | 'profile';
  created_at: string;
}

interface ChatInterfaceProps {
  profileId: string;
  profileName: string;
  onBack: () => void;
}

export const ChatInterface = ({ profileId, profileName, onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && profileId) {
      initializeChat();
    }
  }, [user, profileId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async () => {
    if (!user) return;

    try {
      // Get conversation
      const { data: conversation, error: convError } = await supabase
        .from('chat_conversations')
        .select('id')
        .eq('user_id', user.id)
        .eq('profile_id', profileId)
        .maybeSingle();

      if (convError) {
        console.error('Error fetching conversation:', convError);
        return;
      }

      if (!conversation) {
        console.error('Conversation not found');
        return;
      }

      setConversationId(conversation.id);

      // Load initial message if no messages exist
      const { data: existingMessages, error: msgError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true });

      if (msgError) {
        console.error('Error fetching messages:', msgError);
        return;
      }

      if (!existingMessages || existingMessages.length === 0) {
        // Create initial message from profile
        const initialMessage = `¡Hola! Me encantaría conocerte mejor. Las estrellas nos han conectado por algo especial... ✨ Cuéntame, ¿qué te ha traído hasta aquí?`;
        
        const { data: newMsg, error: insertError } = await supabase
          .from('chat_messages')
          .insert({
            conversation_id: conversation.id,
            sender_type: 'profile',
            message: initialMessage
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating initial message:', insertError);
        } else {
          setMessages([newMsg]);
        }
      } else {
        setMessages(existingMessages);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversationId || sending) return;

    setSending(true);
    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      // Add user message
      const { data: userMessage, error: userError } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_type: 'user',
          message: messageText
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
        setNewMessage(messageText);
        return;
      }

      setMessages(prev => [...prev, userMessage]);

      // Simulate profile response
      setTimeout(async () => {
        const responses = [
          "¡Qué interesante! Las estrellas me susurran que tienes una energía muy especial... 🌟",
          "Me encanta tu perspectiva. Siento una conexión cósmica muy fuerte contigo ✨",
          "Las constelaciones me dicen que tenemos mucho en común. Cuéntame más sobre ti 💫",
          "Tu aura brilla con una luz única. ¿Has sentido alguna vez esta conexión astral? 🌙",
          "Los planetas se han alineado para nuestro encuentro. Es fascinante conocerte 🪐"
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        const { data: profileMessage, error: profileError } = await supabase
          .from('chat_messages')
          .insert({
            conversation_id: conversationId,
            sender_type: 'profile',
            message: randomResponse
          })
          .select()
          .single();

        if (!profileError) {
          setMessages(prev => [...prev, profileMessage]);
        }
      }, 1000 + Math.random() * 2000);

    } catch (error) {
      console.error('Unexpected error:', error);
      setNewMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-6 bg-white/20 rounded w-32 animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card p-3 animate-pulse">
              <div className="h-4 bg-white/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/20">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-white">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="font-semibold text-white">{profileName}</h3>
          <p className="text-xs text-white/60">En línea</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card className={`max-w-[80%] p-3 ${
              message.sender_type === 'user' 
                ? 'bg-purple-600/80 text-white' 
                : 'glass-card text-white'
            }`}>
              <p className="text-sm">{message.message}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(message.created_at).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </Card>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/20">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje..."
            className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
            disabled={sending}
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className="stellar-button px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
