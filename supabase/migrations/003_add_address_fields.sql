-- ============================================
-- Add address and google_maps_url to restaurants
-- ============================================

ALTER TABLE public.restaurants
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS google_maps_url TEXT;
p