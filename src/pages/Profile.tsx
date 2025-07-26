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
    <div className="min-h-screen bg-cosmic-blue flex flex-col items-center py-8 px-4">
      <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-md border-white/20 p-6 relative">
        {/* Botón Volver arriba a la izquierda y % compatible a la derecha */}
        <div className="flex flex-row items-center justify-between w-full absolute top-4 left-0 px-6">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-cosmic-magenta hover:text-fuchsia-400 bg-white/20 px-3 py-1 rounded-lg font-semibold shadow focus:outline-none focus:ring-2 focus:ring-cosmic-magenta"
            aria-label="Volver al inicio"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Volver</span>
          </button>
          <Badge className="bg-cosmic-gold/20 text-cosmic-gold text-xs">
            {profile.compatibility_score}% compatible
          </Badge>
        </div>
        <CardHeader className="flex flex-col items-center gap-2 mt-16">
          <CardTitle className="text-white text-3xl mt-2">{profile.name}</CardTitle>
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar className="w-4 h-4" />
            <span>{profile.age} años</span>
            <MapPin className="w-4 h-4 ml-2" />
            <span>{profile.location}</span>
          </div>
        </CardHeader>
        <CardContent>
          {/* Slider de fotos */}
          {photos.length > 0 && (
            <div className="flex flex-col items-center mb-8 relative">
              <img
                ref={imgRef}
                src={photos[currentPhoto]}
                alt={`Foto ${currentPhoto + 1} de ${profile.name}`}
                className="object-cover w-full max-w-sm sm:max-w-lg md:w-[30rem] md:h-[30rem] rounded-2xl border-4 border-cosmic-magenta shadow-lg mx-auto cursor-pointer select-none"
                onClick={handleImageClick}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                draggable={false}
                style={{ userSelect: 'none' }}
              />
              {photos.length > 1 && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setCurrentPhoto((currentPhoto - 1 + photos.length) % photos.length)}
                    className="bg-cosmic-magenta text-white rounded-full px-3 py-1 hidden sm:inline"
                    aria-label="Foto anterior"
                  >
                    {"<"}
                  </button>
                  <button
                    onClick={() => setCurrentPhoto((currentPhoto + 1) % photos.length)}
                    className="bg-cosmic-magenta text-white rounded-full px-3 py-1 hidden sm:inline"
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
          </div>
          {/* Descripción */}
          <p className="text-gray-100 text-base mb-8 text-center whitespace-pre-line">
            {profile.description}
          </p>
          {/* Botón Chatear con (primer nombre) */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={() => navigate(`/chat/${profile.id}`)}
              className="bg-cosmic-magenta hover:bg-fuchsia-600 text-white font-bold text-lg px-8 py-3 rounded-xl shadow-lg"
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