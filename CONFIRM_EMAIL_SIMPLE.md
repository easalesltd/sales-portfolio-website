# Confirm email — simple setup (one service: Resend)

You only need **Resend** (free tier). No EmailJS private key, no extra EmailJS template.

## 1. Resend

1. Create an account at [resend.com](https://resend.com).
2. Add your domain (e.g. `easalesltd.co.uk`) and follow their DNS steps until it verifies.
3. Create an **API key** and copy it.
4. Pick a **from** address on that domain, e.g. `hello@easalesltd.co.uk` (must be allowed in Resend).

## 2. Vercel (or `.env.local` on your computer)

Add **exactly these** environment variables:

| Key | Example |
|-----|---------|
| `REQUEST_VISIT_TOKEN_SECRET` | Any random string, **at least 16 characters** (password generator is fine) |
| `RESEND_API_KEY` | `re_…` from Resend |
| `RESEND_FROM` | `East Anglian Sales <hello@easalesltd.co.uk>` |
| `VISIT_REQUEST_NOTIFY_EMAIL` | Your inbox: `dave@easalesltd.co.uk` |
| `NEXT_PUBLIC_SITE_URL` | `https://www.easalesltd.co.uk` (your real site, no trailing slash) |

## 3. Redeploy

Vercel → **Deployments** → **⋯** → **Redeploy** so the new variables load.

## What happens

1. Visitor submits **Request an Agent Visit**.
2. They get an email from Resend with a **Confirm** link.
3. They click it → you get one email at `VISIT_REQUEST_NOTIFY_EMAIL` with their details (Reply-To is their address).

If these variables are **missing**, the form falls back to the old “send straight from the browser” behaviour.

## Optional: advanced

You can instead use EmailJS for the notification email if you set `EMAILJS_PRIVATE_KEY` — see `.env.example`. The simple list above is enough on its own.
