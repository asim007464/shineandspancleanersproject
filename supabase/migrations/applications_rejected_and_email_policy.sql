-- 1. Add 'rejected' to application status (run after applications_user_status.sql)
-- Run in Supabase Dashboard → SQL Editor
-- NOTE: RLS and get_my_latest_application() are set in applications_my_by_user_id_only.sql
--       (user_id only, no email match - so new accounts don't see old applications).

ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_status_check;
ALTER TABLE public.applications ADD CONSTRAINT applications_status_check
  CHECK (status IN ('pending', 'approved', 'rejected'));
