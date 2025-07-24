-- Agregar columna read_at a la tabla messages
-- Esta columna se usará para marcar mensajes como leídos

ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Crear un índice para mejorar el rendimiento de las consultas de mensajes no leídos
CREATE INDEX IF NOT EXISTS idx_messages_read_at 
ON messages(read_at);

-- Crear un índice compuesto para consultas de mensajes no leídos por chat
CREATE INDEX IF NOT EXISTS idx_messages_unread 
ON messages(chat_id, read_at, sender_id);

-- Actualizar mensajes existentes para que tengan read_at como NULL (no leídos)
UPDATE messages 
SET read_at = NULL 
WHERE read_at IS NULL; 