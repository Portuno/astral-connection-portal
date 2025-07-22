import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { Profile } from "@/data/mockProfiles";
import { Sparkles, MapPin, Calendar, Sun, Moon, Navigation, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Extender el tipo Profile para permitir hasta 4 fotos
interface ProfileWithGallery extends Profile {
  gallery?: string[]; // URLs de fotos adicionales
}

const ProfilePage = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileWithGallery | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState(0);

  useEffect(() => {
    if (!profileId) return;
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();
      if (data) {
        setProfile(data);
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

  // Slider de fotos
  const photos = [profile.photo_url, profile.photo_url_2, profile.photo_url_3].filter(Boolean);

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
          {/* Slider de fotos */}
          {photos.length > 0 && (
            <div className="flex flex-col items-center mb-6 relative">
              <img
                src={photos[currentPhoto]}
                alt={`Foto ${currentPhoto + 1} de ${profile.name}`}
                className="object-cover w-48 h-48 rounded-lg border-2 border-cosmic-magenta"
              />
              {photos.length > 1 && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setCurrentPhoto((currentPhoto - 1 + photos.length) % photos.length)}
                    className="bg-cosmic-magenta text-white rounded-full px-3 py-1"
                    aria-label="Foto anterior"
                  >
                    {"<"}
                  </button>
                  <button
                    onClick={() => setCurrentPhoto((currentPhoto + 1) % photos.length)}
                    className="bg-cosmic-magenta text-white rounded-full px-3 py-1"
                    aria-label="Foto siguiente"
                  >
                    {">"}
                  </button>
                </div>
              )}
              {photos.length > 1 && (
                <div className="flex gap-1 mt-2">
                  {photos.map((_, idx) => (
                    <span
                      key={idx}
                      className={`w-2 h-2 rounded-full ${idx === currentPhoto ? "bg-cosmic-magenta" : "bg-gray-400"}`}
                    />
                  ))}
                </div>
              )}
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
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
        <button
          id="volver-inicio"
          onClick={() => { console.log('Click volver al inicio'); navigate('/home'); }}
          style={{
            background: '#d72660',
            color: 'white',
            fontWeight: 'bold',
            fontSize: 20,
            padding: '16px 32px',
            borderRadius: 8,
            boxShadow: '0 2px 8px #0002',
            cursor: 'pointer',
            zIndex: 9999,
            position: 'relative'
          }}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default ProfilePage; 