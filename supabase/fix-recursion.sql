-- ============================================================
-- FIX: "infinite recursion detected in policy for relation profiles"
-- Run this in Supabase SQL Editor (one time)
-- ============================================================

-- 1. Create helper that reads role without going through RLS
CREATE OR REPLACE FUNCTION public.get_my_profile_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- 2. Drop policies that cause recursion (they query profiles inside profiles policy)
DROP POLICY IF EXISTS "Admin can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can read all applications" ON public.applications;
DROP POLICY IF EXISTS "Admin can read all referrals" ON public.referrals;
DROP POLICY IF EXISTS "Admin can insert update referrals" ON public.referrals;
DROP POLICY IF EXISTS "Admin can update site settings" ON public.site_settings;

-- 3. Recreate them using the helper (no recursion)
CREATE POLICY "Admin can read all profiles" ON public.profiles
  FOR SELECT USING (public.get_my_profile_role() = 'admin');

CREATE POLICY "Admin can update profiles" ON public.profiles
  FOR UPDATE USING (public.get_my_profile_role() = 'admin');

CREATE POLICY "Admin can read all applications" ON public.applications
  FOR SELECT USING (public.get_my_profile_role() = 'admin');

CREATE POLICY "Admin can read all referrals" ON public.referrals
  FOR SELECT USING (public.get_my_profile_role() = 'admin');

CREATE POLICY "Admin can insert update referrals" ON public.referrals
  FOR ALL USING (public.get_my_profile_role() = 'admin');

CREATE POLICY "Admin can update site settings" ON public.site_settings
  FOR ALL USING (public.get_my_profile_role() = 'admin');
