-- Add gender and sexual preference fields to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('masculino', 'femenino', 'otro'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sexual_preference TEXT CHECK (sexual_preference IN ('masculino', 'femenino', 'ambos'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Add gender field to chat_profiles table and ensure avatar_url exists
ALTER TABLE public.chat_profiles ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('masculino', 'femenino', 'otro'));

-- Update existing chat_profiles with gender and avatar URLs
UPDATE public.chat_profiles SET 
  gender = CASE 
    WHEN name IN ('Luna', 'Sofia', 'Isabella', 'Carmen', 'Valentina', 'Aria', 'Elena', 'Camila') THEN 'femenino'
    ELSE 'masculino'
  END,
  avatar_url = CASE 
    WHEN name = 'Luna' THEN 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face'
    WHEN name = 'Sofia' THEN 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
    WHEN name = 'Isabella' THEN 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'
    WHEN name = 'Carmen' THEN 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face'
    WHEN name = 'Valentina' THEN 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face'
    WHEN name = 'Aria' THEN 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face'
    WHEN name = 'Elena' THEN 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=face'
    WHEN name = 'Camila' THEN 'https://images.unsplash.com/photo-1488207984724-a9b23dd07974?w=400&h=400&fit=crop&crop=face'
    ELSE 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
  END
WHERE avatar_url IS NULL OR avatar_url = '';

-- Add some male profiles to diversify the matches
INSERT INTO public.chat_profiles (name, age, location, description, personality, interests, zodiac_sign, compatibility_score, gender, avatar_url) VALUES
('Diego', 29, 'Barcelona, España', 'Músico y compositor que encuentra inspiración en las estrellas. Creo que el universo tiene una sinfonía perfecta para cada alma.', 'Creativo, sensible, apasionado', ARRAY['música', 'composición', 'astrología', 'café', 'conciertos'], 'Géminis', 89, 'masculino', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face'),
('Alejandro', 31, 'Madrid, España', 'Profesor de filosofía fascinado por los misterios del cosmos. Las estrellas me enseñan sobre la sabiduría ancestral.', 'Intelectual, reflexivo, sabio', ARRAY['filosofía', 'lectura', 'astrología', 'debates', 'historia'], 'Sagitario', 91, 'masculino', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'),
('Mateo', 26, 'Valencia, España', 'Chef creativo que cocina siguiendo los ciclos lunares. Cada plato es una conexión con las energías celestiales.', 'Innovador, cálido, espiritual', ARRAY['cocina', 'gastronomía', 'luna', 'naturaleza', 'mercados'], 'Tauro', 87, 'masculino', 'https://images.unsplash.com/photo-1507081323647-4d250478b919?w=400&h=400&fit=crop&crop=face'),
('Gabriel', 28, 'Sevilla, España', 'Artista visual que plasma la magia del universo en sus obras. Cada trazo está guiado por la energía cósmica.', 'Artístico, visionario, profundo', ARRAY['arte', 'pintura', 'exposiciones', 'viajes', 'espiritualidad'], 'Piscis', 93, 'masculino', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face');

-- Create function to filter profiles by user preferences
CREATE OR REPLACE FUNCTION get_compatible_profiles(user_gender TEXT, user_preference TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  age INTEGER,
  location TEXT,
  description TEXT,
  personality TEXT,
  interests TEXT[],
  avatar_url TEXT,
  zodiac_sign TEXT,
  compatibility_score INTEGER,
  gender TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cp.id,
    cp.name,
    cp.age,
    cp.location,
    cp.description,
    cp.personality,
    cp.interests,
    cp.avatar_url,
    cp.zodiac_sign,
    cp.compatibility_score,
    cp.gender
  FROM public.chat_profiles cp
  WHERE cp.is_active = true
    AND (
      user_preference = 'ambos' OR
      (user_preference = 'masculino' AND cp.gender = 'masculino') OR
      (user_preference = 'femenino' AND cp.gender = 'femenino')
    )
  ORDER BY cp.compatibility_score DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 