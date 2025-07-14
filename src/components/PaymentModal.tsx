
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Crown, MessageCircle, Heart, Sparkles, Users } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const benefits = [
    {
      icon: MessageCircle,
      title: "Chat Ilimitado",
      description: "Conversaciones sin límites con todos tus matches cósmicos",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: Heart,
      title: "Matches Personalizados",
      description: "Perfiles únicos basados en tu carta astral y compatibilidad",
      color: "from-pink-400 to-pink-600"
    },
    {
      icon: Sparkles,
      title: "Compatibilidad Detallada",
      description: "Análisis profundo de conexión astral con cada match",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: Users,
      title: "Filtros Avanzados",
      description: "Encuentra exactamente lo que buscas según tus preferencias",
      color: "from-blue-400 to-blue-600"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none'
        }}
      >
        {/* Semi-transparent overlay that shows background content */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal content */}
        <div className="relative w-full max-w-md mx-auto bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-xl border-2 border-white/20 text-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden">
          
          {/* Header */}
          <DialogHeader className="relative p-4 sm:p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg sm:text-xl font-bold flex items-center space-x-2">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                <span>Activa tu Magia Premium</span>
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Floating cosmic elements in header */}
            <div className="absolute top-2 right-16 text-lg animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}>✨</div>
            <div className="absolute top-4 left-4 text-sm animate-pulse opacity-40" style={{ animationDelay: '1s' }}>🌟</div>
          </DialogHeader>

          {/* Scrollable content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)] sm:max-h-[calc(85vh-140px)]">
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              
              {/* Hero section */}
              <div className="text-center space-y-3">
                <div className="relative mx-auto">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse-glow shadow-2xl">
                    <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-sm animate-bounce">
                    👑
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold leading-tight">
                  Para conectar con tu alma gemela, activa tu energía cósmica
                </h3>
                <p className="text-white/80 text-sm leading-relaxed px-2">
                  Desbloquea todo el poder del universo para encontrar tu match perfecto
                </p>
              </div>

              {/* Benefits Grid - Mobile Optimized */}
              <div className="space-y-3">
                {benefits.map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <Card key={index} className="bg-white/10 border-white/20 p-4 hover:bg-white/15 transition-all duration-300 rounded-2xl backdrop-blur-md">
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-r ${benefit.color} rounded-full flex items-center justify-center flex-shrink-0 shadow-lg`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white text-sm sm:text-base">{benefit.title}</h4>
                          <p className="text-white/70 text-xs sm:text-sm leading-relaxed mt-1">{benefit.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Premium Access Info */}
              <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/30 p-4 text-center backdrop-blur-md rounded-2xl">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span className="font-bold text-yellow-400 text-base">Acceso Premium</span>
                </div>
                <p className="text-white/90 text-sm">
                  ✨ Activación inmediata • 🔒 Pago 100% seguro • 💫 Sin compromisos
                </p>
              </Card>

              {/* Square Payment Button - Mobile Optimized */}
              <div className="w-full flex justify-center pt-2">
                <div style={{
                  overflow: "auto",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  width: "100%",
                  maxWidth: "300px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
                  borderRadius: "24px",
                  fontFamily: "Karla, SQ Market, Helvetica, Arial, sans-serif"
                }}>
                  <div style={{ padding: "20px", width: "100%" }}>
                    <div className="text-center mb-4">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Crown className="w-5 h-5 text-yellow-300" />
                        <p style={{
                          fontSize: "16px",
                          lineHeight: "20px",
                          color: "#ffffff",
                          fontWeight: "600",
                          margin: 0
                        }}>AlmaEstelar Premium</p>
                      </div>
                      <p style={{
                        fontSize: "28px",
                        lineHeight: "32px",
                        fontWeight: "700",
                        color: "#ffffff",
                        margin: "4px 0 0 0"
                      }}>29,90€</p>
                    </div>
                    <a 
                      target="_blank" 
                      href="https://square.link/u/NuZ4xbVI?src=embed" 
                      style={{
                        display: "inline-block",
                        fontSize: "14px",
                        lineHeight: "48px",
                        height: "48px",
                        color: "#ffffff",
                        width: "100%",
                        backgroundColor: "#ff6b6b",
                        textAlign: "center",
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                        borderRadius: "24px",
                        textDecoration: "none",
                        transition: "all 0.3s ease",
                        fontWeight: "600"
                      }}
                      onMouseEnter={(e) => {
                        const target = e.target as HTMLAnchorElement;
                        target.style.backgroundColor = "#ff5252";
                        target.style.transform = "translateY(-2px)";
                        target.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        const target = e.target as HTMLAnchorElement;
                        target.style.backgroundColor = "#ff6b6b";
                        target.style.transform = "translateY(0)";
                        target.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
                      }}
                    >
                      🌟 Activar Magia Cósmica
                    </a>
                  </div>
                  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Karla" />
                </div>
              </div>

              <p className="text-xs text-white/60 text-center leading-relaxed pb-2">
                🔐 Pago seguro con Square • ⚡ Activación instantánea • 💫 Cancela cuando quieras
              </p>
            </div>
          </div>

          {/* Bottom hint about chats waiting */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/90 to-transparent p-4 pointer-events-none">
            <div className="flex items-center justify-center space-x-2 text-white/60 text-xs">
              <Heart className="w-3 h-3" />
              <span>Tus matches cósmicos te esperan...</span>
              <Sparkles className="w-3 h-3" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
