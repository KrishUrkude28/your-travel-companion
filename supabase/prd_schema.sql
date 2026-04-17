-- guides table
CREATE TABLE IF NOT EXISTS public.guides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  bio TEXT,
  specialities TEXT[],
  languages TEXT[] NOT NULL,
  price_half_day INTEGER NOT NULL,
  price_full_day INTEGER NOT NULL,
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  photo_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  available_days TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN CREATE POLICY "Public read guides" ON public.guides FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id),
  user_id UUID REFERENCES public.profiles(id),
  guide_id UUID REFERENCES public.guides(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users insert reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN CREATE POLICY "Users select distinct payments" ON public.payments FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.bookings WHERE id = booking_id)); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- update bookings table if it misses guide_id or payment_id
DO $$ BEGIN
  ALTER TABLE public.bookings ADD COLUMN guide_id UUID REFERENCES public.guides(id);
EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.bookings ADD COLUMN payment_id TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.bookings ADD COLUMN booking_ref TEXT UNIQUE;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;
