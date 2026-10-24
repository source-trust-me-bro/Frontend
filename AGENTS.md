<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## KalevaShorts project rules

- Use `pnpm` exclusively. Do not add npm/yarn lockfiles.
- Configure exactly three environment variables: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `FASTAPI_BASE_URL`. Validate them in `src/lib/server/env.ts`.
- Do not create `middleware.ts`. `src/proxy.ts` exists only to give Clerk 7 its request context under the Next 16 Proxy convention. Perform every authentication and authorization decision inside Server Components, Server Actions or server-only helpers via `@clerk/nextjs/server`.
- Keep the feature-based structure under `src/features/`. Server-only FastAPI calls belong in `features/*/server/` and must send the Clerk session token as a Bearer token.
- The landing page is an adaptation of the 8B template. Preserve every `id`, `data-8b-section`, `data-8b-motion` and `data-8b-part` hook, keep `hero` directly above `listen` and `calls` directly above `tune`, and keep every `--len:N` value in sync with its display text.
- All GSAP, ScrollTrigger and Lenis effects must stay gated behind `prefers-reduced-motion: no-preference` and must tear down cleanly on navigation.
- `editor` and `admin` are the only roles that may render editor controls. Verify them server-side on every render.

