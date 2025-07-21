import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { CheckCircle, Crown, Home, MessageCircle } from 'lucide-react'
import { useToast } from '../components/ui/use-toast'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const [isVerifying, setIsVerifying] = useState(true)
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        toast({
          title: "Error",
          description: "No se encontró información de pago",
          variant: "destructive"
        })
        navigate('/')
        return
      }

      try {
        // Verificar el estado del pago con Square
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/square-webhook`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            session_id: sessionId
          })
        })

        if (response.ok) {
          // Refrescar datos del usuario para obtener el estado premium
          await refreshUser()
          
          toast({
            title: "¡Bienvenido a Premium!",
            description: "Tu suscripción premium ha sido activada exitosamente",
          })
        } else {
          throw new Error('Error al verificar el pago')
        }

      } catch (error) {
        console.error('Error verificando pago:', error)
        toast({
          title: "Error",
          description: "Hubo un problema al verificar tu pago. Contacta soporte.",
          variant: "destructive"
        })
      } finally {
        setIsVerifying(false)
      }
    }

    verifyPayment()
  }, [sessionId, navigate, toast, refreshUser])

  const handleGoHome = () => {
    navigate('/')
  }

  const handleStartChatting = () => {
    navigate('/chats')
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Verificando tu pago...
            </h2>
            <p className="text-gray-600">
              Estamos confirmando tu suscripción premium
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            ¡Pago Exitoso!
          </CardTitle>
          <CardDescription className="text-gray-600">
            Tu suscripción premium ha sido activada
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Estado premium */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800">
                Estado: Premium
              </span>
            </div>
            <p className="text-sm text-yellow-700">
              Ahora tienes acceso a todas las funciones premium
            </p>
          </div>

          {/* Próximos pasos */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">
              ¿Qué puedes hacer ahora?
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Explorar todos los perfiles sin límites
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Chatear con otros usuarios
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Obtener lecturas de tarot personalizadas
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Acceder a horóscopos detallados
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            <Button
              onClick={handleStartChatting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Empezar a Chatear
            </Button>
            
            <Button
              onClick={handleGoHome}
              variant="outline"
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Ir al Inicio
            </Button>
          </div>

          {/* Información adicional */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Tu suscripción se renovará automáticamente cada mes.
              <br />
              Puedes cancelar en cualquier momento desde tu perfil.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PaymentSuccess 