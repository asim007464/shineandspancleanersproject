# Deploy to GitHub + Netlify (Shine & Span Cleaners)

## 1. Quick check before deploy

- **Pages/routes:** All wired in `App.jsx`: Home, About, Contact, Apply, Login, Signup, Forgot/Reset Password, Referral, Privacy, Terms, Admin.
- **SPA redirect:** `public/_redirects` has `/* /index.html 200` so Netlify serves the app on every path.
- **Secrets:** `.env` is in `.gitignore` — do **not** commit it. Set the same vars in Netlify (see below).

---

## 2. Push this project to your GitHub repo

Your repo: **https://github.com/asim007464/shineandspancleanersproject**

If this folder is **not** yet a git repo, or you want to push to that repo as a fresh copy:

```bash
cd g:\waseemproject\secondproject\vite-project

# If you haven't initialised git here yet:
git init
git add .
git commit -m "Shine & Span Cleaners – full app with Supabase"

# Add your GitHub repo as remote (use main or master to match your repo)
git remote add origin https://github.com/asim007464/shineandspancleanersproject.git

# If the repo already has a branch (e.g. main), pull first then push
git branch -M main
git pull origin main --allow-unrelated-histories
# Resolve any conflicts if needed, then:
git push -u origin main
```

If this folder **is already** a git repo and you only want to update the existing remote:

```bash
git remote -v
# If origin points to the correct repo:
git add .
git commit -m "Latest changes: referrals, admin, apply, auth, Supabase"
git push origin main
```

---

## 3. Netlify (site already connected to GitHub)

Because the repo is already connected to Netlify, a new push to `main` will trigger a new build. You only need to:

### 3.1 Build settings (usually auto-detected)

- **Build command:** `npm run build` (or `vite build`)
- **Publish directory:** `dist`
- **Node version:** 18 or 20 (in Netlify: Site settings → Environment → Node version, or add `NODE_VERSION=20`)

### 3.2 Environment variables (required)

In **Netlify → Site → Site configuration → Environment variables**, add:

| Name                     | Value                                      | Scopes   |
|--------------------------|--------------------------------------------|----------|
| `VITE_SUPABASE_URL`      | Your Supabase project URL                  | All      |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon (public) key            | All      |

Get both from **Supabase Dashboard → Settings → API** (Project URL and anon public key).

- **Important:** After adding or changing these, trigger a **new deploy** (Deploys → Trigger deploy → Deploy site). Env vars are baked in at build time.

---

## 4. Backend / database (Supabase)

Your app uses Supabase for auth, profiles, applications, referrals, site settings, etc. For production:

1. **Run all migrations** in the Supabase project that production uses:
   - In **Supabase Dashboard → SQL Editor**, run (in order) the scripts in `supabase/migrations/` that you use (e.g. schema, RLS, referral triggers, `get_referrer_by_referral_code`, `get_my_referred_profiles`, locations, storage, etc.).
2. **Auth redirect URLs:** In **Supabase → Authentication → URL Configuration**:
   - Add your **Netlify site URL** (e.g. `https://yoursite.netlify.app`) to **Redirect URLs**.
   - Add the same under **Site URL** if you want auth redirects to go there by default.
3. **First admin user:** Run in SQL Editor (once):  
   `UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';`  
   (and any `is_main_admin` / main-admin migration you use.)

---

## 5. After deploy

- Open your Netlify URL and test: Home, Apply, Login, Signup, Referral, Admin (with an admin account).
- If something fails, check **Netlify → Deploys → [latest] → Build log** and the browser console (F12) for missing env vars or Supabase errors.

---

## Summary

| Step | Action |
|------|--------|
| 1 | Push code to `https://github.com/asim007464/shineandspancleanersproject` |
| 2 | Netlify: set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` |
| 3 | Netlify: trigger a new deploy after setting env vars |
| 4 | Supabase: run migrations; add Netlify URL to Auth redirect URLs; set admin user |
