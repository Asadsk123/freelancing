# Royal Asad - Project Conventions

## Stack
- Next.js 15 (App Router) with TypeScript strict mode
- Tailwind CSS 4 (CSS-based config via @theme in globals.css)
- PostgreSQL via Neon (Drizzle ORM) — not yet configured
- Cloudflare R2 for file storage — not yet configured
- Resend for transactional email — not yet configured
- Auth.js v5 for authentication — not yet configured

## Project Structure
- `src/app/(public)/` — Public marketing site (SSG/ISR)
- `src/app/(portal)/` — Client portal (SSR, auth required)
- `src/app/(admin)/` — Admin dashboard (SSR, admin auth required)
- `src/app/api/v1/` — API routes
- `src/components/ui/` — Design system primitives
- `src/components/{public,portal,admin}/` — Section-specific components
- `src/lib/` — Server-side libraries and utilities
- `src/config/` — Brand, theme, navigation, email configuration
- `messages/` — i18n translation files

## Key Rules
- Customer convenience > developer convenience
- No fake data, reviews, or statistics
- Branding centralized in `src/config/brand.ts` and CSS tokens in `globals.css`
- All user-facing strings go through i18n (messages/*.json)
- Every database query goes through the repository layer
- CSS uses semantic token variables (--primary, --foreground, etc.)
- Dark mode via `data-theme="dark"` attribute + prefers-color-scheme

## Commands
- `npm run dev` — Start dev server on localhost:3000
- `npm run build` — Production build
- `npm run lint` — ESLint
