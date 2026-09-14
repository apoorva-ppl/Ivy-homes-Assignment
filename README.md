# Ivy Homes — Frontend

A Next.js 14 (App Router) + TypeScript frontend on top of the Ivy Homes property API, built per `ivy-homes-frontend-brief.md`.

## Stack

Next.js 14, TypeScript, Tailwind CSS, Framer Motion, TanStack Query, Zustand, Recharts, Radix UI primitives.

## Local setup

```bash
npm install
cp .env.local.example .env.local
# edit .env.local and fill in the real API key
npm run dev
```

Open http://localhost:3000 — it redirects to `/listings`.

## How the API key is protected

The brief flags key exposure as a disqualifier, so this app never sends `IVY_API_KEY` to the browser at all:

- `IVY_API_BASE` and `IVY_API_KEY` are **server-only** env vars (no `NEXT_PUBLIC_` prefix).
- `app/api/ivy/[...path]/route.ts` is a Next.js Route Handler that proxies every request to `https://solve.ivy.homes`, appending `?api_key=...` server-side.
- The browser only ever talks to your own `/api/ivy/...` endpoint. The user's `Authorization: Bearer <token>` header (not a secret, just a session token) is forwarded through.
- `.env.local` is gitignored. Only `.env.local.example` (with a placeholder key) is committed.

On Vercel, set `IVY_API_BASE` and `IVY_API_KEY` as Project Environment Variables (Settings → Environment Variables) — they stay server-side there too.

## Structure

```
/app
  /login              login form -> POST /auth/login
  /listings           browse + filters (client-side fallback filtering/sorting)
  /listings/[id]      detail + map link + similar strip + favourite toggle
  /rentals /[id]
  /projects /[id]
  /saved              GET/POST/DELETE /v1/favourites (protected route)
  /insights           GET /v1/analytics/summary + charts + data-quality-notes slot
  /api/ivy/[...path]  server-side proxy that attaches the API key
/components           cards, filter bar/drawer, navbar, charts, ui primitives
/hooks                TanStack Query hooks per resource
/lib                  api.ts (fetch wrapper), client-filter.ts (fallback filtering), utils.ts, types.ts
/store                auth-store.ts (Zustand, persisted)
```

## Notes on the API

- The written API docs are treated as unreliable per the brief: listing objects render defensively (unknown/extra fields like `is_live` don't break anything), and filters are re-applied client-side over whatever the server returns as a fallback in case a given filter param is ignored server-side.
- Errors surface as toasts with the raw `{ detail }` message from the API.
- `/insights` has a placeholder "Data Quality Notes" card — meant to be populated from a JSON file of findings once the data-analysis pass is done.

## Deploying

```bash
npm run build   # sanity check locally first
```

Then on Vercel: import the repo, add `IVY_API_BASE` and `IVY_API_KEY` as environment variables, deploy. Confirm a fresh incognito login works end-to-end afterward.

## Known gaps / next steps

- No embedded map (react-leaflet) yet — listing/project detail pages currently link out to Google Maps using lat/long. Swappable in if you want an inline map.
- Dark mode not implemented (brief marks it as optional).
- Locality/status filter options are free-text/hand-picked rather than pulled from a live facet endpoint, since the API doesn't expose one.
