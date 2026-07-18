-- ============================================
-- MyFoodMap - Admin RLS Enforcement
-- Date: 2026-07-18
--
-- Adds server-side admin enforcement for
-- cuisine_types. Previously, any authenticated
-- user could CRUD cuisine types (migration 002).
-- Now only users with is_admin = true on their
-- profile can perform write operations.
-- SELECT is open to all (anon + authenticated)
-- so the app can display cuisine types to everyone.
-- ============================================

-- 1. Add is_admin column to profiles (default false)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false NOT NULL;

-- 2. Seed the admin user based on hardcoded email
UPDATE public.profiles
SET is_admin = true
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'jdorado.cebrian@gmail.com'
);

-- 3. Drop the permissive RLS policies from migration 002
--    that allowed any authenticated user to CRUD cuisine_types
DROP POLICY IF EXISTS "Authenticated users can view cuisine types"
  ON public.cuisine_types;
DROP POLICY IF EXISTS "Authenticated users can insert cuisine types"
  ON public.cuisine_types;
DROP POLICY IF EXISTS "Authenticated users can update cuisine types"
  ON public.cuisine_types;
DROP POLICY IF EXISTS "Authenticated users can delete cuisine types"
  ON public.cuisine_types;

-- 4. Also drop the admin-only SELECT (replaced by public read)
DROP POLICY IF EXISTS "Admins can view cuisine types"
  ON public.cuisine_types;

-- 5. Anyone can read cuisine types (anon + authenticated)
GRANT SELECT ON public.cuisine_types TO anon;
GRANT SELECT ON public.cuisine_types TO authenticated;

CREATE POLICY "Anyone can view cuisine types"
  ON public.cuisine_types
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 6. Admin-only policies for mutations (INSERT/UPDATE/DELETE)
CREATE POLICY "Admins can insert cuisine types"
  ON public.cuisine_types
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update cuisine types"
  ON public.cuisine_types
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete cuisine types"
  ON public.cuisine_types
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
  );
