-- Corregir políticas RLS para la tabla messages
-- Eliminar políticas existentes primero para evitar conflictos

-- Eliminar todas las políticas existentes de la tabla messages
DROP POLICY IF EXISTS "Users can create messages in their chats" ON messages;
DROP POLICY IF EXISTS "Users can view messages from their chats" ON messages;
DROP POLICY IF EXISTS "Users can update messages in their chats" ON messages;
DROP POLICY IF EXISTS "Users can delete messages in their chats" ON messages;
DROP POLICY IF EXISTS "Realtime access to messages" ON messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
DROP POLICY IF EXISTS "Users can delete their own messages" ON messages;

-- Habilitar RLS en la tabla messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Política para INSERT: Usuarios pueden crear mensajes en chats donde participan
CREATE POLICY "Users can create messages in their chats" ON messages
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM chats 
    WHERE chats.id = messages.chat_id 
    AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
  )
);

-- Política para SELECT: Usuarios pueden ver mensajes de chats donde participan
CREATE POLICY "Users can view messages from their chats" ON messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM chats 
    WHERE chats.id = messages.chat_id 
    AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
  )
);

-- Política para UPDATE: Usuarios pueden actualizar sus propios mensajes
CREATE POLICY "Users can update their own messages" ON messages
FOR UPDATE USING (
  sender_id = auth.uid()
) WITH CHECK (
  sender_id = auth.uid()
);

-- Política para DELETE: Usuarios pueden eliminar sus propios mensajes
CREATE POLICY "Users can delete their own messages" ON messages
FOR DELETE USING (
  sender_id = auth.uid()
);

-- Política para Realtime: Permitir acceso a mensajes para suscripciones en tiempo real
CREATE POLICY "Realtime access to messages" ON messages
FOR SELECT USING (true);

-- Crear índices para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at); 