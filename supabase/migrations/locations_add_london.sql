-- Add London as a location option (run if you already ran locations_table.sql before London was added)
INSERT INTO public.locations (name, postcodes) VALUES
  ('London', 'SW1, SW3, EC1, EC2, W1, WC1, WC2, NW1, SE1, E1, N1')
ON CONFLICT (name) DO UPDATE SET postcodes = EXCLUDED.postcodes, updated_at = NOW();
