
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
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight text-justify sm:text-center lg:text-left">
              Tu <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">alma gemela</span> está escrita en las estrellas
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-white/90 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0 text-justify sm:text-center lg:text-left">
              El universo ha conspirado para este momento. Conecta con tu destino cósmico a través de tu carta natal única.
            </p>
            
            <div className="pt-4 lg:pt-6">
              <Button 
                onClick={onDiscoverClick}
                className="stellar-button text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 rounded-full animate-pulse-glow w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 border-2 border-white/20"
                size="lg"
              >
                <span className="flex items-center gap-3">
                  Despertar mi magia interior
                  <span className="text-2xl animate-bounce">✨</span>
                </span>
              </Button>
            </div>

            {/* Quick info points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-6 lg:pt-8 text-center lg:text-left">
              <div className="flex flex-col items-center lg:items-start space-y-2 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-2xl animate-pulse-glow">🌟</div>
                <p className="text-sm sm:text-base text-white/90 font-semibold">Carta astral única</p>
                <p className="text-xs text-white/60 text-justify sm:text-center lg:text-left">Basada en tu momento exacto</p>
              </div>
              <div className="flex flex-col items-center lg:items-start space-y-2 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-2xl animate-pulse-glow">💫</div>
                <p className="text-sm sm:text-base text-white/90 font-semibold">Compatibilidad perfecta</p>
                <p className="text-xs text-white/60 text-justify sm:text-center lg:text-left">Algoritmo cósmico avanzado</p>
              </div>
              <div className="flex flex-col items-center lg:items-start space-y-2 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-2xl animate-pulse-glow">💖</div>
                <p className="text-sm sm:text-base text-white/90 font-semibold">Tu alma gemela</p>
                <p className="text-xs text-white/60 text-justify sm:text-center lg:text-left">Esperándote en el cosmos</p>
              </div>
            </div>
          </div>
          
          {/* Right side - Visual element */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-72 h-72 xl:w-96 xl:h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 via-pink-400/20 to-blue-500/30 rounded-full animate-pulse-glow blur-sm"></div>
              <div className="absolute inset-4 bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-blue-600/20 rounded-full animate-float border border-white/10"></div>
              <div className="absolute inset-8 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-700/10 rounded-full border border-white/5"></div>
              <div className="absolute inset-0 flex items-center justify-center text-6xl xl:text-7xl animate-float" style={{ animationDelay: '1s' }}>
                ✨
              </div>
              {/* Floating elements around */}
              <div className="absolute top-4 right-8 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>🌙</div>
              <div className="absolute bottom-8 left-4 text-2xl animate-bounce" style={{ animationDelay: '1.5s' }}>⭐</div>
              <div className="absolute top-1/3 left-2 text-xl animate-bounce" style={{ animationDelay: '2s' }}>💫</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
