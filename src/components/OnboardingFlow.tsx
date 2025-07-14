
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { DateTimePicker } from "./DateTimePicker";
import CityAutocomplete from "./CityAutocomplete";
import { useAuth } from "./AuthProvider";

interface OnboardingData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  gender: string;
  sexualPreference: string;
}

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [formData, setFormData] = useState<OnboardingData>({
    name: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    gender: "",
    sexualPreference: ""
  });
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const genderOptions = [
    { value: 'masculino', label: 'Masculino', emoji: '♂️' },
    { value: 'femenino', label: 'Femenino', emoji: '♀️' },
    { value: 'otro', label: 'Otro', emoji: '✨' }
  ];

  const preferenceOptions = [
    { value: 'masculino', label: 'Masculino', emoji: '♂️', description: 'Buscas energía masculina' },
    { value: 'femenino', label: 'Femenino', emoji: '♀️', description: 'Buscas energía femenina' },
    { value: 'ambos', label: 'Ambos', emoji: '💫', description: 'Abierto/a a todas las energías' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);

    try {
      // Update profiles table with onboarding completion
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: formData.name,
          email: user.email,
          birth_date: formData.birthDate,
          birth_time: formData.birthTime || null,
          birth_place: formData.birthPlace,
          gender: formData.gender,
          sexual_preference: formData.sexualPreference,
          onboarding_completed: true
        });

      if (profileError) {
        console.error('Error updating profile:', profileError);
        toast({
          title: "Error cósmico 🌙",
          description: "No pudimos guardar tu información. Inténtalo de nuevo.",
          variant: "destructive"
        });
        return;
      }

      // Also save to user_onboarding table for detailed astrological data
      const { error: onboardingError } = await supabase
        .from('user_onboarding')
        .upsert({
          user_id: user.id,
          full_name: formData.name,
          birth_date: formData.birthDate,
          birth_time: formData.birthTime,
          birth_place: formData.birthPlace,
          birth_city: formData.birthPlace.split(',')[0]?.trim() || formData.birthPlace,
          birth_country: formData.birthPlace.split(',').pop()?.trim() || 'Unknown',
          onboarding_step: 1,
          is_completed: true,
          completed_at: new Date().toISOString()
        });

      if (onboardingError) {
        console.error('Error saving onboarding data:', onboardingError);
      }

      toast({
        title: "¡Energía cósmica capturada! ✨",
        description: "Tu esencia astral ha sido registrada en el universo...",
      });
      
      onComplete();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Interferencia cósmica 🌟",
        description: "Los planetas están alineándose... Prueba otra vez.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const isoDate = date.toISOString().split('T')[0];
      handleChange('birthDate', isoDate);
    }
  };

  const handleTimeChange = (time: string) => {
    handleChange('birthTime', time);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>
      
      {/* Floating cosmic elements - mobile optimized */}
      <div className="absolute top-16 left-4 sm:top-20 sm:left-8 w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
      <div className="absolute top-32 right-4 sm:top-40 sm:right-16 w-1 h-1 bg-purple-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-48 left-1/4 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-pink-300 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

      <Card className="glass-card p-4 sm:p-6 lg:p-8 max-w-md sm:max-w-lg w-full space-y-6 sm:space-y-8 rounded-2xl sm:rounded-3xl border-2 border-white/20 shadow-2xl backdrop-blur-xl relative z-10">
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-purple-400 via-pink-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse-glow shadow-2xl">
              <span className="text-2xl sm:text-3xl animate-float">🌟</span>
            </div>
            <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs sm:text-sm animate-bounce shadow-lg">
              ✨
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
              Conecta con tu esencia cósmica
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Para crear tu carta astral personalizada y encontrar tu alma gemela perfecta, necesitamos conocer tu energía única.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="name" className="text-white font-semibold text-sm flex items-center gap-2">
              <span className="text-pink-300 text-base sm:text-lg">👤</span>
              Tu nombre cósmico
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/50 h-10 sm:h-12 rounded-xl sm:rounded-2xl border-2 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300 text-sm sm:text-base"
              placeholder="¿Cómo te llamas, alma celestial?"
              required
              disabled={isLoading}
            />
          </div>

          {/* Gender Selection - Mobile Optimized */}
          <div className="space-y-2 sm:space-y-3">
            <Label className="text-white font-semibold text-sm flex items-center gap-2">
              <span className="text-blue-300 text-base sm:text-lg">⚡</span>
              Tu energía cósmica
            </Label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {genderOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleChange('gender', option.value)}
                  disabled={isLoading}
                  className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
                    formData.gender === option.value
                      ? 'border-purple-400 bg-purple-500/20 shadow-lg'
                      : 'border-white/30 bg-white/5 hover:border-purple-300 hover:bg-white/10'
                  }`}
                >
                  <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{option.emoji}</div>
                  <div className="text-white text-xs sm:text-sm font-medium">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Sexual Preference Selection - Mobile Optimized */}
          <div className="space-y-2 sm:space-y-3">
            <Label className="text-white font-semibold text-sm flex items-center gap-2">
              <span className="text-pink-300 text-base sm:text-lg">💖</span>
              Buscas conexión con...
            </Label>
            <div className="space-y-2 sm:space-y-3">
              {preferenceOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleChange('sexualPreference', option.value)}
                  disabled={isLoading}
                  className={`w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 text-left ${
                    formData.sexualPreference === option.value
                      ? 'border-pink-400 bg-pink-500/20 shadow-lg'
                      : 'border-white/30 bg-white/5 hover:border-pink-300 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-xl sm:text-2xl">{option.emoji}</div>
                    <div>
                      <div className="text-white font-medium text-sm sm:text-base">{option.label}</div>
                      <div className="text-white/70 text-xs sm:text-sm">{option.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <Label className="text-white font-semibold text-sm flex items-center gap-2">
              <span className="text-yellow-300 text-base sm:text-lg">🌅</span>
              Tu momento de llegada al cosmos
            </Label>
            <DateTimePicker
              date={selectedDate}
              onDateChange={handleDateChange}
              time={formData.birthTime}
              onTimeChange={handleTimeChange}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="birthPlace" className="text-white font-semibold text-sm flex items-center gap-2">
              <span className="text-green-300 text-base sm:text-lg">🌍</span>
              Tu punto de origen terrenal
            </Label>
            <CityAutocomplete
              value={formData.birthPlace}
              onChange={(value) => handleChange("birthPlace", value)}
              disabled={isLoading}
            />
          </div>

          <div className="pt-4 sm:pt-6">
            <Button 
              type="submit"
              className="stellar-button w-full text-base sm:text-lg font-bold py-3 sm:py-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 border-2 border-white/20"
              disabled={isLoading || !formData.gender || !formData.sexualPreference}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2 sm:gap-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Conectando con las estrellas...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Crear mi carta astral
                  <span className="text-lg sm:text-xl animate-bounce">🌟</span>
                </span>
              )}
            </Button>
          </div>

          <div className="text-center space-y-2 pt-2">
            <p className="text-xs text-white/70 flex items-center justify-center gap-2">
              <span className="text-green-400">🔒</span>
              Tu energía está protegida por magia ancestral
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
