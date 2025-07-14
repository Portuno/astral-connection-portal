import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, User, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';
import { useToast } from '@/components/ui/use-toast';

interface AvailableUser {
  id: string;
  name: string;
  email: string;
  birth_place?: string;
  onboarding_completed: boolean;
}

interface UserPickerProps {
  onSelectUser: (userId: string, userName: string) => void;
  onBack: () => void;
}

export const UserPicker = ({ onSelectUser, onBack }: UserPickerProps) => {
  const [users, setUsers] = useState<AvailableUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [starting, setStarting] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadAvailableUsers();
  }, [user]);

  const loadAvailableUsers = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Obtener usuarios que han completado el onboarding (excluyendo al usuario actual)
      const { data: availableUsers, error } = await supabase
        .from('profiles')
        .select('id, name, email, birth_place, onboarding_completed')
        .eq('onboarding_completed', true)
        .neq('id', user.id)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error loading users:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los usuarios disponibles.",
          variant: "destructive"
        });
        return;
      }

      if (availableUsers) {
        setUsers(availableUsers as AvailableUser[]);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "Error inesperado al cargar usuarios.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startConversation = async (otherUserId: string, otherUserName: string) => {
    if (!user || starting) return;

    try {
      setStarting(otherUserId);

      // Crear o obtener conversación
      const { data: conversationId, error } = await supabase.rpc(
        'get_or_create_user_conversation',
        { other_user_id: otherUserId }
      );

      if (error) {
        console.error('Error creating conversation:', error);
        toast({
          title: "Error",
          description: "No se pudo iniciar la conversación.",
          variant: "destructive"
        });
        return;
      }

      // Navegar al chat
      onSelectUser(otherUserId, otherUserName);
      
      toast({
        title: "¡Conversación iniciada! ✨",
        description: `Ya puedes chatear con ${otherUserName}`,
      });

    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "Error inesperado al iniciar conversación.",
        variant: "destructive"
      });
    } finally {
      setStarting(null);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.birth_place?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-white/20 bg-black/20 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-white">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-bold text-white">Nuevos amigos cósmicos</h2>
          </div>
          <div className="h-10 bg-white/20 rounded-lg animate-pulse"></div>
        </div>
        
        <div className="flex-1 p-4 space-y-3">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="glass-card p-4 animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/20 rounded w-3/4"></div>
                  <div className="h-3 bg-white/10 rounded w-1/2"></div>
                </div>
                <div className="w-20 h-8 bg-white/20 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/20 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">Nuevos amigos cósmicos</h2>
            <p className="text-sm text-white/70">Conecta con otros usuarios que han completado su carta astral</p>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, email o lugar..."
            className="bg-white/10 border-white/30 text-white placeholder:text-white/50 pl-10"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <User className="h-16 w-16 text-white/30 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios disponibles'}
            </h3>
            <p className="text-white/70 max-w-xs">
              {searchTerm 
                ? 'Intenta con otro término de búsqueda' 
                : 'Parece que eres uno de los primeros en completar tu carta astral. ¡Comparte la app con tus amigos!'}
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredUsers.map((otherUser) => (
              <Card
                key={otherUser.id}
                className="glass-card p-4 hover:bg-white/20 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">
                      {otherUser.name || otherUser.email}
                    </h3>
                    {otherUser.birth_place && (
                      <p className="text-sm text-white/70 truncate">
                        📍 {otherUser.birth_place}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-300 border border-green-400/30">
                        ✨ Carta astral completa
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => startConversation(otherUser.id, otherUser.name || otherUser.email)}
                    disabled={starting === otherUser.id}
                    size="sm"
                    className="stellar-button flex-shrink-0"
                  >
                    {starting === otherUser.id ? (
                      <>
                        <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Iniciando...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chatear
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 