
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Crown, MessageCircle, Heart, Sparkles } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-lg border border-white/20 text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center space-x-2">
              <Crown className="w-6 h-6 text-yellow-400" />
              <span>Activa tu Magia Premium</span>
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse-glow">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold">
              Para hablar con tu alma gemela, necesitas activar tu conexión cósmica
            </h3>
            <p className="text-white/80 text-sm">
              Desbloquea el poder de chatear con tus matches perfectos
            </p>
          </div>

          <Card className="bg-white/10 border-white/20 p-4 space-y-3">
            <h4 className="font-semibold text-center text-white">Premium incluye:</h4>
            <div className="space-y-2 text-sm text-white/90">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-purple-400" />
                <span>Chat ilimitado con tus matches</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-pink-400" />
                <span>8 perfiles de alma gemela personalizados</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>Compatibilidad astral detallada</span>
              </div>
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span>Acceso 24/7 a tu panel personal</span>
              </div>
            </div>
          </Card>

          {/* Square Payment Button */}
          <div className="w-full flex justify-center">
            <div style={{
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "center",
              width: "100%",
              maxWidth: "300px",
              background: "#FFFFFF",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              borderRadius: "16px",
              fontFamily: "Karla, SQ Market, Helvetica, Arial, sans-serif"
            }}>
              <div style={{ padding: "20px", width: "100%" }}>
                <p style={{
                  fontSize: "18px",
                  lineHeight: "20px",
                  color: "#1a1f3a",
                  marginBottom: "8px",
                  textAlign: "center"
                }}>AstroTarot Premium</p>
                <p style={{
                  fontSize: "18px",
                  lineHeight: "20px",
                  fontWeight: "600",
                  color: "#1a1f3a",
                  marginBottom: "16px",
                  textAlign: "center"
                }}>29,90&nbsp;€</p>
                <a 
                  target="_blank" 
                  href="https://square.link/u/NuZ4xbVI?src=embed" 
                  style={{
                    display: "inline-block",
                    fontSize: "18px",
                    lineHeight: "48px",
                    height: "48px",
                    color: "#ffffff",
                    width: "100%",
                    backgroundColor: "#cc0023",
                    textAlign: "center",
                    boxShadow: "0 0 0 1px rgba(0,0,0,.1) inset",
                    borderRadius: "50px",
                    textDecoration: "none",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLAnchorElement;
                    target.style.backgroundColor = "#a8001d";
                    target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLAnchorElement;
                    target.style.backgroundColor = "#cc0023";
                    target.style.transform = "translateY(0)";
                  }}
                >
                  Activar Acceso Premium ✨
                </a>
              </div>
              <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Karla" />
            </div>
          </div>

          <p className="text-xs text-white/60 text-center">
            Pago seguro mediante Square. Acceso inmediato tras el pago.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
