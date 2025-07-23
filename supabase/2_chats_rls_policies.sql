-- Políticas RLS para la tabla chats
-- Estas políticas permiten el acceso a chats y el funcionamiento del realtime

-- Habilitar RLS en la tabla chats
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- Política para INSERT: Usuarios pueden crear chats donde participan
CREATE POLICY "Users can create chats" ON chats
FOR INSERT WITH CHECK (
  user1_id = auth.uid() OR user2_id = auth.uid()
);

-- Política para SELECT: Usuarios pueden ver chats donde participan
CREATE POLICY "Users can view their chats" ON chats
FOR SELECT USING (
  user1_id = auth.uid() OR user2_id = auth.uid()
);

-- Política para UPDATE: Usuarios pueden actualizar chats donde participan (para last_message_at)
CREATE POLICY "Users can update their chats" ON chats
FOR UPDATE USING (
  user1_id = auth.uid() OR user2_id = auth.uid()
) WITH CHECK (
  user1_id = auth.uid() OR user2_id = auth.uid()
);

-- Política para DELETE: Usuarios pueden eliminar chats donde participan
CREATE POLICY "Users can delete their chats" ON chats
FOR DELETE USING (
  user1_id = auth.uid() OR user2_id = auth.uid()
);

-- Política específica para realtime: Permitir acceso a chats para el realtime
CREATE POLICY "Realtime access to chats" ON chats
FOR ALL USING (
  user1_id = auth.uid() OR user2_id = auth.uid()
); 