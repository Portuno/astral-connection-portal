import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Wifi, Database, MessageSquare, Users } from 'lucide-react';
import ConnectionDiagnostic from '@/components/ConnectionDiagnostic';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useFacebookPixel } from '@/hooks/useFacebookPixel';

const Diagnostic = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackContact } = useFacebookPixel();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  // Track Contact event when user accesses diagnostic page (intent to contact support)
  useEffect(() => {
    trackContact();
  }, [trackContact]);

  const runQuickTests = async () => {
    setIsTesting(true);
    const results = [];

    // Test 1: Conexión básica
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      results.push({
        test: 'Conexión Básica',
        status: error ? 'error' : 'success',
        message: error ? error.message : 'Conexión exitosa'
      });
    } catch (error) {
      results.push({
        test: 'Conexión Básica',
        status: 'error',
        message: error instanceof Error ? error.message : 'Error desconocido'
      });
    }

    // Test 2: Autenticación
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      results.push({
        test: 'Autenticación',
        status: session ? 'success' : 'warning',
        message: session ? `Usuario: ${session.user.email}` : 'No hay sesión activa'
      });
    } catch (error) {
      results.push({
        test: 'Autenticación',
        status: 'error',
        message: error instanceof Error ? error.message : 'Error desconocido'
      });
    }

    // Test 3: Permisos de mensajes
    try {
      const { data, error } = await supabase.from('messages').select('id').limit(1);
      results.push({
        test: 'Permisos de Mensajes',
        status: error ? 'error' : 'success',
        message: error ? error.message : 'Acceso permitido'
      });
    } catch (error) {
      results.push({
        test: 'Permisos de Mensajes',
        status: 'error',
        message: error instanceof Error ? error.message : 'Error desconocido'
      });
    }

    // Test 4: Permisos de chats
    try {
      const { data, error } = await supabase.from('chats').select('id').limit(1);
      results.push({
        test: 'Permisos de Chats',
        status: error ? 'error' : 'success',
        message: error ? error.message : 'Acceso permitido'
      });
    } catch (error) {
      results.push({
        test: 'Permisos de Chats',
        status: 'error',
        message: error instanceof Error ? error.message : 'Error desconocido'
      });
    }

    setTestResults(results);
    setIsTesting(false);

    // Mostrar resumen
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    
    if (errorCount === 0) {
      toast({
        title: "✅ Diagnóstico Exitoso",
        description: `Todos los ${results.length} tests pasaron correctamente`,
      });
    } else {
      toast({
        title: "⚠️ Problemas Detectados",
        description: `${errorCount} de ${results.length} tests fallaron`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1440] via-[#2a0a3c] to-[#0a1033] p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-cosmic-gold hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-cosmic-gold rounded-full p-2"
            tabIndex={0}
            aria-label="Volver a Home"
          >
            <ArrowLeft className="h-6 w-6" />
            <span className="font-semibold">Volver</span>
          </button>
          <h1 className="text-3xl font-bold text-white">🔧 Diagnóstico de Sistema</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tests Rápidos */}
          <Card className="bg-white/5 backdrop-blur-md border-cosmic-gold/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cosmic-gold">
                <Wifi className="h-5 w-5" />
                Tests Rápidos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm">
                Ejecuta tests básicos para verificar la conectividad y permisos del sistema.
              </p>
              
              <Button 
                onClick={runQuickTests} 
                disabled={isTesting}
                className="w-full bg-cosmic-magenta hover:bg-fuchsia-600"
              >
                {isTesting ? 'Ejecutando...' : 'Ejecutar Tests Rápidos'}
              </Button>

              {testResults.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-cosmic-gold">Resultados:</h4>
                  {testResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
                      <span className="text-sm text-gray-300">{result.test}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        result.status === 'success' ? 'bg-green-500/20 text-green-400' :
                        result.status === 'error' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {result.status === 'success' ? '✅' : 
                         result.status === 'error' ? '❌' : '⚠️'}
                        {result.message}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Diagnóstico Completo */}
          <Card className="bg-white/5 backdrop-blur-md border-cosmic-gold/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cosmic-gold">
                <Database className="h-5 w-5" />
                Diagnóstico Completo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm mb-4">
                Diagnóstico detallado de todos los componentes del sistema.
              </p>
              <ConnectionDiagnostic />
            </CardContent>
          </Card>
        </div>

        {/* Información de Solución de Problemas */}
        <Card className="mt-6 bg-white/5 backdrop-blur-md border-cosmic-gold/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cosmic-gold">
              <MessageSquare className="h-5 w-5" />
              Solución de Problemas Comunes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-cosmic-gold">Problemas de WebSocket:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Verificar configuración de firewall</li>
                  <li>• Comprobar variables de entorno</li>
                  <li>• Revisar políticas RLS en Supabase</li>
                  <li>• Verificar conectividad de red</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-cosmic-gold">Problemas de Permisos:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Ejecutar migración SQL 9_fix_realtime_policies.sql</li>
                  <li>• Verificar autenticación del usuario</li>
                  <li>• Comprobar políticas de acceso</li>
                  <li>• Revisar configuración de RLS</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
              <h4 className="font-medium text-yellow-400 mb-2">⚠️ Pasos Recomendados:</h4>
              <ol className="text-sm text-gray-300 space-y-1">
                <li>1. Ejecuta el archivo SQL <code className="bg-black/30 px-1 rounded">9_fix_realtime_policies.sql</code> en tu base de datos Supabase</li>
                <li>2. Verifica que las variables de entorno estén configuradas correctamente</li>
                <li>3. Asegúrate de que el usuario esté autenticado</li>
                <li>4. Si persisten los problemas, contacta al soporte técnico</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Diagnostic; 