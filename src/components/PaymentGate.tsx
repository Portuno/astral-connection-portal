
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from './AuthProvider';
import { AuthModal } from './AuthModal';
import { ChatProfiles } from './ChatProfiles';
import { ChatInterface } from './ChatInterface';

export default function PaymentGate() {
  const { user, hasPaidAccess, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentView, setCurrentView] = useState<'profiles' | 'chat'>('profiles');
  const [selectedProfile, setSelectedProfile] = useState<{id: string, name: string} | null>(null);

  if (loading) {
    return (
      <div className="py-6 sm:py-8 lg:py-12 px-4 sm:px-6">
        <div className="max-w-lg mx-auto">
          <Card className="glass-card p-4 sm:p-6 text-center">
            <div className="animate-pulse space-y-4">
              <div className="w-16 h-16 mx-auto bg-white/20 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-white/20 rounded mx-auto w-3/4"></div>
                <div className="h-3 bg-white/10 rounded mx-auto w-1/2"></div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // No user logged in
  if (!user) {
    return (
      <>
        <section className="py-6 sm:py-8 lg:py-12 px-4 sm:px-6">
          <div className="max-w-lg mx-auto">
            <Card className="glass-card p-4 sm:p-6 lg:p-8 text-center space-y-4 sm:space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse-glow shadow-2xl">
                <span className="text-2xl sm:text-3xl">🔮</span>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Tu Destino Cósmico Te Espera
                </h2>
                
                <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                  Inicia sesión para descubrir tu carta astral y conectar con almas compatibles en el universo.
                </p>
              </div>
              
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="w-full stellar-button bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                ✨ Iniciar Sesión Cósmica
              </Button>
            </Card>
          </div>
        </section>
        
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  // User logged in but no paid access
  if (!hasPaidAccess) {
    return (
      <section className="py-6 sm:py-8 lg:py-12 px-4 sm:px-6">
        <div className="max-w-xl mx-auto">
          <Card className="glass-card p-4 sm:p-6 lg:p-8 text-center space-y-4 sm:space-y-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse-glow shadow-2xl">
              <span className="text-2xl sm:text-3xl">💫</span>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                ¡Hola {user.user_metadata?.name || 'Alma Cósmica'}!
              </h2>
              
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                Tu carta astral está lista. Para acceder a tus matches cósmicos y comenzar a chatear, activa tu suscripción premium.
              </p>
            </div>
            
            {/* Premium Benefits */}
            <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl text-left space-y-3 border border-white/20">
              <h3 className="font-bold text-white text-center text-base sm:text-lg flex items-center justify-center gap-2">
                <span className="text-yellow-400">👑</span>
                Acceso Premium incluye:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm text-white/80">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                  <span className="text-purple-400">💖</span>
                  <span>Matches personalizados</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                  <span className="text-blue-400">💬</span>
                  <span>Chat ilimitado</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                  <span className="text-pink-400">✨</span>
                  <span>Compatibilidad detallada</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                  <span className="text-yellow-400">🌟</span>
                  <span>Acceso 24/7</span>
                </div>
              </div>
            </div>
            
            {/* Square Payment Button - Mobile Optimized */}
            <div className="w-full flex justify-center pt-2">
              <div style={{
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                width: "100%",
                maxWidth: "320px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "2px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
                borderRadius: "20px",
                fontFamily: "Karla, SQ Market, Helvetica, Arial, sans-serif"
              }}>
                <div style={{ padding: "20px", width: "100%" }}>
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-yellow-300 text-lg">👑</span>
                      <p style={{
                        fontSize: "16px",
                        lineHeight: "20px",
                        color: "#ffffff",
                        fontWeight: "600",
                        margin: 0
                      }}>AlmaEstelar Premium</p>
                    </div>
                    <p style={{
                      fontSize: "24px",
                      lineHeight: "28px",
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
            
            <p className="text-xs text-white/60 text-center leading-relaxed">
              🔐 Pago seguro con Square • ⚡ Activación instantánea • 💫 Cancela cuando quieras
            </p>
          </Card>
        </div>
      </section>
    );
  }

  // User has paid access - show chat interface
  const handleStartChat = (profileId: string, profileName: string) => {
    setSelectedProfile({ id: profileId, name: profileName });
    setCurrentView('chat');
  };

  const handleBackToProfiles = () => {
    setCurrentView('profiles');
    setSelectedProfile(null);
  };

  return (
    <div className="py-4 sm:py-6 lg:py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {currentView === 'profiles' ? (
          <ChatProfiles onStartChat={handleStartChat} />
        ) : (
          selectedProfile && (
            <ChatInterface 
              profileId={selectedProfile.id}
              profileName={selectedProfile.name}
              onBack={handleBackToProfiles}
            />
          )
        )}
      </div>
    </div>
  );
}

export { PaymentGate };
