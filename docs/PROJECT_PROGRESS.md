# Royal Asad — Project Progress

> **Single source of truth for project progress.** Updated after every completed module and committed together with the module. If chat history is lost, resume from this file.

**Last updated:** 2026-07-08
**Current module completed:** Production Polish — contact placeholders, project-create UI, dashboard header buttons, assistant search + quick actions, curated AI/software services, enterprise trust section
**Latest commit:** committed with this file (see `git log -1`); previous: `cb42245`

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
| 25 UX+ | Inline email autocomplete, network quality indicator, unsaved-changes warning, auto-scroll to first error | `4d1af5b` |
| 26 | AI Helper (movable, i18n, lazy, reduced-motion, post-OTP welcome) + architecture docs | `280b10e` |
| 26.1 | AI Helper E2E verification + fixes (drag persistence, Escape/focus a11y, viewport clamping) | `a06f085` |
| 26.2 | Production audit: no TODO/debug/mock; timer-cleanup fix (guide-nav setTimeout tracked + cleared on unmount); regression sweep | `b1c9ae1` |
| 26 handoff | Docs finalized, conventions verified, developer handoff summary | `c13b469` |
| 26 final verify | 8/8 pre-approval checks passed; keyboard-activation fix (Enter/Space on mascot) | `f140a30` |
| 27 | Transactional Email Delivery (provider abstraction, templates, queue, wired flows) | `6b17cb0` |
| 28 | Admin Management & Security Hardening (Team page, promote/demote/activate, shared `requireAdmin` on all admin actions) | `cb42245` |
| MP-A | Mega Phase A: settings persistence, client review submission, blog editor UI, admin analytics (real), audit logging, file upload pipeline (local + R2 providers) | `f809741` |
| MP-B | Mega Phase B: sitemap/robots/Organization+Article JSON-LD, public `/blog/[slug]` page, PWA manifest + app icon, unread notification badge, portal/admin loading skeletons | `c572440` |
| MP-C | Mega Phase C: assistant.* translated into all 14 locales (key parity verified), email retry worker (`/api/cron/email-retry`, CRON_SECRET-guarded), `.env.example` documents STORAGE_MODE + CRON_SECRET | `783483f` |
| Polish2 | Final Polish verification: link crawl across all public pages found footer `/privacy` + `/security` 404s → both pages created (honest practice summaries, legal-copy note); heading/skip-nav/viewport checks pass; re-crawl clean | this commit |
| Polish | Production Polish: contact info cards (placeholders), `/admin/projects/new` create UI (project-create gap closed), session-aware Dashboard/Client-Portal header button, assistant search + 4 quick actions (new en keys, EN fallback for other locales), services curated to 4 high-value AI/software offerings in DB (mobile-apps removed), enterprise `TrustStrip` on home (capability statements only, no fabricated stats) | this commit |

## Remaining Modules (planned)

- **Module 25 (Premium UX) — remaining sub-modules**:
  - **String-coverage expansion for i18n** — architecture is complete and wired into the public header, mobile nav, footer, and home hero; remaining hardcoded strings across the rest of the app migrate incrementally by wrapping them in `t()` + adding keys to `en.json` (English fallback until translated). Drop-in, no architecture changes.
  - **25C accessibility/performance follow-up** — theme done; app-wide accessibility audit + performance pass (memoization, lazy loading, code splitting) remain. Note: the root layout now reads cookies/headers for locale, so all routes are dynamic (`ƒ`) — revisit static/ISR strategy during the perf pass if needed.
  - **25D** — SEO metadata, Open Graph, structured data, hreflang (now feasible with locales), trust indicators, notification badge, unsaved-changes warning, session-expiry warning, micro-interactions, skeletons
- ~~File upload pipeline~~ — **DONE (Mega Phase A)**; watermarking still deferred (needs `sharp`)
- ~~Client review submission~~ — **DONE (Mega Phase A)**
- ~~Blog post editor UI~~ — **DONE (Mega Phase A)**
- ~~Audit logging~~ — **DONE (Mega Phase A)**; audit-log admin UI still deferred
- **Revenue tracking** — deferred (stat removed from dashboard until real data exists)

## Database Status

- **Provider:** Neon PostgreSQL (serverless) via `@neondatabase/serverless`
- **ORM:** Drizzle v0.45.2, config in `drizzle.config.ts`, migrations in `drizzle/`
- **Connection:** `DATABASE_URL` in `.env.local` (gitignored). `hasDatabase()` guard gives graceful degradation on every page when unset.
- **Schema:** 19 tables, 8 enums, 20 FKs — users, sessions, otp_codes, inquiries, service_categories, services, projects, milestones, project_conversations, conversation_messages, files, reviews, blog_categories, blog_tags, blog_posts, blog_post_tags, notifications, email_queue, audit_log
- **Delete rules:** cascade for child records (milestones, conversations, messages, files, reviews, post_tags, notifications); restrict for users referenced by projects/files/posts; set null for optional refs (service on project, category on post/file milestone)
- **Repositories implemented:** inquiry, user, otp, session, project, service, service-category, review, blog-post, blog-category, notification, file, conversation, milestone, email-queue, audit-log (all extend `BaseRepository` with lazy `db` getter; barrel export in `src/lib/repositories/index.ts`)

## Authentication Status

- **Flow:** Email + OTP (passwordless). OTP stored in DB; previous OTPs invalidated on new request; delivered via the transactional email system (Module 27) — real email in production, log-only in dev (fallback code `123456`).
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
- Phase 26: **AI Helper (Aria)** implemented — movable/draggable mascot with persisted position, idle bob (pausable, reduced-motion-aware), hide/show launcher, panel with i18n-driven guides (Services/Contact/Dashboard navigation + milestones/uploads/page explanations), post-OTP welcome, lazy-loaded (zero first-paint JS), never blocks content, no tracking; voice is types-only (deferred). Existing language (14-lang auto-detect/cookie/RTL/fallback), email autocomplete, and network indicator confirmed working unchanged. Also documented architecture for theme packs (incl. Developer), performance, price comparison, portfolio trust, and admin analytics.
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

- Watermarking on file previews (needs `sharp`; upload/download/revision pipeline done)
- Email retry worker (queue processing; inline delivery is single-attempt)
- Audit-log admin UI (writes implemented)
- i18n string-coverage expansion
- SEO/OG/JSON-LD/sitemap (Mega Phase B); PWA; perf pass

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

## Technical Debt — RESOLVED in Module 28 ✅

1. ✅ Admin cannot deactivate/demote their own account (`userId === session.userId` guard in `setAdminActive`/`demoteToClient`).
2. ✅ At least one active admin always remains (`countActiveAdmins() <= 1` guard before deactivate/demote).
3. ✅ All checks live in the server action + repository layer.
4. ✅ Explicit `requireAdmin()` (`session.role === "admin"`) inside **every** admin server action (clients, services, reviews, blog, projects, milestones, team) — defense in depth beyond middleware. Shared helper `src/lib/auth/guards.ts` (no duplication).

## AI Assistant / Website Mascot — IMPLEMENTED (text; voice deferred)

Movable "Aria" helper, mounted once from the root layout (after `I18nProvider`).

- **Files**: [assistant.tsx](../src/components/assistant/assistant.tsx) (behavior + UI), [assistant-mount.tsx](../src/components/assistant/assistant-mount.tsx) (lazy `next/dynamic`, `ssr:false` — zero first-paint JS), [voice.ts](../src/components/assistant/voice.ts) (voice types + `ASSISTANT_VOICE_ENABLED=false`, not implemented). Idle-bob keyframe in `globals.css`.
- **Movable**: draggable via pointer events with a tap/drag threshold; position persisted in `localStorage` (`ra_assistant_pos`); re-clamped on resize so it never leaves the viewport.
- **Never blocks content**: full-screen wrapper is `pointer-events-none`; only the mascot + panel are interactive.
- **Idle animation / pause**: gentle bob, gated by a `paused` toggle (persisted `ra_assistant_paused`) **and** `prefers-reduced-motion` (auto-disabled).
- **Hide/show**: hide (persisted `ra_assistant_hidden`) collapses to a small launcher that restores it.
- **Guides + explains** (all via i18n `assistant.*`, so it **speaks the current website language**; English fallback): go to Services / Contact (quote) / Dashboard (App Router navigation), explain milestones, explain uploads, explain this page.
- **Post-OTP welcome**: verify-form sets `ra_assistant_welcome`; the assistant opens once with a welcome after sign-in, then clears the flag.
- **No spying**: purely local — no network calls, no analytics, no tracking.
- **Voice (later)**: `useAssistantVoice()` will add `speechSynthesis` (output) + `SpeechRecognition` (input) keyed to the active locale, mic requested only on explicit tap; text architecture is voice-agnostic so voice is additive.
- **Accessibility**: mascot is keyboard-operable — **Enter/Space** toggle the panel (via `onKeyDown`, since keyboard fires `click` not pointer events); opening moves focus into the panel; **Escape closes** and returns focus to the mascot; all controls are labelled buttons; Tab cycles panel controls/guides; reduced-motion disables the bob (JS gate + global CSS rule).
- **E2E verification pass (fixes applied)**: (1) drag now persists the *current* position via refs — fixed a stale-closure bug that saved the old position; (2) added Escape-to-close + focus management (were missing); (3) panel is measured and **clamped fully within the viewport** via a layout effect — fixed an overflow bug that also clipped the 6th guide. Verified in-browser: draggable + persistence-across-reload, hide/show, pause/resume, tap-open, Escape-close, **real post-OTP welcome** (email → auto-send → paste OTP → verified → `/dashboard` → welcome shown once), lazy-load (First Load JS unchanged at 102 kB), no console/hydration errors.
- **Missing translations (to add later)**: the `assistant.*` namespace exists only in `en.json`; in the other 13 languages the assistant currently falls back to English (architecture is ready — it renders via `t()`, so adding `assistant` keys to each dictionary makes it multilingual with no code change). RTL container still applies correctly (verified in Arabic: `dir=rtl`).

## Mega Phase C — i18n & Background Jobs (2026-07-08)

- **Assistant translations:** `assistant.*` (23 keys) added to all 13 non-English dictionaries (ur, ar, hi, bn, fr, de, es, pt, ru, tr, zh, ja, ko); key parity with `en.json` verified by script; Arabic RTL render smoke-tested (`lang="ar" dir="rtl"`).
- **Email retry worker:** `POST|GET /api/cron/email-retry` — `Authorization: Bearer $CRON_SECRET` guard (503 unconfigured, 401 wrong secret), processes `emailQueueRepository.findRetryable()` directly through the provider (no re-enqueue), respects log-only mode (no-op outside production email mode). Point Vercel Cron / any scheduler at it in prod.
- **Env docs:** `.env.example` now documents `STORAGE_MODE` (local/r2 selection) and `CRON_SECRET`.
- **Still deferred:** session-timeout warning (product decision), theme packs, remaining hardcoded-string i18n migration (incremental by design), watermarking, audit-log UI.

## Mega Phase B — SEO & Web-Platform (2026-07-08)

Gates pass (lint/tsc/build); routes smoke-tested on dev (`robots.txt`, `sitemap.xml`, `manifest.webmanifest` all 200; unknown blog slug 404s).

- **SEO:** `src/app/robots.ts` (allow public, disallow portal/admin/api), `src/app/sitemap.ts` (static routes + published blog slugs, graceful without DB), Organization JSON-LD in the root layout, Article JSON-LD + OpenGraph `article` metadata on the new post page.
- **Public blog detail:** `/blog/[slug]` — published-only (drafts/archived 404), excerpt + content rendering, category badge, back link; list cards now link to it.
- **PWA-lite:** `src/app/manifest.ts` + `src/app/icon.svg` (RA letter-mark, brand #4c6ef5). Offline service worker deferred.
- **Notification badge:** portal layout fetches `notificationRepository.countUnread` → bell badge (9+ cap, aria-label includes count).
- **Skeletons:** `loading.tsx` for portal + admin route groups.
- **Deferred with reasons:** `next/font` (Inter isn't actually loaded today — system fallback in use; adding Google-font download makes builds network-dependent; self-host later), `next/image` (no raster images in the app yet), hreflang (locale is cookie-based, no per-locale URLs), OG image generation, offline SW.

## Mega Phase A — Management & Real Data (2026-07-08)

All lint/tsc/build gates pass; every feature browser-tested against real Neon data; test rows cleaned after verification.

- **Settings persistence (portal):** `/settings` now real — profile (name/phone/company) via `updateProfile`, notification preference (all/portal_only/critical_only) saved instantly via `updateNotificationPreference`; unsaved-changes warning + Saved indicator. Verified: values persist across reload (DB-checked).
- **Client review submission:** review section on completed projects (`/projects/[id]`) — 5-star + optional testimonial; server guards: session ownership, completed-only, no double review; created unpublished (`isPublished=false`) until admin approves. Verified end-to-end incl. guard behaviors.
- **Blog editor UI:** `/admin/blog/new` + `/admin/blog/[id]` sharing `BlogPostForm` (title with auto-slug, excerpt, content, cover URL, category, status), delete with confirm dialog; list page gets New-post button + row links. Fixed `createBlogPost` to derive `authorId` from the session (was client input). Verified: create → publish (live on public `/blog`) → delete.
- **Admin analytics (real data only):** dashboard Analytics section — inquiries last-30-days with delta vs previous 30, average review rating, milestone completion rate (+projects delivered), 6-month inquiry trend bar chart (`date_trunc` group-by, zero-filled). New repo methods: `inquiry.countSince/monthlyCounts`, `review.averageRating`, `milestone.completionStats`. Graceful "—" empty states.
- **Audit logging:** `auditLogRepository` (`record()` best-effort — never throws/blocks; `findRecent()` ready for a future UI). Wired into 16 mutations: team promote/demote/activate, blog create/update/delete, project create/status/delete, milestone create/update/status/delete, review publish-toggle/delete/submit, file upload/status/delete/revision-request. UI deferred.
- **File upload pipeline:** `src/lib/storage/` provider abstraction mirroring email — local FS provider (`.storage/`, gitignored, path-traversal-safe) + Cloudflare R2 provider (S3 SigV4 via fetch, no SDK; auto-selected when `R2_*` env present, `STORAGE_MODE` override). Upload route `POST /api/projects/[id]/files` (admin-only, 50 MB cap, XHR progress) fires the `fileUploaded` email; serve route `GET /api/files/[id]` (admin or owner client; drafts hidden from clients; probe-safe 404s; inline/attachment by mime). Admin `FilesManager` on `/admin/projects/[id]`: drag&drop + progress, status select (draft/preview/revision_requested/approved/final), download, delete (confirm + best-effort object removal). Portal: download + request-revision (note, guards: owner, not draft/final/already-requested); revision note surfaces to admin. `fileRepository.create` auto-versions per (project, fileName). Verified end-to-end both roles. Watermarking deferred (`sharp`).

## Module 28 — Admin Management & Security Hardening

- **Shared guard** `src/lib/auth/guards.ts` — `requireAdmin()` returns `{ ok, session }`; added to **every** admin server action as defense in depth (the duplicated local copy in milestone actions was removed).
- **Admin Team page** `/admin/team` (new nav item, sidebar + mobile): lists administrators; promote an existing user to admin by email; activate/deactivate; demote to client. Real DB data, no mock.
- **Security guards** (server-enforced, `src/app/admin/team/actions.ts`): cannot deactivate/demote **your own** account; the **last active administrator** cannot be deactivated/demoted; all validated with Zod; UI also disables the blocked buttons with an explanatory tooltip (reduce confusion) + confirmation dialogs for destructive actions.
- **Repository** additions: `findAllAdmins`, `countActiveAdmins`, `setActive`, `setRole` (single queries, no N+1).
- **Verified in browser (real DB)**: promote client→admin, deactivate/reactivate a non-self admin, demote admin→client, self-actions disabled, last-admin protection reflected in UI; other admin pages + hardened actions unaffected; no console errors. Test admin removed afterward.

## Module 27 — Transactional Email Delivery

**Architecture** (`src/lib/email/`):
- `types.ts` — `EmailProvider`, `EmailMessage`, `RenderedEmail`, `SendOutcome`.
- `config.ts` — `getEmailMode()` (production | log), `getFromAddress()`, `getSiteUrl()`.
- `providers/` — `resend.ts` (REST via `fetch`, **no SDK dependency**), `console.ts` (dev log-only), `index.ts` (`getProvider()` selector; add SendGrid/SES/SMTP here).
- `templates/` — `layout.ts` (branded, responsive, dark-mode-friendly HTML + plain-text builder, HTML-escaped) and `index.ts` (all typed template builders).
- `send.ts` — `deliverEmail()` records to `email_queue`, delivers, updates status; **never throws**. `sendRendered()` helper.
- `index.ts` — high-level `email.*` API (otp, inquiryConfirmation, newInquiryNotification, projectCreated, projectStatusChanged, milestoneCreated, milestoneCompleted, fileUploaded, newMessage, welcome*, securityAlert*). *future-ready, not yet triggered.
- `src/lib/repositories/email-queue.ts` — `enqueue`, `markSending/Sent/Failed`, `findRetryable` (queue-ready for a future worker).

**Wired flows**: OTP (replaces the console log), contact (confirmation + admin notification), project created, project status changed, milestone created/completed, new conversation message. File-uploaded template is ready for when the upload pipeline lands.

**Reliability / security**:
- Every send is best-effort and awaited but **never fails the main action** (`deliverEmail` catches all errors).
- **Dev safety**: without `EMAIL_MODE=production`, development never sends real email — it logs a sanitized one-liner (recipient + subject only). Dev sign-in fallback code `123456` still works.
- **Production never accepts the dev OTP** (`isDev` is false in production, so the `123456` branch is dead there).
- Secrets: API key only from env; error messages are sanitized (Bearer tokens redacted) before logging; OTP codes are never logged.
- **Retries without duplicate OTPs**: the OTP row is created once; email is a separate `email_queue` row. `findRetryable` returns `queued`/`failed` (< 5 attempts) rows for a future background worker — no coupling to the UI action.

**Deliverability — DNS to configure before going live** (for the sending domain):
- **SPF** — `TXT` `@` → `v=spf1 include:_spf.resend.com ~all`
- **DKIM** — add the `CNAME` records shown in the Resend dashboard for the domain (enables signing)
- **DMARC** — `TXT` `_dmarc` → `v=DMARC1; p=quarantine; rua=mailto:dmarc@royalasad.com`
- Env: `RESEND_API_KEY`, `EMAIL_FROM_DEFAULT`, `EMAIL_FROM_SUPPORT`, optional `EMAIL_MODE` (see `.env.example`).

**Verified in dev** (log mode; emails recorded to `email_queue`): otp, inquiry_confirmation, inquiry_notification, milestone_created, milestone_completed, new_message — each with full HTML + plain-text bodies and `status=sent`. Full OTP login (admin) still works with `123456`.

## Phase 26 — Developer Handoff (AI Helper)

**Files added**
- `src/components/assistant/assistant.tsx` — the assistant (draggable mascot + panel + guides).
- `src/components/assistant/assistant-mount.tsx` — lazy loader (`next/dynamic`, `ssr:false`).
- `src/components/assistant/voice.ts` — voice types + `ASSISTANT_VOICE_ENABLED=false` (deferred; imported by nothing → zero bundle cost).

**Files modified**
- `src/app/layout.tsx` — mounts `<AssistantMount />` inside `I18nProvider`/`TooltipProvider`.
- `src/app/(auth)/login/verify/verify-form.tsx` — sets `ra_assistant_welcome` on OTP success.
- `src/app/globals.css` — `ra-assistant-bob` idle keyframe (disabled by the reduced-motion rule).
- `src/lib/i18n/dictionaries/en.json` — `assistant.*` namespace (English only; other locales fall back).

**Public API / components introduced**
- `<AssistantMount />` — drop-in, self-contained; no props; mounted once globally.
- Persistence keys (localStorage): `ra_assistant_pos`, `ra_assistant_hidden`, `ra_assistant_paused`, `ra_assistant_welcome` (one-shot).
- To make the assistant open with a welcome after any flow: set `localStorage.ra_assistant_welcome = "1"` before navigating.

**Architectural decisions**
- Cookie/DB-free, purely client-local (no tracking) → mounted client-only via `ssr:false` so it never touches SSR or the initial bundle.
- Drag math lives entirely in refs (not `pos` state) to avoid stale-closure persistence/tap bugs.
- Panel position is measured in `useLayoutEffect` and clamped to the viewport (content-height-aware, responsive).
- All copy flows through the existing i18n `t()` so the assistant is multilingual by construction.

**Risks**: low. Root layout is dynamic (cookie/header locale reads) — a perf-pass consideration, not an assistant issue. Assistant copy is English-only until `assistant.*` is translated per locale.

**Commits**: `280b10e` (build) → `a06f085` (E2E fixes: drag/Escape/clamp) → `b1c9ae1` (audit + timer cleanup).

## Future Architecture — Theme Packs (documentation only, NOT implemented)

The current theme system (Light / Dark / System via `data-theme` + premium via `data-premium`, all token-based in `globals.css`) is designed to extend to named theme packs **without breaking existing behavior**:

- Add `data-pack="business | luxury | creative | minimal | high-contrast | developer"` on `<html>`, persisted in `localStorage` (`ra_pack`), applied by the same no-FOUC inline script.
- Each pack is a CSS block overriding the semantic tokens (`--background`, `--foreground`, `--primary`, `--shadow-*`, etc.) — no component changes, since every component already reads tokens.
- **High Contrast** pairs with accessibility (WCAG AAA contrast, stronger focus rings); **Developer** favors dense spacing + monospace accents.
- Packs compose with Light/Dark/System (a pack can define both light and dark token sets via `[data-pack="x"][data-theme="dark"]`).
- The appearance dropdown gains a "Theme pack" group; default (no `data-pack`) keeps today's exact look, so current users see **no visual regression**.

## Future Architecture — Performance (documentation only; principles already applied to new code)

Target: excellent Lighthouse scores. Roadmap, in the Next.js App Router idioms already in use:
- **Images**: `next/image` with `formats: [avif, webp]` (already set), explicit width/height to avoid layout shift, `priority` on above-the-fold hero/LCP images, lazy by default elsewhere.
- **Code splitting / dynamic imports**: heavy or below-the-fold client widgets via `next/dynamic` (the AI assistant already does `ssr:false`); keep server components server-only to ship less JS.
- **Fonts**: `next/font` (self-hosted, `display: swap`, preloaded subset) to remove render-blocking font requests.
- **Streaming + skeletons**: route-level `loading.tsx` + `<Suspense>` around slow data with skeleton fallbacks.
- **Virtualization**: long lists (future large project/inquiry tables) via windowing.
- **Caching / CDN / compression**: static assets immutable-cached; HTML/RSC cached per the dynamic/ISR strategy (revisit the current all-dynamic rendering from cookie-based i18n during the perf pass — consider moving locale to the URL or an edge-set header to restore static/ISR); gzip/brotli at the CDN edge.
- **Prefetch/preload**: `next/link` prefetches in-viewport routes; preload critical assets.
- **Rules for every new feature**: lazy-load when possible, avoid unnecessary client components, avoid hydration issues (mount-gate client-only signals — the network indicator already does this), avoid layout shift, no render-blocking work.

## Future Architecture — Price Comparison (documentation only, NOT implemented)

- A `PriceComparison` section driven **only** by real, admin-entered data in a future `price_benchmarks` table (source + date + amount, with an admin-managed provenance note).
- **Never fabricate** competitor prices, discounts, or misleading comparisons. If no verified data exists, the component **renders nothing** (returns `null`) — no placeholders, no "was/now" theatrics.
- Same repository + server-action pattern as the rest of the app; values shown with locale-aware currency formatting.

## Future Architecture — Portfolio Trust ("This site is our work")

- An admin-toggleable public section: "This website itself is a demonstration of our work." Controlled by a setting (future `site_settings` row) so it can be shown/hidden without a deploy.
- Content authored through the existing i18n system; no fabricated claims.

## Future Architecture — Admin Dashboard Analytics (real data only)

- Extend the admin dashboard with **client engagement**, **conversion**, and **completion** metrics computed from existing tables — e.g. inquiry→project conversion rate (`inquiries` → `projects`), project completion rate (`projects.status='completed'`), average time-to-completion (`completedDate − createdAt`), active-client engagement (recent conversation messages / logins).
- **Real statistics only** — every number derives from a repository query; no mock/estimated figures. Revenue stays out until real financial data exists (the placeholder was already removed in Module 19).

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

## Recommended Next Phase (post-26, by business impact then dependency)

1. ~~Transactional Email Delivery~~ — **DONE (Module 27).**
2. ~~Admin Management + Security Hardening~~ — **DONE (Module 28).**
3. ~~File Upload & Delivery Pipeline~~ — **DONE (Mega Phase A)** except watermarking (needs `sharp`).
   Original scope note: Core product value — portal file previews with watermark protection + revision requests. Schema (`files`) + display exist; actual upload/storage/download/watermark are missing. Needs a storage backend (R2 env vars scaffolded) + signed URLs; watermarking needs an image lib (e.g. `sharp`). Best delivered with a storage-provider abstraction (dev provider + R2) mirroring the email module. `fileUploaded` email template already wired to fire once uploads exist.
4. **SEO / Open Graph / structured data (25D).** Conversion + discoverability for the public marketing site; hreflang now feasible with the i18n locales. Fully deliverable now with no external deps.
5. **Email background worker** — a cron/route that processes `emailQueueRepository.findRetryable()` to retry failed/queued emails (architecture ready; inline delivery is single-attempt today).

Other open items (lower priority): 25C accessibility/perf pass; session-timeout warning; theme packs; price comparison; portfolio-trust section; audit-log admin UI; watermarking; incremental i18n string-coverage (drop-in via `t()`).

## Contact Data Final (2026-07-14)
- Real contact details wired via brand config: fahadasadmuz@gmail.com, +91 9135430422, One BKC Bandra Kurla Complex Mumbai 400051, 7AM-9PM IST. Contact page renders all four (verified live). Services already enterprise AI/software-only (4). AI Helper unchanged (already upgraded).

## Browser Polish Pass (2026-07-14)
- Live browser regression: home/services/contact clean (console error-free), header Dashboard button role-aware, contact real data renders, assistant search filters correctly. Fixed: assistant panel initial focus now lands on the search input (was Pause button). Mobile visual test still limited by automation viewport (responsive classes + mobile nav verified in code).

## Audit Log UI + OG Image (2026-07-14)
- /admin/audit page: recent 100 entries table (action badge by type, actor, metadata summary, relative time), empty state, DB-guard; added to admin sidebar + mobile nav. Route middleware-protected (307 unauth verified).
- Dynamic OG image (/opengraph-image, next/og edge ImageResponse) - brand gradient + RA mark + tagline; 200 verified. Deferred list shrinks: audit-log UI and OG image done.

## Admin Settings Real (2026-07-14)
- Fixed: admin settings was cosmetic (fake success toasts, stale hardcoded values). Admin Profile now loads the real session user and saves via updateProfile (name/phone; company preserved; unsaved-warning + Saved indicator; DB-verified). Agency Information is now honest read-only from brand config with a code pointer - no fake save button.

## Engineering Polish Final (2026-07-14)
- Contact form services now DB-driven (active services + Other) - removed stale hardcoded list (graphic-design/seo/etc.) that mismatched curated offerings; inquiry schema already permissive.
- Header username freshness: portal + admin layouts fetch the user from DB so a profile rename shows immediately (JWT payload was stale for up to 30 days).
- Deep-link login: middleware ?from= now honored after OTP verify (login form forwards it; open-redirect guarded - only same-origin paths starting with / accepted).
- Twitter card upgraded to summary_large_image (1200x630 OG image exists).
- Assistant pageInfo copy made accurate in all 14 locales (removed 'Ask me anything' overpromise - it is a guided assistant with search).
Gates pass; verified live: DB-driven service options render, old slugs gone, twitter meta present, from-param pages 200.

## Engineering 10/10 Pass (2026-07-14)
- favicon.ico fallback generated in pure Node (32x32 PNG-in-ICO, brand rounded square + RA pixel monogram; ICO header + embedded PNG validated byte-level; /favicon.ico 200) - Safari/legacy fallback for the SVG icon.
- i18n consistency: the 10 newer assistant keys (search, quick actions, info strings) translated into all 13 non-English locales - assistant panel no longer mixes languages; key parity re-verified by script.
- Link crawl clean (12 internal links incl. favicon). Not possible in this environment (documented): physical-device QA, non-Chromium cross-browser runs, Lighthouse, post-deploy verification.

## Final Branding Pass (2026-07-14)
- Visible brand unified to exactly 'ROYAL-ASAD AI & Digital Solutions' everywhere: brand config (name/description/companyName), email From lines, page meta descriptions (login/about/blog/contact), About body copy, all 14 dictionaries (Latin + transliterated mentions replaced), OG image (two-line lockup), manifest (full name + short_name ROYAL-ASAD per spec), Logo made responsive for the longer name. No renames of folders/repo/DB/routes/env/identifiers. Verified live: title, og:site_name, manifest, OG image 200; zero old-brand strings left in src.

## Principal-Engineer Hardening Pass (2026-07-18)
- Automated testing: Vitest suite - 44 deterministic unit tests across 6 files (all Zod schemas, i18n matcher/translator + 14-locale key-parity guard, storage key sanitization + local provider round-trip + path-escape rejection, email/storage mode env matrices, formatting with fixed clock, logger redaction + Sentry envelope capture). npm test wired; no DB/network needed.
- CI: .github/workflows/ci.yml - lint, tsc, vitest, production build; fails on any error; build requires no secrets (graceful degradation verified).
- Observability: src/lib/observability - structured JSON logger with automatic secret redaction (secret-named keys, Bearer tokens, connection strings) + captureError provider abstraction (Sentry envelope HTTP API when SENTRY_DSN set, logs otherwise; never throws). Wired into email delivery, upload, file serve, and cron retry failures.
- Security headers (next.config): CSP (default-src self, frame-ancestors none, form-action self; dev-only unsafe-eval for react-refresh), X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, HSTS. Live-verified; console clean under CSP.
- Storage key hardening: dots collapsed so '..' cannot appear in keys (defense on top of resolve-time validation).
- Docs: README.md, docs/DEPLOYMENT.md, docs/SECURITY.md (attack-surface table incl. dev-only npm audit stance), docs/OPERATIONS.md (monitoring, backup, recovery runbook), docs/TESTING.md (layers, determinism rules, Playwright promotion plan).
- Gates: lint + tsc + 44/44 tests + build all green.

## Final Engineering Sweep (2026-07-19)
- Dead code removed: unrouted design-showcase.tsx (256 lines, Module-2 artifact) + 4 unused components (date-display, relative-time, radio-group, switch - the last only referenced by the showcase).
- JWT claim-shape validation: middleware + getSession now runtime-validate payload shape (userId/email/name strings, role in admin|client) instead of casting - malformed-but-signed tokens are rejected. Live-verified: good admin token 200, bad-role and shapeless tokens redirect to login.
- Sweeps clean: zero TODO/FIXME/HACK/@ts-ignore/console.log/debugger; no remaining 'as any'; no mock/temporary code.
- Gates: lint + tsc + 44/44 tests + build green; 8/8 public routes 200 post-change.
ONLY DEPLOYMENT REMAINS (hosting, env vars, DNS, live email/storage/monitoring, real-device QA, Lighthouse).

## Pre-Deployment Pass: Session Revalidation (2026-07-19)
- REAL VULNERABILITY FOUND during full regression: validly-signed JWTs remained usable for their 30-day life even after the account was deleted, deactivated, or demoted (discovered live - a deleted test user's cookie still opened the portal).
- FIX: (1) requireAdmin() now revalidates the actor in the DB (exists + active + still admin) on every admin action; (2) portal and admin layouts revalidate the user (exists + active, admin role for /admin) and bounce dead sessions to new GET /api/auth/invalid-session which destroys the cookie and redirects to /login (RSC render cannot mutate cookies).
- VERIFIED LIVE: ghost client/admin tokens -> 307 invalid-session on /dashboard, /projects, /admin/audit; invalid-session clears cookie -> /login; deleted-user browser cookie bounced to login; fresh admin OTP login works and honors ?from= (landed on /admin/audit).
- Full pass otherwise clean: gates green (lint/tsc/44 tests/build), zero visible 'Royal Asad' brand strings in src, all flows regression-tested this session.

## Code Freeze Audit (2026-07-20)
- REAL ISSUE FOUND: middleware getSecret() silently fell back to the public dev secret when AUTH_SECRET was missing - in production that would let anyone forge sessions (session.ts already threw; edge did not). FIX: middleware now fails closed in production (throws without a >=32-char AUTH_SECRET), mirroring session.ts. Dev fallback unchanged.
- Verified: gates green (lint / tsc / 44 tests / build); dev smoke - home 200, unauth admin 307, login 200; real admin session loads /admin/dashboard through the updated middleware.
- Freeze sweeps: no TODO/FIXME/HACK/debug/mock/dead code (re-checked after last commits); routes/SEO/links/headers previously verified and unchanged.
CODE FREEZE COMPLETE - remaining work is deployment-only.

## Deployment Prep (2026-07-20)
- vercel.json added: Vercel Cron hits GET /api/cron/email-retry every 10 min (Vercel auto-sends CRON_SECRET as the Bearer token - matches the route's guard).
- DEPLOYMENT.md: Vercel quickstart (login -> link -> env add list -> deploy --prod), ephemeral-FS warning (R2 required on Vercel; local mode loses uploads), post-deploy checklist pointer.
- BLOCKED on human-only steps: vercel login (browser/email auth), RESEND_API_KEY (Resend account), R2 credentials (Cloudflare account). Fresh AUTH_SECRET + CRON_SECRET values generated and handed to the owner in-session.
