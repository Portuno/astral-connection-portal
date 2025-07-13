
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
  zodiac_sign: string;
  compatibility_score: number;
}

interface ChatProfileCardProps {
  profile: ChatProfile;
  onStartChat: (profileId: string) => void;
}

export const ChatProfileCard = ({ profile, onStartChat }: ChatProfileCardProps) => {
  return (
    <Card className="glass-card p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white">{profile.name}</h3>
          <p className="text-sm text-white/70">{profile.age} años • {profile.location}</p>
        </div>
        <Badge variant="secondary" className="bg-purple-500/20 text-purple-200">
          {profile.compatibility_score}% compatible
        </Badge>
      </div>
      
      <p className="text-sm text-white/80 line-clamp-3">{profile.description}</p>
      
      <div className="space-y-2">
        <p className="text-xs text-white/60 font-medium">Signo: {profile.zodiac_sign}</p>
        <div className="flex flex-wrap gap-1">
          {profile.interests.slice(0, 3).map((interest, index) => (
            <Badge key={index} variant="outline" className="text-xs border-white/30 text-white/70">
              {interest}
            </Badge>
          ))}
          {profile.interests.length > 3 && (
            <Badge variant="outline" className="text-xs border-white/30 text-white/70">
              +{profile.interests.length - 3}
            </Badge>
          )}
        </div>
      </div>
      
      <Button 
        onClick={() => onStartChat(profile.id)}
        className="w-full stellar-button"
      >
        Iniciar Chat ✨
      </Button>
    </Card>
  );
};
