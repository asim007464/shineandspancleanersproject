-- =============================================================================
-- Let referrers see name and email of people they referred (RLS blocks direct
-- profile read). Run in Supabase Dashboard → SQL Editor.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.get_my_referred_profiles()
RETURNS TABLE(referred_user_id uuid, full_name text, email text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT p.id AS referred_user_id, p.full_name, p.email
  FROM public.referrals r
  JOIN public.profiles p ON p.id = r.referred_user_id
  WHERE r.referrer_id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public.get_my_referred_profiles() TO authenticated;
