-- =============================================================================
-- Main admin: one profile can be the main admin and cannot be demoted to user.
-- Admins created by the main admin (role = 'admin', is_main_admin = false) can be set back to user.
-- Run in Supabase Dashboard → SQL Editor
-- =============================================================================

-- 1. Add column: only one row should have is_main_admin = true
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_main_admin BOOLEAN NOT NULL DEFAULT false;

-- 2. Set the first existing admin as main (if none set yet)
UPDATE public.profiles
SET is_main_admin = true
WHERE role = 'admin'
  AND (SELECT COUNT(*) FROM public.profiles WHERE is_main_admin = true) = 0
  AND id = (SELECT id FROM public.profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1);

-- 3. Ensure main admin always has role = 'admin' (cannot be demoted)
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_main_admin_has_admin_role;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_main_admin_has_admin_role
  CHECK ( (NOT is_main_admin) OR (role = 'admin') );

-- 4. Only one main admin allowed
DROP INDEX IF EXISTS profiles_one_main_admin;
CREATE UNIQUE INDEX profiles_one_main_admin ON public.profiles ((true)) WHERE is_main_admin = true;

-- 5. Optional: trigger to block demoting main admin (extra safety)
CREATE OR REPLACE FUNCTION public.prevent_demote_main_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.is_main_admin = true AND NEW.role <> 'admin' THEN
    RAISE EXCEPTION 'Cannot change main admin to non-admin role.';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS prevent_demote_main_admin_trigger ON public.profiles;
CREATE TRIGGER prevent_demote_main_admin_trigger
  BEFORE UPDATE OF role ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_demote_main_admin();

-- 6. Only main admin can promote a user to admin
CREATE OR REPLACE FUNCTION public.only_main_admin_can_promote_to_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updater_is_main boolean;
BEGIN
  IF OLD.role = 'user' AND NEW.role = 'admin' THEN
    SELECT is_main_admin INTO updater_is_main FROM public.profiles WHERE id = auth.uid() LIMIT 1;
    IF updater_is_main <> true THEN
      RAISE EXCEPTION 'Only the main admin can make other users admin.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS only_main_admin_can_promote_trigger ON public.profiles;
CREATE TRIGGER only_main_admin_can_promote_trigger
  BEFORE UPDATE OF role ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.only_main_admin_can_promote_to_admin();

-- 7. Only main admin can demote an admin to user (sub-admin cannot make themselves or others user)
CREATE OR REPLACE FUNCTION public.only_main_admin_can_demote_to_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updater_is_main boolean;
BEGIN
  IF OLD.role = 'admin' AND NEW.role = 'user' THEN
    SELECT is_main_admin INTO updater_is_main FROM public.profiles WHERE id = auth.uid() LIMIT 1;
    IF updater_is_main <> true THEN
      RAISE EXCEPTION 'Only the main admin can change an admin back to user.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS only_main_admin_can_demote_trigger ON public.profiles;
CREATE TRIGGER only_main_admin_can_demote_trigger
  BEFORE UPDATE OF role ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.only_main_admin_can_demote_to_user();
