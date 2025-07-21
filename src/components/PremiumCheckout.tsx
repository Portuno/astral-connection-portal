import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Check, Crown, Star } from 'lucide-react'
import { useToast } from './ui/use-toast'

const PremiumCheckout = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Crown className="w-16 h-16 text-yellow-500" />
              <Star className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Activar Premium
          </CardTitle>
          <CardDescription className="text-gray-600">
            Desbloquea todas las funciones premium de AstroTarot
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Precio */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-3xl font-bold text-gray-900">€29,90</span>
              <Badge variant="secondary" className="text-sm">
                /mes
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              Cancelación en cualquier momento
            </p>
          </div>

          {/* Lista de características */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 mb-3">
              Incluye:
            </h3>
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* Botón de pago */}
          <Button
            onClick={handleUpgradeToPremium}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 text-lg"
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

          {/* Información de seguridad */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Pago seguro procesado por Square
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PremiumCheckout 