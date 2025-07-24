-- Corregir políticas RLS para la tabla messages
-- Estas políticas permiten el acceso a mensajes y el funcionamiento correcto de las consultas

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

-- Política para UPDATE: Usuarios pueden actualizar mensajes en chats donde participan
CREATE POLICY "Users can update messages in their chats" ON messages
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM chats 
    WHERE chats.id = messages.chat_id 
    AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM chats 
    WHERE chats.id = messages.chat_id 
    AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
  )
);

-- Política para DELETE: Usuarios pueden eliminar mensajes en chats donde participan
CREATE POLICY "Users can delete messages in their chats" ON messages
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM chats 
    WHERE chats.id = messages.chat_id 
    AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
  )
);

-- Política específica para realtime: Permitir acceso a mensajes para el realtime
CREATE POLICY "Realtime access to messages" ON messages
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM chats 
    WHERE chats.id = messages.chat_id 
    AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
  )
);

-- Crear índices para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_read_at ON messages(read_at);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Índice compuesto para consultas de mensajes no leídos
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(chat_id, read_at, sender_id); 