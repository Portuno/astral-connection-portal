import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Preloading() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cosmic-blue via-indigo-900 to-purple-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cosmic-gold mx-auto mb-6"></div>
        <h2 className="text-2xl text-white mb-4">Analizando tu carta natal...</h2>
        <p className="text-white mb-2">Buscando compatibilidades cósmicas...</p>
        <p className="text-cosmic-gold">Esto puede tardar unos segundos</p>
      </div>
    </div>
  );
} 