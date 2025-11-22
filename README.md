# TinyLink URL Shortener

TinyLink is a modern URL shortener built with Next.js 16 and TypeScript. It lets you create branded short links, track clicks, and manage your catalog from an intuitive dashboard powered by a Neon (PostgreSQL) database.

## Features

- 🔗 Create short links with optional custom codes (6–8 characters)
- 📊 Track total clicks and last-clicked timestamps
- 📁 Dashboard table with search, copy, delete, and stats actions
- 📈 Dedicated stats page for each code
- ❤️ Responsive UI built with Tailwind CSS and shadcn/ui components

## Tech Stack

- **Frontend / API**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui (Radix primitives), Geist font
- **Database**: Neon Serverless PostgreSQL
- **Utilities**: Zod validation, React Hook Form

## Project Structure

```
TinyUrl/
├── app/                  # Next.js routes (pages + API)
├── components/           # Reusable UI elements
├── lib/                  # DB + validation helpers
├── public/               # Static assets
├── scripts/schema.sql    # Database schema
└── *.md / config files   # Docs and tooling configs
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm (bundled with Node) or another compatible package manager
- PostgreSQL database (recommended: [Neon](https://neon.tech))

### Clone & Install

```bash
git clone https://github.com/SathyaSeelanG/TinyUrl.git
cd TinyUrl
npm install
```

### Configure Environment

1. Copy the example file: `cp .env.example .env.local`
2. Fill in the required variables:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
```

> `DATABASE_URL` should point to the Neon/PostgreSQL instance that stores the `links` table.

### Set Up the Database

Run the schema file against your database (Neon SQL console, psql, or any SQL client):

```sql
\i scripts/schema.sql
```

This creates the `links` table, indexes, and user scoping columns.

### Run the App

```bash
npm run dev     # Start development server at https://tiny-link-clone.vercel.app
npm run build   # Production build
npm run start   # Run production build
npm run lint    # Static analysis
```

## API Documentation

### Base URLs

- **Local**: `https://tiny-link-clone.vercel.app`
- **Production**: set via `NEXT_PUBLIC_APP_URL`

### Authentication

Cookie-based user IDs; each visitor automatically receives a `user_id` cookie, so no API keys are required. All data is scoped to that ID.

### Endpoints Overview

| Method | Path | Description |
|--------|------|-------------|
| GET | `/healthz` | Basic health check |
| POST | `/api/links` | Create a short link |
| GET | `/api/links` | List links for current user |
| GET | `/api/links/:code` | Fetch stats for a code |
| DELETE | `/api/links/:code` | Delete a link you own |
| GET | `/:code` | Redirect to the original URL |

### Sample Requests

**Create a Link**

```bash
curl -X POST https://tiny-link-clone.vercel.app/api/links \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/docs",
    "code": "docs01"
  }'
```

**List Links**

```bash
curl https://tiny-link-clone.vercel.app/api/links
```

**Get Link Details**

```bash
curl https://tiny-link-clone.vercel.app/api/links/docs01
```

**Delete a Link**

```bash
curl -X DELETE https://tiny-link-clone.vercel.app/api/links/docs01
```

**Redirect**

```bash
curl -I https://tiny-link-clone.vercel.app/docs01
# → 302 redirect to https://example.com/docs
```

### Response Shape

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "code": "docs01",
  "original_url": "https://example.com/docs",
  "click_count": 12,
  "created_at": "2025-11-22T03:30:00.000Z",
  "last_clicked": "2025-11-22T05:45:00.000Z",
  "user_id": "c31c4629-af58-48a1-8f35-f13fbf35817a"
}
```

Errors follow the `{ "error": "message" }` convention with appropriate HTTP status codes (`400`, `404`, `409`, etc.).

## Database Schema

Primary table: `links`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, default `gen_random_uuid()` | Unique link identifier |
| `code` | TEXT | UNIQUE, NOT NULL | Short code (6–8 alphanumeric chars) |
| `original_url` | TEXT | NOT NULL | Target URL |
| `created_at` | TIMESTAMP | DEFAULT `NOW()` | Creation timestamp |
| `click_count` | INTEGER | DEFAULT `0` | Total clicks |
| `last_clicked` | TIMESTAMP | NULL | Last time link was used |
| `created_by` | TEXT | NULL | Legacy creator field |
| `user_id` | VARCHAR(255) | NOT NULL | Cookie-based user scope |

Indexes:

```sql
CREATE INDEX IF NOT EXISTS idx_links_code ON links(code);
CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);
```

## Additional Documentation

- [`APPLICATION_DOCUMENTATION.md`](./APPLICATION_DOCUMENTATION.md) – in-depth architecture & UX
- [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) – extended API reference
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) – deployment guidance

Feel free to open issues or pull requests to improve TinyLink!
