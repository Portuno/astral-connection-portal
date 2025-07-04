
-- Crear tabla para almacenar los datos del formulario de registro
CREATE TABLE public.user_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  birth_date DATE NOT NULL,
  birth_time TIME,
  birth_place TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Agregar índice para búsquedas por email
CREATE INDEX idx_user_registrations_email ON public.user_registrations(email);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.user_registrations ENABLE ROW LEVEL SECURITY;

-- Crear política que permite a cualquiera insertar datos (para registro público)
CREATE POLICY "Anyone can insert registration data" 
  ON public.user_registrations 
  FOR INSERT 
  WITH CHECK (true);

-- Crear política que permite a los usuarios ver solo sus propios datos
CREATE POLICY "Users can view their own registrations" 
  ON public.user_registrations 
  FOR SELECT 
  USING (true);
