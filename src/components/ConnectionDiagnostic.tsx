import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'warning' | 'loading';
  message: string;
  details?: string;
}

const ConnectionDiagnostic = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const newResults: DiagnosticResult[] = [];

    // 1. Verificar variables de entorno
    newResults.push({
      name: 'Variables de Entorno',
      status: 'loading',
      message: 'Verificando configuración...'
    });

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      newResults[0] = {
        name: 'Variables de Entorno',
        status: 'error',
        message: 'Faltan variables de entorno',
        details: `URL: ${supabaseUrl ? '✅' : '❌'}, Key: ${supabaseKey ? '✅' : '❌'}`
      };
    } else {
      newResults[0] = {
        name: 'Variables de Entorno',
        status: 'success',
        message: 'Configuración correcta',
        details: `URL: ${supabaseUrl.substring(0, 20)}..., Key: ${supabaseKey.substring(0, 20)}...`
      };
    }

    setResults([...newResults]);

    // 2. Verificar conexión HTTP
    newResults.push({
      name: 'Conexión HTTP',
      status: 'loading',
      message: 'Probando conexión...'
    });

    setResults([...newResults]);

    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error) {
        newResults[1] = {
          name: 'Conexión HTTP',
          status: 'error',
          message: 'Error de conexión HTTP',
          details: error.message
        };
      } else {
        newResults[1] = {
          name: 'Conexión HTTP',
          status: 'success',
          message: 'Conexión HTTP exitosa',
          details: 'Respuesta recibida correctamente'
        };
      }
    } catch (error) {
      newResults[1] = {
        name: 'Conexión HTTP',
        status: 'error',
        message: 'Error de conexión HTTP',
        details: error instanceof Error ? error.message : 'Error desconocido'
      };
    }

    setResults([...newResults]);

    // 3. Verificar autenticación
    newResults.push({
      name: 'Autenticación',
      status: 'loading',
      message: 'Verificando sesión...'
    });

    setResults([...newResults]);

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        newResults[2] = {
          name: 'Autenticación',
          status: 'error',
          message: 'Error de autenticación',
          details: error.message
        };
      } else if (!session) {
        newResults[2] = {
          name: 'Autenticación',
          status: 'warning',
          message: 'No hay sesión activa',
          details: 'El usuario no está autenticado'
        };
      } else {
        newResults[2] = {
          name: 'Autenticación',
          status: 'success',
          message: 'Sesión activa',
          details: `Usuario: ${session.user.email}`
        };
      }
    } catch (error) {
      newResults[2] = {
        name: 'Autenticación',
        status: 'error',
        message: 'Error verificando autenticación',
        details: error instanceof Error ? error.message : 'Error desconocido'
      };
    }

    setResults([...newResults]);

    // 4. Verificar WebSocket
    newResults.push({
      name: 'Conexión WebSocket',
      status: 'loading',
      message: 'Probando WebSocket...'
    });

    setResults([...newResults]);

    try {
      const channel = supabase.channel('diagnostic-test');
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 10000);
      });

      const connectionPromise = new Promise((resolve, reject) => {
        channel
          .on('system', { event: 'error' }, (error) => {
            reject(error);
          })
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              resolve(status);
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
              reject(new Error(`Status: ${status}`));
            }
          });
      });

      await Promise.race([connectionPromise, timeoutPromise]);
      
      // Limpiar canal
      supabase.removeChannel(channel);

      newResults[3] = {
        name: 'Conexión WebSocket',
        status: 'success',
        message: 'WebSocket conectado',
        details: 'Conexión en tiempo real establecida'
      };
    } catch (error) {
      newResults[3] = {
        name: 'Conexión WebSocket',
        status: 'error',
        message: 'Error de WebSocket',
        details: error instanceof Error ? error.message : 'Error desconocido'
      };
    }

    setResults([...newResults]);

    // 5. Verificar permisos de base de datos
    newResults.push({
      name: 'Permisos de Base de Datos',
      status: 'loading',
      message: 'Verificando permisos...'
    });

    setResults([...newResults]);

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id')
        .limit(1);
      
      if (error) {
        newResults[4] = {
          name: 'Permisos de Base de Datos',
          status: 'error',
          message: 'Error de permisos',
          details: error.message
        };
      } else {
        newResults[4] = {
          name: 'Permisos de Base de Datos',
          status: 'success',
          message: 'Permisos correctos',
          details: 'Acceso a tablas verificado'
        };
      }
    } catch (error) {
      newResults[4] = {
        name: 'Permisos de Base de Datos',
        status: 'error',
        message: 'Error verificando permisos',
        details: error instanceof Error ? error.message : 'Error desconocido'
      };
    }

    setResults([...newResults]);
    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'loading':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Exitoso</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-500">Advertencia</Badge>;
      case 'loading':
        return <Badge variant="outline">Verificando...</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          Diagnóstico de Conexión
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(result.status)}
              <div>
                <h4 className="font-medium">{result.name}</h4>
                <p className="text-sm text-gray-600">{result.message}</p>
                {result.details && (
                  <p className="text-xs text-gray-500 mt-1">{result.details}</p>
                )}
              </div>
            </div>
            {getStatusBadge(result.status)}
          </div>
        ))}
        
        <div className="flex justify-center pt-4">
          <Button 
            onClick={runDiagnostics} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Ejecutando...' : 'Ejecutar Diagnóstico'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionDiagnostic; 