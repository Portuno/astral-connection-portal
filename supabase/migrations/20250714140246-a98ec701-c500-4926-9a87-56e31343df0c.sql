-- Agregar campo onboarding_completed a la tabla profiles si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Crear tabla user_onboarding si no existe
CREATE TABLE IF NOT EXISTS public.user_onboarding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  birth_time TIME,
  birth_place TEXT NOT NULL,
  birth_city TEXT,
  birth_country TEXT,
  onboarding_step INTEGER DEFAULT 1,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS en user_onboarding si existe
ALTER TABLE public.user_onboarding ENABLE ROW LEVEL SECURITY;

-- Crear políticas para user_onboarding
DROP POLICY IF EXISTS "Users can view their own onboarding" ON public.user_onboarding;
DROP POLICY IF EXISTS "Users can insert their own onboarding" ON public.user_onboarding;
DROP POLICY IF EXISTS "Users can update their own onboarding" ON public.user_onboarding;

CREATE POLICY "Users can view their own onboarding" 
  ON public.user_onboarding 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own onboarding" 
  ON public.user_onboarding 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own onboarding" 
  ON public.user_onboarding 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- Recrear la función para manejar nuevos usuarios de manera más robusta
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Insertar perfil para nuevo usuario con manejo de errores
  INSERT INTO public.profiles (id, name, email, onboarding_completed)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error pero no fallar el registro del usuario
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Eliminar trigger existente si existe y recrearlo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función para asegurar que un usuario tenga perfil
CREATE OR REPLACE FUNCTION public.ensure_user_profile(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  user_email TEXT;
  user_name TEXT;
BEGIN
  -- Obtener datos del usuario de auth.users
  SELECT email, raw_user_meta_data ->> 'name', raw_user_meta_data ->> 'full_name'
  INTO user_email, user_name
  FROM auth.users 
  WHERE id = user_id;

  -- Crear perfil si no existe
  INSERT INTO public.profiles (id, name, email, onboarding_completed)
  VALUES (
    user_id,
    COALESCE(user_name, split_part(user_email, '@', 1)),
    user_email,
    false
  )
  ON CONFLICT (id) DO NOTHING;
END;
$$;

-- Crear perfiles para usuarios existentes que no tengan perfil
INSERT INTO public.profiles (id, name, email, onboarding_completed)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data ->> 'name', u.raw_user_meta_data ->> 'full_name', split_part(u.email, '@', 1)),
  u.email,
  false
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL; 