# 🔧 Configuración de Supabase para AstroTarot

## 📋 Pasos para configurar la base de datos

### 1. Acceder a Supabase Dashboard
- Ve a [supabase.com](https://supabase.com)
- Inicia sesión en tu proyecto
- Ve a **SQL Editor** en el menú lateral

### 2. Ejecutar el script de la tabla users
Copia y pega el siguiente SQL en el editor:

```sql
-- Crear tabla de usuarios completa para el sistema AstroTarot
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  birth_date DATE,
  birth_time TIME,
  birth_place TEXT,
  gender VARCHAR(50),
  looking_for VARCHAR(100),
  is_premium BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  PRIMARY KEY (id)
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Función para crear usuario automáticamente
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
      split_part(NEW.email, '@', 1)
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

-- Trigger para crear usuario automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 3. Ejecutar el script
- Haz clic en **Run** para ejecutar el script
- Deberías ver un mensaje de éxito

### 4. Verificar la tabla
- Ve a **Table Editor** en el menú lateral
- Deberías ver la tabla `users` creada

## 🔍 Verificar que funciona

1. **Probar Google Auth** en tu aplicación
2. **Verificar en Supabase**:
   - Ve a **Authentication** → **Users**
   - Deberías ver el usuario creado
   - Ve a **Table Editor** → **users**
   - Deberías ver el registro del usuario

## 🚨 Si algo falla

### Error: "relation public.users does not exist"
- La tabla no se creó correctamente
- Vuelve a ejecutar el script SQL

### Error: "permission denied"
- Problema con RLS policies
- Ejecuta este SQL adicional:

```sql
-- Política temporal más permisiva
CREATE POLICY "Temporary full access" ON public.users
  FOR ALL USING (true);
```

### Usuario no aparece en la tabla
- El trigger no se ejecutó
- Ejecuta manualmente:

```sql
-- Crear usuario manualmente (reemplaza con tu UUID e email)
INSERT INTO public.users (id, email, full_name, is_premium, onboarding_completed)
VALUES ('TU_UUID_AQUI', 'tu_email@gmail.com', 'Tu Nombre', false, false)
ON CONFLICT (id) DO NOTHING;
```

## ✅ Señales de que funciona correctamente

- ✅ Google Auth funciona
- ✅ Usuario aparece en Authentication → Users
- ✅ Usuario aparece en Table Editor → users
- ✅ AuthProvider no da timeout
- ✅ Usuario permanece logueado al navegar

## 📞 Ayuda

Si necesitas ayuda, comparte:
1. **Screenshot del error** en la consola
2. **Screenshot de la tabla users** en Supabase
3. **Screenshot de Authentication → Users** en Supabase 