
import { Card } from "@/components/ui/card";

const steps = [
  {
    icon: "📅",
    title: "Ingresa tus datos natales",
    description: "Fecha, hora y lugar de nacimiento"
  },
  {
    icon: "🌟",
    title: "Generamos tu carta astral única",
    description: "Analizamos la posición de los astros"
  },
  {
    icon: "💫",
    title: "Analizamos tu compatibilidad cósmica",
    description: "Buscamos tu conexión perfecta"
  },
  {
    icon: "💖",
    title: "Te mostramos a tu alma gemela",
    description: "Descubre quién es tu persona destinada"
  },
  {
    icon: "💬",
    title: "Habla con ella tras suscribirte",
    description: "Conecta y comienza vuestra historia"
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-12 md:py-20 px-4 md:px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center space-y-3 md:space-y-4 mb-10 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
            ¿Cómo funciona?
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Un viaje espiritual hacia tu destino cósmico
          </p>
        </div>

        <div className="space-y-4 md:space-y-6">
          {steps.map((step, index) => (
            <Card key={index} className="glass-card p-4 md:p-6 lg:p-8 relative overflow-hidden">
              <div className="absolute top-2 right-2 md:top-4 md:right-4 text-4xl md:text-6xl opacity-10 font-bold text-white">
                {index + 1}
              </div>
              
              <div className="flex items-start space-x-3 md:space-x-4">
                <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-xl md:text-2xl animate-pulse-glow">
                  {step.icon}
                </div>
                
                <div className="flex-1 space-y-1 md:space-y-2">
                  <h3 className="text-lg md:text-xl font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-white/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
