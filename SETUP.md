# Payment & Email Setup Guide

## 1. Stripe (Payment Gateway)

### Register
1. Go to **stripe.com** → Create account
2. Verify your email
3. You can start testing immediately — no business verification needed for test mode

### Create a Product and Price
1. In the Stripe Dashboard, go to **Product catalog** → **+ Add product**
2. Fill in:
   - **Name:** Гайд: Как собрать идеальную косметичку
   - **Pricing:** One-time · set your price · select currency (RUB or EUR/USD)
3. Save — you'll land on the product page
4. Copy the **Price ID** — it looks like `price_1ABC...` → paste into `.env.local` as `STRIPE_PRICE_ID`

### Get your Secret Key
1. Dashboard → **Developers** → **API keys**
2. Copy **Secret key** (`sk_test_...`) → paste into `.env.local` as `STRIPE_SECRET_KEY`

> Keep the dashboard in **Test mode** (toggle in the top-left) while developing.

---

## 2. Resend (Email Delivery)

### Register
1. Go to **resend.com** → Create account (free tier: 3 000 emails/month, 100/day)
2. Verify your email

### Get your API Key
1. Dashboard → **API Keys** → **Create API key**
2. Copy the key (`re_...`) → paste into `.env.local` as `RESEND_API_KEY`

### Sender address
- **In development** — `onboarding@resend.dev` works out of the box, no setup needed.
  All test emails land in the inbox of the **Resend account owner** regardless of the `to:` field (Resend restriction on free/unverified accounts).
- **In production** — add and verify your own domain in Resend → **Domains** → **Add Domain**.
  Then update `senderEmail` in `src/lib/config.ts` to e.g. `noreply@yourdomain.com`.

---

## 3. Local Testing

### Prerequisites
Install the Stripe CLI:
```bash
# macOS
brew install stripe/stripe-cli/stripe

# or download from: stripe.com/docs/stripe-cli
```

### Step-by-step

**Terminal 1 — start the dev server:**
```bash
npm run dev
```

**Terminal 2 — forward Stripe webhooks to localhost:**
```bash
stripe login          # one-time, opens browser
stripe listen --forward-to localhost:3000/api/webhook
```
The CLI will print a webhook signing secret:
```
> Ready! Your webhook signing secret is whsec_abc123...
```
Copy it → paste into `.env.local` as `STRIPE_WEBHOOK_SECRET`.
Restart the dev server after updating `.env.local`.

### Run a test purchase
1. Open **http://localhost:3000**
2. Click **Купить гайд** → modal opens
3. Enter any name and a real email address you can check
4. Click **Перейти к оплате** → Stripe Checkout opens
5. Use the test card:

| Field          | Value                  |
|----------------|------------------------|
| Card number    | `4242 4242 4242 4242`  |
| Expiry         | Any future date        |
| CVC            | Any 3 digits           |
| Name / Address | Anything               |

6. Click **Pay** → redirected to `/success` ✓
7. Check **Terminal 2** — you should see `checkout.session.completed` webhook received ✓
8. Check your email inbox — guide PDF attached ✓
9. Check `ADMIN_EMAIL` inbox — purchase notification with buyer details ✓

### Other test cards

| Scenario              | Card number          |
|-----------------------|----------------------|
| Payment declined      | `4000 0000 0000 0002` |
| Insufficient funds    | `4000 0000 0000 9995` |
| 3D Secure required    | `4000 0025 0000 3155` |

---

## 4. Checklist before going live

- [ ] Switch Stripe to **Live mode** → get new `sk_live_...` key and `price_live_...` ID
- [ ] Deploy the app (e.g. Vercel)
- [ ] Register a live webhook in Stripe Dashboard:
      **Developers → Webhooks → Add endpoint**
      URL: `https://yourdomain.com/api/webhook`
      Event: `checkout.session.completed`
      Copy the signing secret → set as `STRIPE_WEBHOOK_SECRET` in production env vars
- [ ] Verify a domain in Resend and update `senderEmail` in `src/lib/config.ts`
- [ ] Set `NEXT_PUBLIC_BASE_URL=https://yourdomain.com` in production env vars
- [ ] Upload `private/guide.pdf` to the server (the folder is gitignored — see note below)

> **Note on the PDF in production:** `private/` is gitignored and won't be deployed automatically.
> The simplest fix is to upload the file manually via your hosting provider's file manager or SSH.
> A more robust solution is to store the PDF in Vercel Blob or Amazon S3 and fetch it by URL in the webhook.
