
import { Button } from "@/components/ui/button";

const HeroSection = ({ onDiscoverClick }: { onDiscoverClick: () => void }) => {
  return (
    <section className="min-h-screen flex items-center px-4 md:px-6 relative">
      {/* Zodiac symbols floating - more subtle */}
      <div className="zodiac-symbol top-16 left-4 md:top-20 md:left-10 text-lg md:text-xl opacity-20">♈</div>
      <div className="zodiac-symbol top-24 right-6 md:top-32 md:right-16 text-lg md:text-xl opacity-20">♌</div>
      <div className="zodiac-symbol bottom-32 left-6 md:bottom-40 md:left-20 text-lg md:text-xl opacity-20">♓</div>
      <div className="zodiac-symbol bottom-20 right-4 md:bottom-28 md:right-12 text-lg md:text-xl opacity-20">♒</div>
      
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-4 lg:space-y-6 text-center lg:text-left animate-float">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
              Tu alma gemela está escrita en las estrellas
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-white/80 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
              Conecta con la persona destinada para ti a través de tu carta natal
            </p>
            
            <div className="pt-2 lg:pt-4">
              <Button 
                onClick={onDiscoverClick}
                className="stellar-button text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-5 rounded-full animate-pulse-glow w-full sm:w-auto"
                size="lg"
              >
                Descubre quién es ✨
              </Button>
            </div>

            {/* Quick info points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 lg:pt-6 text-center lg:text-left">
              <div className="flex flex-col items-center lg:items-start space-y-1">
                <div className="text-lg">🌟</div>
                <p className="text-xs sm:text-sm text-white/70">Carta astral única</p>
              </div>
              <div className="flex flex-col items-center lg:items-start space-y-1">
                <div className="text-lg">💫</div>
                <p className="text-xs sm:text-sm text-white/70">Compatibilidad cósmica</p>
              </div>
              <div className="flex flex-col items-center lg:items-start space-y-1">
                <div className="text-lg">💖</div>
                <p className="text-xs sm:text-sm text-white/70">Tu alma gemela</p>
              </div>
            </div>
          </div>
          
          {/* Right side - Visual element */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-64 h-64 xl:w-80 xl:h-80">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-blue-500/30 rounded-full animate-pulse-glow"></div>
              <div className="absolute inset-4 bg-gradient-to-br from-purple-500/20 to-blue-600/20 rounded-full animate-float"></div>
              <div className="absolute inset-8 bg-gradient-to-br from-purple-600/10 to-blue-700/10 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center text-5xl xl:text-6xl animate-float" style={{ animationDelay: '1s' }}>
                ✨
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
