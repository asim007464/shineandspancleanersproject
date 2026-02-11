-- =============================================================================
-- RUN THIS IN SUPABASE DASHBOARD → SQL EDITOR
-- Use this if a brand-new account (that never applied) still sees
-- "We are checking your profile" on the Apply page.
-- =============================================================================
-- This makes "my application" depend ONLY on user_id (logged-in user).
-- It removes the email-based match that can show another person's application.
-- =============================================================================

-- 1. RLS: users can only READ their own applications (by user_id)
DROP POLICY IF EXISTS "Users can read own applications" ON public.applications;
CREATE POLICY "Users can read own applications" ON public.applications
  FOR SELECT USING (auth.uid() = user_id);

-- 2. RPC: return only the current user's latest application (by user_id only)
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
