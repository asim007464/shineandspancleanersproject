-- Run in Supabase Dashboard → SQL Editor.
-- Prevents applying with an email or phone already used by another account's application.

CREATE OR REPLACE FUNCTION public.check_application_email_phone_taken(check_email TEXT, check_phone TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.applications a
    WHERE a.user_id IS DISTINCT FROM auth.uid()
      AND (
        (a.form_data->>'email') IS NOT NULL AND TRIM(a.form_data->>'email') = TRIM(check_email)
        OR (a.form_data->>'phone') IS NOT NULL AND TRIM(a.form_data->>'phone') = TRIM(check_phone)
      )
  );
$$;
