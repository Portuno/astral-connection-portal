
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Loading = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [totalDuration] = useState(() => {
    // Duración aleatoria entre 7 y 12 segundos
    return Math.floor(Math.random() * (12 - 7 + 1)) + 7;
  });

  const steps = [
    "Analizando tu carta natal...",
    "Calculando posiciones planetarias...",
    "Identificando aspectos astrológicos...",
    "Buscando conexiones cósmicas...",
    "Encontrando tu alma gemela..."
  ];

  useEffect(() => {
    // Calcular el intervalo basado en la duración total aleatoria
    const intervalMs = (totalDuration * 1000) / 100; // Dividir la duración total en 100 incrementos
    
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => navigate("/home"), 1000);
          return 100;
        }
        return prevProgress + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [navigate, totalDuration]);

  useEffect(() => {
    // Calcular el tiempo por paso basado en la duración total
    const stepInterval = (totalDuration * 1000) / steps.length;
    
    const stepTimer = setInterval(() => {
      setCurrentStep((prevStep) => {
        if (prevStep >= steps.length - 1) {
          clearInterval(stepTimer);
          return prevStep;
        }
        return prevStep + 1;
      });
    }, stepInterval);

    return () => clearInterval(stepTimer);
  }, [steps.length, totalDuration]);

  return (
    <div className="min-h-screen bg-cosmic-blue flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Animación principal */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto relative">
            {/* Círculo exterior giratorio */}
            <div className="absolute inset-0 border-4 border-cosmic-magenta/30 rounded-full animate-spin"></div>
            
            {/* Círculo medio */}
            <div className="absolute inset-2 border-4 border-cosmic-gold/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
            
            {/* Centro con estrellas */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl animate-pulse">✨</div>
            </div>
            
            {/* Estrellas orbitando */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 animate-spin origin-center" style={{ animationDuration: '4s' }}>
                <div className="text-cosmic-gold text-sm">⭐</div>
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 animate-spin origin-center" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
                <div className="text-cosmic-magenta text-sm">🌟</div>
              </div>
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-2 animate-spin origin-center" style={{ animationDuration: '5s' }}>
                <div className="text-white text-sm">💫</div>
              </div>
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-2 animate-spin origin-center" style={{ animationDuration: '5s', animationDirection: 'reverse' }}>
                <div className="text-cosmic-gold text-sm">🌙</div>
              </div>
            </div>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
          🔮 Conectando con el Cosmos
        </h1>

        {/* Paso actual */}
        <div className="mb-6">
          <p className="text-cosmic-gold text-lg font-medium mb-2">
            {steps[currentStep]}
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-white/20 rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cosmic-magenta to-cosmic-gold h-full rounded-full transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Porcentaje */}
        <p className="text-white/70 text-sm mb-8">
          {Math.round(progress)}% completado
        </p>

        {/* Mensaje motivacional */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <p className="text-white/80 text-sm italic">
            "Las estrellas no pueden brillar sin oscuridad. Tu luz perfecta está a punto de encontrar su complemento en el universo."
          </p>
        </div>

        {/* Partículas flotantes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
