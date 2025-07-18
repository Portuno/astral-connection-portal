
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Heart, Star, Users, Sparkles, Moon, Sun } from "lucide-react";

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
      text: "La compatibilidad astrológica realmente funciona. Encontré a alguien que entiende mi naturaleza emocional como nunca antes.",
      highlighted: true
    },
    {
      name: "Diego",
      age: 31,
      text: "Las predicciones sobre mi alma gemela fueron increíblemente precisas. Ahora entiendo por qué mis relaciones anteriores no funcionaron.",
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-cosmic-blue">
      {/* Hero Section - Optimizado para móvil */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cosmic-blue via-purple-900 to-cosmic-magenta opacity-80"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            {/* Logo/Brand */}
            <div className="mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-cosmic-magenta to-cosmic-gold rounded-full mb-4">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                Alma<span className="text-cosmic-gold">Estelar</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-2">
                Encuentra tu conexión perfecta a través de la sabiduría ancestral de la astrología
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-cosmic-gold mb-1">98%</div>
                <div className="text-xs sm:text-sm text-gray-400">Compatibilidad</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-cosmic-gold mb-1">50k+</div>
                <div className="text-xs sm:text-sm text-gray-400">Usuarios</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-cosmic-gold mb-1">2.4k</div>
                <div className="text-xs sm:text-sm text-gray-400">Parejas</div>
              </div>
            </div>

            {/* CTA Principal */}
            <div className="space-y-4 sm:space-y-6">
              <Button
                onClick={handleOpenOnboarding}
                className="w-full sm:w-auto bg-gradient-to-r from-cosmic-magenta to-purple-600 hover:from-cosmic-magenta/90 hover:to-purple-600/90 text-white px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-semibold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 min-w-[280px] sm:min-w-[320px]"
              >
                <Heart className="w-5 h-5 mr-2" />
                Descubre mi alma gemela
              </Button>
              
              <p className="text-sm sm:text-base text-gray-400 px-4">
                Gratis • Sin compromisos • Resultados inmediatos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
              ¿Cómo funciona la magia?
            </h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto px-2">
              Utilizamos los 4 pilares fundamentales de la astrología para crear conexiones auténticas y duraderas
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {pillars.map((pillar, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105 h-full">
                    <CardContent className="p-6 sm:p-8 text-center h-full flex flex-col">
                      <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">{pillar.icon}</div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">{pillar.title}</h3>
                      <p className="text-sm sm:text-base text-gray-300 flex-grow">{pillar.description}</p>
                      <div className="mt-4 text-cosmic-gold text-sm font-medium">
                        Toca para saber más →
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="bg-white/95 backdrop-blur-md border-white/20 max-w-md mx-4">
                  <DialogHeader>
                    <DialogTitle className="text-2xl text-cosmic-blue flex items-center gap-2">
                      <span className="text-3xl">{pillar.icon}</span>
                      {pillar.title}
                    </DialogTitle>
                    <DialogDescription className="text-gray-700 text-base leading-relaxed pt-2">
                      {pillar.details}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-white mb-8 sm:mb-12">
            Historias de amor escritas en las estrellas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className={`bg-white/10 backdrop-blur-md border-white/20 transform transition-all duration-300 hover:scale-105 ${
                  testimonial.highlighted ? "ring-2 ring-cosmic-magenta md:scale-105" : ""
                }`}
              >
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-cosmic-magenta to-cosmic-gold rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center text-xl sm:text-2xl font-bold text-white">
                    {testimonial.name[0]}
                  </div>
                  <p className="text-gray-300 text-center mb-4 sm:mb-6 italic text-sm sm:text-base leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-cosmic-gold font-semibold text-sm sm:text-base">
                      {testimonial.name}, {testimonial.age} años
                    </p>
                    <Star className="w-4 h-4 text-cosmic-gold fill-current" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA - Optimizado para móvil */}
      <footer className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-t from-black/40 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 sm:mb-8">
            <Moon className="w-12 h-12 sm:w-16 sm:h-16 text-cosmic-gold mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-white leading-tight">
              ¿Listo para encontrar tu 
              <span className="text-cosmic-gold block sm:inline"> conexión cósmica?</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto px-2 leading-relaxed">
              Únete a miles de personas que ya han encontrado el amor a través de la astrología. 
              Tu alma gemela te está esperando.
            </p>
          </div>
          
          <div className="space-y-6">
            <Button
              onClick={handleOpenOnboarding}
              className="w-full sm:w-auto bg-gradient-to-r from-cosmic-magenta to-purple-600 hover:from-cosmic-magenta/90 hover:to-purple-600/90 text-white px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-semibold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 min-w-[280px] sm:min-w-[350px] max-w-sm mx-auto"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Crear mi perfil cósmico
            </Button>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Términos y condiciones</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Política de privacidad</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contacto</a>
            </div>

            <p className="text-gray-500 text-xs sm:text-sm">© 2025 AlmaEstelar. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
