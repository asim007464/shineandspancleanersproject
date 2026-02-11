-- =============================================================================
-- One referral per person + application progress (status) on referrals.
-- Run in Supabase Dashboard → SQL Editor after referral_trigger_on_application.sql
-- =============================================================================

-- 1. Add column to store the referred application's status (pending/approved/rejected) for progress display
ALTER TABLE public.referrals
  ADD COLUMN IF NOT EXISTS referred_application_status TEXT;

-- 2. Trigger: create at most ONE referral per referred_user_id; set application status
CREATE OR REPLACE FUNCTION public.on_application_with_referrer()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.referrer_id IS NOT NULL AND NEW.user_id IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.referrals WHERE referred_user_id = NEW.user_id) THEN
      INSERT INTO public.referrals (referrer_id, referred_application_id, referred_user_id, status, referred_application_status)
      VALUES (NEW.referrer_id, NEW.id, NEW.user_id, 'pending', COALESCE(NEW.status, 'pending'));
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_application_with_referrer ON public.applications;
CREATE TRIGGER on_application_with_referrer
  AFTER INSERT ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.on_application_with_referrer();

-- 3. When an application's status changes, update the linked referral's referred_application_status
CREATE OR REPLACE FUNCTION public.sync_referral_application_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.referrals
  SET referred_application_status = NEW.status, updated_at = NOW()
  WHERE referred_application_id = NEW.id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_referral_application_status ON public.applications;
CREATE TRIGGER sync_referral_application_status
  AFTER UPDATE OF status ON public.applications
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.sync_referral_application_status();

-- 4. Backfill referred_application_status from applications
UPDATE public.referrals r
SET referred_application_status = a.status
FROM public.applications a
WHERE r.referred_application_id = a.id AND (r.referred_application_status IS DISTINCT FROM a.status);

-- 5. One referral per person: keep only one referral per referred_user_id (earliest), delete duplicates
DELETE FROM public.referrals r1
USING public.referrals r2
WHERE r1.referred_user_id = r2.referred_user_id
  AND r1.id <> r2.id
  AND r1.created_at > r2.created_at;

-- 6. RPC: only create referral if this referred_user_id has no referral yet
CREATE OR REPLACE FUNCTION public.ensure_referral_for_application(p_application_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_app RECORD;
BEGIN
  SELECT id, referrer_id, user_id, status INTO v_app
  FROM public.applications WHERE id = p_application_id LIMIT 1;
  IF v_app.referrer_id IS NULL OR v_app.user_id IS NULL THEN RETURN; END IF;
  IF EXISTS (SELECT 1 FROM public.referrals WHERE referred_user_id = v_app.user_id) THEN RETURN; END IF;
  INSERT INTO public.referrals (referrer_id, referred_application_id, referred_user_id, status, referred_application_status)
  VALUES (v_app.referrer_id, v_app.id, v_app.user_id, 'pending', COALESCE(v_app.status, 'pending'));
END;
$$;
