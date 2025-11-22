# TinyLink App Structure & File-by-File Notes

This document summarizes every meaningful file inside the TinyLink Next.js project so future contributors can understand where logic lives and how the pieces interact.

## High-Level Directory Map

| Path | Purpose |
|------|---------|
| `app/` | Next.js App Router entry point. Contains layouts, pages, API routes, and route handlers such as redirects and stats pages. |
| `app/api/` | Server-only code for REST style endpoints. Each folder maps to a route segment (e.g., `healthz`, `links`). |
| `app/code/[code]/` | Dynamic route for viewing stats about a specific short link. |
| `app/[code]/route.ts` | Edge-style route handler that performs redirects for public short URLs and increments analytics. |
| `components/` | Client-side React components, including shared UI from shadcn/ui, the `LinkForm`, `LinksTable`, header, footer, etc. |
| `lib/` | Infrastructure helpers such as database access (`db.ts`), validation schemas (`validation.ts`), cookie utilities, and API response helpers. |
| `scripts/schema.sql` | Canonical database schema defining the `links` table plus supporting indexes. |
| `public/` | Static assets (icons, favicons) referenced by the layout metadata. |
| `APPLICATION_DOCUMENTATION.md` | Extended architecture and UX explanations. |
| `API_DOCUMENTATION.md` | Detailed REST endpoint reference. |
| `README.md` | Quickstart guide, API cheatsheet, and schema notes. |
| `DEPLOYMENT.md` | Steps for pushing to hosting + environment setup. |
| `requirements.md` | Original take-home problem statement. |

---

## App Router Files (`app/`)

### `app/layout.tsx`
- Root layout applied to every page.
- Imports Geist fonts, global stylesheet, header/footer, and Vercel Analytics component.
- Sets metadata (`title`, `description`).
- Wraps `<body>` in flex column so header/footer sandwich the page content.

### `app/page.tsx`
- Client component ("use client").
- Manages `refreshTrigger` state used to refresh the links table when a new link is created.
- Layout: gradient background, centered container.
- Renders `LinkForm` (creation) and `LinksTable` (listing) components.

### `app/not-found.tsx`
- Custom 404 page for unmatched routes (e.g., invalid short codes).
- Displays friendly message and button to go back to dashboard.

### `app/docs/`
- Houses documentation pages surfaced inside the app (e.g., API docs UI). Notably `app/docs/api/page.tsx` renders interactive endpoint descriptions using cards, badges, etc.

### `app/code/[code]/page.tsx`
- Server component for the stats page of a specific short code.
- Awaits `params` to extract `code` (since App Router may pass a Promise).
- Provides UI wrapper (title, back button) and renders `StatsContent` client component for fetching/displaying data.

### `app/[code]/route.ts`
- Edge/server route that handles public redirects.
- Steps:
  1. Resolve dynamic `code` param.
  2. Validate presence; return 400 if missing.
  3. Query `links` table for matching record.
  4. If missing, respond with 404 JSON.
  5. Normalize URL to include protocol.
  6. Increment `click_count` + update `last_clicked`.
  7. Issue `NextResponse.redirect(redirectUrl, 302)`.
- Logs errors and returns 500 JSON on failure.

### `app/api/healthz/route.ts`
- Lightweight health endpoint (see detailed commentary below).
- Returns `{ ok: true, version: "1.0" }` for uptime checks.

### `app/api/links/route.ts`
- Handles `POST` and `GET` for link creation & listing.
- Shared utilities: `sql` (database), `validation`, `api-utils`, `cookies`.
- `POST` flow:
  - Parse JSON body (`url`, optional `code`).
  - Retrieve or create `user_id` cookie.
  - Validate URL and optional code format.
  - Ensure uniqueness (loop + DB check when generating code).
  - Insert row with `user_id`, return `201` payload and set cookie header.
- `GET` flow:
  - Ensure `user_id` cookie exists.
  - Query all links for that ID ordered by `created_at DESC`.
  - Return JSON with cookie header refreshed.
- Errors handled with `errorResponse` helper and console logging.

### `app/api/[code]/route.ts`
- Similar to `app/[code]/route.ts` but meant for API consumers that need JSON.
- Validates `code`, fetches link, increments metrics, and issues `Response.redirect`.
- Returns JSON error payloads and logs failures.

### `app/api/links/[code]/route.ts` (if present)
- **Note:** No dedicated file currently; `GET`/`DELETE` handlers for stats and deletion are implemented in `app/api/links/route.ts` via query param logic elsewhere (e.g., `StatsContent` likely fetches `/api/links/${code}`).

### `app/healthz/route.ts`
- Duplicate server-supplied route for UI-level health check page (header link). Typically proxies to API health or provides static OK message.

---

## Components (`components/`)

### Layout-Level
- `header.tsx`: Sticky top nav with TinyLink branding and quick links (Dashboard, Docs, Health).
- `footer.tsx`: Multi-column footer describing product, stack, quick links, and GitHub link.
- `theme-provider.tsx`: shadcn/ui theme context wrapper (if dark mode is added later).

### Feature Components
- `link-form.tsx`:
  - Client component using React Hook Form + Zod.
  - Handles URL/code inputs, validation, success state with copy/share, and resets.
  - Accepts `onSuccess` callback to trigger table refresh.
- `links-table.tsx`:
  - Fetches `/api/links`, manages loading/empty/search states.
  - Columns: code, short link, destination, clicks, created date, actions (stats + delete).
  - Provides copy buttons, search debouncing, and deletion confirmation.
- `stats-content.tsx`:
  - Fetches `/api/links/:code` on mount.
  - Shows summary cards (clicks, created, last clicked) and copyable URLs.
  - Handles loading/error UI and integrates share/copy interactions.

### UI Primitives (`components/ui/`)
- Exposes shadcn-generated components (Button, Card, Badge, Input, etc.) used across the pages.

---

## Library Helpers (`lib/`)

- `db.ts`: Initializes Neon client on the server. Validates `DATABASE_URL`, strips quotes, logs partial URL for debugging, and exports `sql` tagged template for queries.
- `validation.ts`: Contains `isValidUrl`, `isValidCode`, and `generateCode` utilities using regex and randomness.
- `api-utils.ts`: Small wrappers for consistent success/error JSON responses.
- `cookies.ts`: Manages anonymous `user_id` cookies (generation, parsing, serialization) so each browser session owns its links.
- `time-utils.ts`: Provides formatting helpers (e.g., `formatDistanceToNow`) for UI display inside components.
- `utils.ts`: Misc helpers (class name merging, etc.).

---

## Styles & Public Assets

- `app/globals.css`: Tailwind base styles plus custom gradient backgrounds, typography tweaks, and utility classes used by layout/components.
- `public/`: Icons referenced by metadata and UI images.

---

## `app/api/healthz/route.ts`

```ts
export const GET = async () => {
  return Response.json({ ok: true, version: "1.0" })
}
```

### Line-by-line commentary

1. `export const GET = async () => {`  
   - Next.js App Router treats any exported HTTP verb (GET, POST, etc.) inside `route.ts` as the handler for that method.  
   - Declaring it as `const GET` ensures tree-shaking friendliness and matches the framework convention.  
   - The function is marked `async`, allowing future asynchronous operations (database pings, dependency checks) without changing the signature.

2. `  return Response.json({ ok: true, version: "1.0" })`  
   - Uses the Web Fetch API `Response.json()` helper to craft a JSON response with `Content-Type: application/json`.  
   - The payload contains two fields:  
     - `ok: true` — boolean health indicator for monitoring/uptime checks.  
     - `version: "1.0"` — simple version stamp so clients can confirm which build is live.  
   - Because `Response.json` automatically sets status `200 OK`, no explicit status code is required for this basic endpoint.

3. The closing braces terminate the function. There is no additional logic, making the endpoint deterministic and very fast.

- **Why it exists:** Handles unmatched routes with a friendly error page.
- **When to call it:** Automatically rendered by Next.js for 404 errors.
- **Extendability:** Customize the error message or add a search bar.

### `app/docs/`

- **Why it exists:** Houses documentation pages for the app.
- **When to call it:** Manually visited by users for documentation.
- **Extendability:** Add new documentation pages or sections as needed.

### `app/code/[code]/page.tsx`

- **Why it exists:** Displays stats for a specific short link.
- **When to call it:** Automatically rendered by Next.js for the `/[code]` route.
- **Extendability:** Add new stats or visualizations for link performance.

### `app/[code]/route.ts`

- **Why it exists:** Handles public redirects for short links.
- **When to call it:** Automatically handled by Next.js for the `/[code]` route.
- **Extendability:** Add custom redirect logic or analytics tracking.

### `app/api/healthz/route.ts`

- **Why it exists:** Provides a lightweight health endpoint for uptime checks.
- **When to call it:** Periodically by CI/CD health checks, load balancers, or third-party monitors.
- **Extendability:** Add deeper diagnostics or async checks for database connectivity.

### `app/api/links/route.ts`

- **Why it exists:** Handles link creation and listing via API.
- **When to call it:** Manually by API consumers for link creation and listing.
- **Extendability:** Add new API endpoints or methods for link management.

### `app/api/[code]/route.ts`

- **Why it exists:** Handles API requests for link stats and redirects.
- **When to call it:** Manually by API consumers for link stats and redirects.
- **Extendability:** Add custom API logic or error handling.

### `app/api/links/[code]/route.ts`

- **Why it exists:** Handles API requests for link deletion and stats.
- **When to call it:** Manually by API consumers for link deletion and stats.
- **Extendability:** Add custom API logic or error handling.

### `app/healthz/route.ts`

- **Why it exists:** Provides a duplicate server-supplied route for UI-level health checks.
- **When to call it:** Manually by users for health checks.
- **Extendability:** Customize the health check logic or add custom error handling.

---

## Notes on Overall Structure

- **App Router Layouts:** `app/layout.tsx` wraps every page with global UI (Geist fonts, header/footer) and imports global styles.  
- **Client vs Server Components:** Files prefixed with `"use client"` (e.g., `app/page.tsx`, `components/link-form.tsx`) enable hooks/state for interactive features, while API routes and most lib files run on the server only.
- **API Flow:**  
  1. `POST /api/links` validates URLs/codes, writes to the `links` table, and returns the row.  
  2. `GET /api/links` filters by the `user_id` cookie to show only the current user’s links.  
  3. `GET /api/links/:code` retrieves stats for a single link.  
  4. `DELETE /api/links/:code` removes a link owned by the user.  
  5. `GET /:code` (in `app/[code]/route.ts`) redirects visitors and updates click analytics.
- **Database Layer:** `lib/db.ts` centralizes the Neon/PostgreSQL connection logic so API routes can share the same client and avoid duplicating boilerplate.
- **Validation:** `lib/validation.ts` leverages Zod to enforce URL and code rules before data reaches the database, ensuring API responses remain predictable.

This document gives reviewers and future contributors a single reference for how the project is structured and what the `/healthz` endpoint does in detail.
