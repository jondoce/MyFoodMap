-- ============================================
-- MyFoodMap - Initial Schema Migration
-- ============================================

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Restaurants table
CREATE TABLE public.restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  dish TEXT NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX idx_restaurants_user_id ON public.restaurants(user_id);
CREATE INDEX idx_restaurants_created_at ON public.restaurants(created_at DESC);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_restaurants_updated_at
  BEFORE UPDATE ON public.restaurants
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

-- Grants: required so RLS policies can be evaluated for authenticated users
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.restaurants TO authenticated;

-- Profiles: users can only access their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Restaurants: users can only CRUD their own restaurants
CREATE POLICY "Users can view own restaurants"
  ON public.restaurants FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own restaurants"
  ON public.restaurants FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own restaurants"
  ON public.restaurants FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own restaurants"
  ON public.restaurants FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- Storage: restaurant-photos bucket
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('restaurant-photos', 'restaurant-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view restaurant photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'restaurant-photos');

CREATE POLICY "Authenticated users can upload photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'restaurant-photos'
    AND auth.role() = 'authenticated'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'restaurant-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
