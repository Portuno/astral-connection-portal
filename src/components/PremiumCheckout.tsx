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

      const data = await response.json()

      if (data.checkout_session?.checkout_url) {
        // Redirigir a Square Checkout
        window.location.href = data.checkout_session.checkout_url
      } else {
        throw new Error('No se pudo crear la sesión de pago')
      }

    } catch (error) {
      console.error('Error al procesar el pago:', error)
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
      {/* Modal centrado */}
      <div
        className="relative w-[95vw] max-w-2xl mx-auto rounded-3xl shadow-2xl bg-gradient-to-br from-white/90 via-purple-100/90 to-blue-100/90 p-0 flex flex-col items-center"
        style={{ minHeight: '60vh', maxHeight: '90vh', width: '90vw', maxWidth: '420px' }}
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
        <div className="w-full flex flex-col items-center pt-8 pb-4 px-6">
          <div className="flex justify-center mb-2">
            <div className="relative">
              <Crown className="w-16 h-16 text-yellow-500 drop-shadow-lg" />
              <Star className="w-7 h-7 text-yellow-400 absolute -top-3 -right-3 animate-pulse" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-cosmic-magenta text-center mb-2">¡Descubre tu experiencia Premium!</h2>
          <p className="text-base text-gray-700 text-center mb-2 max-w-xs">
            Desbloquea los chats, habla con tus conexiones estelares, accede a funciones exclusivas y vive el amor cósmico sin límites.
          </p>
        </div>
        {/* Precio y beneficios */}
        <div className="w-full flex-1 flex flex-col justify-between px-6 pb-6">
          <div className="text-center mb-4">
            <span className="text-4xl font-bold text-cosmic-magenta">€29,90</span>
            <span className="ml-2 text-base text-gray-600 font-semibold">/mes</span>
            <div className="text-xs text-gray-500 mt-1">Cancela cuando quieras</div>
          </div>
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-cosmic-magenta mb-2 text-center">Incluye:</h3>
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 bg-white/60 rounded-lg px-3 py-2 shadow-sm">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
          <Button
            onClick={handleUpgradeToPremium}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cosmic-magenta to-purple-600 hover:from-cosmic-magenta/90 hover:to-purple-600/90 text-white font-bold py-3 text-lg rounded-xl shadow-lg mt-2 mb-3"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Procesando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Activar Premium
              </div>
            )}
          </Button>
          <div className="text-center mt-2">
            <p className="text-xs text-gray-500">
              Pago seguro procesado por Square
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PremiumCheckout 