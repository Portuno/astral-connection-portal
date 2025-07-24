import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseRealtimeOptions {
  channelName: string;
  event: string;
  schema?: string;
  table?: string;
  filter?: string;
  onMessage?: (payload: any) => void;
  onError?: (error: any) => void;
  onStatusChange?: (status: string) => void;
  enabled?: boolean;
  fallbackToPolling?: boolean;
  pollingInterval?: number;
}

interface UseRealtimeReturn {
  isConnected: boolean;
  error: string | null;
  usePolling: boolean;
  reconnect: () => void;
  disconnect: () => void;
}

export const useRealtime = ({
  channelName,
  event,
  schema = 'public',
  table,
  filter,
  onMessage,
  onError,
  onStatusChange,
  enabled = true,
  fallbackToPolling = true,
  pollingInterval = 3000
}: UseRealtimeOptions): UseRealtimeReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usePolling, setUsePolling] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const channelRef = useRef<RealtimeChannel | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxRetries = 3;

  // Función para limpiar recursos
  const cleanup = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  // Función para iniciar polling
  const startPolling = useCallback(() => {
    if (!fallbackToPolling || !table) return;
    
    cleanup();
    console.log(`[Realtime] Iniciando polling para ${table} cada ${pollingInterval}ms`);
    setUsePolling(true);
    setError('Usando sincronización manual');
    
    // Aquí podrías implementar la lógica de polling específica
    // Por ahora solo marcamos que estamos en modo polling
  }, [fallbackToPolling, table, pollingInterval, cleanup]);

  // Función para detener polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setUsePolling(false);
  }, []);

  // Función para reconectar
  const reconnect = useCallback(() => {
    cleanup();
    setRetryCount(0);
    setError(null);
    setIsConnected(false);
    stopPolling();
  }, [cleanup, stopPolling]);

  // Función para desconectar
  const disconnect = useCallback(() => {
    cleanup();
    setIsConnected(false);
    setError(null);
    stopPolling();
  }, [cleanup, stopPolling]);

  // Configurar canal de Realtime
  useEffect(() => {
    if (!enabled || !channelName) {
      cleanup();
      return;
    }

    console.log(`[Realtime] Configurando canal: ${channelName}`);
    
    const channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: 'user',
        },
      },
    });

    // Configurar eventos según el tipo
    if (event === 'postgres_changes' && table) {
      channel.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema,
          table,
          filter,
        },
        (payload) => {
          console.log('[Realtime] Mensaje recibido:', payload);
          onMessage?.(payload);
        }
      );
    } else {
      // Para otros tipos de eventos
      channel.on(event, (payload) => {
        console.log('[Realtime] Mensaje recibido:', payload);
        onMessage?.(payload);
      });
    }

    // Manejar errores del sistema
    channel.on('system', { event: 'error' }, (error) => {
      console.error('[Realtime] Error en canal:', error);
      setError(error.message || 'Error de conexión');
      setIsConnected(false);
      onError?.(error);
      
      // Cambiar a polling después de varios errores
      if (retryCount >= maxRetries && fallbackToPolling) {
        startPolling();
      }
    });

    // Manejar cierre de conexión
    channel.on('system', { event: 'close' }, () => {
      console.log('[Realtime] Canal cerrado');
      setIsConnected(false);
      onStatusChange?.('CLOSED');
      
      // Intentar reconexión automática
      if (retryCount < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
        reconnectTimeoutRef.current = setTimeout(() => {
          setRetryCount(prev => prev + 1);
          reconnect();
        }, delay);
      } else if (fallbackToPolling) {
        startPolling();
      }
    });

    // Suscribir al canal
    channel.subscribe((status) => {
      console.log(`[Realtime] Estado de suscripción: ${status}`);
      onStatusChange?.(status);
      
      if (status === 'SUBSCRIBED') {
        console.log('[Realtime] Suscripción exitosa');
        setIsConnected(true);
        setError(null);
        setRetryCount(0);
        stopPolling();
      } else if (status === 'CHANNEL_ERROR') {
        console.error('[Realtime] Error en canal');
        setIsConnected(false);
        setError('Error de canal');
        
        if (retryCount >= maxRetries && fallbackToPolling) {
          startPolling();
        }
      } else if (status === 'TIMED_OUT') {
        console.error('[Realtime] Timeout de conexión');
        setIsConnected(false);
        setError('Timeout de conexión');
        
        if (retryCount >= maxRetries && fallbackToPolling) {
          startPolling();
        }
      }
    });

    channelRef.current = channel;

    return () => {
      cleanup();
    };
  }, [
    enabled,
    channelName,
    event,
    schema,
    table,
    filter,
    onMessage,
    onError,
    onStatusChange,
    retryCount,
    maxRetries,
    fallbackToPolling,
    startPolling,
    stopPolling,
    reconnect,
    cleanup
  ]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    isConnected,
    error,
    usePolling,
    reconnect,
    disconnect
  };
}; 