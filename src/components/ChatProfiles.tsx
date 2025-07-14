
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatProfileCard } from './ChatProfileCard';
import { useAuth } from './AuthProvider';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, Sparkles } from 'lucide-react';

interface ChatProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  description: string;
  personality: string;
  interests: string[];
  avatar_url?: string;
  zodiac_sign: string;
  compatibility_score: number;
  gender?: string;
}

interface UserProfile {
  gender?: string;
  sexual_preference?: string;
}

interface ChatProfilesProps {
  onStartChat: (profileId: string, profileName: string) => void;
}

export const ChatProfiles = ({ onStartChat }: ChatProfilesProps) => {
  const [profiles, setProfiles] = useState<ChatProfile[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [hasGenderSupport, setHasGenderSupport] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  useEffect(() => {
    if (userProfile !== null) {
      fetchProfiles();
    }
  }, [userProfile, selectedFilter]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      // Try to fetch with new gender fields first
      const { data, error }: any = await supabase
        .from('profiles')
        .select('gender, sexual_preference')
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.message?.includes('column')) {
        // If gender column doesn't exist yet, set empty profile and disable gender features
        console.log('Gender features not available yet (migration pending)');
        setUserProfile({});
        setHasGenderSupport(false);
        return;
      }

      setUserProfile(data || {});
      setHasGenderSupport(true);
    } catch (error) {
      console.error('Unexpected error:', error);
      setUserProfile({});
      setHasGenderSupport(false);
    }
  };

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      
      if (hasGenderSupport && userProfile?.gender && userProfile?.sexual_preference) {
        // Try to use the new filtered function
        try {
          const { data, error }: any = await (supabase as any).rpc('get_compatible_profiles', {
            user_gender: userProfile.gender,
            user_preference: selectedFilter === 'all' ? userProfile.sexual_preference : selectedFilter
          });

          if (!error && data) {
            setProfiles(data);
            return;
          }
        } catch (rpcError) {
          console.log('RPC function not available yet, falling back to regular query');
        }
      }

      // Fallback to regular query if RPC is not available or user hasn't set preferences
      const { data, error } = await supabase
        .from('chat_profiles')
        .select('*')
        .eq('is_active', true)
        .order('compatibility_score', { ascending: false });

      if (error) {
        console.error('Error fetching profiles:', error);
        toast({
          title: "Error cósmico 🌙",
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

  const getFilterOptions = () => {
    if (!hasGenderSupport || !userProfile?.sexual_preference) return [];

    const options = [
      { value: 'all', label: 'Todas mis preferencias', emoji: '💫', description: 'Según tu preferencia cósmica' }
    ];

    if (userProfile.sexual_preference === 'ambos') {
      options.push(
        { value: 'masculino', label: 'Solo Masculino', emoji: '♂️', description: 'Energía masculina' },
        { value: 'femenino', label: 'Solo Femenino', emoji: '♀️', description: 'Energía femenina' }
      );
    }

    return options;
  };

  if (loading) {
    return (
      <div className="space-y-3 sm:space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card p-3 sm:p-4 animate-pulse">
            <div className="flex space-x-3 sm:space-x-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                <div className="h-3 bg-white/10 rounded w-1/2"></div>
                <div className="h-8 bg-white/10 rounded w-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const filterOptions = getFilterOptions();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="flex items-center justify-center space-x-1 sm:space-x-2">
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">Tu Alma Gemela te Espera</h2>
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
        </div>
        
        <p className="text-sm text-white/70 px-2">
          Hemos encontrado <span className="text-purple-300 font-semibold">{profiles.length}</span> perfiles compatibles con tu energía cósmica
        </p>

        {/* Filter Options - Mobile Optimized */}
        {filterOptions.length > 1 && (
          <div className="space-y-2 sm:space-y-3 px-2">
            <div className="flex items-center justify-center space-x-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-white/80 text-xs sm:text-sm font-medium">Filtrar por energía:</span>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2">
              {filterOptions.map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFilter(option.value)}
                  className={`border-2 transition-all duration-300 text-xs sm:text-sm px-3 py-2 h-auto ${
                    selectedFilter === option.value
                      ? 'border-purple-400 bg-purple-500/20 text-purple-200'
                      : 'border-white/30 bg-white/5 text-white/70 hover:border-purple-300 hover:bg-white/10'
                  }`}
                >
                  <span className="mr-1 sm:mr-2">{option.emoji}</span>
                  <span className="truncate">{option.label}</span>
                </Button>
              ))}
            </div>
            
            {selectedFilter !== 'all' && (
              <div className="text-center px-2">
                <Badge variant="outline" className="border-blue-400/50 text-blue-300 bg-blue-400/10 text-xs">
                  Mostrando: {filterOptions.find(opt => opt.value === selectedFilter)?.description}
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* User Profile Info - Mobile Optimized */}
        {hasGenderSupport && userProfile?.gender && userProfile?.sexual_preference && (
          <div className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 mx-2">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-blue-300">Tu energía:</span>
                <Badge variant="outline" className="border-blue-400/50 text-blue-300 text-xs">
                  {userProfile.gender === 'masculino' ? '♂️ Masculino' : 
                   userProfile.gender === 'femenino' ? '♀️ Femenino' : '✨ Otro'}
                </Badge>
              </div>
              <div className="hidden sm:block w-1 h-4 bg-white/30 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <span className="text-pink-300">Buscas:</span>
                <Badge variant="outline" className="border-pink-400/50 text-pink-300 text-xs">
                  {userProfile.sexual_preference === 'masculino' ? '♂️ Masculino' :
                   userProfile.sexual_preference === 'femenino' ? '♀️ Femenino' : '💫 Ambos'}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {profiles.length === 0 ? (
        <div className="text-center space-y-3 sm:space-y-4 py-6 sm:py-8 px-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center opacity-50">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-semibold text-white">No hay matches disponibles</h3>
            <p className="text-sm text-white/70 px-2">
              Las estrellas están preparando nuevas conexiones para ti... ✨
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4 px-2 sm:px-0">
          {profiles.map((profile) => (
            <ChatProfileCard
              key={profile.id}
              profile={profile}
              onStartChat={handleStartChat}
            />
          ))}
        </div>
      )}
    </div>
  );
};
