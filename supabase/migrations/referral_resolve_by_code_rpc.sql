-- =============================================================================
-- Resolve referral code to referrer (id + name) so applicants can look up
-- referrer without needing to read other users' profiles (RLS blocks that).
-- Run in Supabase Dashboard → SQL Editor.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.get_referrer_by_referral_code(p_code text)
RETURNS TABLE(id uuid, full_name text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT pr.id, pr.full_name
  FROM public.profiles pr
  WHERE pr.referral_code = upper(trim(nullif(p_code, '')))
  LIMIT 1;
$$;

-- Allow authenticated users to call (applicants need it on Apply form)
GRANT EXECUTE ON FUNCTION public.get_referrer_by_referral_code(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_referrer_by_referral_code(text) TO anon;
