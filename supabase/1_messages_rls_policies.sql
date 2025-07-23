-- Políticas RLS para la tabla messages
-- Estas políticas permiten el acceso a mensajes y el funcionamiento del realtime

-- Habilitar RLS en la tabla messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Política para INSERT: Usuarios pueden insertar mensajes en chats donde participan
CREATE POLICY "Users can insert messages in their chats" ON messages
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM chats 
    WHERE id = chat_id 
    AND (user1_id = auth.uid() OR user2_id = auth.uid())
  )
);

-- Política para SELECT: Usuarios pueden ver mensajes de chats donde participan
CREATE POLICY "Users can view messages in their chats" ON messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM chats 
    WHERE id = chat_id 
    AND (user1_id = auth.uid() OR user2_id = auth.uid())
  )
);

-- Política para UPDATE: Usuarios pueden actualizar sus propios mensajes (para marcar como leídos)
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

-- Política específica para realtime: Permitir acceso a mensajes para el realtime
CREATE POLICY "Realtime access to messages" ON messages
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM chats 
    WHERE id = chat_id 
    AND (user1_id = auth.uid() OR user2_id = auth.uid())
  )
); 