
-- Crear tabla para rastrear pagos de usuarios
CREATE TABLE public.user_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  square_payment_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para los perfiles de chat demo
CREATE TABLE public.chat_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  personality TEXT NOT NULL,
  interests TEXT[] NOT NULL,
  avatar_url TEXT,
  zodiac_sign TEXT NOT NULL,
  compatibility_score INTEGER DEFAULT 85 CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para las conversaciones de chat
CREATE TABLE public.chat_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.chat_profiles(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para los mensajes de chat
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'profile')),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.user_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para user_payments
CREATE POLICY "Users can view their own payments" 
  ON public.user_payments 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can insert payments" 
  ON public.user_payments 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Service can update payments" 
  ON public.user_payments 
  FOR UPDATE 
  USING (true);

-- Políticas RLS para chat_profiles (todos pueden ver perfiles activos)
CREATE POLICY "Anyone can view active chat profiles" 
  ON public.chat_profiles 
  FOR SELECT 
  USING (is_active = true);

-- Políticas RLS para chat_conversations
CREATE POLICY "Users can view their own conversations" 
  ON public.chat_conversations 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own conversations" 
  ON public.chat_conversations 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own conversations" 
  ON public.chat_conversations 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- Políticas RLS para chat_messages
CREATE POLICY "Users can view messages from their conversations" 
  ON public.chat_messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_conversations 
      WHERE id = conversation_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to their conversations" 
  ON public.chat_messages 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_conversations 
      WHERE id = conversation_id AND user_id = auth.uid()
    )
  );

-- Insertar 8 perfiles de chat demo
INSERT INTO public.chat_profiles (name, age, location, description, personality, interests, zodiac_sign, compatibility_score) VALUES
('Luna', 28, 'Barcelona, España', 'Artista y escritora apasionada por la astrología y la conexión espiritual. Me encanta explorar nuevas culturas y filosofías.', 'Creativa, empática, intuitiva', ARRAY['astrología', 'arte', 'viajes', 'meditación', 'literatura'], 'Piscis', 92),
('Sofia', 26, 'Madrid, España', 'Psicóloga especializada en terapias holísticas. Creo en el poder de las estrellas para guiar nuestro destino.', 'Comprensiva, sabia, cálida', ARRAY['psicología', 'yoga', 'cocina', 'música', 'naturaleza'], 'Virgo', 88),
('Isabella', 30, 'Valencia, España', 'Empresaria exitosa que equilibra su vida profesional con su pasión por la astrología y el crecimiento personal.', 'Ambiciosa, equilibrada, determinada', ARRAY['negocios', 'fitness', 'astrología', 'wine', 'tecnología'], 'Capricornio', 85),
('Carmen', 24, 'Sevilla, España', 'Bailarina flamenca con alma gitana. Las estrellas me guían en cada paso de mi danza y mi vida.', 'Apasionada, libre, magnética', ARRAY['danza', 'música', 'tradiciones', 'fotografía', 'festivales'], 'Leo', 94),
('Valentina', 27, 'Bilbao, España', 'Ingeniera de día, astróloga de noche. Combino la lógica con la magia del cosmos para entender el universo.', 'Analítica, curiosa, misteriosa', ARRAY['ciencia', 'astrología', 'lectura', 'senderismo', 'café'], 'Acuario', 90),
('Esperanza', 29, 'Granada, España', 'Profesora de filosofía fascinada por las conexiones cósmicas. Creo que cada encuentro está escrito en las estrellas.', 'Reflexiva, profunda, romántica', ARRAY['filosofía', 'historia', 'poesía', 'teatro', 'jardines'], 'Libra', 87),
('Marisol', 25, 'Málaga, España', 'Guía turística y amante del mar. La brisa marina y las constelaciones son mis mejores consejeras.', 'Aventurera, optimista, espontánea', ARRAY['viajes', 'playa', 'deportes acuáticos', 'gastronomía', 'culturas'], 'Sagitario', 91),
('Rocío', 31, 'Zaragoza, España', 'Chef especializada en cocina consciente. Cocino siguiendo los ciclos lunares y las energías astrales.', 'Nurturante, intuitiva, creativa', ARRAY['cocina', 'astrología culinaria', 'huertos', 'wellness', 'familia'], 'Cáncer', 89);
