# Testing

## Layers

| Layer | Tool | Command | Scope |
|---|---|---|---|
| Static | ESLint / TypeScript strict | `npm run lint` / `npx tsc --noEmit` | whole codebase |
| Unit | Vitest | `npm test` | pure logic — no DB, no network, deterministic |
| Build | Next.js | `npm run build` | route compilation, type-checked pages |
| E2E (manual, scripted) | browser + signed JWTs | see below | role routing, flows |

CI (`.github/workflows/ci.yml`) runs all four gates on every push/PR and fails on any error.

## Unit suite (tests/unit)

- `validations.test.ts` — every Zod schema: inquiry, blog post (slug rules),
  file status/revision, review rating bounds, profile/notification settings
- `i18n.test.ts` — `matchAcceptLanguage`, translator dot-path + missing-key
  behavior, **dictionary key parity across all 14 locales** (fails the build if
  a locale drifts from `en.json`)
- `storage.test.ts` — `buildStorageKey` sanitization (traversal, unicode,
  length), local provider put/get/delete round-trip in a temp root,
  path-escape rejection, `getStorageMode` env matrix
- `email-config.test.ts` — `getEmailMode` safety matrix (dev never sends
  without explicit override)
- `formatting.test.ts` — file sizes, tracking IDs, relative time (fixed clock)
- `observability.test.ts` — logger redaction (secrets, Bearer, connection
  strings), Sentry envelope delivery + failure swallowing

Conventions: tests import through `@/` aliases (see `vitest.config.ts`);
`server-only` is stubbed via `tests/helpers/server-only-stub.ts`; anything
touching env vars restores them in `afterEach`. No mock data ships to prod —
fixtures live only inside `tests/`.

## End-to-end flows (scripted, real server)

Playwright is intentionally **not** vendored yet (heavy browser downloads;
flows change while the product is pre-launch). Critical flows are covered by
repeatable scripts + real-browser passes documented in PROJECT_PROGRESS.md:

- Role routing matrix via **signed real JWTs** against a running server
  (logged-out / client / admin × portal / admin routes / APIs)
- OTP login (client + admin), settings persistence, review submission with all
  guards, blog create→publish→delete, upload→download→revision-request,
  audit-log rendering — each verified end-to-end in a real browser against the
  real database, with test rows cleaned afterwards

When the product stabilizes post-launch, promote these into a Playwright suite
using the dev OTP path (`NODE_ENV!==production` accepts the fallback code) and
a dedicated seed/teardown script per spec file.

## Determinism rules

- No test depends on network, time-of-day (fake timers only), or row ordering.
- DB-touching logic is exercised through repositories in E2E, not unit tests —
  unit tests never require `DATABASE_URL`.
