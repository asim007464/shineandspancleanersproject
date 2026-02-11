-- =============================================================================
-- RUN THIS ENTIRE SCRIPT ONCE IN SUPABASE DASHBOARD → SQL EDITOR
-- Order matters: we set applications by user_id ONLY (no email match).
-- Do NOT run the old "email match" block after this or it will undo the fix.
-- =============================================================================

-- 1. Add 'rejected' to application status (no RLS/RPC change here)
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_status_check;
ALTER TABLE public.applications ADD CONSTRAINT applications_status_check
  CHECK (status IN ('pending', 'approved', 'rejected'));

-- 2. Applications RLS: users can only read their own (by user_id only)
DROP POLICY IF EXISTS "Users can read own applications" ON public.applications;
CREATE POLICY "Users can read own applications" ON public.applications
  FOR SELECT USING (auth.uid() = user_id);

-- 3. RPC: return only current user's latest application (by user_id only)
CREATE OR REPLACE FUNCTION public.get_my_latest_application()
RETURNS SETOF public.applications
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT a.* FROM public.applications a
  WHERE a.user_id = auth.uid()
  ORDER BY a.created_at DESC
  LIMIT 1;
$$;

-- 4. Fix "infinite recursion" in profiles: helper + admin policies
CREATE OR REPLACE FUNCTION public.get_my_profile_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

DROP POLICY IF EXISTS "Admin can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can read all applications" ON public.applications;
DROP POLICY IF EXISTS "Admin can read all referrals" ON public.referrals;
DROP POLICY IF EXISTS "Admin can insert update referrals" ON public.referrals;
DROP POLICY IF EXISTS "Admin can update site settings" ON public.site_settings;

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

-- 5. (Optional) Set your email as admin – change the email if needed
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'waseemsajjad@gmail.com';
