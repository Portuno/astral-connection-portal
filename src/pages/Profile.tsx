import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { Profile } from "@/data/mockProfiles";
import { Sparkles, MapPin, Calendar, Sun, Moon, Navigation, Heart } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// Extender el tipo Profile para permitir hasta 4 fotos
interface ProfileWithGallery extends Profile {
  gallery?: string[]; // URLs de fotos adicionales
}

const ProfilePage = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileWithGallery | null>(null);

  useEffect(() => {
    if (!profileId) return;
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();
      if (data) {
        setProfile({
          ...data,
          gallery: data.photo_url ? [data.photo_url, data.photo_url, data.photo_url, data.photo_url] : [],
        });
      }
    };
    fetchProfile();
  }, [profileId]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-cosmic-blue flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-white mb-4">Perfil no encontrado</h2>
          <Button onClick={() => navigate('/home')} variant="outline">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic-blue flex flex-col items-center py-8 px-4">
      <Card className="w-full max-w-xl bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="flex flex-col items-center gap-2">
          <Avatar className="w-20 h-20 border-2 border-cosmic-gold/30">
            <AvatarImage src={profile.photo_url || undefined} alt={profile.name} />
            <AvatarFallback className="bg-cosmic-magenta text-white font-bold">
              {profile.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-white text-2xl mt-2">{profile.name}</CardTitle>
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar className="w-4 h-4" />
            <span>{profile.age} años</span>
            <MapPin className="w-4 h-4 ml-2" />
            <span>{profile.location}</span>
          </div>
          <Badge className="bg-cosmic-gold/20 text-cosmic-gold text-xs mt-2">
            {profile.compatibility_score}% compatible
          </Badge>
        </CardHeader>
        <CardContent>
          {/* Galería de fotos */}
          {profile.gallery && profile.gallery.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {profile.gallery.slice(0, 4).map((url, idx) => (
                <AspectRatio key={idx} ratio={1} className="rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={url}
                    alt={`Foto ${idx + 1} de ${profile.name}`}
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
              ))}
            </div>
          )}
          {/* Info astrológica */}
          <div className="flex flex-wrap gap-4 mb-4 justify-center">
            <div className="flex items-center gap-2 text-sm text-gray-200">
              <Sun className="w-4 h-4 text-cosmic-gold" />
              <span>Sol: {profile.sign}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-200">
              <Moon className="w-4 h-4 text-cosmic-magenta" />
              <span>Luna: {profile.moon_sign}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-200">
              <Navigation className="w-4 h-4 text-cosmic-blue" />
              <span>Ascendente: {profile.rising_sign}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-200">
              <Heart className="w-4 h-4 text-red-400" />
              <span>Busca: {profile.lookingFor}</span>
            </div>
          </div>
          {/* Descripción */}
          <p className="text-gray-100 text-base mb-4 text-center whitespace-pre-line">
            {profile.description}
          </p>
        </CardContent>
      </Card>
      <Button onClick={() => navigate('/home')} className="mt-8" variant="outline">
        Volver a perfiles
      </Button>
    </div>
  );
};

export default ProfilePage; 