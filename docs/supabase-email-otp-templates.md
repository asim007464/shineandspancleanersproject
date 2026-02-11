# Show 6-digit OTP in Supabase emails (instead of magic link)

Your app asks users to **enter a 6-digit code** on the website. By default, Supabase sends an email with a **magic link** (“Follow this link to login”) and no code. To show the **OTP code** in the email, you need to edit the email templates in the Supabase Dashboard.

---

## Step 1: Open Email Templates

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) and open your project.
2. In the left sidebar, go to **Authentication** → **Email Templates**.

---

## Step 2: Edit the “Magic Link” template

This template is used when:

- After signup, the user clicks **“Send code to my email”** (verification step).
- On **Forgot password**, when the user requests a code to their email.

1. Click **Magic Link** in the list of templates.
2. **Subject** – you can keep it or change it, for example:
   - `Your login code – Shine & Span`
3. **Message body** – replace the content with something like this so the **6-digit code** is clearly shown, and so the user can open the OTP page from the email if they closed the website:

```html
<h2>Your verification code</h2>
<p>Use this 8-digit code to verify your account or reset your password:</p>
<p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">{{ .Token }}</p>
<p>Enter this code on the website. You can request a new code after 60 seconds. The code expires in about 1 hour.</p>
<p>If you closed the website, use this link to open the verification page and enter the code:</p>
<p><a href="{{ .RedirectTo }}">Open verification page</a></p>
<p>If you didn't request this, you can ignore this email.</p>
```

4. Click **Save**.

Important variables:
- **`{{ .Token }}`** – Supabase replaces this with the actual 6-digit OTP. Do not remove it.
- **`{{ .RedirectTo }}`** – The link to your app’s OTP page (signup or forgot password). If the user closed the site and opens the email later, they can click this link to return to the correct page and enter the code.

---

## Step 3 (optional): Edit “Confirm signup” if you use it

If you ever send a “confirm signup” email and want that to show a code instead of only a link, edit the **Confirm signup** template and use `{{ .Token }}` in the body, for example:

```html
<h2>Confirm your signup</h2>
<p>Your 6-digit verification code is:</p>
<p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">{{ .Token }}</p>
<p>Enter this code on the website to confirm your email.</p>
```

---

## Step 4 (optional): “Reset password” / recovery email

If you use the **recovery** flow and want the reset email to show a code instead of only a link, edit the **Reset password** template and include `{{ .Token }}` in the body in the same way as above.

---

## Summary

| Template       | When it’s used in your app              | What to add in the body   |
|----------------|----------------------------------------|---------------------------|
| **Magic Link** | Signup verification + Forgot password  | `{{ .Token }}` (6-digit)  |
| Confirm signup | If you send signup confirmation email | `{{ .Token }}` (optional) |
| Reset password | If you use recovery email              | `{{ .Token }}` (optional) |

After saving the **Magic Link** template, new emails sent when users click “Send code to my email” (signup or forgot password) will show the **6-digit OTP** so users can type it on your website. ### Redirect URLs (for the link in the email)

For the `{{ .RedirectTo }}` link to work, add your site URLs in Supabase: **Authentication** → **URL Configuration** → **Redirect URLs** (e.g. `https://yoursite.com/signup`, `https://yoursite.com/forgot-password`, and for local dev `http://localhost:5173/signup`, `http://localhost:5173/forgot-password`). The app already passes the correct redirect when sending the code, so users who click the link in the email land on the OTP page.
