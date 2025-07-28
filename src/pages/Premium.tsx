import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

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
  const { user, session } = useAuth();

  const handleActivatePremium = async () => {
    console.log("[DEBUG] Click en activar premium");
    if (!user || !session) {
      console.log("[DEBUG] Usuario o sesión no disponible", { user, session });
      toast({
        title: "Debes iniciar sesión",
        description: "Inicia sesión para activar premium.",
        variant: "destructive",
      });
      return;
    }
    try {
      console.log("[DEBUG] Llamando a Supabase function...", {
        user_id: user.id,
        access_token: session.access_token
      });
      const response = await fetch(
        "https://mfwvjjemxzgaddzlzodt.supabase.co/functions/v1/stripe-checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ user_id: user.id }),
        }
      );
      console.log("[DEBUG] Respuesta cruda de Supabase:", response);
      const data = await response.json();
      console.log("[DEBUG] JSON recibido de Supabase:", data);
      const url =
        data.checkout_url ||
        data.checkout_session?.checkout_page_url ||
        data.checkout_session?.checkout_url ||
        data.checkout_session?.payment_link?.url ||
        data.checkout_session?.url;
      if (url) {
        console.log("[DEBUG] Redirigiendo a:", url);
        window.location.href = url;
      } else {
        console.error("[DEBUG] No se pudo crear la sesión de pago", data);
        throw new Error("No se pudo crear la sesión de pago");
      }
    } catch (error) {
      console.error("[DEBUG] Error en handleActivatePremium:", error);
      toast({
        title: "Error",
        description: "No se pudo procesar el pago. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-1">
      <GalacticBackground />
      <div className="relative z-10 w-full max-w-md mx-auto rounded-3xl border-0 shadow-[0_0_64px_16px_rgba(80,200,255,0.18)] bg-[rgba(20,20,40,0.98)] backdrop-blur-2xl flex flex-col items-center px-5 py-7">
        <button
          onClick={() => navigate('/home')}
          className="absolute top-3 right-3 text-cyan-200 hover:text-cosmic-magenta focus:outline-none focus:ring-2 focus:ring-cosmic-magenta rounded-full bg-white/10 p-1.5 z-20"
          aria-label="Cerrar"
          tabIndex={0}
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-5">
          <h1 className="text-2xl md:text-3xl font-bold text-cosmic-magenta mb-3 leading-tight drop-shadow-[0_2px_8px_rgba(168,139,250,0.25)]">
            Hazte Premium y desbloquea conversaciones cósmicas
          </h1>
          <p className="text-cyan-100 text-sm md:text-base leading-relaxed max-w-sm mx-auto">
            Accede a todas las funciones exclusivas de Amor Astral y realiza tu pago premium de forma segura a través de Stripe:
          </p>
        </div>

        <div className="w-full mb-5">
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-cyan-100 text-sm md:text-base leading-relaxed">
              <span className="text-cosmic-magenta font-bold text-lg flex-shrink-0 mt-0.5">🔓</span>
              <span>Desbloquear conversaciones cósmicas</span>
            </li>
            <li className="flex items-start gap-3 text-cyan-100 text-sm md:text-base leading-relaxed">
              <span className="text-cosmic-magenta font-bold text-lg flex-shrink-0 mt-0.5">💬</span>
              <span>Acceso ilimitado a chats</span>
            </li>
            <li className="flex items-start gap-3 text-cyan-100 text-sm md:text-base leading-relaxed">
              <span className="text-cosmic-magenta font-bold text-lg flex-shrink-0 mt-0.5">🌟</span>
              <span>Funciones exclusivas y soporte prioritario</span>
            </li>
            <li className="flex items-start gap-3 text-cyan-100 text-sm md:text-base leading-relaxed">
              <span className="text-cosmic-magenta font-bold text-lg flex-shrink-0 mt-0.5">🚫</span>
              <span>Sin anuncios</span>
            </li>
          </ul>
        </div>

        <div className="w-full">
          <button
            onClick={handleActivatePremium}
            className="w-full bg-gradient-to-r from-cosmic-magenta to-cyan-400 hover:from-cosmic-magenta/90 hover:to-cyan-400/90 text-white font-bold py-4 px-4 rounded-2xl shadow-lg text-base md:text-lg tracking-wide border-2 border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cosmic-magenta transition-all duration-200"
            tabIndex={0}
            aria-label="Activar Premium con Stripe"
            style={{ boxShadow: '0 0 24px 4px #38bdf8cc, 0 0 64px 8px #a78bfa55' }}
          >
            Activa tu suscripción por 29,9€ con pago seguro Stripe
          </button>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-3xl" style={{boxShadow:'0 0 96px 24px #38bdf855, 0 0 192px 48px #a78bfa22'}}></div>
      </div>
    </div>
  );
};

export default Premium; 