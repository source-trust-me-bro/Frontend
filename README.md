# KalevaShorts

An open-source bilingual Finnish–English news platform with cross-language verification. The public landing page is adapted from the 8B App Landing Page Template, and the authenticated workspace pairs Clerk with a FastAPI + MongoDB user profile.

## Stack

- **Next.js 16** App Router with Cache Components and Partial Prefetching
- **React 19** Server Components, Server Actions and `useActionState`
- **Clerk 7** for sessions and role metadata
- **FastAPI** at `FASTAPI_BASE_URL` for the MongoDB-backed profile
- **GSAP 3**, ScrollTrigger, SplitText and Lenis for the landing page motion
- **Zod 4** for request and environment validation
- **pnpm** only; do not introduce npm or yarn lockfiles

## Getting started

```bash
pnpm install
pnpm dev
```

Create `.env.local` with exactly the three variables the app validates:

```dotenv
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
FASTAPI_BASE_URL=http://127.0.0.1:8000/api/v1
```

`src/lib/server/env.ts` parses these at import time and fails loudly if one is missing or malformed.

## Routes

| Route | Rendering | Purpose |
| --- | --- | --- |
| `/` | Static | 8B landing page with GSAP/Lenis scenes and Clerk-aware CTAs |
| `/dashboard` | Partial prerender | Protected reader workspace; syncs `GET /api/v1/users/me` and updates `preferred_language` |
| `/editor` | Partial prerender | Protected workspace; verifies `editor` or `admin` role server-side |
| `/sign-in/[[...sign-in]]` | Blocking | Clerk sign-in |
| `/sign-up/[[...sign-up]]` | Blocking | Clerk sign-up |

## Authentication

- All authorization happens in Server Components and Server Actions via `@clerk/nextjs/server`.
- `src/proxy.ts` exists only because Clerk 7 needs request context for `auth()`; Next 16 renamed middleware to Proxy. There is intentionally no `middleware.ts`.
- Primary landing CTAs open Clerk's sign-up modal when signed out and link to `/dashboard` when signed in. The signed-in flow redirects to `/dashboard` through Clerk's fallback redirect URLs.
- Editor access is checked from `sessionClaims.metadata.role` with a public-metadata fallback before any editor controls render.

## FastAPI contract

| Method | Path | Used by |
| --- | --- | --- |
| `GET` | `/health/ready` | `getBackendHealth()` and the dashboard health card |
| `GET` | `/users/me` | `getCurrentUserProfile(token)` |
| `PATCH` | `/users/me` | `updateUserPreferences` Server Action |

All user requests send `Authorization: Bearer <Clerk session token>`. A `404` on `GET /users/me` is treated as "profile awaiting first sync" rather than an error page. If FastAPI is offline the dashboard keeps the Clerk identity visible and reports the failure without crashing.

Expected profile shape:

```json
{
  "id": "mongo-id",
  "clerk_user_id": "user_...",
  "email": "reader@example.com",
  "display_name": "Reader",
  "preferred_language": "en",
  "role": "viewer"
}
```

`preferred_language` accepts `en` or `fi`.

## Landing page fidelity

The adaptation preserves every template id, class, `data-8b-section`, `data-8b-motion` and `data-8b-part` hook. The template's CSS layers live in `src/styles/landing.css`; the GSAP/Lenis scene scripts are ported to `src/features/landing/components/landing-motion.tsx` with teardown for client-side navigation.

`hero` remains directly above `listen`, and `calls` remains directly above `tune`, so the cross-section ScrollTrigger timelines stay intact. Every `style="--len:N"` value matches its rendered text.

The motion layer is fully gated behind `prefers-reduced-motion: no-preference`. Under `reduce`, no Lenis instance, staging classes or scroll animations are created; a small mobile override also stops the calls phone from overlapping the feature list.

## Verification

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Licensing and credits

- Code: MIT, see [LICENSE](./LICENSE).
- Landing page template: MIT, Copyright (c) 2026 8B, see [LICENSE-8B.md](./LICENSE-8B.md).
- Photos, fonts and libraries: see [CREDITS.md](./CREDITS.md).
