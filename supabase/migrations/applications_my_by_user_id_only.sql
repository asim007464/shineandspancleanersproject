-- Fix: "My application" must be by user_id only, not by email.
-- Otherwise a new account with the same email as an old applicant would see that person's application (e.g. "approved").
-- Run in Supabase Dashboard → SQL Editor (after applications_rejected_and_email_policy.sql).

-- 1. RLS: Users can only read their own applications (by user_id)
DROP POLICY IF EXISTS "Users can read own applications" ON public.applications;
CREATE POLICY "Users can read own applications" ON public.applications
  FOR SELECT USING (auth.uid() = user_id);

-- 2. RPC: Return only the current user's latest application (by user_id)
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
