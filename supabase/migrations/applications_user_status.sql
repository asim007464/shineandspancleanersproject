-- Add user_id and status to applications (for "already applied" and approval flow)
-- Run in Supabase Dashboard → SQL Editor

-- Add columns (existing rows get user_id NULL, status 'pending')
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved'));

-- Users can read their own applications (to show status / request update)
DROP POLICY IF EXISTS "Users can read own applications" ON public.applications;
CREATE POLICY "Users can read own applications" ON public.applications
  FOR SELECT USING (auth.uid() = user_id);

-- Admin can update applications (e.g. set status to approved)
DROP POLICY IF EXISTS "Admin can update applications" ON public.applications;
CREATE POLICY "Admin can update applications" ON public.applications
  FOR UPDATE USING (public.get_my_profile_role() = 'admin');

-- Ensure admin select policy still exists (already there from schema.sql)
-- No change needed for INSERT: "Anyone can insert application" stays; we'll send user_id from app.
