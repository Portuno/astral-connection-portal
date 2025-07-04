
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const WelcomeSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-lg mx-auto">
        <Card className="glass-card p-8 text-center space-y-8">
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse-glow">
              <span className="text-3xl">✨</span>
            </div>
            
            <h2 className="text-2xl font-bold text-white leading-tight">
              Tu carta ha sido leída
            </h2>
            
            <p className="text-xl text-white/90 font-medium">
              Ya sabemos quién es tu alma gemela.
            </p>
            
            <p className="text-white/70">
              Para poder ver y hablar con ella, activa tu suscripción.
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              className="stellar-button w-full text-xl py-6 rounded-full font-bold"
            >
              Suscribirme por 29,90 €/mes
            </Button>
            
            <p className="text-sm text-white/60">
              Pago seguro mediante Square. Puedes cancelar cuando quieras.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default WelcomeSection;
