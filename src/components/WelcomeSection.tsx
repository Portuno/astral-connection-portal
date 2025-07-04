
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const WelcomeSection = () => {
  return (
    <section className="py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-lg mx-auto">
        <Card className="glass-card p-6 md:p-8 text-center space-y-6 md:space-y-8">
          <div className="space-y-4">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse-glow">
              <span className="text-2xl md:text-3xl">✨</span>
            </div>
            
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
              Tu carta ha sido leída
            </h2>
            
            <p className="text-lg md:text-xl text-white/90 font-medium">
              Ya sabemos quién es tu alma gemela.
            </p>
            
            <p className="text-sm md:text-base text-white/70">
              Para poder ver y hablar con ella, activa tu suscripción.
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              className="stellar-button w-full text-lg md:text-xl py-4 md:py-6 rounded-full font-bold"
            >
              Suscribirme por 29,90 €/mes
            </Button>
            
            <p className="text-xs md:text-sm text-white/60">
              Pago seguro mediante Square. Puedes cancelar cuando quieras.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default WelcomeSection;
