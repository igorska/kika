# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (may use port 3001 if 3000 is taken)
npm run build      # Production build
npm run lint       # ESLint via next lint
npm run test       # Run all tests once (vitest)
npm run test:watch # Watch mode
npm run test:coverage # Coverage report
```

Run a single test file:
```bash
npx vitest run src/app/api/checkout/route.test.ts
```

## Environment Variables

Copy `.env.example` to `.env.local`. Required vars:

| Variable | Purpose |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe API secret |
| `STRIPE_PRICE_ID` | Stripe price ID for the guide product |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature verification |
| `RESEND_API_KEY` | Transactional email via Resend |
| `ADMIN_EMAIL` | Where purchase/failure notifications go |
| `NEXT_PUBLIC_BASE_URL` | Base URL used in Stripe redirect URLs |

## Architecture

Single-product landing page + Stripe checkout. Russian-language content (guide: "Как собрать идеальную косметичку").

**Page structure** (`HomeClient.tsx` orchestrates):
`Hero` → `TrustBar` → `AboutGuide` → `Contents` → `AboutAuthor` → `CtaSection`

Any section can trigger `CheckoutModal` via `onBuyClick` prop. `CheckoutModal` is dynamically imported with `ssr: false`.

**Purchase flow:**
1. User fills name + email (+ optional phone with country dial code) in `CheckoutModal`
2. `POST /api/checkout` — creates a Stripe Checkout session, stores customer metadata (IP, geo, device, UA) via Vercel/Cloudflare headers
3. User pays on Stripe-hosted page, redirected to `/success`
4. `POST /api/webhook` — handles `checkout.session.completed`: sends PDF guide to customer via Resend, sends admin notification; handles `payment_intent.payment_failed`: sends failure notification to admin
5. PDF file must exist at `private/guide.pdf` (relative to `process.cwd()`)

**Key config:** `src/lib/config.ts` — product name, admin email, PDF path, sender email.

## Design System

Tailwind custom tokens (defined in `tailwind.config.ts`):
- `primary` — `#E83A7C` (buttons, accents)
- `primary-dark` — `#C4205E`
- `primary-light` — `#F9D0E2`
- `charcoal` — `#2D2D2D` (text)
- `cream` — `#FAF8F6` (modal background)
- `font-serif` — Playfair Display (loaded via `next/font/google`, CSS var `--font-playfair`)
- `font-sans` — system UI stack

Scroll animations: add `data-animate` attribute to elements; `AnimationObserver` (client component in layout) uses `IntersectionObserver` to add `in-view` class. Respects `prefers-reduced-motion`.

Framer Motion is used for `CheckoutModal` entrance animations (spring on desktop, slide-up on mobile).
