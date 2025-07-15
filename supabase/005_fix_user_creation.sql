-- Script para arreglar la creación automática de usuarios con Google OAuth
-- Eliminar triggers existentes para evitar conflictos
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Crear función mejorada para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, is_premium, onboarding_completed)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name', 
      NEW.raw_user_meta_data->>'name',
      NEW.email
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url', 
      NEW.raw_user_meta_data->>'picture'
    ),
    FALSE,
    FALSE
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, users.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Recrear el trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Política adicional para permitir inserción via aplicación
CREATE POLICY "Enable insert for service role" ON public.users
  FOR INSERT WITH CHECK (true);

-- Eliminar cualquier política que pueda estar bloqueando
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.users;

-- Recrear políticas más permisivas
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id OR auth.role() = 'service_role'); 