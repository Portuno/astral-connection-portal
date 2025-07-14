
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

interface ChatProfileCardProps {
  profile: ChatProfile;
  onStartChat: (profileId: string) => void;
}

export const ChatProfileCard = ({ profile, onStartChat }: ChatProfileCardProps) => {
  const getGenderEmoji = (gender?: string) => {
    switch (gender) {
      case 'masculino': return '♂️';
      case 'femenino': return '♀️';
      default: return '✨';
    }
  };

  return (
    <Card className="glass-card p-3 sm:p-4 space-y-3 sm:space-y-4 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2 border-white/10 hover:border-white/30">
      <div className="flex items-start space-x-3 sm:space-x-4">
        {/* Profile Image */}
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
            {profile.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=667eea&color=fff&size=64`;
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-base sm:text-lg">
                {profile.name.charAt(0)}
              </div>
            )}
          </div>
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-400 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-600 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <h3 className="text-base sm:text-lg font-semibold text-white truncate">{profile.name}</h3>
                <span className="text-sm sm:text-base flex-shrink-0">{getGenderEmoji(profile.gender)}</span>
              </div>
              <p className="text-xs sm:text-sm text-white/70 truncate">{profile.age} años • {profile.location}</p>
            </div>
            <Badge variant="secondary" className="bg-purple-500/30 text-purple-200 border border-purple-400/50 text-xs px-2 py-1 flex-shrink-0">
              {profile.compatibility_score}% ✨
            </Badge>
          </div>

          {/* Zodiac Sign */}
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs border-yellow-400/50 text-yellow-300 bg-yellow-400/10 px-2 py-0.5">
              {profile.zodiac_sign} ♈
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Description - Mobile Optimized */}
      <p className="text-xs sm:text-sm text-white/80 line-clamp-2 sm:line-clamp-3 leading-relaxed">{profile.description}</p>
      
      {/* Interests - Mobile Optimized */}
      <div className="space-y-1 sm:space-y-2">
        <p className="text-xs text-white/60 font-medium">Intereses cósmicos:</p>
        <div className="flex flex-wrap gap-1">
          {profile.interests.slice(0, 3).map((interest, index) => (
            <Badge key={index} variant="outline" className="text-xs border-white/30 text-white/70 bg-white/5 px-2 py-0.5">
              {interest}
            </Badge>
          ))}
          {profile.interests.length > 3 && (
            <Badge variant="outline" className="text-xs border-white/30 text-white/70 bg-white/5 px-2 py-0.5">
              +{profile.interests.length - 3}
            </Badge>
          )}
        </div>
      </div>

      {/* Personality - Hidden on mobile to save space */}
      <div className="hidden sm:block space-y-1 sm:space-y-2">
        <p className="text-xs text-white/60 font-medium">Esencia astral:</p>
        <p className="text-xs sm:text-sm text-white/70 italic line-clamp-2">"{profile.personality}"</p>
      </div>
      
      {/* Chat Button - Mobile Optimized */}
      <Button 
        onClick={() => onStartChat(profile.id)}
        className="w-full stellar-button bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2.5 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
      >
        <span className="flex items-center justify-center gap-1 sm:gap-2">
          <span className="text-base sm:text-lg">💫</span>
          <span>Conectar con {profile.name}</span>
        </span>
      </Button>
    </Card>
  );
};
