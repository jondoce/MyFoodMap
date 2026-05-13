-- ============================================
-- MyFoodMap - Cuisine Types Migration
-- ============================================

-- 1. Create cuisine_types table
CREATE TABLE public.cuisine_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_cuisine_types_name ON public.cuisine_types(name);

-- 2. Seed common cuisine types
INSERT INTO public.cuisine_types (name) VALUES
  ('Italian'),
  ('Japanese'),
  ('Mexican'),
  ('Indian'),
  ('Chinese'),
  ('Thai'),
  ('French'),
  ('Spanish'),
  ('Korean'),
  ('Vietnamese'),
  ('Mediterranean'),
  ('American'),
  ('Brazilian'),
  ('Peruvian'),
  ('Ethiopian'),
  ('Turkish'),
  ('Lebanese'),
  ('Greek'),
  ('Caribbean'),
  ('Other');

-- 3. Add cuisine_type_id column to restaurants
ALTER TABLE public.restaurants
  ADD COLUMN cuisine_type_id UUID REFERENCES public.cuisine_types(id) ON DELETE SET NULL;

CREATE INDEX idx_restaurants_cuisine_type_id ON public.restaurants(cuisine_type_id);

-- 4. Migrate existing data: map text type to cuisine_type_id
UPDATE public.restaurants r
SET cuisine_type_id = ct.id
FROM public.cuisine_types ct
WHERE LOWER(r.type) = LOWER(ct.name);

-- 5. Drop old type column
ALTER TABLE public.restaurants DROP COLUMN type;

-- 6. RLS for cuisine_types
ALTER TABLE public.cuisine_types ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cuisine_types TO authenticated;

CREATE POLICY "Authenticated users can view cuisine types"
  ON public.cuisine_types FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert cuisine types"
  ON public.cuisine_types FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update cuisine types"
  ON public.cuisine_types FOR UPDATE
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete cuisine types"
  ON public.cuisine_types FOR DELETE
  TO authenticated USING (true);
