
import { Button } from "@/components/ui/button";

const HeroSection = ({ onDiscoverClick }: { onDiscoverClick: () => void }) => {
  return (
    <section className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced background with mobile optimization */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 opacity-40"></div>
      
      {/* Zodiac symbols floating - mobile optimized */}
      <div className="zodiac-symbol top-20 left-4 sm:left-8 lg:left-16 text-xl sm:text-2xl lg:text-3xl opacity-30 animate-pulse">♈</div>
      <div className="zodiac-symbol top-32 right-4 sm:right-8 lg:right-20 text-lg sm:text-xl lg:text-2xl opacity-25 animate-bounce">♌</div>
      <div className="zodiac-symbol bottom-40 left-4 sm:left-12 lg:left-24 text-lg sm:text-xl lg:text-2xl opacity-20 animate-float">♓</div>
      <div className="zodiac-symbol bottom-24 right-4 sm:right-6 lg:right-16 text-xl sm:text-2xl lg:text-3xl opacity-35 animate-pulse" style={{ animationDelay: '1s' }}>♒</div>
      
      <div className="w-full max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left side - Text content with improved mobile layout */}
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left animate-float">
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                Tu <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse-glow">alma gemela</span> está escrita en las estrellas
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-white/90 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
                El universo ha conspirado para este momento. Conecta con tu destino cósmico a través de tu carta natal única.
              </p>
            </div>
            
            <div className="pt-2 lg:pt-4">
              <Button 
                onClick={onDiscoverClick}
                className="stellar-button text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-6 rounded-full animate-pulse-glow w-full sm:max-w-sm lg:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 border-2 border-white/20"
                size="lg"
              >
                <span className="flex items-center justify-center gap-2 sm:gap-3">
                  <span className="font-semibold">Despertar mi magia interior</span>
                  <span className="text-xl sm:text-2xl animate-bounce">✨</span>
                </span>
              </Button>
            </div>

            {/* Quick info points with improved mobile layout */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 pt-4 lg:pt-8">
              <div className="flex flex-col items-center space-y-2 p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-2xl sm:text-3xl animate-pulse-glow mb-1">🌟</div>
                <p className="text-sm sm:text-base text-white font-semibold">Carta astral única</p>
                <p className="text-xs text-white/70 text-center leading-relaxed">Basada en tu momento exacto de nacimiento</p>
              </div>
              
              <div className="flex flex-col items-center space-y-2 p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-2xl sm:text-3xl animate-pulse-glow mb-1" style={{ animationDelay: '0.5s' }}>💫</div>
                <p className="text-sm sm:text-base text-white font-semibold">Compatibilidad perfecta</p>
                <p className="text-xs text-white/70 text-center leading-relaxed">Algoritmo cósmico avanzado</p>
              </div>
              
              <div className="flex flex-col items-center space-y-2 p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300 sm:col-span-1">
                <div className="text-2xl sm:text-3xl animate-pulse-glow mb-1" style={{ animationDelay: '1s' }}>💖</div>
                <p className="text-sm sm:text-base text-white font-semibold">Tu conexión cósmica</p>
                <p className="text-xs text-white/70 text-center leading-relaxed">Esperándote en el universo</p>
              </div>
            </div>
          </div>
          
          {/* Right side - Enhanced visual element for desktop */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-80 h-80 xl:w-96 xl:h-96">
              {/* Multiple glowing circles */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/40 via-pink-400/30 to-blue-500/40 rounded-full animate-pulse-glow blur-lg"></div>
              <div className="absolute inset-6 bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-blue-600/30 rounded-full animate-float border border-white/20"></div>
              <div className="absolute inset-12 bg-gradient-to-br from-purple-600/20 via-pink-600/15 to-blue-700/20 rounded-full border border-white/10 animate-pulse" style={{ animationDelay: '2s' }}></div>
              
              {/* Central cosmic symbol */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-7xl xl:text-8xl animate-float drop-shadow-2xl" style={{ animationDelay: '1s' }}>
                  ✨
                </div>
              </div>
              
              {/* Floating cosmic elements */}
              <div className="absolute top-8 right-12 text-3xl animate-bounce opacity-80" style={{ animationDelay: '0.5s' }}>🌙</div>
              <div className="absolute bottom-12 left-8 text-2xl animate-bounce opacity-70" style={{ animationDelay: '1.5s' }}>⭐</div>
              <div className="absolute top-1/3 left-4 text-xl animate-bounce opacity-60" style={{ animationDelay: '2s' }}>💫</div>
              <div className="absolute bottom-1/4 right-6 text-2xl animate-bounce opacity-75" style={{ animationDelay: '2.5s' }}>🔮</div>
              <div className="absolute top-1/4 right-4 text-lg animate-float opacity-65" style={{ animationDelay: '3s' }}>🌟</div>
            </div>
          </div>

          {/* Mobile cosmic decoration */}
          <div className="lg:hidden flex justify-center mt-6">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 via-pink-400/20 to-blue-500/30 rounded-full animate-pulse-glow"></div>
              <div className="absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl animate-float">
                ✨
              </div>
              <div className="absolute top-2 right-4 text-lg animate-bounce opacity-70" style={{ animationDelay: '0.5s' }}>🌙</div>
              <div className="absolute bottom-4 left-2 text-base animate-bounce opacity-60" style={{ animationDelay: '1s' }}>⭐</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
