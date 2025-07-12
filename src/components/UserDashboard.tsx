
import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Home,
  Sparkles, 
  User, 
  Settings, 
  Lock,
  Heart,
  MessageCircle 
} from 'lucide-react';

const matches = [
  {
    id: 1,
    name: "Luna",
    age: 28,
    zodiacSign: "Cáncer",
    compatibility: 94,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b550?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Stellar",
    age: 26,
    zodiacSign: "Piscis",
    compatibility: 89,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Aurora",
    age: 30,
    zodiacSign: "Libra",
    compatibility: 85,
    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "Celeste",
    age: 27,
    zodiacSign: "Géminis",
    compatibility: 82,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
  }
];

interface UserDashboardProps {
  onShowPaymentModal: () => void;
}

export default function UserDashboard({ onShowPaymentModal }: UserDashboardProps) {
  const { user, hasPaidAccess } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'chart' | 'profile' | 'settings'>('home');

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Alma Cósmica';

  const renderHomeTab = () => (
    <div className="space-y-6">
      {/* Header personalizado */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">
          Hola, {userName} 🌙
        </h1>
        <p className="text-white/80 text-lg">
          Tu carta astral ha sido leída. Aquí están tus matches cósmicos.
        </p>
      </div>

      {/* Dashboard de matches */}
      <div className="space-y-4">
        {matches.map((match) => (
          <Card key={match.id} className="glass-card p-4 relative overflow-hidden">
            {!hasPaidAccess && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Lock className="w-8 h-8 text-white mx-auto" />
                  <p className="text-white text-sm font-medium">Match bloqueado</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img 
                  src={match.avatar} 
                  alt={match.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-purple-400/50"
                />
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1">
                  <Heart className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{match.name}</h3>
                  <span className="text-sm text-purple-300">{match.zodiacSign}</span>
                </div>
                <p className="text-white/70">{match.age} años</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex-1 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${match.compatibility}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-white font-medium">{match.compatibility}%</span>
                </div>
                <p className="text-xs text-purple-300 mt-1">Afinidad cósmica</p>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <Button
                onClick={hasPaidAccess ? () => {} : onShowPaymentModal}
                className="flex-1 stellar-button text-sm"
                disabled={!hasPaidAccess}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Hablar con {match.name}
              </Button>
              <Button
                onClick={hasPaidAccess ? () => {} : onShowPaymentModal}
                variant="outline"
                className="px-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
                disabled={!hasPaidAccess}
              >
                Ver perfil
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderChartTab = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Mi Carta Astral ✨</h2>
        
        {/* Zodiac wheel animation */}
        <div className="relative w-48 h-48 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-purple-400/30 animate-spin" style={{ animationDuration: '20s' }}>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>
          </div>
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <span className="text-4xl">♈</span>
          </div>
        </div>
      </div>

      <Card className="glass-card p-6 space-y-4">
        <h3 className="text-xl font-semibold text-white text-center">Tu Esencia Cósmica</h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-white/80">Signo Solar</span>
              <span className="text-white font-semibold">Aries ♈</span>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-white/80">Luna</span>
              <span className="text-white font-semibold">Capricornio ♑</span>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-white/80">Ascendente</span>
              <span className="text-white font-semibold">Escorpio ♏</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 mt-4">
          <p className="text-white text-center italic">
            "Eres fuego que toma forma y dirige. Tu alma ardiente encuentra equilibrio en la tierra práctica, 
            mientras tu misterioso ascendente revela profundidades ocultas."
          </p>
        </div>
      </Card>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Mi Perfil 👤</h2>
      </div>
      
      <Card className="glass-card p-6 space-y-4">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{userName}</h3>
            <p className="text-white/70">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button className="w-full stellar-button">
            Editar Foto de Perfil
          </Button>
          <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
            Actualizar Información
          </Button>
          <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
            Cambiar Preferencias
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Ajustes ⚙️</h2>
      </div>
      
      <Card className="glass-card p-6 space-y-4">
        <div className="space-y-3">
          <Button 
            onClick={onShowPaymentModal}
            className="w-full stellar-button"
          >
            {hasPaidAccess ? 'Gestionar Suscripción' : 'Activar Premium'}
          </Button>
          <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
            Notificaciones
          </Button>
          <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
            Privacidad
          </Button>
          <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
            Soporte
          </Button>
          <Button variant="destructive" className="w-full">
            Cerrar Sesión
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* Floating stars */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-1 h-1 bg-purple-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-60 left-1/4 w-1.5 h-1.5 bg-pink-300 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Main content */}
      <div className="relative z-10 pb-20">
        <div className="container mx-auto px-4 py-8">
          {activeTab === 'home' && renderHomeTab()}
          {activeTab === 'chart' && renderChartTab()}
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-lg border-t border-white/20">
        <div className="flex justify-around py-2">
          {[
            { id: 'home', icon: Home, label: 'Inicio' },
            { id: 'chart', icon: Sparkles, label: 'Mi Carta' },
            { id: 'profile', icon: User, label: 'Perfil' },
            { id: 'settings', icon: Settings, label: 'Ajustes' }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-all ${
                activeTab === id 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Payment modal trigger for blocked matches */}
      {!hasPaidAccess && (
        <div className="fixed inset-0 pointer-events-none">
          {/* This will be handled by the parent component */}
        </div>
      )}
    </div>
  );
}
