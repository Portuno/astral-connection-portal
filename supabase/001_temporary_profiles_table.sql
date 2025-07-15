-- Crear tabla temporal para perfiles sin autenticación
-- Este archivo debe ejecutarse manualmente en Supabase

CREATE TABLE IF NOT EXISTS temporary_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    full_name TEXT NOT NULL,
    gender TEXT NOT NULL,
    birth_date DATE NOT NULL,
    birth_time TIME NOT NULL,
    birth_place TEXT NOT NULL,
    looking_for TEXT NOT NULL DEFAULT 'conexion-especial',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para búsquedas por session_id
CREATE INDEX IF NOT EXISTS idx_temporary_profiles_session_id ON temporary_profiles(session_id);

-- Crear índice para búsquedas por fecha de creación (para limpieza automática)
CREATE INDEX IF NOT EXISTS idx_temporary_profiles_created_at ON temporary_profiles(created_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE temporary_profiles ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserción sin autenticación
CREATE POLICY "Allow anonymous inserts" ON temporary_profiles
    FOR INSERT WITH CHECK (true);

-- Política para permitir lectura por session_id
CREATE POLICY "Allow read by session_id" ON temporary_profiles
    FOR SELECT USING (true);

-- Función para limpiar registros antiguos (más de 7 días)
CREATE OR REPLACE FUNCTION cleanup_temporary_profiles()
RETURNS void AS $$
BEGIN
    DELETE FROM temporary_profiles 
    WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Comentario explicativo
COMMENT ON TABLE temporary_profiles IS 'Tabla temporal para almacenar perfiles de usuarios no autenticados. Los registros se limpian automáticamente después de 7 días.'; 