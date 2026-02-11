-- ============================================================
-- Make a user an ADMIN (run in Supabase SQL Editor)
-- ============================================================

-- STEP 1: Check who is in profiles (see exact emails and roles)
-- Run this first to see your users:
-- SELECT id, email, full_name, role FROM public.profiles;

-- STEP 2: Set waseem as admin (use the EXACT email from STEP 1)
-- This returns the updated row so you see "1 row" if it worked:
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'waseemsajjad@gmail.com'
RETURNING id, email, role;
