
-- Create table to track user payments
CREATE TABLE public.user_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'EUR',
  square_payment_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  payment_date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own payments" ON public.user_payments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Anyone can insert payments" ON public.user_payments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service can update payments" ON public.user_payments
  FOR UPDATE USING (true);
