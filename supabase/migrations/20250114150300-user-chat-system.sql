-- Crear tabla para conversaciones entre usuarios reales
CREATE TABLE public.user_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user1_id, user2_id),
  CHECK (user1_id != user2_id)
);

-- Crear tabla para mensajes entre usuarios
CREATE TABLE public.user_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.user_conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image')),
  message_content TEXT NOT NULL,
  image_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear índices para optimizar consultas
CREATE INDEX idx_user_conversations_user1 ON public.user_conversations(user1_id);
CREATE INDEX idx_user_conversations_user2 ON public.user_conversations(user2_id);
CREATE INDEX idx_user_conversations_active ON public.user_conversations(is_active);
CREATE INDEX idx_user_messages_conversation ON public.user_messages(conversation_id);
CREATE INDEX idx_user_messages_sender ON public.user_messages(sender_id);
CREATE INDEX idx_user_messages_created_at ON public.user_messages(created_at);

-- Habilitar Row Level Security
ALTER TABLE public.user_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_messages ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para user_conversations
CREATE POLICY "Users can view their own conversations" 
  ON public.user_conversations 
  FOR SELECT 
  USING (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "Users can create conversations" 
  ON public.user_conversations 
  FOR INSERT 
  WITH CHECK (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "Users can update their conversations" 
  ON public.user_conversations 
  FOR UPDATE 
  USING (user1_id = auth.uid() OR user2_id = auth.uid());

-- Políticas RLS para user_messages
CREATE POLICY "Users can view messages from their conversations" 
  ON public.user_messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_conversations 
      WHERE id = conversation_id 
      AND (user1_id = auth.uid() OR user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert messages to their conversations" 
  ON public.user_messages 
  FOR INSERT 
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.user_conversations 
      WHERE id = conversation_id 
      AND (user1_id = auth.uid() OR user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can update their own messages" 
  ON public.user_messages 
  FOR UPDATE 
  USING (sender_id = auth.uid());

-- Función para obtener o crear conversación entre dos usuarios
CREATE OR REPLACE FUNCTION public.get_or_create_user_conversation(
  other_user_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  conversation_id UUID;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado';
  END IF;
  
  IF current_user_id = other_user_id THEN
    RAISE EXCEPTION 'No puedes crear una conversación contigo mismo';
  END IF;
  
  -- Buscar conversación existente (en cualquier orden)
  SELECT id INTO conversation_id
  FROM public.user_conversations
  WHERE (user1_id = current_user_id AND user2_id = other_user_id)
     OR (user1_id = other_user_id AND user2_id = current_user_id);
  
  -- Si no existe, crear nueva conversación
  IF conversation_id IS NULL THEN
    INSERT INTO public.user_conversations (user1_id, user2_id)
    VALUES (
      LEAST(current_user_id, other_user_id),
      GREATEST(current_user_id, other_user_id)
    )
    RETURNING id INTO conversation_id;
  END IF;
  
  RETURN conversation_id;
END;
$$;

-- Función para marcar mensajes como leídos
CREATE OR REPLACE FUNCTION public.mark_messages_as_read(
  conversation_id_param UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado';
  END IF;
  
  -- Verificar que el usuario pertenece a la conversación
  IF NOT EXISTS (
    SELECT 1 FROM public.user_conversations 
    WHERE id = conversation_id_param 
    AND (user1_id = current_user_id OR user2_id = current_user_id)
  ) THEN
    RAISE EXCEPTION 'No tienes permisos para esta conversación';
  END IF;
  
  -- Marcar como leídos todos los mensajes que no son del usuario actual
  UPDATE public.user_messages 
  SET is_read = true
  WHERE conversation_id = conversation_id_param 
  AND sender_id != current_user_id 
  AND is_read = false;
END;
$$;

-- Crear bucket para imágenes de chat si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-images', 'chat-images', true)
ON CONFLICT (id) DO NOTHING;

-- Política de storage para permitir a usuarios autenticados subir imágenes
CREATE POLICY "Users can upload chat images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'chat-images' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Política para ver imágenes públicas de chat
CREATE POLICY "Chat images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'chat-images'); 