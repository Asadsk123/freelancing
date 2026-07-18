# ROYAL-ASAD AI & Digital Solutions

Premium international agency platform: public marketing site, client portal,
and admin suite in one Next.js application.

## Stack

Next.js 15 (App Router, RSC + server actions) · TypeScript strict · Tailwind CSS 4
· Neon PostgreSQL + Drizzle ORM · passwordless OTP auth (jose JWT) · provider-based
email (Resend) and storage (local/Cloudflare R2) · 14-language i18n with RTL ·
Vitest · GitHub Actions CI.

## Getting started

```bash
npm ci
cp .env.example .env.local   # fill in DATABASE_URL (+ AUTH_SECRET for prod-like runs)
npm run db:push              # apply schema
npm run dev                  # http://localhost:3000
```

Sign in with any email — in development the OTP is logged, and the fallback
code `123456` is accepted. `admin@royalasad.com` is auto-provisioned as admin.

Without `DATABASE_URL` the app still runs: every page degrades gracefully with
a "database not connected" notice.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | dev server |
| `npm run lint` / `npx tsc --noEmit` | static checks |
| `npm test` | unit tests (Vitest, no DB needed) |
| `npm run build` / `npm start` | production build / serve |
| `npm run db:push` / `npm run db:studio` | Drizzle schema push / data browser |

## Project map

```
src/app/(public)/    marketing site (home, services, portfolio, blog, contact, …)
src/app/(auth)/      login + OTP verification
src/app/(portal)/    client portal (projects, files, conversations, reviews, settings)
src/app/admin/       admin suite (projects, blog, team, audit log, …)
src/app/api/         upload/serve/cron route handlers
src/lib/             repositories, auth, email, storage, i18n, observability, validations
src/db/schema/       Drizzle schema (19 tables)
docs/                PROJECT_PROGRESS (source of truth), DEPLOYMENT, SECURITY, OPERATIONS, TESTING
```

## Documentation

- [docs/PROJECT_PROGRESS.md](docs/PROJECT_PROGRESS.md) — full build history & current state
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — env vars, DNS, deploy steps, post-deploy checks
- [docs/SECURITY.md](docs/SECURITY.md) — auth model, headers, attack-surface review
- [docs/OPERATIONS.md](docs/OPERATIONS.md) — monitoring, backup, recovery runbook
- [docs/TESTING.md](docs/TESTING.md) — test layers and conventions
