# Royal Asad — Project Progress

> **Single source of truth for project progress.** Updated after every completed module and committed together with the module. If chat history is lost, resume from this file.

**Last updated:** 2026-07-06
**Current module completed:** Module 25 UX+ — Email autocomplete, Network status, Session/Premium touches
**Latest commit:** committed with this file (see `git log -1`); previous: `847a6f9`

---

## Completed Modules

| # | Module | Commit |
|---|--------|--------|
| 1 | Project initialization | `1838362` |
| 2 | Design System components | `159962e` |
| 3 | Public layout (header, footer, navigation) + review fixes | `0e24312`, `e1118ec` |
| 4 | Database architecture with Drizzle ORM | `e3a2984` |
| 5 | Public pages with real content + shared Zod validation | `7073262`, `bb71d4b` |
| 6 | Authentication UI (login + OTP verification) | `c331ade` |
| 7 | Client Portal UI (dashboard, projects, notifications, settings) | `0eb94e2` |
| 8 | Admin Dashboard UI (8 admin pages) | `dc7616d` |
| 9 | Authentication backend (JWT sessions, middleware, RBAC) | `7f71f77` |
| 10 | Contact form backend + inquiry pipeline | `504d89d` |
| 11 | Real Database Integration (Neon PostgreSQL, 19 tables) | `9d0ce4b` |
| 12 | User/Auth DB integration + OTP security hardening | `3df5744`, `2a1ddcf` |
| 13 | Real Project Management System + audit fixes | `4646220`, `b8c4906` |
| 14 | Services Management System (CRUD, public page) | `03186f2` |
| 15 | Admin Clients Management (real client list + project counts) | `224d6b3` |
| 16 | Admin Reviews Management (publish/unpublish, delete) | `3190f75` |
| 17 | Admin Blog Management (posts CRUD, public blog page) | `86b9b7c` |
| 18 | Portal Notifications (user-scoped, mark-as-read actions) | `04dd888` |
| 19 | Admin Dashboard Enhancement (6 real stat cards) | `147ae12` |
| 20 | Public Portfolio Page (completed projects showcase) | `9266361` |
| 21 | Public Testimonials Section (published reviews on home) | `f3723a7` |
| 22 | Project Files Display (portal detail Files tab) | `4571eb7` |
| 23 | Project Conversations (message thread + send form) | `90e124c` |
| 24 | Admin Project Milestones Management (CRUD, admin-guarded) | `a3b4956` |
| 25A | Login/OTP automation, copy buttons, tooltips, smart defaults, error boundary | `ec20d87` |
| 25A+ | OTP auto-send (debounced, cancellable, single-shot), Gmail domain suggestions, tooltip consistency | `0246587` |
| 25C | Theme/Appearance: Light/Dark/System + premium visuals, no-FOUC, elevation tokens | `e1336aa` |
| 25B | Internationalization (14 languages) + globe language switcher, RTL, auto-detect, persist | `847a6f9` |
| 25 UX+ | Inline email autocomplete, network quality indicator, unsaved-changes warning, auto-scroll to first error | this commit |

## Remaining Modules (planned)

- **Module 25 (Premium UX) — remaining sub-modules**:
  - **String-coverage expansion for i18n** — architecture is complete and wired into the public header, mobile nav, footer, and home hero; remaining hardcoded strings across the rest of the app migrate incrementally by wrapping them in `t()` + adding keys to `en.json` (English fallback until translated). Drop-in, no architecture changes.
  - **25C accessibility/performance follow-up** — theme done; app-wide accessibility audit + performance pass (memoization, lazy loading, code splitting) remain. Note: the root layout now reads cookies/headers for locale, so all routes are dynamic (`ƒ`) — revisit static/ISR strategy during the perf pass if needed.
  - **25D** — SEO metadata, Open Graph, structured data, hreflang (now feasible with locales), trust indicators, notification badge, unsaved-changes warning, session-expiry warning, micro-interactions, skeletons
- **File upload pipeline** — actual upload with storage backend, watermarking, revision requests (schema exists, display-only implemented)
- **Client review submission** — client-side flow to submit a review after project completion
- **Blog post editor UI** — admin form to create/edit posts (server actions exist; UI forms pending)
- **Email delivery** — process `email_queue` (OTP currently logged in dev; queue schema exists)
- **Admin Management / Security Hardening module** — see Technical Debt below
- **Audit logging** — write to `audit_log` on sensitive mutations (schema exists)
- **Revenue tracking** — deferred (stat removed from dashboard until real data exists)
- **i18n** — `messages/` directory scaffolded, not yet wired

## Database Status

- **Provider:** Neon PostgreSQL (serverless) via `@neondatabase/serverless`
- **ORM:** Drizzle v0.45.2, config in `drizzle.config.ts`, migrations in `drizzle/`
- **Connection:** `DATABASE_URL` in `.env.local` (gitignored). `hasDatabase()` guard gives graceful degradation on every page when unset.
- **Schema:** 19 tables, 8 enums, 20 FKs — users, sessions, otp_codes, inquiries, service_categories, services, projects, milestones, project_conversations, conversation_messages, files, reviews, blog_categories, blog_tags, blog_posts, blog_post_tags, notifications, email_queue, audit_log
- **Delete rules:** cascade for child records (milestones, conversations, messages, files, reviews, post_tags, notifications); restrict for users referenced by projects/files/posts; set null for optional refs (service on project, category on post/file milestone)
- **Repositories implemented:** inquiry, user, otp, session, project, service, service-category, review, blog-post, blog-category, notification, file, conversation, milestone (all extend `BaseRepository` with lazy `db` getter; barrel export in `src/lib/repositories/index.ts`)

## Authentication Status

- **Flow:** Email + OTP (passwordless). OTP stored hashed in DB; previous OTPs invalidated on new request.
- **Session:** JWT (HS256 via `jose`) in httpOnly cookie `ra_session`, 30-day expiry. DB session records cleaned on login/logout.
- **Secret:** `AUTH_SECRET` env var (min 32 chars, required in production; dev fallback exists).
- **Route protection:** `src/middleware.ts` (edge runtime, JWT verify only, no DB) — unauthenticated → `/login`; non-admin on `/admin/*` → `/dashboard`.
- **Roles:** `admin` | `client` on users table.
- **Ownership enforcement:** portal pages/actions derive userId from session only; project detail 404s for non-owner clients; notification queries all scoped by `session.userId`.

## Features Implemented

- Public site: home (hero, services overview, testimonials, CTA), services (active only), portfolio (completed projects), blog (published posts), about, contact (inquiry form with Zod validation + tracking ID)
- Client portal: dashboard (project stats), projects list, project detail (milestones, files, and conversation tabs all real — one message thread per project with send form), notifications (user-scoped, mark-read actions), settings (profile update)
- Admin: dashboard (6 live stat cards + recent inquiries/projects), projects (list + detail page with full milestone CRUD, status/delete actions), clients (list + activate toggle), services (full CRUD + active toggle), blog (list; actions for CRUD), inquiries (status management), reviews (publish/unpublish, delete), settings
- Admin milestones: create/edit/delete + inline status change on `/admin/projects/[id]`; every action guarded by `session.role === "admin"` (defense in depth); revalidates admin + portal project routes; clients see updates in their portal detail page
- Cross-cutting: dark mode, responsive design, accessibility (aria labels, skip links), empty states everywhere, DB-not-connected warnings, `revalidatePath` after every mutation (admin + affected public/portal paths)
- 25A UX polish: passwordless login remembers previous email (localStorage) with smart focus (new users → email field via native autofocus; returning users → Continue button, one-click); OTP flow has auto-advance/paste/auto-submit/resend countdown (pre-existing) plus server-side OTP rate limiting (30s cooldown via `otpRepository.secondsUntilResend`, friendly `retryAfter` messaging); secure-login trust indicator; reusable `CopyButton` (clipboard + fallback, tooltip, accessible live region) on tracking IDs; app-wide `TooltipProvider` with tooltips on every icon-only button (theme toggle, notifications, sign out, milestone edit/delete, copy); auto-resize `Textarea` (message + contact forms); global reduced-motion CSS; root error boundary (`src/app/error.tsx`); duplicate-submit guards on login/resend
- 25 UX+ improvements:
  - **Inline email autocomplete** ([email-input.tsx](../src/components/shared/email-input.tsx)): ghost-text completion of common domains matched by prefix after `@` (`abc@g`→`gmail.com`, `@y`→`yahoo.com`, `@o`→`outlook.com`, `@i`→`icloud.com`, `@p`→`proton.me`, plus more). Accept with **Tab**, **Right Arrow** (caret at end), or **click** the suggestion. Never overwrites typed text, never suggests for custom domains, pure string work (no network, no location/permissions). Replaces the old chip suggestions in the login form. Uses `type="text"` + `inputMode="email"` so caret APIs work for Right-Arrow accept; email validity stays enforced by Zod.
  - **Network quality indicator** ([network-status.tsx](../src/components/shared/network-status.tsx)) in public/portal/admin headers: Wi-Fi icon + tooltip showing Excellent / Good / Slow / Offline from the Network Information API (`effectiveType`) + `online`/`offline` events. Informational only; when slow it politely notes "Your connection may be affecting loading" (never blames the site); no location/permissions; renders after mount to avoid hydration mismatch.
  - **Unsaved-changes warning** ([use-unsaved-changes-warning.ts](../src/lib/hooks/use-unsaved-changes-warning.ts)): reusable hook (native `beforeunload`), applied to the contact form while a message is in progress and unsent.
  - **Auto-scroll to first validation error**: on submit failure the contact form focuses the first invalid field and smooth-scrolls the error into view.
  - OTP UX (auto-focus next, backspace-left, full-paste, auto-submit, countdown, friendly resend, loading, duplicate-submit prevention) confirmed complete from 25A/25A+ — no changes needed.
- 25B Internationalization: scalable, file-based i18n architecture under `src/lib/i18n/` — `config.ts` (locale list + native names + `dir`, `matchAcceptLanguage`), per-locale JSON dictionaries in `dictionaries/`, `dictionary.ts` (loader + deep-merge English fallback per key), `translator.ts` (dot-path `t()`), `server.ts` (`getI18n()` resolves locale from cookie → `Accept-Language` → English; server components call it), `provider.tsx` (`I18nProvider` + `useTranslations`/`useLocale` for client components). Root layout resolves the locale and sets `<html lang dir>` + wraps the tree in `I18nProvider`. **14 languages**: English, Urdu, Arabic, Hindi, Bengali, French, German, Spanish, Portuguese, Russian, Turkish, Chinese (Simplified), Japanese, Korean — **unlimited-language-ready** (add a JSON file + one loader line). **RTL** for Urdu + Arabic. Globe-icon-only `LanguageSwitcher` (native names, localized "Language" tooltip, keyboard accessible) in public/portal/admin headers; selection persisted in the `ra_locale` cookie (1 year) and applied via `router.refresh()`. Wired surfaces: public header nav + CTA + mobile nav, footer, home hero. **New features stay translatable by construction** — add the string to `en.json` and render it via `t()`/`getI18n().t`; missing translations fall back to English automatically. Verified: cookie persistence (Arabic survives reload, RTL), Accept-Language auto-detect (French with no cookie → `lang="fr"`), English fallback for unsupported languages, all 14 native names in the switcher, live language switch with no console errors.
- 25C Theme/Appearance: three-way theme (Light / Dark / **System** — System follows `prefers-color-scheme` live via matchMedia), replacing the old 2-way toggle; choice persisted in `localStorage.theme` (System = key removed, governed by CSS media query); **no-FOUC** inline script in `<head>` applies theme + premium before first paint; **premium visual mode** (opt-in, persisted `ra_premium`) adds tasteful depth — richer elevation shadows + a subtle radial depth wash — with no RGB/gaming effects and readability preserved; new elevation tokens (`--shadow-sm/md/lg`) defined for light/dark/premium (cards/dropdowns previously referenced these but they were undefined → now render proper depth); appearance control is a keyboard-accessible dropdown (Sun/Moon/Monitor + Sparkles) with a tooltip on the icon-only trigger
- 25A+ refinements: OTP **auto-send** on login — once the email is valid and the user stops typing for 4s, the code sends automatically with a visible countdown ("Sending your code automatically in Ns — or press Continue now"); any keystroke resets the timer, clicking Continue cancels it and sends immediately, and a single-shot `sentRef` guard guarantees exactly one OTP request (verified: auto-send=1 OTP, manual-cancel=1 OTP). **Gmail domain suggestions**: typing a bare username (e.g. `john`) offers one-click chips `john@gmail.com` / `@outlook.com` / `@yahoo.com` (never auto-applied — user must choose). **Tooltip consistency**: every icon-only button in the app now has a tooltip (added public-header Open menu, mobile-nav Close menu, admin mobile menu toggle to the earlier set)

## Features Still Pending

- File upload/download/watermark pipeline (display done)
- Client review submission flow
- Blog editor forms (admin UI)
- Email sending (queue processing)
- Admin management + security hardening (see Technical Debt)
- Audit log writes
- i18n wiring

## Environment Setup

- Next.js 15.5.20 (App Router), TypeScript strict, Tailwind CSS 4 with CSS custom properties
- `.env.local` (gitignored): `DATABASE_URL` (set, Neon), `AUTH_SECRET` (dev fallback in use)
- `.env.example` documents required vars
- Run: `npm run dev` → http://localhost:3000 (localhost only — no domain, no third-party builders)
- Verification gate per module: `npm run lint`, `npx tsc --noEmit`, `npm run build` — all must pass, plus browser test

## Known Limitations

- OTP codes are logged to server console in dev (no email provider connected)
- File records are display-only; no storage backend for actual upload/download yet
- `next lint` is deprecated (Next 16 will remove it) — migrate to ESLint CLI eventually
- `jose` build warning about CompressionStream in Edge Runtime — harmless (JWE unused; only JWT sign/verify)
- Dev server on Windows: after `npm run build`, `.next` must be deleted before `npm run dev` (stale cache causes ENOENT)

## Technical Debt (must be implemented in Admin Management / Security Hardening module — do not defer past production hardening)

1. Prevent admin from deactivating own account (server-side check `targetUserId !== session.userId`)
2. Ensure at least one active admin remains (count check in same transaction as update)
3. Perform these checks inside server action/repository layer
4. Add explicit `session.role === "admin"` check inside every admin server action (defense in depth beyond middleware)

## Future Architecture — AI Assistant / Website Mascot (documentation only, NOT implemented)

Planned assistant that becomes the site mascot. **Voice is deferred**; build the non-voice architecture first.

- **Component shape**: a top-level client `AssistantProvider` (mounted once in the root layout, after `I18nProvider`) exposing context — `open()/close()`, `guideTo(path)`, `explain(pageKey)`, `position`, `state` (`idle | talking | guiding | listening`). A portal-rendered `<AssistantMascot />` (fixed-position, `pointer-events` on the character only) + `<AssistantChat />` panel.
- **Movable character**: absolutely-positioned, draggable (pointer events), position persisted in `localStorage` (`ra_assistant_pos`). Respects `prefers-reduced-motion` (idle animations pause). Lazy-loaded (`next/dynamic`, `ssr:false`) so it adds zero JS to first paint.
- **Idle animations**: CSS/SVG keyframe loops gated behind reduced-motion; no heavy runtime.
- **Guides users**: `guideTo(path)` uses the App Router to navigate and can highlight a target via a data-attribute (`[data-assistant-target="..."]`) + scroll-into-view.
- **Explains pages**: per-route explanation keys resolved through the existing i18n system (`assistant.<pageKey>.*` in the dictionaries) so the assistant **automatically speaks the current website language** — reuses `useTranslations()`; no separate translation mechanism.
- **Opens chat / helps complete actions**: chat panel dispatches intents to typed handlers; actions reuse existing server actions (never new privileged paths).
- **Voice (later)**: a `useAssistantVoice()` hook behind a feature flag will add speech-synthesis (output) and speech-recognition (input), keyed to the active locale; the text architecture above is voice-agnostic so voice is additive.
- **Performance**: entire subsystem lazy-loaded and idle-deferred; no impact on initial bundle or SSR.

## Future Architecture — Theme Packs (documentation only, NOT implemented)

The current theme system (Light / Dark / System via `data-theme` + premium via `data-premium`, all token-based in `globals.css`) is designed to extend to named theme packs **without breaking existing behavior**:

- Add `data-pack="business | luxury | dark | minimal | creative | high-contrast"` on `<html>`, persisted in `localStorage` (`ra_pack`), applied by the same no-FOUC inline script.
- Each pack is a CSS block overriding the semantic tokens (`--background`, `--foreground`, `--primary`, `--shadow-*`, etc.) — no component changes, since every component already reads tokens.
- **High Contrast** pack pairs with accessibility (WCAG AAA contrast, stronger focus rings).
- Packs compose with Light/Dark/System (a pack can define both light and dark token sets via `[data-pack="x"][data-theme="dark"]`).
- The appearance dropdown gains a "Theme pack" group; default (no `data-pack`) keeps today's exact look, so current users are unaffected.

## Deferred / Roadmap Items

- **Session timeout warning before logout** — deferred (needs a product decision on idle policy). Current session is a 30-day httpOnly JWT with no idle logout. Planned approach: expose a non-sensitive `ra_session_exp` companion cookie (or a lightweight `/api/session` endpoint) so a client `useSessionExpiry()` hook can show a warning modal a few minutes before expiry with a "Stay signed in" refresh. Not built yet.
- **Last-saved indicator** — add a "Saved • {relative time}" indicator to forms with real persistence (e.g., portal/admin settings once wired to `updateProfile`). The relative-time formatter (`formatRelativeTime`) already exists.
- **Premium UX (ongoing)** — skeleton loaders, richer empty-state illustrations, and broader toast coverage roll out incrementally alongside the features they support.
- **i18n string-coverage expansion** — migrate remaining hardcoded strings to `t()` (drop-in, English fallback).
- **Performance pass** (25C follow-up) — memoization, code splitting, and revisiting the all-dynamic rendering introduced by cookie/header locale reads.

## Project Rules (standing)

- No fake data, reviews, or statistics — real DB data only
- No Higgsfield or third-party builders; localhost:3000 only; no domain purchases
- One module at a time: implement → verify (lint, tsc, build, browser) → report → wait for explicit approval
- Do not modify completed modules unless absolutely necessary
- Update this file after every module and commit it with the module

## Next Module to Implement

**Module 25D — SEO/trust/micro-interactions** (or the 25C accessibility/performance follow-up, Product Owner's choice): SEO metadata, Open Graph, structured data, hreflang (now feasible with the i18n locales), trust indicators, notification badge, unsaved-changes warning, session-expiry warning, better skeletons/loading, micro-interactions. Also open: incremental i18n string-coverage expansion across remaining pages (drop-in via `t()`).

Deferred (outside Module 25, revisit after 25 completes):
- Blog editor UI (admin forms; server actions exist)
- Client review submission flow
- Real settings persistence (wire portal settings form to `userRepository.updateProfile`)
- Admin Management / Security Hardening (implement the technical-debt items below with real server-side enforcement)
