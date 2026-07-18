# Operations

Runbook for ROYAL-ASAD AI & Digital Solutions in production.

## Monitoring

- **Errors:** set `SENTRY_DSN` and server errors (email delivery, upload, file
  serve, cron) are delivered to Sentry via its envelope HTTP API — no SDK.
  Without a DSN they land in structured JSON logs (same call sites).
- **Logs:** `src/lib/observability/logger.ts` emits single-line JSON
  (`{level, event, time, …fields}`) to stdout — ship with your platform's log
  drain. Redaction is automatic for secret-named keys, Bearer tokens, and
  connection strings. Never add raw OTPs, JWTs, or env values to log fields.
- **Email health:** `email_queue` table is the source of truth
  (`status`, `attempts`, `lastError`). Alert if `failed` rows with
  `attempts >= 5` accumulate.
- **Cron:** the retry worker responds `{processed, sent, failed}` and logs
  `cron.email_retry.completed` — alert on scheduler failures or non-200s.

## Backup

**Database (Neon):**
- Neon keeps automatic point-in-time restore history per branch
  (check plan limits). For an explicit safety net, schedule
  `pg_dump "$DATABASE_URL" --format=custom --file=backup-$(date +%F).dump`
  (daily via cron/GitHub Actions) and store dumps in object storage with a
  30-day retention policy.

**Files:**
- `STORAGE_MODE=r2`: R2 is durable object storage; optionally enable bucket
  versioning or replicate with `rclone sync` to a second bucket for
  delete-protection.
- `STORAGE_MODE=local`: back up the `.storage/` directory alongside DB dumps —
  local mode is not recommended for production.

**Code:** git history is the source of truth — push `master` to a hosted remote
(GitHub) as part of deployment.

## Recovery

1. **Bad deploy:** redeploy the previous commit (every commit on `master`
   passes lint + typecheck + tests + build via CI).
2. **Database restore:** Neon branch restore to a timestamp, or
   `pg_restore --clean --dbname "$DATABASE_URL" backup-<date>.dump`.
   Schema is additive-only so far; after restoring, run `npm run db:push`
   to reconcile if the schema moved ahead of the dump.
3. **Storage restore:** copy objects back into the bucket; DB `files.original_key`
   values are the object keys, so rows and objects reconcile by key. Orphaned
   rows serve a clean 404 ("content missing from storage") rather than erroring.
4. **Secret rotation:** rotating `AUTH_SECRET` invalidates all sessions (users
   simply sign in again). Rotate `CRON_SECRET`/R2/Resend keys in env + provider
   dashboards; nothing is persisted in the database.

## Routine maintenance

- Review `/admin/audit` periodically for unexpected admin activity.
- Prune `email_queue` rows older than ~90 days if volume grows.
- Dependency updates: `npm outdated` monthly; run the full gate
  (`lint`, `tsc`, `test`, `build`) before shipping upgrades.
