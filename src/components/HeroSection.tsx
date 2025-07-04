
import { Button } from "@/components/ui/button";

const HeroSection = ({ onDiscoverClick }: { onDiscoverClick: () => void }) => {
  return (
    <section className="min-h-screen flex items-center px-4 md:px-6 relative">
      {/* Zodiac symbols floating - more subtle on mobile */}
      <div className="zodiac-symbol top-16 left-4 md:top-20 md:left-10 text-xl md:text-2xl">♈</div>
      <div className="zodiac-symbol top-24 right-6 md:top-32 md:right-16 text-xl md:text-2xl">♌</div>
      <div className="zodiac-symbol bottom-32 left-6 md:bottom-40 md:left-20 text-xl md:text-2xl">♓</div>
      <div className="zodiac-symbol bottom-20 right-4 md:bottom-28 md:right-12 text-xl md:text-2xl">♒</div>
      
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left animate-float">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
              Tu alma gemela está escrita en las estrellas
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-white/80 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
              Conecta con la persona destinada para ti a través de tu carta natal
            </p>
            
            <div className="pt-4 lg:pt-6">
              <Button 
                onClick={onDiscoverClick}
                className="stellar-button text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 rounded-full animate-pulse-glow w-full sm:w-auto"
                size="lg"
              >
                Descubre quién es
              </Button>
            </div>
          </div>
          
          {/* Right side - Visual element */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-80 h-80 xl:w-96 xl:h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-blue-500/30 rounded-full animate-pulse-glow"></div>
              <div className="absolute inset-4 bg-gradient-to-br from-purple-500/20 to-blue-600/20 rounded-full animate-float"></div>
              <div className="absolute inset-8 bg-gradient-to-br from-purple-600/10 to-blue-700/10 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center text-6xl xl:text-7xl animate-float" style={{ animationDelay: '1s' }}>
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
