-- =============================================================================
-- Worker role: users who have applied become 'worker' and cannot be made admin.
-- Order: main admin → admin → worker → user. Run in Supabase Dashboard → SQL Editor.
-- =============================================================================

-- 1. Allow 'worker' in profiles.role (drop existing check and add new one)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check1;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'worker', 'admin'));

-- 2. Backfill: set role = 'worker' for anyone who has at least one application and is currently 'user'
UPDATE public.profiles
SET role = 'worker', updated_at = NOW()
WHERE role = 'user'
  AND id IN (SELECT user_id FROM public.applications WHERE user_id IS NOT NULL);

-- 3. When a new application is submitted, set that user's role to 'worker' if they are 'user'
CREATE OR REPLACE FUNCTION public.set_profile_worker_on_application()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET role = 'worker', updated_at = NOW()
  WHERE id = NEW.user_id AND role = 'user';
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS set_profile_worker_on_application_trigger ON public.applications;
CREATE TRIGGER set_profile_worker_on_application_trigger
  AFTER INSERT ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.set_profile_worker_on_application();

-- 4. Only 'user' (not worker) can be promoted to admin; workers cannot become admin
CREATE OR REPLACE FUNCTION public.only_main_admin_can_promote_to_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updater_is_main boolean;
BEGIN
  IF NEW.role = 'admin' THEN
    IF OLD.role = 'worker' THEN
      RAISE EXCEPTION 'Workers (users who have applied) cannot be made admin.';
    END IF;
    IF OLD.role = 'user' THEN
      SELECT is_main_admin INTO updater_is_main FROM public.profiles WHERE id = auth.uid() LIMIT 1;
      IF updater_is_main <> true THEN
        RAISE EXCEPTION 'Only the main admin can make other users admin.';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
