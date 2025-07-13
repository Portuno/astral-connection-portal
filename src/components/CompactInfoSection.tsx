
import { Card } from "@/components/ui/card";

const CompactInfoSection = () => {
  return (
    <section className="py-8 md:py-12 px-4 md:px-6 relative">
      <div className="max-w-6xl mx-auto">
        {/* Main info grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          <Card className="glass-card p-4 md:p-6 text-center space-y-3 animate-float">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-xl animate-pulse-glow">
              📅
            </div>
            <h3 className="text-sm md:text-base font-bold text-white">
              Ingresa tus datos
            </h3>
            <p className="text-xs md:text-sm text-white/70">
              Fecha, hora y lugar de nacimiento
            </p>
          </Card>

          <Card className="glass-card p-4 md:p-6 text-center space-y-3 animate-float" style={{ animationDelay: '0.2s' }}>
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-xl animate-pulse-glow">
              🌟
            </div>
            <h3 className="text-sm md:text-base font-bold text-white">
              Carta astral única
            </h3>
            <p className="text-xs md:text-sm text-white/70">
              Analizamos la posición de los astros
            </p>
          </Card>

          <Card className="glass-card p-4 md:p-6 text-center space-y-3 animate-float" style={{ animationDelay: '0.4s' }}>
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-xl animate-pulse-glow">
              💫
            </div>
            <h3 className="text-sm md:text-base font-bold text-white">
              Compatibilidad
            </h3>
            <p className="text-xs md:text-sm text-white/70">
              Buscamos tu conexión perfecta
            </p>
          </Card>

          <Card className="glass-card p-4 md:p-6 text-center space-y-3 animate-float" style={{ animationDelay: '0.6s' }}>
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-xl animate-pulse-glow">
              💖
            </div>
            <h3 className="text-sm md:text-base font-bold text-white">
              Tu alma gemela
            </h3>
            <p className="text-xs md:text-sm text-white/70">
              Descubre quién es tu persona destinada
            </p>
          </Card>
        </div>

        {/* Testimonials compact */}
        <div className="text-center space-y-4 md:space-y-6">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
            Miles ya encontraron su destino cósmico
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <Card className="glass-card p-4 space-y-3 animate-float">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-lg">
                  👨‍💼
                </div>
                <div className="text-left">
                  <p className="text-sm text-white/90 italic">
                    "Conocí a Julia, fue como si nos conociéramos de otras vidas."
                  </p>
                  <p className="text-xs text-white/70 mt-1">— Marcos, 34 años</p>
                </div>
              </div>
            </Card>

            <Card className="glass-card p-4 space-y-3 animate-float" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-lg">
                  👩‍🎨
                </div>
                <div className="text-left">
                  <p className="text-sm text-white/90 italic">
                    "Mi carta astral me llevó a encontrar mi alma gemela."
                  </p>
                  <p className="text-xs text-white/70 mt-1">— Carmen, 28 años</p>
                </div>
              </div>
            </Card>

            <Card className="glass-card p-4 space-y-3 animate-float" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-lg">
                  👨‍🔬
                </div>
                <div className="text-left">
                  <p className="text-sm text-white/90 italic">
                    "AlmaEstelar me ayudó a encontrar mi verdadero amor cósmico."
                  </p>
                  <p className="text-xs text-white/70 mt-1">— David, 31 años</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompactInfoSection;
