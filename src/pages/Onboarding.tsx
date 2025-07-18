
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
import { ArrowLeft, User, Calendar, Clock, MapPin, Heart, Sparkles } from "lucide-react";

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
      // Generar un ID único para la sesión
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log("🆔 ID de sesión generado:", sessionId);

      // Crear objeto de perfil
      const profileData = {
        id: sessionId,
        full_name: formData.fullName,
        gender: formData.gender,
        birth_date: formData.birthDate,
        birth_time: formData.birthTime,
        birth_place: formData.birthPlace,
        looking_for: formData.lookingFor,
        created_at: new Date().toISOString()
      };

      console.log("📋 Datos del perfil a guardar:", profileData);

      // Guardar en localStorage como respaldo
      localStorage.setItem("sessionId", sessionId);
      localStorage.setItem("userProfile", JSON.stringify(profileData));
      console.log("💾 Datos guardados en localStorage");

             // Intentar guardar en Supabase (opcional, continúa sin él si falla)
       try {
         console.log("🔄 Intentando guardar en Supabase...");
         const supabaseData = {
           session_id: sessionId,
           full_name: formData.fullName,
           gender: formData.gender,
           birth_date: formData.birthDate,
           birth_time: formData.birthTime,
           birth_place: formData.birthPlace,
           looking_for: formData.lookingFor,
           created_at: new Date().toISOString()
         };
         
         const { data, error } = await supabase
           .from('temporary_profiles')
           .insert([supabaseData])
           .select();

         if (error) {
           console.error("❌ Error de Supabase:", error);
           console.log("⚠️ Continuando sin Supabase, usando localStorage");
         } else {
           console.log("✅ Guardado exitoso en Supabase:", data);
         }
       } catch (supabaseError) {
         console.error("❌ Error de conexión con Supabase:", supabaseError);
         console.log("⚠️ Continuando sin Supabase, usando localStorage");
       }

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
    <div className="min-h-screen bg-cosmic-blue">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cosmic-magenta to-cosmic-gold rounded-full">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4">
            ✨ Crear tu Perfil Cósmico
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-2xl mx-auto px-2">
            Necesitamos algunos datos para calcular tu carta natal y encontrar tu conexión perfecta
          </p>
        </div>

        {/* Formulario */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl sm:text-2xl text-cosmic-gold flex items-center justify-center gap-2">
                <User className="w-5 h-5 sm:w-6 sm:h-6" />
                Tu Información Natal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre Completo */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nombre Completo
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="Tu nombre completo"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-cosmic-magenta h-12 text-base"
                    required
                  />
                </div>

                {/* Género */}
                <div className="space-y-3">
                  <Label className="text-white text-sm font-medium flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Género
                  </Label>
                  <RadioGroup 
                    value={formData.gender} 
                    onValueChange={(value) => handleInputChange("gender", value)}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                  >
                    <div className="flex items-center space-x-2 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                      <RadioGroupItem value="masculino" id="masculino" className="text-cosmic-magenta" />
                      <Label htmlFor="masculino" className="text-white text-sm font-medium cursor-pointer flex-1">
                        Masculino
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                      <RadioGroupItem value="femenino" id="femenino" className="text-cosmic-magenta" />
                      <Label htmlFor="femenino" className="text-white text-sm font-medium cursor-pointer flex-1">
                        Femenino
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                      <RadioGroupItem value="otro" id="otro" className="text-cosmic-magenta" />
                      <Label htmlFor="otro" className="text-white text-sm font-medium cursor-pointer flex-1">
                        Otro
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Fecha y Hora de Nacimiento */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-white text-sm font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Fecha de Nacimiento
                    </Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange("birthDate", e.target.value)}
                      className="bg-white/10 border-white/20 text-white focus:border-cosmic-magenta h-12 text-base"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthTime" className="text-white text-sm font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Hora de Nacimiento
                    </Label>
                    <Input
                      id="birthTime"
                      type="time"
                      value={formData.birthTime}
                      onChange={(e) => handleInputChange("birthTime", e.target.value)}
                      className="bg-white/10 border-white/20 text-white focus:border-cosmic-magenta h-12 text-base"
                      required
                    />
                  </div>
                </div>

                {/* Qué Buscas */}
                <div className="space-y-3">
                  <Label className="text-white text-sm font-medium flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    ¿Qué buscas?
                  </Label>
                  <RadioGroup 
                    value={formData.lookingFor} 
                    onValueChange={(value) => handleInputChange("lookingFor", value)}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    <div className="flex items-center space-x-2 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                      <RadioGroupItem value="relacion-seria" id="relacion-seria" className="text-cosmic-magenta" />
                      <Label htmlFor="relacion-seria" className="text-white text-sm font-medium cursor-pointer flex-1">
                        Relación seria
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                      <RadioGroupItem value="conexion-especial" id="conexion-especial" className="text-cosmic-magenta" />
                      <Label htmlFor="conexion-especial" className="text-white text-sm font-medium cursor-pointer flex-1">
                        Conexión especial
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                      <RadioGroupItem value="amistad-profunda" id="amistad-profunda" className="text-cosmic-magenta" />
                      <Label htmlFor="amistad-profunda" className="text-white text-sm font-medium cursor-pointer flex-1">
                        Amistad profunda
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                      <RadioGroupItem value="explorar" id="explorar" className="text-cosmic-magenta" />
                      <Label htmlFor="explorar" className="text-white text-sm font-medium cursor-pointer flex-1">
                        Explorar
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Lugar de Nacimiento */}
                <div className="space-y-2">
                  <Label htmlFor="birthPlace" className="text-white text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Lugar de Nacimiento
                  </Label>
                  <CityAutocomplete
                    value={formData.birthPlace}
                    onChange={(value) => handleInputChange("birthPlace", value)}
                    placeholder="Escribe al menos 2 letras..."
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-cosmic-magenta h-12 text-base"
                  />
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Comienza a escribir y selecciona tu ciudad de la lista
                  </p>
                </div>

                {/* Botón de Submit */}
                <div className="pt-6 space-y-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cosmic-magenta to-purple-600 hover:from-cosmic-magenta/90 hover:to-purple-600/90 text-white py-4 sm:py-5 text-base sm:text-lg font-semibold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Guardando...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Calcular mi Carta Natal
                      </div>
                    )}
                  </Button>
                  
                  <p className="text-xs text-center text-gray-400 px-4">
                    Al continuar, aceptas nuestros términos y condiciones
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Botón para volver */}
          <div className="text-center mt-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
