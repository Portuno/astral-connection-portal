-- Agregar columna last_message_at a la tabla chats
-- Esta columna se usará para ordenar los chats por actividad

ALTER TABLE chats 
ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Crear un índice para mejorar el rendimiento de las consultas ordenadas
CREATE INDEX IF NOT EXISTS idx_chats_last_message_at 
ON chats(last_message_at DESC NULLS LAST);

-- Actualizar la columna last_message_at para chats existentes basándose en el último mensaje
UPDATE chats 
SET last_message_at = (
  SELECT MAX(created_at) 
  FROM messages 
  WHERE messages.chat_id = chats.id
)
WHERE EXISTS (
  SELECT 1 
  FROM messages 
  WHERE messages.chat_id = chats.id
);

-- Crear una función para actualizar automáticamente last_message_at cuando se inserta un mensaje
CREATE OR REPLACE FUNCTION update_chat_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chats 
  SET last_message_at = NEW.created_at
  WHERE id = NEW.chat_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger para actualizar automáticamente last_message_at
DROP TRIGGER IF EXISTS trigger_update_chat_last_message ON messages;
CREATE TRIGGER trigger_update_chat_last_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_last_message(); 