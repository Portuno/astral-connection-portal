
import { Button } from "@/components/ui/button";

const HeroSection = ({ onDiscoverClick }: { onDiscoverClick: () => void }) => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative">
      {/* Zodiac symbols floating */}
      <div className="zodiac-symbol top-20 left-10">♈</div>
      <div className="zodiac-symbol top-32 right-16">♌</div>
      <div className="zodiac-symbol bottom-40 left-20">♓</div>
      <div className="zodiac-symbol bottom-28 right-12">♒</div>
      
      <div className="max-w-4xl mx-auto space-y-8 animate-float">
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
          Tu alma gemela está escrita en las estrellas
        </h1>
        
        <p className="text-xl md:text-2xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
          Conecta with la persona destinada para ti a través de tu carta natal
        </p>
        
        <div className="pt-8">
          <Button 
            onClick={onDiscoverClick}
            className="stellar-button text-xl px-12 py-6 rounded-full animate-pulse-glow"
            size="lg"
          >
            Descubre quién es
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
