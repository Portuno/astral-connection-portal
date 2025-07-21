-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.chats (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user1_id uuid NOT NULL,
  user2_id text NOT NULL,
  user1_auth_id uuid,
  user2_auth_id text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  last_message_at timestamp with time zone,
  CONSTRAINT chats_pkey PRIMARY KEY (id)
);
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL,
  sender_id text NOT NULL,
  sender_auth_id text,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  read_at timestamp with time zone,
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chats(id)
);
CREATE TABLE public.profiles (
  id character varying NOT NULL,
  name character varying NOT NULL,
  age integer NOT NULL,
  sign character varying NOT NULL,
  moon_sign character varying NOT NULL,
  rising_sign character varying NOT NULL,
  description text NOT NULL,
  photo_url text,
  compatibility_score integer NOT NULL,
  gender character varying NOT NULL,
  location character varying NOT NULL,
  looking_for character varying NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  user_id uuid,
  full_name text,
  photo_url_2 text,
  photo_url_3 text,
  updated_at timestamp with time zone DEFAULT now(),
  gender_preference text DEFAULT 'ambos'::text,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  square_subscription_id character varying UNIQUE,
  square_customer_id character varying,
  status character varying DEFAULT 'active'::character varying,
  plan_type character varying DEFAULT 'premium'::character varying,
  amount numeric DEFAULT 29.90,
  currency character varying DEFAULT 'EUR'::character varying,
  billing_period character varying DEFAULT 'monthly'::character varying,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.temporary_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  full_name text NOT NULL,
  gender text NOT NULL,
  birth_date date NOT NULL,
  birth_time time without time zone NOT NULL,
  birth_place text NOT NULL,
  looking_for text NOT NULL DEFAULT 'conexion-especial'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT temporary_profiles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  full_name text NOT NULL,
  gender text NOT NULL CHECK (gender = ANY (ARRAY['mujer'::text, 'hombre'::text, 'otro'::text])),
  birth_date date NOT NULL,
  birth_time time without time zone NOT NULL,
  birth_place text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL,
  email character varying NOT NULL,
  full_name character varying,
  avatar_url text,
  is_premium boolean DEFAULT false,
  onboarding_completed boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);