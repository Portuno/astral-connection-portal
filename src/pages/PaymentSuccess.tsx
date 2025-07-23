import { useNavigate } from 'react-router-dom';
import { Sparkles, Star, Moon, Heart } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-10 left-10 animate-pulse">
          <Sparkles size={80} className="text-pink-400" />
        </div>
        <div className="absolute bottom-20 right-20 animate-spin-slow">
          <Star size={100} className="text-yellow-300" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce">
          <Moon size={120} className="text-indigo-300 opacity-30" />
        </div>
      </div>
      {/* Contenido principal */}
      <div className="z-10 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-10 flex flex-col items-center max-w-lg w-full border border-pink-400">
        <h1 className="text-4xl font-extrabold mb-2 text-pink-300 drop-shadow-lg tracking-wide text-center">¡Pago exitoso!</h1>
        <h2 className="text-2xl font-bold mb-4 text-yellow-200 text-center">Bienvenido a <span className="text-pink-400 drop-shadow-md">Amor Astral</span></h2>
        <Heart size={60} className="text-pink-400 mb-6 animate-pulse" aria-hidden="true" />
        <p className="text-lg text-center mb-8 text-white/90">
          ¡Gracias por confiar en nosotros!<br />
          Tu suscripción premium está activa y el universo de conexiones te espera.<br />
          Explora, conversa y déjate guiar por la magia del tarot y la astrología.
        </p>
        <button
          onClick={handleGoHome}
          className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-pink-300"
          aria-label="Volver a Home y conversar con los perfiles invitados"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleGoHome(); }}
        >
          Volver a Home y conversar con los perfiles invitados
        </button>
      </div>
      {/* Branding */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <span className="text-2xl font-extrabold text-pink-400 drop-shadow-lg tracking-widest">Amor Astral</span>
      </div>
    </div>
  );
};

export default PaymentSuccess; 