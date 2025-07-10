
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
          title: "¡Ups! 🌟",
          description: "Las estrellas están alineándose... Inténtalo de nuevo en un momento.",
          variant: "destructive"
        });
        return;
      }

      console.log('Data saved successfully');
      toast({
        title: "¡Magia cósmica activada! ✨",
        description: "Tu energía astral ha sido capturada. Preparando tu destino...",
      });
      
      onSubmit(formData);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Interferencia cósmica 🌙",
        description: "Los planetas están jugando... Prueba otra vez.",
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
    <section className="py-8 md:py-16 px-4 md:px-6">
      <div className="max-w-md mx-auto">
        <Card className="glass-card p-6 md:p-8 space-y-6 md:space-y-8 rounded-3xl border-2 border-white/20 shadow-2xl">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 via-pink-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse-glow shadow-lg">
                <span className="text-2xl animate-float">✨</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs animate-bounce">
                🌟
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
                Despierta tu magia interior
              </h2>
              <p className="text-base text-white/80 leading-relaxed max-w-sm mx-auto">
                Las estrellas han conspirado para traerte hasta aquí. 
                <span className="block mt-1 text-white/60 text-sm">✨ Tu alma gemela te está esperando ✨</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white font-semibold text-sm flex items-center gap-2">
                <span className="text-pink-300">👤</span>
                Tu nombre mágico
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50 h-12 rounded-2xl border-2 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                placeholder="¿Cómo te llamas, alma cósmica?"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-semibold text-sm flex items-center gap-2">
                <span className="text-blue-300">📧</span>
                Tu portal digital
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50 h-12 rounded-2xl border-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                placeholder="tuenergia@cosmica.com"
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-white font-semibold text-sm flex items-center gap-1">
                  <span className="text-yellow-300">🌅</span>
                  Tu llegada
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleChange("birthDate", e.target.value)}
                  className="bg-white/10 border-white/30 text-white h-12 rounded-xl border-2 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthTime" className="text-white font-semibold text-sm flex items-center gap-1">
                  <span className="text-purple-300">🕐</span>
                  Tu momento
                </Label>
                <Input
                  id="birthTime"
                  type="time"
                  value={formData.birthTime}
                  onChange={(e) => handleChange("birthTime", e.target.value)}
                  className="bg-white/10 border-white/30 text-white h-12 rounded-xl border-2 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthPlace" className="text-white font-semibold text-sm flex items-center gap-2">
                <span className="text-green-300">🌍</span>
                Tu punto de origen cósmico
              </Label>
              <Input
                id="birthPlace"
                type="text"
                value={formData.birthPlace}
                onChange={(e) => handleChange("birthPlace", e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50 h-12 rounded-2xl border-2 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
                placeholder="Barcelona, España ✨"
                required
                disabled={isLoading}
              />
            </div>

            <div className="pt-4">
              <Button 
                type="submit"
                className="stellar-button w-full text-lg font-bold py-6 rounded-2xl mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 border-2 border-white/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Consultando las estrellas...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Revelar mi destino cósmico
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
              <p className="text-xs text-white/50">
                Más de <span className="text-pink-300 font-semibold">10,000 almas</span> ya encontraron su conexión 💫
              </p>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default RegistrationForm;
