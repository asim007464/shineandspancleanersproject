# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Supabase (backend)

The app uses your client's Supabase project. To connect:

1. Copy `.env.example` to `.env`.
2. In [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Settings → API**, copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`
3. Restart the dev server after changing `.env`.

Use the client in code: `import { supabase } from './lib/supabase'` then `supabase.from('table')`, `supabase.auth`, `supabase.storage`, etc.

### First-time backend setup

1. **Run the schema**  
   In Supabase Dashboard → SQL Editor, paste and run the contents of `supabase/schema.sql`. This creates tables (profiles, applications, referrals, site_settings), RLS policies, and triggers.

2. **Create logo storage bucket**  
   In Supabase Dashboard → Storage → New bucket: name `logos`, set to **Public**. This allows the admin panel to upload and display the site logo.

3. **Make your account admin**  
   After signing up once via the app, run in SQL Editor (replace with your email):
   ```sql
   UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
   ```
   Then log in and open `/admin` to manage users, applications, referrals, and site settings (location + logo).

4. **Signup & forgot password (6-digit code)**  
   Both signup and forgot password use a **6-digit code** sent to the user’s email (no link). Keep **Confirm email** **OFF** in **Authentication → Providers → Email** so Supabase doesn’t send a separate confirmation link; the app sends the OTP and verifies the code on the site.

5. **OTP by email or phone**  
   Signup and forgot password send a **6-digit code** by **email** or **phone**. Email works with the default Email provider. For **phone (SMS)** OTP, enable the **Phone** provider in **Authentication → Providers** and configure an SMS provider (e.g. Twilio) in Supabase. Users choose “Email” or “Phone” and enter the code on the site.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
