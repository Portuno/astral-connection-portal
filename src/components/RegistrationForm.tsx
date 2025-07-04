
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface FormData {
  name: string;
  email: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}

const RegistrationForm = ({ onSubmit }: { onSubmit: (data: FormData) => void }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    birthDate: "",
    birthTime: "",
    birthPlace: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Guardar datos en Supabase
      const { error } = await supabase
        .from('user_registrations')
        .insert({
          name: formData.name,
          email: formData.email,
          birth_date: formData.birthDate,
          birth_time: formData.birthTime || null,
          birth_place: formData.birthPlace
        });

      if (error) {
        console.error('Error saving data:', error);
        toast({
          title: "Error",
          description: "Hubo un problema al guardar tus datos. Por favor intenta de nuevo.",
          variant: "destructive"
        });
        return;
      }

      // Si se guardó exitosamente, continuar con el flujo
      console.log('Data saved successfully');
      toast({
        title: "¡Perfecto!",
        description: "Tus datos han sido guardados. Generando tu carta astral...",
      });
      
      onSubmit(formData);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado. Por favor intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-md mx-auto">
        <Card className="glass-card p-8 space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Descubre tu destino cósmico
            </h2>
            <p className="text-white/70">
              Ingresa tus datos para generar tu carta astral única
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white font-medium">
                Nombre completo
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50 h-12"
                placeholder="Tu nombre"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50 h-12"
                placeholder="tu@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-white font-medium">
                Fecha de nacimiento
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleChange("birthDate", e.target.value)}
                className="bg-white/10 border-white/30 text-white h-12"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthTime" className="text-white font-medium">
                Hora de nacimiento (opcional)
              </Label>
              <Input
                id="birthTime"
                type="time"
                value={formData.birthTime}
                onChange={(e) => handleChange("birthTime", e.target.value)}
                className="bg-white/10 border-white/30 text-white h-12"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthPlace" className="text-white font-medium">
                Ciudad y país de nacimiento
              </Label>
              <Input
                id="birthPlace"
                type="text"
                value={formData.birthPlace}
                onChange={(e) => handleChange("birthPlace", e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50 h-12"
                placeholder="Madrid, España"
                required
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit"
              className="stellar-button w-full text-lg py-6 rounded-full"
              disabled={isLoading}
            >
              {isLoading ? "Generando carta astral..." : "Generar mi carta astral"}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default RegistrationForm;
