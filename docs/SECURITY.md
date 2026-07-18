# Security

Security model and hardening reference for ROYAL-ASAD AI & Digital Solutions.

## Authentication

- Passwordless email OTP. Codes are hashed in the database, single-active per
  email (a new request invalidates the previous code), expire after
  `OTP_EXPIRY_MINUTES`, and resends are rate-limited (30s cooldown, server-enforced).
- The dev fallback code is accepted **only** when `NODE_ENV !== "production"`.
- Sessions are HS256 JWTs (`jose`) in the `ra_session` cookie: `httpOnly`,
  `sameSite=lax`, `secure` in production, 30-day expiry. `AUTH_SECRET`
  (min 32 chars) is mandatory in production — startup fails without it.

## Authorization (defense in depth)

1. **Middleware** (edge): JWT verification only — unauthenticated → `/login?from=…`,
   non-admin on `/admin/*` → `/dashboard`.
2. **Layouts**: the admin layout re-checks `session.role` server-side.
3. **Every admin server action** calls `requireAdmin()` independently of middleware.
4. **Ownership**: portal actions derive the user id from the session, never from
   client input. Non-owners receive 404 (not 403) so resources can't be probed.
   Clients never see `draft` files.

## Route/API surface

- `POST /api/projects/[id]/files` — admin-only (401 otherwise), 50 MB cap.
- `GET /api/files/[id]` — session required; admin or owning client; probe-safe 404s;
  `Content-Disposition` filename sanitized; `X-Content-Type-Options: nosniff`;
  `Cache-Control: private, no-store`.
- `POST|GET /api/cron/email-retry` — requires `Authorization: Bearer $CRON_SECRET`;
  503 when unconfigured (never open by default).

## Headers (next.config.ts)

CSP (`default-src 'self'`; `frame-ancestors 'none'`; `form-action 'self'`),
`X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
restrictive `Permissions-Policy`, HSTS (2 years, includeSubDomains).
Note: `script-src` includes `'unsafe-inline'` — required by Next.js runtime
scripts absent a nonce pipeline; revisit if a stricter CSP is mandated.

## Attack-surface review (verified in this codebase)

| Vector | Mitigation |
|---|---|
| SQL injection | Drizzle parameterized queries only; no string-built SQL |
| XSS | React escaping; no `dangerouslySetInnerHTML` with user input (only build-time JSON-LD/theme script); CSP as backstop |
| CSRF | Server actions are origin-checked by Next.js; session cookie `sameSite=lax`; no state-changing GET |
| Open redirect | `?from=` honored only for same-origin paths (`/…`, not `//…`) |
| Directory traversal | Storage keys sanitized at build (`..` collapsed) **and** resolved paths validated against the storage root |
| SSRF | No user-supplied URLs are fetched server-side (R2/Resend endpoints are config-derived) |
| Upload abuse | Auth + role gate, size cap, generated keys (no user-controlled paths), mime stored not trusted for execution |
| Enumeration | 404-on-unauthorized for files/projects; OTP responses don't reveal account existence |
| Secrets in logs | Structured logger redacts secret-named keys, Bearer tokens, and connection strings; email errors sanitized before storage |

## Audit trail

Sensitive mutations (team role changes, publishing, project/milestone/file/review
mutations — 16 call sites) write best-effort entries to `audit_log`
(actor, action, entity, small non-sensitive metadata). Visible at `/admin/audit`.

## Dependency audit stance

`npm audit` reports moderate advisories confined to **dev tooling**
(drizzle-kit's bundled esbuild dev server; Next's internally pinned postcss).
Neither is reachable in production runtime; the suggested "fixes" are breaking
downgrades. Re-evaluate on each dependency upgrade.

## Reporting

Suspected vulnerabilities: email the support address in `src/config/brand.ts`.
