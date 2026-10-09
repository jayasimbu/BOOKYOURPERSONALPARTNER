# Companion Connect — Staging Deployment Guide

**Target Environment:** Vercel Staging + Supabase Cloud + Razorpay Sandbox  
**Status:** READY FOR STAGING DEPLOYMENT

---

## 🛠️ EXACT MANUAL STEPS TO LAUNCH CLOUD STAGING

To deploy the locally verified codebase to cloud staging, execute the following manual commands when authorized with your cloud accounts:

### Step 1: Link Supabase Cloud Project & Push Database Migrations
```bash
# 1. Authenticate with Supabase CLI
npx supabase login

# 2. Link local repo to your target staging Supabase project (DO NOT link to production!)
npx supabase link --project-ref your-staging-project-ref

# 3. Push schema migrations 01 and 02 (19 tables + idempotent RLS policies)
npx supabase db push

# 4. Set backend Edge Function secrets
npx supabase secrets set RAZORPAY_KEY_SECRET=rzp_test_secret_key
npx supabase secrets set RAZORPAY_WEBHOOK_SECRET=test_webhook_secret

# 5. Deploy Razorpay Webhook Edge Function
npx supabase functions deploy razorpay-webhook
```

### Step 2: Deploy Frontend to Vercel Staging
```bash
# 1. Authenticate with Vercel CLI
npx vercel login

# 2. Deploy preview build to Vercel Staging
npx vercel --build
npx vercel deploy --prebuilt
```

### Step 3: Configure Razorpay Test Mode Webhook
1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com/) in **Test Mode**.
2. Navigate to **Settings** -> **Webhooks** -> **Add New Webhook**.
3. Set **Webhook URL** to: `https://your-staging-project-ref.supabase.co/functions/v1/razorpay-webhook`.
4. Set **Secret** to match `RAZORPAY_WEBHOOK_SECRET`.
5. Select active events: `payment.captured` and `payment.failed`.

---

## 📌 ENVIRONMENT VARIABLE SEPARATION MATRIX

| Environment Variable | Target Location | Client Exposed | Purpose |
| :--- | :--- | :---: | :--- |
| `VITE_SUPABASE_URL` | Vercel Env Vars | YES | Supabase Client Endpoint |
| `VITE_SUPABASE_ANON_KEY` | Vercel Env Vars | YES | Supabase Anon Key |
| `VITE_RAZORPAY_KEY_ID` | Vercel Env Vars | YES | Razorpay Sandbox Key ID |
| `RAZORPAY_KEY_SECRET` | Supabase Secrets | 🚫 NO | Server Payment Creation |
| `RAZORPAY_WEBHOOK_SECRET` | Supabase Secrets | 🚫 NO | Webhook Signature Verification |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Secrets | 🚫 NO | Edge Function Admin Access |
