-- Schema para el sistema de chats
-- Tabla de chats únicos entre usuarios
CREATE TABLE IF NOT EXISTS public.chats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user1_id TEXT NOT NULL, -- ID del usuario actual (puede ser session_id temporal)
    user2_id TEXT NOT NULL, -- ID del perfil con quien chatea
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user1_id, user2_id)
);

-- Tabla de mensajes dentro de cada chat
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE NOT NULL,
    sender_id TEXT NOT NULL, -- Quien envía el mensaje
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE NULL
);

-- Tabla de perfiles con fotos (extender la existente)
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    sign TEXT NOT NULL,
    moon_sign TEXT NOT NULL,
    rising_sign TEXT NOT NULL,
    description TEXT NOT NULL,
    photo_url TEXT NULL,
    compatibility_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_chats_user1 ON public.chats(user1_id);
CREATE INDEX IF NOT EXISTS idx_chats_user2 ON public.chats(user2_id);
CREATE INDEX IF NOT EXISTS idx_chats_updated ON public.chats(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_chat ON public.messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at DESC);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para chats
CREATE TRIGGER update_chats_updated_at 
    BEFORE UPDATE ON public.chats
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar perfiles de ejemplo con fotos
INSERT INTO public.profiles (id, name, age, sign, moon_sign, rising_sign, description, photo_url, compatibility_score) VALUES
('luna', 'Luna', 25, 'Piscis', 'Cáncer', 'Escorpio', 'Una alma sensible que encuentra magia en los pequeños momentos. Ama la música, la poesía y las conversaciones profundas bajo la luz de la luna.', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face', 94),
('sofia', 'Sofía', 28, 'Libra', 'Géminis', 'Leo', 'Equilibrio perfecto entre elegancia y espontaneidad. Disfruta del arte, los viajes y crear conexiones auténticas con personas especiales.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face', 91),
('maya', 'Maya', 26, 'Escorpio', 'Piscis', 'Virgo', 'Intensidad y misterio en perfecta armonía. Le fascina explorar los secretos del universo y las profundidades del alma humana.', 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face', 89),
('elena', 'Elena', 24, 'Sagitario', 'Aries', 'Acuario', 'Espíritu libre con sed de aventuras. Siempre lista para explorar nuevos horizontes y vivir experiencias que expandan su conciencia.', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face', 87),
('camila', 'Camila', 27, 'Géminis', 'Libra', 'Sagitario', 'Mente brillante y corazón curioso. Le encanta aprender cosas nuevas, debatir ideas fascinantes y descubrir conexiones inesperadas.', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face', 85)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    age = EXCLUDED.age,
    sign = EXCLUDED.sign,
    moon_sign = EXCLUDED.moon_sign,
    rising_sign = EXCLUDED.rising_sign,
    description = EXCLUDED.description,
    photo_url = EXCLUDED.photo_url,
    compatibility_score = EXCLUDED.compatibility_score; 