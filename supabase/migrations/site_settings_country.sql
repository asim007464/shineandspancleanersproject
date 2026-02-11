-- =============================================================================
-- Add default country to site_settings (UK / US / Canada). Run in Supabase SQL Editor.
-- =============================================================================

INSERT INTO public.site_settings (key, value, updated_at)
VALUES ('country', 'uk', NOW())
ON CONFLICT (key) DO NOTHING;
