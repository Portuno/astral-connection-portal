import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { XCircle, Home, Crown } from 'lucide-react'

const PaymentCancelled = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  const handleTryAgain = () => {
    navigate('/premium')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Pago Cancelado
          </CardTitle>
          <CardDescription className="text-gray-600">
            No se completó tu suscripción premium
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Mensaje informativo */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-700 text-center">
              No te preocupes, puedes intentar nuevamente cuando quieras.
              <br />
              Tu cuenta gratuita sigue activa.
            </p>
          </div>

          {/* Beneficios premium recordatorio */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-center">
              ¿Qué te pierdes sin Premium?
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                Acceso ilimitado a todos los perfiles
              </div>
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                Chat sin límites con otros usuarios
              </div>
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                Lecturas de tarot personalizadas
              </div>
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                Horóscopo diario detallado
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            <Button
              onClick={handleTryAgain}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <Crown className="w-4 h-4 mr-2" />
              Intentar Nuevamente
            </Button>
            
            <Button
              onClick={handleGoHome}
              variant="outline"
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </div>

          {/* Información adicional */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              ¿Tienes preguntas sobre el pago?
              <br />
              Contacta a soporte@astrotarot.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PaymentCancelled 