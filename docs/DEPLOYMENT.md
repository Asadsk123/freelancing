# Deployment Guide

## Vercel quickstart (temporary *.vercel.app domain)

One-time, from the project root:

```powershell
npx vercel login                 # authenticate (browser/email — must be done by a human)
npx vercel link --yes            # create/link the Vercel project

# Production env vars (repeat with `preview` for preview deploys):
npx vercel env add DATABASE_URL production          # Neon connection string (from .env.local)
npx vercel env add AUTH_SECRET production           # 64-hex-char random (node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
npx vercel env add CRON_SECRET production           # random string — Vercel Cron automatically sends it as the Bearer token
npx vercel env add NEXT_PUBLIC_SITE_URL production  # https://<project>.vercel.app (update after first deploy)
npx vercel env add EMAIL_MODE production            # "production" to send real email, "log" until DNS is ready
npx vercel env add RESEND_API_KEY production        # from resend.com dashboard
npx vercel env add EMAIL_FROM_DEFAULT production
npx vercel env add EMAIL_FROM_SUPPORT production
npx vercel env add STORAGE_MODE production          # "r2" — see warning below
npx vercel env add R2_ACCOUNT_ID production
npx vercel env add R2_ACCESS_KEY_ID production
npx vercel env add R2_SECRET_ACCESS_KEY production
npx vercel env add R2_BUCKET_NAME production
npx vercel env add SENTRY_DSN production            # optional

npx vercel deploy --prod         # build + deploy
```

**Storage warning (Vercel):** the serverless filesystem is ephemeral —
`STORAGE_MODE=local` will silently lose uploads between invocations. On Vercel,
**R2 is required** for the file pipeline to work.

**Cron:** `vercel.json` schedules `GET /api/cron/email-retry` every 10 minutes.
When a `CRON_SECRET` env var exists, Vercel automatically sends it as
`Authorization: Bearer <CRON_SECRET>` — which is exactly what the route expects.

**Post-deploy:** set `NEXT_PUBLIC_SITE_URL` to the real deployment URL and
redeploy, then run the smoke checklist at the bottom of this file against the
live URL. Custom domain + SPF/DKIM/DMARC come last.

Production deployment for ROYAL-ASAD AI & Digital Solutions (Next.js 15 App Router).

## Requirements

- Node.js 20+
- A Neon PostgreSQL database (or any Postgres reachable over TLS)
- A host that runs Next.js server output (Vercel, Railway, Fly.io, a VPS with `next start`, etc.)

## Environment variables

Copy `.env.example` and fill in real values. Summary:

| Variable | Required in prod | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | Neon Postgres connection string |
| `AUTH_SECRET` | Yes (min 32 chars) | JWT signing key — app refuses to start without it in production |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical origin used by sitemap, robots, emails, JSON-LD |
| `RESEND_API_KEY` | For real email | Resend API key |
| `EMAIL_MODE` | Recommended | `production` to send; unset/`log` never sends |
| `EMAIL_FROM_DEFAULT` / `EMAIL_FROM_SUPPORT` | Recommended | From addresses (domain must match DNS setup) |
| `STORAGE_MODE` | Recommended | `r2` in prod; `local` keeps files on the app filesystem |
| `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET_NAME` | For R2 | Cloudflare R2 credentials |
| `CRON_SECRET` | For email retries | Bearer secret for `/api/cron/email-retry` |
| `SENTRY_DSN` | Optional | Error monitoring via Sentry envelope API |

The production build itself needs **no secrets** (verified in CI): every
integration degrades gracefully when unconfigured.

## Steps

1. `npm ci`
2. `npm run db:push` (first deploy) — applies the Drizzle schema to the database.
3. `npm run build`
4. `npm start` (or platform equivalent).
5. Sign in once with the admin email — the admin account is auto-provisioned
   for `admin@royalasad.com` on first OTP login.
6. Point a scheduler at the email retry worker every 5–15 minutes:
   `POST $SITE/api/cron/email-retry` with header `Authorization: Bearer $CRON_SECRET`
   (Vercel Cron, GitHub Actions schedule, or any cron + curl).

## Email DNS (before enabling EMAIL_MODE=production)

For the sending domain:

- SPF: TXT `v=spf1 include:_spf.resend.com ~all`
- DKIM: CNAME records from the Resend dashboard
- DMARC: TXT `v=DMARC1; p=quarantine; rua=mailto:dmarc@<domain>`

## Post-deploy verification

- `/` renders; `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/favicon.ico` return 200
- Sign-in works end-to-end (real OTP email arrives)
- `/admin/dashboard` requires an admin; `/dashboard` requires a session
- Upload a file on a project as admin; download it as the client
- `POST /api/cron/email-retry` with the secret returns `{processed, sent, failed}`
- Run Lighthouse against the production URL; investigate anything under 90
