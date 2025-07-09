
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
      <div className="py-8 md:py-12 px-4 md:px-6">
        <div className="max-w-lg mx-auto">
          <Card className="glass-card p-6 text-center">
            <div className="animate-pulse">
              <div className="h-6 bg-white/20 rounded mb-4"></div>
              <div className="h-4 bg-white/10 rounded"></div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // User not logged in
  if (!user) {
    return (
      <>
        <section className="py-8 md:py-12 px-4 md:px-6">
          <div className="max-w-lg mx-auto">
            <Card className="glass-card p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse-glow">
                <span className="text-2xl">🔐</span>
              </div>
              
              <h2 className="text-xl font-bold text-white">
                Accede a Tu Destino Cósmico
              </h2>
              
              <p className="text-white/80">
                Inicia sesión para acceder a tus perfiles de alma gemela y comenzar a chatear.
              </p>
              
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="stellar-button w-full"
              >
                Iniciar Sesión / Registrarse ✨
              </Button>
            </Card>
          </div>
        </section>
        
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </>
    );
  }

  // User logged in but no paid access
  if (!hasPaidAccess) {
    return (
      <section className="py-8 md:py-12 px-4 md:px-6">
        <div className="max-w-lg mx-auto">
          <Card className="glass-card p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse-glow">
              <span className="text-2xl">💫</span>
            </div>
            
            <h2 className="text-xl font-bold text-white">
              ¡Hola {user.user_metadata?.name || 'Alma Cósmica'}!
            </h2>
            
            <p className="text-white/80">
              Tu carta astral está lista. Para acceder a tus matches cósmicos y comenzar a chatear, activa tu suscripción.
            </p>
            
            <div className="bg-white/10 p-4 rounded-lg text-left space-y-2">
              <h3 className="font-semibold text-white">Acceso Premium incluye:</h3>
              <ul className="text-sm text-white/80 space-y-1">
                <li>• 8 perfiles de alma gemela personalizados</li>
                <li>• Chat ilimitado con tus matches</li>
                <li>• Compatibilidad astral detallada</li>
                <li>• Acceso 24/7 a tu panel personal</li>
              </ul>
            </div>
            
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
                  }}>AstroTarot</p>
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
                    Activar Acceso Premium
                  </a>
                </div>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Karla" />
              </div>
            </div>
            
            <p className="text-xs text-white/60">
              Pago seguro mediante Square. Acceso inmediato tras el pago.
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
    <section className="py-8 md:py-12 px-4 md:px-6">
      <div className="max-w-lg mx-auto">
        <Card className="glass-card p-4 md:p-6">
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
        </Card>
      </div>
    </section>
  );
}

export { PaymentGate };
