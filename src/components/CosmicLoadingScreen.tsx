
import { useEffect, useState } from "react";

interface CosmicLoadingScreenProps {
  onLoadingComplete: () => void;
}

const cosmicPhrases = [
  "✨ Las estrellas se alinean para revelarte tu destino...",
  "🌙 La luna susurra los secretos de tu alma gemela...",
  "🔮 El universo teje los hilos de tu conexión cósmica...",
  "⭐ Los planetas danzan para crear tu carta astral...",
  "💫 Tu energía se conecta con las fuerzas celestiales...",
  "🌟 El cosmos revela las pistas de tu amor verdadero...",
  "✨ Las constelaciones escriben tu historia de amor...",
  "🌙 Tu aura se sincroniza con la magia universal..."
];

const CosmicLoadingScreen = ({ onLoadingComplete }: CosmicLoadingScreenProps) => {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Change phrase every 1.5 seconds
    const phraseInterval = setInterval(() => {
      setCurrentPhrase(prev => (prev + 1) % cosmicPhrases.length);
    }, 1500);

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(phraseInterval);
          setTimeout(onLoadingComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => {
      clearInterval(phraseInterval);
      clearInterval(progressInterval);
    };
  }, [onLoadingComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>
      
      {/* Floating stars */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-white rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-2 h-2 bg-purple-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-60 left-1/4 w-2.5 h-2.5 bg-pink-300 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-40 right-1/4 w-2 h-2 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
      <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>

      <div className="text-center space-y-8 px-4 relative z-10">
        {/* Main cosmic symbol */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-400 via-pink-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse-glow">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-600 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '8s' }}>
              <span className="text-4xl animate-float">🔮</span>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-lg animate-bounce shadow-lg">
            ✨
          </div>
          <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-sm animate-bounce shadow-lg" style={{ animationDelay: '1s' }}>
            🌙
          </div>
        </div>

        {/* Phrase display */}
        <div className="space-y-4 min-h-[100px] flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
            Creando tu destino cósmico
          </h2>
          <p 
            className="text-lg md:text-xl text-white/90 leading-relaxed max-w-md mx-auto animate-fade-in"
            key={currentPhrase}
          >
            {cosmicPhrases[currentPhrase]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-sm mx-auto space-y-3">
          <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm">
            <div 
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 h-2 rounded-full transition-all duration-300 shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/70 text-sm">
            {progress}% completado
          </p>
        </div>

        {/* Additional cosmic elements */}
        <div className="flex justify-center space-x-4 text-2xl animate-bounce">
          <span style={{ animationDelay: '0s' }}>⭐</span>
          <span style={{ animationDelay: '0.2s' }}>✨</span>
          <span style={{ animationDelay: '0.4s' }}>🌟</span>
          <span style={{ animationDelay: '0.6s' }}>💫</span>
        </div>
      </div>
    </div>
  );
};

export default CosmicLoadingScreen;
