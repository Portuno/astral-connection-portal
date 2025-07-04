
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const WelcomeSection = () => {
  return (
    <section className="py-8 md:py-12 px-4 md:px-6">
      <div className="max-w-lg mx-auto">
        <Card className="glass-card p-4 md:p-6 text-center space-y-4 md:space-y-6">
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse-glow">
              <span className="text-2xl">✨</span>
            </div>
            
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
              Tu carta ha sido leída
            </h2>
            
            <p className="text-lg font-medium text-white/90">
              Ya sabemos quién es tu alma gemela.
            </p>
            
            <p className="text-sm text-white/70">
              Para poder ver y hablar con ella, activa tu suscripción.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              className="stellar-button w-full text-lg py-4 rounded-full font-bold"
            >
              Suscribirme por 29,90 €/mes
            </Button>
            
            <p className="text-xs text-white/60">
              Pago seguro mediante Square. Puedes cancelar cuando quieras.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default WelcomeSection;
