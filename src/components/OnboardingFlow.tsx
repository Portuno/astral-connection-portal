
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
}

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [formData, setFormData] = useState<OnboardingData>({
    name: "",
    birthDate: "",
    birthTime: "",
    birthPlace: ""
  });
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>
      
      <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-1 h-1 bg-purple-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-60 left-1/4 w-1.5 h-1.5 bg-pink-300 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

      <Card className="glass-card p-8 max-w-md w-full space-y-8 rounded-3xl border-2 border-white/20 shadow-2xl backdrop-blur-xl relative z-10">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-400 via-pink-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse-glow shadow-2xl">
              <span className="text-3xl animate-float">🌟</span>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-sm animate-bounce shadow-lg">
              ✨
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
              Conecta con tu esencia cósmica
            </h2>
            <p className="text-white/80 leading-relaxed">
              Para crear tu carta astral personalizada, necesitamos conocer tu momento de llegada al universo.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-white font-semibold text-sm flex items-center gap-2">
              <span className="text-pink-300 text-lg">👤</span>
              Tu nombre cósmico
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/50 h-12 rounded-2xl border-2 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
              placeholder="¿Cómo te llamas, alma celestial?"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-white font-semibold text-sm flex items-center gap-2">
              <span className="text-yellow-300 text-lg">🌅</span>
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

          <div className="space-y-3">
            <Label htmlFor="birthPlace" className="text-white font-semibold text-sm flex items-center gap-2">
              <span className="text-green-300 text-lg">🌍</span>
              Tu punto de origen terrenal
            </Label>
            <CityAutocomplete
              value={formData.birthPlace}
              onChange={(value) => handleChange("birthPlace", value)}
              disabled={isLoading}
            />
          </div>

          <div className="pt-6">
            <Button 
              type="submit"
              className="stellar-button w-full text-lg font-bold py-6 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 border-2 border-white/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Conectando con las estrellas...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Crear mi carta astral
                  <span className="text-xl animate-bounce">🌟</span>
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
