-- 1. Create 'payments' table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    booking_id TEXT,
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending',
    razorpay_payment_id TEXT
);

-- 2. Create 'reviews' table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    package_id TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT
);

-- Add missing columns for reviews (idempotent)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='user_name') THEN
        ALTER TABLE public.reviews ADD COLUMN user_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='package_title') THEN
        ALTER TABLE public.reviews ADD COLUMN package_title TEXT;
    END IF;
END $$;

-- 3. Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 4. Policies for 'payments'
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
CREATE POLICY "Users can view their own payments" 
ON public.payments FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own payments" ON public.payments;
CREATE POLICY "Users can insert their own payments" 
ON public.payments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 5. Policies for 'reviews'
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
CREATE POLICY "Anyone can view reviews" 
ON public.reviews FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON public.reviews;
CREATE POLICY "Authenticated users can insert reviews" 
ON public.reviews FOR INSERT 
WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- 6. Ensure 'profiles' has necessary columns
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

-- 7. Create 'bookings' table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    package_id TEXT NOT NULL,
    package_title TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    travelers INTEGER DEFAULT 1,
    travel_date DATE NOT NULL,
    message TEXT,
    passport_number TEXT,
    status TEXT DEFAULT 'pending'
);

-- Add column if it's missing (idempotent)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='passport_number') THEN
        ALTER TABLE public.bookings ADD COLUMN passport_number TEXT;
    END IF;
END $$;

-- Enable RLS for 'bookings'
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policies for 'bookings'
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
CREATE POLICY "Users can view their own bookings" 
ON public.bookings FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own bookings" ON public.bookings;
CREATE POLICY "Users can insert their own bookings" 
ON public.bookings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 8. Create 'wishlists' table
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    package_id TEXT NOT NULL,
    package_title TEXT NOT NULL,
    UNIQUE(user_id, package_id)
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own wishlist" ON public.wishlists;
CREATE POLICY "Users can view their own wishlist" ON public.wishlists FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert into their own wishlist" ON public.wishlists;
CREATE POLICY "Users can insert into their own wishlist" ON public.wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete from their own wishlist" ON public.wishlists;
CREATE POLICY "Users can delete from their own wishlist" ON public.wishlists FOR DELETE USING (auth.uid() = user_id);

-- 9. Create 'trip_plans' table for AI Itineraries
CREATE TABLE IF NOT EXISTS public.trip_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    destination TEXT NOT NULL,
    duration TEXT NOT NULL,
    budget TEXT NOT NULL,
    travelers INTEGER DEFAULT 1,
    interests TEXT[] DEFAULT '{}',
    requirements TEXT,
    generated_itinerary JSONB NOT NULL
);

ALTER TABLE public.trip_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own trip plans" ON public.trip_plans;
CREATE POLICY "Users can view their own trip plans" ON public.trip_plans FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own trip plans" ON public.trip_plans;
CREATE POLICY "Users can insert their own trip plans" ON public.trip_plans FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own trip plans" ON public.trip_plans;
CREATE POLICY "Users can delete their own trip plans" ON public.trip_plans FOR DELETE USING (auth.uid() = user_id);

-- 10. Create Storage Bucket for 'itineraries' PDF files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('itineraries', 'itineraries', true)
ON CONFLICT (id) DO NOTHING;

-- Storage bucket policies
DROP POLICY IF EXISTS "Anyone can read itineraries" ON storage.objects;
CREATE POLICY "Anyone can read itineraries" ON storage.objects FOR SELECT USING (bucket_id = 'itineraries');

DROP POLICY IF EXISTS "Authenticated users can upload itineraries" ON storage.objects;
CREATE POLICY "Authenticated users can upload itineraries" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'itineraries' AND auth.role() = 'authenticated');
