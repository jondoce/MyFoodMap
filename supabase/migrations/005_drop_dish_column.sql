-- ============================================
-- MyFoodMap - Drop unused dish column
-- Date: 2026-07-18
--
-- The dish column in restaurants was removed
-- from the application code but never from the
-- database. No code references it.
-- ============================================

ALTER TABLE public.restaurants DROP COLUMN IF EXISTS dish;
