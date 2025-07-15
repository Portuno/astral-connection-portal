-- Extender esquema para autenticación completa
-- Tabla de usuarios extendida (complementa auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    birth_date DATE,
    birth_time TIME,
    birth_place TEXT,
    gender TEXT,
    looking_for TEXT,
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de suscripciones
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
    plan_type TEXT NOT NULL DEFAULT 'premium',
    amount_cents INTEGER NOT NULL DEFAULT 2990, -- €29.90
    currency TEXT NOT NULL DEFAULT 'EUR',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    stripe_subscription_id TEXT UNIQUE,
    square_subscription_id TEXT UNIQUE,
    payment_method TEXT CHECK (payment_method IN ('stripe', 'square')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de pagos
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    amount_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'EUR',
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method TEXT NOT NULL,
    external_payment_id TEXT, -- ID del procesador (Square/Stripe)
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Actualizar tabla de chats para usar auth.users
ALTER TABLE public.chats 
ADD COLUMN IF NOT EXISTS user1_auth_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS user2_auth_id UUID REFERENCES auth.users(id);

-- Actualizar tabla de mensajes 
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS sender_auth_id UUID REFERENCES auth.users(id);

-- Función para crear usuario después del registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url'
    );
    RETURN new;
END;
$$ language plpgsql security definer;

-- Trigger para crear usuario automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Políticas para subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions" ON public.subscriptions
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Políticas para payments
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage payments" ON public.payments
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Políticas para chats
CREATE POLICY "Users can view own chats" ON public.chats
    FOR SELECT USING (
        auth.uid() = user1_auth_id OR 
        auth.uid() = user2_auth_id
    );

CREATE POLICY "Users can create chats" ON public.chats
    FOR INSERT WITH CHECK (
        auth.uid() = user1_auth_id OR 
        auth.uid() = user2_auth_id
    );

-- Políticas para messages
CREATE POLICY "Users can view messages in their chats" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = messages.chat_id 
            AND (chats.user1_auth_id = auth.uid() OR chats.user2_auth_id = auth.uid())
        )
    );

CREATE POLICY "Users can create messages in their chats" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_auth_id AND
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = messages.chat_id 
            AND (chats.user1_auth_id = auth.uid() OR chats.user2_auth_id = auth.uid())
        )
    );

-- Índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON public.users(id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_auth_users ON public.chats(user1_auth_id, user2_auth_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_auth ON public.messages(sender_auth_id);

-- Función para verificar suscripción activa
CREATE OR REPLACE FUNCTION public.user_has_active_subscription(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.subscriptions 
        WHERE user_id = user_uuid 
        AND status = 'active' 
        AND (end_date IS NULL OR end_date > NOW())
    );
END;
$$ language plpgsql security definer;

-- Función para obtener perfil completo del usuario
CREATE OR REPLACE FUNCTION public.get_user_profile(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    has_premium BOOLEAN,
    onboarding_completed BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.email,
        u.full_name,
        u.avatar_url,
        public.user_has_active_subscription(u.id) as has_premium,
        u.onboarding_completed
    FROM public.users u
    WHERE u.id = user_uuid;
END;
$$ language plpgsql security definer; 