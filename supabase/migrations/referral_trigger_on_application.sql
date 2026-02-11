-- =============================================================================
-- Referrals: trigger + policy + backfill so referred applications show for referrer.
-- Run this ENTIRE script in Supabase Dashboard → SQL Editor (once).
-- =============================================================================

-- 1. Referrer can read their own referrals (for Refer & Earn page)
DROP POLICY IF EXISTS "Referrer can read own referrals" ON public.referrals;
CREATE POLICY "Referrer can read own referrals" ON public.referrals
  FOR SELECT USING (referrer_id = auth.uid());

-- 2. Trigger: when an application is inserted with referrer_id, create a referral row
CREATE OR REPLACE FUNCTION public.on_application_with_referrer()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.referrer_id IS NOT NULL THEN
    INSERT INTO public.referrals (referrer_id, referred_application_id, referred_user_id, status)
    VALUES (NEW.referrer_id, NEW.id, NEW.user_id, 'pending');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_application_with_referrer ON public.applications;
CREATE TRIGGER on_application_with_referrer
  AFTER INSERT ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.on_application_with_referrer();

-- 3. Backfill: create referral rows for applications that already have referrer_id but no referral
INSERT INTO public.referrals (referrer_id, referred_application_id, referred_user_id, status)
SELECT a.referrer_id, a.id, a.user_id, 'pending'
FROM public.applications a
WHERE a.referrer_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM public.referrals r WHERE r.referred_application_id = a.id);

-- 4. RPC: call from app after submit so referral is created even if trigger was missing
CREATE OR REPLACE FUNCTION public.ensure_referral_for_application(p_application_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_app RECORD;
BEGIN
  SELECT id, referrer_id, user_id INTO v_app
  FROM public.applications WHERE id = p_application_id LIMIT 1;
  IF v_app.referrer_id IS NULL THEN RETURN; END IF;
  IF EXISTS (SELECT 1 FROM public.referrals WHERE referred_application_id = p_application_id) THEN RETURN; END IF;
  INSERT INTO public.referrals (referrer_id, referred_application_id, referred_user_id, status)
  VALUES (v_app.referrer_id, v_app.id, v_app.user_id, 'pending');
END;
$$;
