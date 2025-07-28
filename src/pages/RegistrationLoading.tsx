import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Star, Moon, Sun } from 'lucide-react';

const RegistrationLoading = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    "Cargando tu información en el sistema...",
    "Analizando tu energía cósmica...",
    "Preparando tu carta natal...",
    "Conectando con las estrellas...",
    "¡Listo para descubrir tu destino!"
  ];

  useEffect(() => {
    const totalDuration = 4000; // 4 segundos
    const intervalMs = totalDuration / 100;
    const stepInterval = totalDuration / steps.length;
    
    // Progress timer
    const progressTimer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => navigate("/premium"), 500);
          return 100;
        }
        return prevProgress + 1;
      });
    }, intervalMs);

    // Step timer
    const stepTimer = setInterval(() => {
      setCurrentStep((prevStep) => {
        if (prevStep >= steps.length - 1) {
          clearInterval(stepTimer);
          return prevStep;
        }
        return prevStep + 1;
      });
    }, stepInterval);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
    };
  }, [navigate, steps.length]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0a1033] via-[#1a1440] to-[#2a0a3c] text-white">
      {/* Fondo galáctico */}
      <div className="fixed inset-0 -z-10">
        <svg className="w-full h-full" style={{ pointerEvents: 'none' }}>
          <defs>
            <radialGradient id="star-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Estrellas animadas */}
          {[...Array(20)].map((_, i) => (
            <circle
              key={i}
              cx={Math.random() * 100 + '%'}
              cy={Math.random() * 100 + '%'}
              r={Math.random() * 1.5 + 0.5}
              fill="url(#star-glow)"
              opacity={0.6 + Math.random() * 0.4}
              className="animate-pulse"
              style={{
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </svg>
      </div>

      <div className="text-center max-w-md mx-auto px-6">
        {/* Icono animado */}
        <div className="mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-cosmic-magenta via-purple-500 to-cosmic-gold rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            {/* Estrellas orbitantes */}
            <div className="absolute inset-0 animate-spin">
              <Star className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 text-cosmic-gold" />
              <Moon className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-4 h-4 text-blue-400" />
              <Sun className="absolute bottom-1/2 -left-2 transform translate-y-1/2 w-4 h-4 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-cosmic-gold via-cosmic-magenta to-purple-400 bg-clip-text text-transparent">
          Preparando tu viaje astral
        </h1>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-cosmic-magenta to-cosmic-gold h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-400">{progress}% completado</p>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <p className="text-lg text-white mb-2 font-medium">
            {steps[currentStep]}
          </p>
          <div className="flex justify-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-cosmic-gold' 
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mensaje motivacional */}
        <div className="text-sm text-gray-300 leading-relaxed">
          <p>Las estrellas se alinean para ti...</p>
          <p className="mt-1">Tu destino cósmico está a punto de revelarse</p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationLoading; 