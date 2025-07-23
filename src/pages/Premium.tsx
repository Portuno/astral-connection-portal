import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { X } from 'lucide-react';

const GalacticBackground = () => (
  <div
    aria-hidden="true"
    className="fixed inset-0 -z-10 w-full h-full bg-gradient-to-br from-[#0a1033] via-[#1a1440] to-[#2a0a3c]">
    <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
      <defs>
        <radialGradient id="star-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {[...Array(18)].map((_, i) => (
        <circle
          key={i}
          cx={Math.random() * 100 + '%'}
          cy={Math.random() * 100 + '%'}
          r={Math.random() * 1.2 + 0.6}
          fill="url(#star-glow)"
          opacity={0.7}
        />
      ))}
      {[...Array(80)].map((_, i) => (
        <circle
          key={100 + i}
          cx={Math.random() * 100 + '%'}
          cy={Math.random() * 100 + '%'}
          r={Math.random() * 0.4 + 0.2}
          fill="#fff"
          opacity={0.3 + Math.random() * 0.5}
        />
      ))}
      <polyline points="10,20 30,40 50,20 70,60" stroke="#6ee7ff" strokeWidth="0.3" opacity="0.18" fill="none" />
      <polyline points="80,80 90,60 100,90" stroke="#a78bfa" strokeWidth="0.3" opacity="0.13" fill="none" />
    </svg>
  </div>
);

const Premium = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleActivatePremium = () => {
    toast({
      title: '¡Pronto podrás activar premium!',
      description: 'Aquí irá el flujo de pago con Square.',
      variant: 'success',
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <GalacticBackground />
      <div className="relative z-10 w-full max-w-2xl mx-auto rounded-3xl p-0 border-0 shadow-[0_0_64px_16px_rgba(80,200,255,0.18)] bg-[rgba(20,20,40,0.98)] backdrop-blur-2xl flex flex-col items-center mt-16 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-cyan-200 hover:text-cosmic-magenta focus:outline-none focus:ring-2 focus:ring-cosmic-magenta rounded-full bg-white/10 p-2 z-20"
          aria-label="Cerrar"
          tabIndex={0}
        >
          <X className="w-6 h-6" />
        </button>
        <DialogTitle className="text-3xl font-extrabold text-cosmic-magenta text-center mb-2 mt-10 drop-shadow-[0_2px_8px_rgba(168,139,250,0.25)]">Hazte Premium y desbloquea conversaciones cósmicas</DialogTitle>
        <DialogDescription className="text-cyan-100 text-center mb-4 max-w-lg">Accede a todas las funciones exclusivas de Amor Astral:</DialogDescription>
        <ul className="mb-6 space-y-3 w-full max-w-md mx-auto px-6">
          <li className="flex items-center gap-3 text-cyan-100 text-lg"><span className="text-cosmic-magenta font-bold text-xl">🔓</span> Desbloquear conversaciones cósmicas</li>
          <li className="flex items-center gap-3 text-cyan-100 text-lg"><span className="text-cosmic-magenta font-bold text-xl">💬</span> Acceso ilimitado a chats</li>
          <li className="flex items-center gap-3 text-cyan-100 text-lg"><span className="text-cosmic-magenta font-bold text-xl">🌟</span> Funciones exclusivas y soporte prioritario</li>
          <li className="flex items-center gap-3 text-cyan-100 text-lg"><span className="text-cosmic-magenta font-bold text-xl">🚫</span> Sin anuncios</li>
        </ul>
        <div className="w-full flex justify-center pb-10 px-6">
          <button
            onClick={handleActivatePremium}
            className="w-full max-w-md bg-gradient-to-r from-cosmic-magenta to-cyan-400 hover:from-cosmic-magenta/90 hover:to-cyan-400/90 text-white font-extrabold py-4 rounded-2xl shadow-lg text-xl tracking-wide border-2 border-cyan-200 animate-pulse focus:outline-none focus:ring-2 focus:ring-cosmic-magenta"
            tabIndex={0}
            aria-label="Activar Premium"
            style={{ boxShadow: '0 0 24px 4px #38bdf8cc, 0 0 64px 8px #a78bfa55' }}
          >
            Activar Premium, 29,9€ al mes
          </button>
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-3xl" style={{boxShadow:'0 0 96px 24px #38bdf855, 0 0 192px 48px #a78bfa22'}}></div>
      </div>
    </div>
  );
};

export default Premium; 