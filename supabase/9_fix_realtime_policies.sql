-- Verificar y corregir políticas RLS para Realtime
-- Este archivo corrige problemas comunes que pueden causar errores 400 en consultas de mensajes

-- 1. Verificar que las políticas de messages permitan acceso correcto
-- Primero, eliminar políticas problemáticas existentes
DROP POLICY IF EXISTS "Users can view messages in their chats" ON messages;
DROP POLICY IF EXISTS "Users can insert messages in their chats" ON messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;

-- 2. Crear políticas más robustas para messages
CREATE POLICY "Users can view messages in their chats" ON messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM chats 
    WHERE chats.id = messages.chat_id 
    AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
  )
);

CREATE POLICY "Users can insert messages in their chats" ON messages
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM chats 
    WHERE chats.id = messages.chat_id 
    AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
  )
  AND sender_id = auth.uid()
);

CREATE POLICY "Users can update their own messages" ON messages
FOR UPDATE USING (
  sender_id = auth.uid()
) WITH CHECK (
  sender_id = auth.uid()
);

-- 3. Verificar que las políticas de chats permitan acceso correcto
DROP POLICY IF EXISTS "Users can view their chats" ON chats;
DROP POLICY IF EXISTS "Users can insert chats" ON chats;
DROP POLICY IF EXISTS "Users can update their chats" ON chats;

CREATE POLICY "Users can view their chats" ON chats
FOR SELECT USING (
  user1_id = auth.uid() OR user2_id = auth.uid()
);

CREATE POLICY "Users can insert chats" ON chats
FOR INSERT WITH CHECK (
  user1_id = auth.uid() OR user2_id = auth.uid()
);

CREATE POLICY "Users can update their chats" ON chats
FOR UPDATE USING (
  user1_id = auth.uid() OR user2_id = auth.uid()
) WITH CHECK (
  user1_id = auth.uid() OR user2_id = auth.uid()
);

-- 4. Habilitar RLS en las tablas si no está habilitado
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- 5. Verificar que la función para marcar mensajes como leídos funcione correctamente
-- Crear una función helper para marcar mensajes como leídos
CREATE OR REPLACE FUNCTION mark_messages_as_read(chat_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE messages 
  SET read_at = NOW()
  WHERE messages.chat_id = chat_id_param 
    AND messages.sender_id != auth.uid()
    AND messages.read_at IS NULL;
END;
$$;

-- 6. Dar permisos necesarios para Realtime
-- Asegurar que el rol anon tenga permisos básicos para Realtime
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT INSERT ON ALL TABLES IN SCHEMA public TO anon;
GRANT UPDATE ON ALL TABLES IN SCHEMA public TO anon;

-- 7. Verificar que las secuencias estén disponibles
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- 8. Crear índices para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_read_at ON messages(read_at);

-- 9. Verificar que la tabla messages tenga las columnas correctas
-- Si falta alguna columna, agregarla
DO $$
BEGIN
  -- Verificar si existe la columna read_at
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'read_at'
  ) THEN
    ALTER TABLE messages ADD COLUMN read_at TIMESTAMP WITH TIME ZONE;
  END IF;
  
  -- Verificar si existe la columna sender_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'sender_id'
  ) THEN
    ALTER TABLE messages ADD COLUMN sender_id UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- 10. Comentarios para debugging
COMMENT ON TABLE messages IS 'Tabla de mensajes con RLS habilitado para seguridad';
COMMENT ON TABLE chats IS 'Tabla de chats con RLS habilitado para seguridad'; 