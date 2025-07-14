
import { Card } from "@/components/ui/card";

const steps = [
  {
    icon: "📅",
    title: "Ingresa tus datos natales",
    description: "Fecha, hora y lugar de nacimiento para crear tu carta astral única"
  },
  {
    icon: "🌟",
    title: "Generamos tu carta astral única",
    description: "Analizamos la posición de los astros en tu momento de nacimiento"
  },
  {
    icon: "💫",
    title: "Analizamos tu compatibilidad cósmica",
    description: "Buscamos conexiones perfectas usando algoritmos astrológicos"
  },
  {
    icon: "💖",
    title: "Te mostramos a tu alma gemela",
    description: "Descubre perfiles personalizados con alta compatibilidad astral"
  },
  {
    icon: "💬",
    title: "Conecta con tu destino",
    description: "Comienza a chatear y construye tu historia cósmica"
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-8 sm:py-12 lg:py-20 px-3 sm:px-4 lg:px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-transparent"></div>
      
      {/* Floating cosmic elements */}
      <div className="absolute top-16 left-4 sm:top-20 sm:left-8 w-1 h-1 sm:w-2 sm:h-2 bg-purple-300 rounded-full animate-pulse opacity-40"></div>
      <div className="absolute top-32 right-4 sm:top-40 sm:right-12 w-1 h-1 bg-pink-300 rounded-full animate-pulse opacity-30" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-8 sm:bottom-32 sm:left-16 w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse opacity-25" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center space-y-2 sm:space-y-3 lg:space-y-4 mb-6 sm:mb-10 lg:mb-16">
          <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white leading-tight">
            ¿Cómo funciona la magia?
          </h2>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed px-2">
            Un viaje espiritual hacia tu destino cósmico
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          {steps.map((step, index) => (
            <Card key={index} className="glass-card p-3 sm:p-4 lg:p-6 xl:p-8 relative overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-white/10 hover:border-white/30">
              <div className="absolute top-1 right-1 sm:top-2 sm:right-2 lg:top-4 lg:right-4 text-2xl sm:text-3xl lg:text-5xl xl:text-6xl opacity-10 font-bold text-white">
                {index + 1}
              </div>
              
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-500 rounded-full flex items-center justify-center text-base sm:text-lg lg:text-xl xl:text-2xl animate-pulse-glow shadow-lg">
                  {step.icon}
                </div>
                
                <div className="flex-1 space-y-1 sm:space-y-2 min-w-0">
                  <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-white leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
              
              {/* Progress indicator */}
              {index < steps.length - 1 && (
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-purple-400 to-transparent opacity-30"></div>
              )}
            </Card>
          ))}
        </div>

        {/* Bottom cosmic decoration */}
        <div className="mt-8 sm:mt-12 lg:mt-16 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <span className="text-xl sm:text-2xl animate-bounce">✨</span>
            <span className="text-xs sm:text-sm text-white/80 font-medium">Tu viaje cósmico comienza aquí</span>
            <span className="text-xl sm:text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>🌟</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
