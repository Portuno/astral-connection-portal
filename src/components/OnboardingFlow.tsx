
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { DateTimePicker } from "./DateTimePicker";
import CityAutocomplete from "./CityAutocomplete";
import { useAuth } from "./AuthProvider";
import { AlertCircle } from "lucide-react";

interface OnboardingData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  unknownTime: boolean;
}

interface ValidationErrors {
  name?: string;
  birthDate?: string;
  birthPlace?: string;
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
    unknownTime: false
  });
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showValidation, setShowValidation] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validar nombre (OBLIGATORIO)
    if (!formData.name.trim()) {
      newErrors.name = "Tu nombre cósmico es necesario para conectar con las estrellas";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Tu nombre debe tener al menos 2 caracteres";
    }

    // Validar fecha de nacimiento (OBLIGATORIO)
    if (!formData.birthDate || !selectedDate) {
      newErrors.birthDate = "Tu momento de llegada al cosmos es esencial para tu carta astral";
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const minDate = new Date("1920-01-01");
      
      if (birthDate > today) {
        newErrors.birthDate = "Tu fecha de nacimiento no puede estar en el futuro";
      } else if (birthDate < minDate) {
        newErrors.birthDate = "Por favor, selecciona una fecha válida";
      }
    }

    // Validar lugar de nacimiento (OBLIGATORIO)
    if (!formData.birthPlace.trim()) {
      newErrors.birthPlace = "Tu punto de origen terrenal es fundamental para calcular tu carta astral";
    } else if (formData.birthPlace.trim().length < 3) {
      newErrors.birthPlace = "Por favor, ingresa una ciudad válida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowValidation(true);
    
    // Validar formulario ANTES de continuar
    if (!validateForm()) {
      toast({
        title: "Información incompleta ⭐",
        description: "Por favor, completa todos los campos obligatorios (nombre, fecha y lugar de nacimiento) para conectar con tu esencia cósmica.",
        variant: "destructive"
      });
      
      // Scroll al primer error
      const firstErrorField = document.querySelector('.border-red-400');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (!user) {
      toast({
        title: "Error de conexión 🌙",
        description: "No se pudo verificar tu identidad. Inténtalo de nuevo.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // Update profiles table with onboarding completion
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: formData.name.trim(),
          email: user.email,
          birth_date: formData.birthDate,
          birth_time: formData.unknownTime ? null : (formData.birthTime || null),
          birth_place: formData.birthPlace.trim(),
          onboarding_completed: true
        });

      if (profileError) {
        console.error('Error updating profile:', profileError);
        toast({
          title: "Error cósmico 🌙",
          description: "No pudimos guardar tu información. Las estrellas están alineándose mal. Inténtalo de nuevo.",
          variant: "destructive"
        });
        return;
      }

      // Also save to user_onboarding table for detailed astrological data
      const { error: onboardingError } = await supabase
        .from('user_onboarding')
        .upsert({
          user_id: user.id,
          full_name: formData.name.trim(),
          birth_date: formData.birthDate,
          birth_time: formData.unknownTime ? null : formData.birthTime,
          birth_place: formData.birthPlace.trim(),
          birth_city: formData.birthPlace.split(',')[0]?.trim() || formData.birthPlace.trim(),
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
        description: "Tu esencia astral ha sido registrada en el universo. Las estrellas ya conocen tu historia...",
      });
      
      onComplete();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Interferencia cósmica 🌟",
        description: "Los planetas están creando interferencia. Inténtalo en unos momentos.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof OnboardingData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (showValidation && errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const isoDate = date.toISOString().split('T')[0];
      handleChange('birthDate', isoDate);
    } else {
      handleChange('birthDate', '');
    }
  };

  const handleTimeChange = (time: string) => {
    handleChange('birthTime', time);
  };

  const handleUnknownTimeChange = (unknown: boolean) => {
    handleChange('unknownTime', unknown);
    if (unknown) {
      handleChange('birthTime', '');
    }
  };

  // Comprobar si el formulario está completo
  const isFormComplete = () => {
    return formData.name.trim().length >= 2 && 
           formData.birthDate && 
           selectedDate && 
           formData.birthPlace.trim().length >= 3;
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
            <div className="flex items-center justify-center gap-2 text-sm text-yellow-300/80">
              <span className="text-red-400">*</span>
              <span>Los campos con asterisco son obligatorios</span>
            </div>
          </div>
        </div>

        {showValidation && Object.keys(errors).length > 0 && (
          <Alert className="bg-red-500/10 border-red-400/30 backdrop-blur-sm">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              Por favor, completa todos los campos obligatorios para continuar tu viaje cósmico.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-white font-semibold text-sm flex items-center gap-2">
              <span className="text-pink-300 text-lg">👤</span>
              Tu nombre cósmico
              <span className="text-red-400 ml-1">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`bg-white/10 border-white/30 text-white placeholder:text-white/50 h-12 rounded-2xl border-2 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300 ${
                showValidation && errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
              }`}
              placeholder="¿Cómo te llamas, alma celestial?"
              disabled={isLoading}
            />
            {showValidation && errors.name && (
              <p className="text-red-300 text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-white font-semibold text-sm flex items-center gap-2">
              <span className="text-yellow-300 text-lg">🌅</span>
              Tu momento de llegada al cosmos
              <span className="text-red-400 ml-1">*</span>
            </Label>
            <div className={`${showValidation && errors.birthDate ? 'p-1 bg-red-400/20 rounded-xl border border-red-400/30' : ''}`}>
              <DateTimePicker
                date={selectedDate}
                onDateChange={handleDateChange}
                time={formData.birthTime}
                onTimeChange={handleTimeChange}
                unknownTime={formData.unknownTime}
                onUnknownTimeChange={handleUnknownTimeChange}
                disabled={isLoading}
              />
            </div>
            {showValidation && errors.birthDate && (
              <p className="text-red-300 text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.birthDate}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="birthPlace" className="text-white font-semibold text-sm flex items-center gap-2">
              <span className="text-green-300 text-lg">🌍</span>
              Tu punto de origen terrenal
              <span className="text-red-400 ml-1">*</span>
            </Label>
            <div className={`${showValidation && errors.birthPlace ? 'p-1 bg-red-400/20 rounded-xl border border-red-400/30' : ''}`}>
              <CityAutocomplete
                value={formData.birthPlace}
                onChange={(value) => handleChange("birthPlace", value)}
                disabled={isLoading}
              />
            </div>
            {showValidation && errors.birthPlace && (
              <p className="text-red-300 text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.birthPlace}
              </p>
            )}
          </div>

          <div className="pt-6">
            <Button 
              type="submit"
              className={`stellar-button w-full text-lg font-bold py-6 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 border-2 border-white/20 disabled:opacity-50 disabled:cursor-not-allowed ${
                !isFormComplete() && !isLoading ? 'opacity-60' : ''
              }`}
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
            
            {!isFormComplete() && !isLoading && (
              <p className="text-center text-white/60 text-sm mt-3">
                💫 Completa todos los campos obligatorios para continuar
              </p>
            )}
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
