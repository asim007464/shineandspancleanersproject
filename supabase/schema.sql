-- ============================================================
-- Run this in Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. PROFILES (extends auth.users; one row per signed-up user)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  referral_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generate referral_code from short id
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT AS $$
  SELECT upper(substring(md5(random()::text) from 1 for 8));
$$ LANGUAGE sql;

-- Trigger: create profile on signup and set referral_code
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    public.generate_referral_code()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. APPLICATIONS (job applications from Apply form)
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_data JSONB NOT NULL,
  referrer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. REFERRALS (track referred cleaners: progress, days worked, reward)
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
  referred_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  days_worked INT NOT NULL DEFAULT 0,
  reward_eligible_at DATE,
  reward_claimed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'working', 'eligible', 'claimed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SITE SETTINGS (location, logo URL – editable by admin)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert defaults
INSERT INTO public.site_settings (key, value) VALUES
  ('location', 'London'),
  ('location_full', 'London, United Kingdom'),
  ('logo_url', '')
ON CONFLICT (key) DO NOTHING;

-- 5. HELPER: get current user's role without triggering RLS (avoids infinite recursion)
CREATE OR REPLACE FUNCTION public.get_my_profile_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- 6. ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies so this script can be re-run safely
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can insert application" ON public.applications;
DROP POLICY IF EXISTS "Admin can read all applications" ON public.applications;
DROP POLICY IF EXISTS "Referrer can read own referrals" ON public.referrals;
DROP POLICY IF EXISTS "Admin can read all referrals" ON public.referrals;
DROP POLICY IF EXISTS "Admin can insert update referrals" ON public.referrals;
DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin can update site settings" ON public.site_settings;

-- PROFILES: users see own; admin sees all (use helper to avoid recursion)
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin can read all profiles" ON public.profiles
  FOR SELECT USING (public.get_my_profile_role() = 'admin');

CREATE POLICY "Admin can update profiles" ON public.profiles
  FOR UPDATE USING (public.get_my_profile_role() = 'admin');

-- APPLICATIONS: anyone can insert (apply form); admin can read all
CREATE POLICY "Anyone can insert application" ON public.applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can read all applications" ON public.applications
  FOR SELECT USING (public.get_my_profile_role() = 'admin');

-- REFERRALS: referrer can read own; admin can read/update all
CREATE POLICY "Referrer can read own referrals" ON public.referrals
  FOR SELECT USING (referrer_id = auth.uid());

CREATE POLICY "Admin can read all referrals" ON public.referrals
  FOR SELECT USING (public.get_my_profile_role() = 'admin');

CREATE POLICY "Admin can insert update referrals" ON public.referrals
  FOR ALL USING (public.get_my_profile_role() = 'admin');

-- SITE_SETTINGS: public read; admin write
CREATE POLICY "Anyone can read site settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admin can update site settings" ON public.site_settings
  FOR ALL USING (public.get_my_profile_role() = 'admin');

-- Auto-create referral row when application has referrer
CREATE OR REPLACE FUNCTION public.on_application_with_referrer()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referrer_id IS NOT NULL THEN
    INSERT INTO public.referrals (referrer_id, referred_application_id, status)
    VALUES (NEW.referrer_id, NEW.id, 'pending');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_application_with_referrer ON public.applications;
CREATE TRIGGER on_application_with_referrer
  AFTER INSERT ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.on_application_with_referrer();

-- 7. STORAGE: logo uploads (create bucket in Dashboard → Storage → New bucket: "logos", Public)
-- Then in Storage → logos → Policies: allow public read; allow authenticated upload (or admin only via RLS).
-- For admin-only upload use: INSERT policy for auth.role() = 'authenticated' + check profile.role in app.

-- 8. Make a user admin: run in a SEPARATE new query (see supabase/make-admin.sql).
--    Do NOT add it here or use "SET role" – use: UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
