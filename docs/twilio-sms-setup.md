# Twilio + Supabase: SMS OTP Setup

Supabase’s **Phone** auth provider needs Twilio credentials so it can send 6-digit OTP codes by SMS. This guide shows how to create a Twilio account and get the **Message Service SID** (and related values) for Supabase.

---

## 1. Create a Twilio account

1. Go to **https://www.twilio.com**
2. Click **Sign up** (or **Try Twilio**).
3. Complete sign-up:
   - Verify your **email**
   - Verify your **phone number** (you’ll get SMS/calls to this number)
4. You get a **free trial** with a small balance.  
   - **Trial limit:** SMS can only be sent to **verified** phone numbers. To send to any number, you must upgrade and add a payment method.

---

## 2. Get Account SID and Auth Token

1. Log in to the **Twilio Console**: https://console.twilio.com
2. On the **Dashboard** (home), find **Account info**.
3. Copy:
   - **Account SID** (starts with `AC...`)
   - **Auth Token** (click “Show” to reveal, then copy)

You’ll paste these into Supabase later.

---

## 3. Get a phone number (for sending SMS)

1. In the Twilio Console, go to **Phone Numbers** → **Manage** → **Buy a number**  
   (or use the “Get a phone number” prompt on the Dashboard).
2. Choose your country and enable **SMS** (and **Voice** if you want).
3. Buy a number (trial accounts often get one free or very cheap).
4. After purchase, the number appears under **Phone Numbers** → **Manage** → **Active numbers**.  
   You’ll use this number (or its SID) when configuring the Messaging Service below.

---

## 4. Create a Messaging Service (to get the Message Service SID)

Supabase asks for a **Twilio Message Service SID** (the one that starts with `MG...`). You get it by creating a **Messaging Service** and adding your sending number to it.

1. In Twilio Console go to: **Messaging** → **Try it out** → **Send an SMS**  
   **or** **Messaging** → **Services**: https://console.twilio.com/us1/develop/sms/services
2. Click **Create Messaging Service**.
3. **Friendly name:** e.g. `Supabase OTP`.
4. **Use case:** choose something like **Verify users with a code** or **Notifications**.
5. Click **Create**.
6. On the new service page:
   - **Add senders** → **Phone numbers** → select the number you bought in step 3 → **Add**.
7. At the top of the service page you’ll see the **SID** that starts with **`MG`** (e.g. `MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`).  
   **This is your Message Service SID** — copy it for Supabase.

---

## 5. Configure Supabase

1. Open your project in **Supabase Dashboard**: https://supabase.com/dashboard
2. Go to **Authentication** → **Providers** → **Phone**.
3. **Enable** the Phone provider.
4. In the **SMS provider** / **Twilio** section, fill in:
   - **Twilio Account SID** — from step 2 (`AC...`)
   - **Twilio Auth Token** — from step 2
   - **Twilio Message Service SID** — from step 4 (`MG...`)
5. If Supabase shows a “From” or “Phone number” field, you can leave it blank when using a Message Service SID (Twilio will use the number you added to that service). If it still asks for a number, use your Twilio number in **E.164** format (e.g. `+1234567890`).
6. Save.

After this, Supabase can send SMS OTPs using Twilio. Your app’s “Send code to my phone” flow will use these settings.

---

## 6. Trial limits (important)

- **Twilio trial:** SMS is only sent to **verified** phone numbers (the ones you add in Twilio Console under **Phone Numbers** → **Manage** → **Verified Caller IDs**).
- To send OTP to **any** user phone number, you must **upgrade** your Twilio account and add a payment method.

---

## Quick reference

| What you need        | Where to get it |
|----------------------|-----------------|
| Account SID          | Console → Dashboard → Account info → `AC...` |
| Auth Token           | Same place, click “Show” |
| Message Service SID  | Messaging → Services → create service → add number → SID `MG...` |
| Phone number (if needed) | Phone Numbers → Manage → Active numbers |

If Supabase supports **Twilio Verify** as well, you can use that instead: create a **Verification Service** in Twilio and use its **Verification SID** in Supabase (see Supabase docs for “Twilio Verify” for exact field names).
