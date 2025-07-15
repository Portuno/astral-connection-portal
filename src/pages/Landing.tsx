
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  
  const handleOpenOnboarding = () => {
    navigate('/onboarding');
  };

  const pillars = [
    {
      icon: "☀️",
      title: "Signo Solar",
      description: "Tu esencia central y personalidad principal",
      details: "El signo solar representa tu núcleo interno, tu ego y la forma en que expresas tu individualidad. Es la base de tu personalidad y define tus motivaciones principales."
    },
    {
      icon: "🌙",
      title: "Signo Lunar",
      description: "Tu mundo emocional y necesidades profundas",
      details: "La Luna revela tu naturaleza emocional, tus instintos y cómo procesas los sentimientos. Determina qué necesitas para sentirte seguro y amado."
    },
    {
      icon: "💖",
      title: "Venus y Marte",
      description: "Tu estilo de amor y atracción",
      details: "Venus muestra cómo amas y qué te atrae, mientras Marte revela tu energía sexual y cómo persigues lo que deseas. Juntos definen tu estilo romántico."
    },
    {
      icon: "🏠",
      title: "Casas y Aspectos",
      description: "El contexto y las dinámicas energéticas",
      details: "Las casas muestran las áreas de vida donde se manifiestan las energías planetarias, mientras los aspectos revelan cómo interactúan entre sí."
    }
  ];

  const testimonials = [
    {
      name: "Marcos",
      age: 34,
      text: "Nunca creí en la astrología hasta que conocí a mi pareja aquí. Nuestras cartas natales encajaban perfectamente y llevamos 2 años juntos.",
      highlighted: false
    },
    {
      name: "Carmen",
      age: 28,
      text: "El análisis de compatibilidad fue increíblemente preciso. Encontré a alguien que realmente me entiende a nivel profundo.",
      highlighted: true
    },
    {
      name: "David",
      age: 31,
      text: "La conexión que encontré aquí va más allá de lo físico. Es como si hubiéramos estado destinados a encontrarnos.",
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-cosmic-blue text-white overflow-x-hidden">
      {/* Hero Section - Optimizado para móvil */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-12 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-blue/50 to-cosmic-blue"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-cosmic-gold to-cosmic-magenta bg-clip-text text-transparent leading-tight">
            Tu alma gemela está escrita en las estrellas
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
            El universo ha conspirado para este momento. Conecta con tu destino cósmico a través de tu carta natal única y nuestro algoritmo de sinastría avanzado.
          </p>
          <Button
            onClick={handleOpenOnboarding}
            className="bg-gradient-to-r from-cosmic-magenta to-purple-600 hover:from-cosmic-magenta/80 hover:to-purple-600/80 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 w-full sm:w-auto max-w-sm mx-auto"
          >
            ✨ Descubre mi alma gemela ✨
          </Button>
        </div>
      </section>

      {/* Los Pilares de la Conexión - Optimizado para móvil */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-cosmic-gold">Los Pilares de la Conexión</h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto px-2">
              Nuestra plataforma va más allá del signo solar. Analizamos los componentes clave de tu carta natal 
              para revelar la verdadera dinámica de una relación.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {pillars.map((pillar, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {pillar.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-cosmic-gold">{pillar.title}</h3>
                      <p className="text-gray-300 text-sm">{pillar.description}</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="bg-cosmic-blue border-white/20 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-cosmic-gold flex items-center gap-2">
                      <span className="text-2xl">{pillar.icon}</span>
                      {pillar.title}
                    </DialogTitle>
                    <DialogDescription className="text-gray-300">
                      {pillar.details}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios - Optimizado para móvil */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-16 text-cosmic-gold">
            Miles ya encontraron su destino cósmico
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className={`bg-white/10 backdrop-blur-md border-white/20 ${
                  testimonial.highlighted ? "ring-2 ring-cosmic-magenta sm:scale-105" : ""
                }`}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cosmic-magenta to-cosmic-gold rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center text-lg sm:text-xl font-bold">
                    {testimonial.name[0]}
                  </div>
                  <p className="text-gray-300 text-center mb-3 sm:mb-4 italic text-sm sm:text-base">"{testimonial.text}"</p>
                  <p className="text-cosmic-gold text-center font-semibold text-sm sm:text-base">
                    {testimonial.name}, {testimonial.age} años
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA - Optimizado para móvil */}
      <footer className="py-12 sm:py-16 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-cosmic-gold">¿Listo para alinear tus estrellas?</h2>
          <p className="text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base px-2">
            Únete a nuestra comunidad y comienza tu viaje para encontrar una conexión que estaba destinada a ser.
          </p>
          
          <Button
            onClick={handleOpenOnboarding}
            className="bg-gradient-to-r from-cosmic-magenta to-purple-600 hover:from-cosmic-magenta/80 hover:to-purple-600/80 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 mb-6 sm:mb-8 w-full sm:w-auto max-w-sm mx-auto"
          >
            ✨ Crear mi perfil cósmico ✨
          </Button>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 sm:mb-8 text-xs sm:text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Términos y condiciones</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Política de privacidad</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Contacto</a>
          </div>

          <p className="text-gray-500 text-xs sm:text-sm">© 2025 AlmaEstelar. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
