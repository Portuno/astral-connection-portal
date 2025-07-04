
import { Card } from "@/components/ui/card";

const testimonials = [
  {
    text: "Nunca creí en estas cosas… pero conocí a Julia, y fue como si nos conociéramos de otras vidas.",
    author: "Marcos, 34 años",
    avatar: "👨‍💼"
  },
  {
    text: "Mi carta astral me llevó a encontrar a mi alma gemela. Ahora entiendo que todo estaba escrito en las estrellas.",
    author: "Carmen, 28 años", 
    avatar: "👩‍🎨"
  },
  {
    text: "Después de tantas decepciones amorosas, AlmaEstelar me ayudó a encontrar mi verdadero amor cósmico.",
    author: "David, 31 años",
    avatar: "👨‍🔬"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-3 md:space-y-4 mb-10 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
            Historias de amor cósmico
          </h2>
          <p className="text-lg md:text-xl text-white/80">
            Miles de almas ya han encontrado su destino
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glass-card p-4 md:p-6 space-y-3 md:space-y-4 animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-xl md:text-2xl mb-3 md:mb-4">
                  {testimonial.avatar}
                </div>
              </div>
              
              <blockquote className="text-sm md:text-base text-white/90 italic leading-relaxed">
                "{testimonial.text}"
              </blockquote>
              
              <footer className="text-xs md:text-sm text-white/70 font-medium text-center">
                — {testimonial.author}
              </footer>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
