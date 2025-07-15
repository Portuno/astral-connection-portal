
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CityAutocomplete from "@/components/CityAutocomplete";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    lookingFor: "conexion-especial" // Valor por defecto
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que todos los campos requeridos estén completos
    console.log("🔍 Validando campos:", formData);
    const requiredFields = [formData.fullName, formData.gender, formData.birthDate, formData.birthTime, formData.birthPlace];
    const emptyFields = requiredFields.filter(field => !field || !field.toString().trim());
    
    if (emptyFields.length > 0) {
      console.log("❌ Campos vacíos detectados:", emptyFields);
      toast({
        title: "Campos incompletos",
        description: "Por favor, completa todos los campos",
        variant: "destructive"
      });
      return;
    }
    
    console.log("✅ Validación de campos exitosa");

    console.log("🔄 Iniciando proceso de guardado...");
    setLoading(true);

    try {
      console.log("📝 Validación pasada, creando datos de perfil...");
      
      // Generar un ID temporal para la sesión si no existe
      let sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        sessionId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("sessionId", sessionId);
      }

      // Crear datos con timestamp para identificar la sesión
      const profileData = {
        session_id: sessionId,
        full_name: formData.fullName,
        gender: formData.gender,
        birth_date: formData.birthDate,
        birth_time: formData.birthTime,
        birth_place: formData.birthPlace,
        looking_for: formData.lookingFor,
        created_at: new Date().toISOString()
      };

      console.log("💾 Guardando en localStorage...");
      // Guardar datos en localStorage para uso inmediato
      localStorage.setItem("onboardingData", JSON.stringify(profileData));
      console.log("✅ Datos guardados en localStorage");

      console.log("🌟 Mostrando toast de éxito...");
      toast({
        title: "🌟 Perfil creado exitosamente",
        description: "¡Tu información astrológica está lista!",
      });
      
      console.log("⏱️ Iniciando navegación a loading screen...");
      // Breve delay para mostrar el success y luego ir a loading
      setTimeout(() => {
        console.log("🔮 Navegando a loading screen para análisis...");
        setLoading(false);
        navigate("/loading");
      }, 1500);
    } catch (error) {
      console.error('❌ Error inesperado en onboarding:', error);
      toast({
        title: "Error inesperado", 
        description: "Ocurrió un error. Inténtalo de nuevo.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cosmic-blue flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ✨ Crear tu Perfil Cósmico
          </h1>
          <p className="text-gray-300 text-lg">
            Necesitamos algunos datos para calcular tu carta natal y encontrar tu conexión perfecta
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-cosmic-gold text-center">
              🌟 Tu Información Natal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre Completo */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white text-sm font-medium">
                  Nombre Completo
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Tu nombre completo"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-cosmic-magenta"
                  required
                />
              </div>

              {/* Género */}
              <div className="space-y-3">
                <Label className="text-white text-sm font-medium">Género</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mujer" id="mujer" className="border-white/20 text-cosmic-magenta" />
                    <Label htmlFor="mujer" className="text-white">Mujer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hombre" id="hombre" className="border-white/20 text-cosmic-magenta" />
                    <Label htmlFor="hombre" className="text-white">Hombre</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="otro" id="otro" className="border-white/20 text-cosmic-magenta" />
                    <Label htmlFor="otro" className="text-white">Otro</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Fecha de Nacimiento */}
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-white text-sm font-medium">
                  Fecha de Nacimiento
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange("birthDate", e.target.value)}
                  className="bg-white/10 border-white/20 text-white focus:border-cosmic-magenta [color-scheme:dark]"
                  required
                />
              </div>

              {/* Horario de Nacimiento */}
              <div className="space-y-2">
                <Label htmlFor="birthTime" className="text-white text-sm font-medium">
                  Horario de Nacimiento
                </Label>
                <Input
                  id="birthTime"
                  type="time"
                  value={formData.birthTime}
                  onChange={(e) => handleInputChange("birthTime", e.target.value)}
                  className="bg-white/10 border-white/20 text-white focus:border-cosmic-magenta [color-scheme:dark]"
                  required
                />
                <p className="text-xs text-gray-400">
                  Si no sabes la hora exacta, puedes usar 12:00 PM como aproximación
                </p>
              </div>

              {/* Lugar de Nacimiento */}
              <div className="space-y-2">
                <Label htmlFor="birthPlace" className="text-white text-sm font-medium">
                  Lugar de Nacimiento
                </Label>
                <CityAutocomplete
                  value={formData.birthPlace}
                  onChange={(value) => handleInputChange("birthPlace", value)}
                  placeholder="Escribe al menos 2 letras..."
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-cosmic-magenta"
                />
                <p className="text-xs text-gray-400">
                  Comienza a escribir y selecciona tu ciudad de la lista
                </p>
              </div>

              {/* Botón de Submit */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cosmic-magenta to-purple-600 hover:from-cosmic-magenta/80 hover:to-purple-600/80 text-white py-3 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Guardando..." : "🔮 Calcular mi Carta Natal"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Botón para volver */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-white"
            disabled={loading}
          >
            ← Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
