import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Check, Crown, Star, X } from 'lucide-react'
import { useToast } from './ui/use-toast'

const PremiumCheckout = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  // Cierre accesible
  const handleClose = () => {
    navigate(-1)
  }

  const handleUpgradeToPremium = async () => {
    console.log("Botón Activar Premium presionado");
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para activar premium",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      // Llamar a la Edge Function de Supabase
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/square-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          user_id: user.id
        })
      })

      console.log("Respuesta fetch:", response);
      const data = await response.json();
      console.log("Respuesta de Square:", data);

      const url =
        data.checkout_session?.checkout_url ||
        data.checkout_session?.payment_link?.url ||
        data.checkout_session?.url;

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No se pudo crear la sesión de pago');
      }

    } catch (error) {
      console.error("Error en handleUpgradeToPremium:", error);
      toast({
        title: "Error",
        description: "No se pudo procesar el pago. Inténtalo de nuevo.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const premiumFeatures = [
    "Acceso ilimitado a todos los perfiles",
    "Chat sin límites con otros usuarios",
    "Lecturas de tarot personalizadas",
    "Horóscopo diario detallado",
    "Compatibilidad astrológica avanzada",
    "Sin anuncios",
    "Soporte prioritario"
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div
        className="relative w-full max-w-md mx-auto rounded-3xl shadow-2xl bg-gradient-to-br from-white/90 via-purple-100/90 to-blue-100/90 flex flex-col items-center h-[90vh]"
      >
        {/* Botón de cierre */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-cosmic-magenta focus:outline-none focus:ring-2 focus:ring-cosmic-magenta rounded-full bg-white/70 p-1 z-20"
          aria-label="Cerrar"
        >
          <X className="w-6 h-6" />
        </button>
        {/* Header visual */}
        <div className="w-full flex flex-col items-center pt-8 pb-2 px-4">
          <div className="flex justify-center mb-2">
            <div className="relative">
              <Crown className="w-14 h-14 text-yellow-500 drop-shadow-lg" />
              <Star className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-cosmic-magenta text-center mb-1">¡Premium!</h2>
          <p className="text-sm text-gray-700 text-center mb-1 max-w-xs">
            Desbloquea los chats, accede a funciones exclusivas y vive el amor cósmico sin límites.
          </p>
        </div>
        {/* Precio y beneficios scrollable */}
        <div className="w-full flex-1 flex flex-col justify-between px-4 pb-2 overflow-y-auto">
          <div className="text-center mb-2">
            <span className="text-3xl font-bold text-cosmic-magenta">€29,90</span>
            <span className="ml-1 text-base text-gray-600 font-semibold">/mes</span>
            <div className="text-xs text-gray-500 mt-1">Cancela cuando quieras</div>
          </div>
          <div className="space-y-2 mb-2">
            <h3 className="font-semibold text-cosmic-magenta mb-1 text-center">Incluye:</h3>
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 bg-white/70 rounded-lg px-2 py-1 shadow-sm">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 text-xs font-medium">{feature}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-1">
            <p className="text-xs text-gray-500">
              Pago seguro procesado por Square
            </p>
          </div>
        </div>
        {/* Botón de pago fijo abajo */}
        <div className="w-full flex-shrink-0 px-4 pb-4 pt-2 sticky bottom-0 bg-gradient-to-t from-white/80 via-white/60 to-transparent z-10">
          <Button
            onClick={handleUpgradeToPremium}
            disabled={isLoading}
            className="w-full h-16 text-xl bg-gradient-to-r from-cosmic-magenta to-purple-600 hover:from-cosmic-magenta/90 hover:to-purple-600/90 text-white font-bold rounded-2xl shadow-lg"
            style={{ minHeight: '60px', fontSize: '1.3rem' }}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Procesando...
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center w-full">
                <Crown className="w-6 h-6" />
                Activar Premium
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PremiumCheckout 