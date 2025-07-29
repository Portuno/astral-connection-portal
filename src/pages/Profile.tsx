import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Sparkles, MapPin, Calendar, Sun, Moon, Navigation, Heart, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Extender el tipo Profile para permitir hasta 4 fotos
interface ProfileWithGallery {
  id: string;
  name: string;
  age: number;
  sign: string;
  moon_sign: string;
  rising_sign: string;
  description: string;
  photo_url: string;
  photo_url_2?: string;
  photo_url_3?: string;
  location?: string;
  compatibility_score?: number;
  lookingFor?: string;
  gallery?: string[];
}

const ProfilePage = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileWithGallery | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!profileId || typeof profileId !== 'string') return;
    setLoading(true);
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId as any)
        .single();
      if (data && !error) {
        setProfile(data as unknown as ProfileWithGallery);
      } else {
        setProfile(null);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [profileId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmic-blue flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cosmic-gold mx-auto mb-4"></div>
          <p className="text-white">Cargando perfil...</p>
        </div>
      </div>
    );
  }

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

  // Touch/swipe handlers
  let touchStartX = 0;
  let touchEndX = 0;
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.changedTouches[0].screenX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 30) {
      setCurrentPhoto((currentPhoto + 1) % photos.length);
    } else if (touchEndX > touchStartX + 30) {
      setCurrentPhoto((currentPhoto - 1 + photos.length) % photos.length);
    }
  };
  const handleImageClick = () => {
    setCurrentPhoto((currentPhoto + 1) % photos.length);
  };

  return (
    <div className="min-h-screen bg-cosmic-blue flex flex-col items-center py-4 px-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20 p-4 relative">
        {/* Header optimizado para móvil */}
        <div className="flex items-center justify-between w-full mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="flex items-center justify-center w-8 h-8 text-cosmic-magenta hover:text-fuchsia-400 bg-white/20 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-cosmic-magenta"
              aria-label="Volver al inicio"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-white text-xl font-bold">{profile.name}</h1>
          </div>
          <Badge className="bg-cosmic-gold/20 text-cosmic-gold text-xs">
            {profile.compatibility_score}% compatible
          </Badge>
        </div>

        {/* Edad y ubicación en una línea */}
        <div className="flex items-center justify-center gap-4 text-gray-300 text-sm mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{profile.age} años</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{profile.location}</span>
          </div>
        </div>

        <CardContent className="p-0">
          {/* Slider de fotos */}
          {photos.length > 0 && (
            <div className="flex flex-col items-center mb-6 relative">
              <img
                ref={imgRef}
                src={photos[currentPhoto]}
                alt={`Foto ${currentPhoto + 1} de ${profile.name}`}
                className="object-cover w-full h-80 rounded-2xl border-4 border-cosmic-magenta shadow-lg cursor-pointer select-none"
                onClick={handleImageClick}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                draggable={false}
                style={{ userSelect: 'none' }}
              />
              {photos.length > 1 && (
                <div className="flex gap-1 mt-3">
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

          {/* Info astrológica optimizada - solo emojis en una línea */}
          <div className="flex justify-center gap-6 mb-6">
            <div className="flex items-center gap-1 text-lg">
              <span>☀️</span>
              <span className="text-sm text-gray-200">{profile.sign}</span>
            </div>
            <div className="flex items-center gap-1 text-lg">
              <span>🌙</span>
              <span className="text-sm text-gray-200">{profile.moon_sign}</span>
            </div>
            <div className="flex items-center gap-1 text-lg">
              <span>⭐</span>
              <span className="text-sm text-gray-200">{profile.rising_sign}</span>
            </div>
          </div>

          {/* Descripción mejorada */}
          <div className="mb-6">
            <p className="text-gray-100 text-sm leading-relaxed text-center px-2 font-medium">
              {profile.description}
            </p>
          </div>

          {/* Botón Chatear optimizado */}
          <div className="flex justify-center">
            <Button
              onClick={() => navigate(`/chat/${profile.id}`)}
              className="w-full bg-gradient-to-r from-cosmic-magenta to-purple-600 hover:from-cosmic-magenta/90 hover:to-purple-600/90 text-white font-bold text-base py-3 rounded-xl shadow-lg"
              aria-label={`Chatear con ${profile.name.split(' ')[0]}`}
            >
              {`Chatear con ${profile.name.split(' ')[0]}`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage; 