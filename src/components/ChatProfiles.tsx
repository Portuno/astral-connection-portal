
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatProfileCard } from './ChatProfileCard';
import { useAuth } from './AuthProvider';
import { useToast } from '@/components/ui/use-toast';

interface ChatProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  description: string;
  personality: string;
  interests: string[];
  zodiac_sign: string;
  compatibility_score: number;
}

interface ChatProfilesProps {
  onStartChat: (profileId: string, profileName: string) => void;
}

export const ChatProfiles = ({ onStartChat }: ChatProfilesProps) => {
  const [profiles, setProfiles] = useState<ChatProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_profiles')
        .select('*')
        .eq('is_active', true)
        .order('compatibility_score', { ascending: false });

      if (error) {
        console.error('Error fetching profiles:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los perfiles. Inténtalo de nuevo.",
          variant: "destructive"
        });
        return;
      }

      setProfiles(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async (profileId: string) => {
    if (!user) return;

    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return;

    try {
      // Check if conversation already exists
      const { data: existingConversation } = await supabase
        .from('chat_conversations')
        .select('id')
        .eq('user_id', user.id)
        .eq('profile_id', profileId)
        .maybeSingle();

      if (existingConversation) {
        onStartChat(profileId, profile.name);
        return;
      }

      // Create new conversation
      const { error } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: user.id,
          profile_id: profileId,
          last_message: `¡Hola! Me encantaría conocerte mejor. Las estrellas nos han conectado por algo especial... ✨`,
          last_message_date: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating conversation:', error);
        toast({
          title: "Error",
          description: "No se pudo iniciar el chat. Inténtalo de nuevo.",
          variant: "destructive"
        });
        return;
      }

      onStartChat(profileId, profile.name);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "Algo salió mal. Inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card p-4 animate-pulse">
            <div className="h-4 bg-white/20 rounded mb-2"></div>
            <div className="h-3 bg-white/10 rounded mb-3"></div>
            <div className="h-8 bg-white/10 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-white">Tu Alma Gemela te Espera</h2>
        <p className="text-white/70 text-sm">
          Hemos encontrado {profiles.length} perfiles compatibles con tu carta astral
        </p>
      </div>
      
      <div className="grid gap-4">
        {profiles.map((profile) => (
          <ChatProfileCard
            key={profile.id}
            profile={profile}
            onStartChat={handleStartChat}
          />
        ))}
      </div>
    </div>
  );
};
