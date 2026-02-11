-- =============================================================================
-- Locations with postcodes: admin can add/edit/delete and set active site location.
-- Run in Supabase Dashboard → SQL Editor.
-- =============================================================================

-- 1. Table: locations (name + postcodes; site-wide active location is in site_settings)
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  postcodes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS: only admin can read/insert/update/delete (public reads current location from site_settings)
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage locations" ON public.locations;
CREATE POLICY "Admin can manage locations" ON public.locations
  FOR ALL
  USING (public.get_my_profile_role() = 'admin')
  WITH CHECK (public.get_my_profile_role() = 'admin');

-- 3. Seed data (from your list + London)
INSERT INTO public.locations (name, postcodes) VALUES
  ('London', 'SW1, SW3, EC1, EC2, W1, WC1, WC2, NW1, SE1, E1, N1'),
  ('Wimbledon', 'SW19, SW20'),
  ('Richmond upon Thames', 'TW9, TW10, SW14'),
  ('Hampstead', 'NW3, NW11'),
  ('Beaconsfield', 'HP9'),
  ('Cobham', 'KT11'),
  ('Sevenoaks', 'TN13, TN14'),
  ('Hale (Cheshire)', 'WA15'),
  ('Wilmslow', 'SK9'),
  ('Stockbridge (Edinburgh)', 'EH3, EH4')
ON CONFLICT (name) DO UPDATE SET postcodes = EXCLUDED.postcodes, updated_at = NOW();

-- 4. Ensure site_settings can store location_postcodes (key/value table; no schema change needed)
-- Admin will upsert key 'location_postcodes' from the app when they "Set as site location".
