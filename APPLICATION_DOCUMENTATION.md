# TinyLink Application Documentation

Complete guide to understanding and using the TinyLink URL shortener application.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Pages](#pages)
- [Components](#components)
- [Database Schema](#database-schema)
- [User Guide](#user-guide)
- [Developer Guide](#developer-guide)
- [Deployment](#deployment)

---

## Overview

**TinyLink** is a modern, full-stack URL shortener built with Next.js 16. It allows users to create short, shareable links, track click analytics, and manage their links through an intuitive dashboard.

### Key Highlights
- 🚀 **Fast & Lightweight** - Built with Next.js 16 and optimized for performance
- 📊 **Click Tracking** - Monitor how many times your links are accessed
- 🎨 **Modern UI** - Beautiful, responsive design with smooth animations
- 🔒 **User Privacy** - Cookie-based user identification (no account required)
- 📱 **Mobile-Friendly** - Works seamlessly on all devices
- 🔍 **Search & Filter** - Easily find your links

---

## Features

### Core Features

#### 1. **Link Shortening**
- Convert long URLs into short, memorable links
- Custom short codes (6-8 characters) or auto-generated
- Instant link creation with visual feedback

#### 2. **Click Analytics**
- Track total clicks per link
- View last clicked timestamp
- Monitor link performance from the dashboard

#### 3. **Link Management**
- View all your links in a searchable table
- Delete links you no longer need
- Copy short links and target URLs with one click

#### 4. **Stats Page**
- Detailed view for individual links
- See creation date and click history
- Copy original and short URLs

#### 5. **Search & Filter**
- Filter links by code or URL
- Real-time search results
- Shows result count

### UI/UX Features

- ✅ **Success states** with animations
- 🔄 **Loading states** with spinners
- ❌ **Error handling** with clear messages
- 📋 **Copy buttons** with "Copied!" feedback
- 🔗 **Share functionality** using native Web Share API
- 🎯 **Empty states** with helpful messages
- 📱 **Responsive design** for all screen sizes

---

## Architecture

### Application Structure

```
TinyURL/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── healthz/             # Health check endpoint
│   │   └── links/               # Link management APIs
│   │       ├── route.ts         # GET (list) & POST (create)
│   │       └── [code]/          # Dynamic route
│   │           └── route.ts     # GET (details) & DELETE
│   ├── code/                    # Stats pages
│   │   └── [code]/             
│   │       └── page.tsx         # Individual link stats
│   ├── [code]/                  # Redirect route
│   │   └── route.ts             # Handle /:code redirects
│   ├── layout.tsx               # Root layout with Header/Footer
│   ├── page.tsx                 # Dashboard (home)
│   └── globals.css              # Global styles
├── components/                   # React Components
│   ├── ui/                      # shadcn/ui components
│   ├── header.tsx               # App header
│   ├── footer.tsx               # App footer
│   ├── link-form.tsx            # Create link form
│   ├── links-table.tsx          # Links list/table
│   └── stats-content.tsx        # Stats page content
├── lib/                         # Utility functions
│   ├── db.ts                    # Database connection
│   ├── validation.ts            # URL & code validation
│   ├── api-utils.ts             # API response helpers
│   └── cookies.ts               # User ID management
└── public/                      # Static assets
```

### Data Flow

1. **User Visit** → Cookie with unique user_id created
2. **Create Link** → POST /api/links → Save to DB → Return short code
3. **View Dashboard** → GET /api/links → Filter by user_id → Display table
4. **Click Short Link** → GET /:code → Increment count → Redirect to original URL
5. **View Stats** → GET /api/links/:code → Display analytics
6. **Delete Link** → DELETE /api/links/:code → Remove from DB

---

## Technology Stack

### Frontend
- **Framework:** Next.js 16 (App Router with React Server Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix UI)
- **Icons:** Lucide React
- **Fonts:** Geist Sans & Geist Mono

### Backend
- **Runtime:** Node.js
- **Framework:** Next.js API Routes
- **Database:** PostgreSQL (Neon)
- **ORM:** @vercel/postgres (SQL template literals)

### DevOps
- **Hosting:** Vercel
- **Database:** Neon (Serverless Postgres)
- **Analytics:** Vercel Analytics
- **Version Control:** Git/GitHub

---

## Pages

### 1. Dashboard (`/`)

**Purpose:** Main page for creating and managing links

**Features:**
- Create new short links
- View all your links in a table
- Search/filter links
- Copy short links and target URLs
- Delete links
- View stats for individual links

**Components Used:**
- `LinkForm` - Create new links
- `LinksTable` - Display and manage links

**State Management:**
- Refresh trigger to update table after link creation
- Client-side component with React hooks

---

### 2. Stats Page (`/code/:code`)

**Purpose:** Detailed analytics for a specific link

**Features:**
- View link code and original URL
- See total clicks
- Check creation and last clicked timestamps
- Copy original URL and short link
- Navigate back to dashboard

**Components Used:**
- `StatsContent` - Client component that fetches data

**Data Fetching:**
- Client-side fetch from `/api/links/:code`
- Loading and error states

---

### 3. Health Check (`/healthz`)

**Purpose:** API health monitoring

**Response:**
```json
{
  "ok": true,
  "version": "1.0"
}
```

**Use Case:** Automated testing and uptime monitoring

---

### 4. Redirect (`/:code`)

**Purpose:** Redirect users from short links to original URLs

**Behavior:**
1. Look up code in database
2. If found:
   - Increment `click_count`
   - Update `last_clicked` timestamp
   - Return 302 redirect to original URL
3. If not found:
   - Return 404 error

**HTTP Status:** 302 (Temporary Redirect)

---

## Components

### Header (`components/header.tsx`)

**Purpose:** Global navigation header

**Features:**
- TinyLink logo and branding
- Navigation links (Dashboard, Health Check)
- Sticky positioning
- Blur backdrop effect

**Styling:**
- Gradient logo background
- Responsive layout
- Glass morphism effect

---

### Footer (`components/footer.tsx`)

**Purpose:** Global footer with information and links

**Sections:**
1. **About** - App description and tech stack
2. **Quick Links** - Navigation to key pages
3. **Technology** - Stack information
4. **Bottom Bar** - Copyright and GitHub link

**Features:**
- Responsive grid layout
- External links with icons
- Current year auto-update

---

### LinkForm (`components/link-form.tsx`)

**Purpose:** Form to create new shortened links

**Features:**
- URL input with validation
- Optional custom code input
- Loading state during submission
- Success state with:
  - Short URL display
  - Copy button
  - Share button
  - "Create Another Link" action
- Error handling

**State:**
- URL and code inputs
- Loading state
- Created link details
- Copy/share feedback

**Validation:**
- URL must be valid HTTP/HTTPS
- Code must be 6-8 alphanumeric characters

---

### LinksTable (`components/links-table.tsx`)

**Purpose:** Display all user's links in a table

**Features:**
- Responsive table with columns:
  - Code
  - Short Link (with copy button)
  - Target URL (with copy button)
  - Clicks
  - Created date
  - Actions (View Stats, Delete)
- Search/filter functionality
- Loading state
- Empty state
- Copy buttons with visual feedback

**State:**
- Links array
- Loading state
- Search query
- Copied states
- Deleting state

**Interactions:**
- Delete with confirmation
- Copy to clipboard
- Navigate to stats page
- Filter as you type

---

### StatsContent (`components/stats-content.tsx`)

**Purpose:** Display detailed stats for a single link

**Features:**
- Link code display
- Original URL (clickable)
- Short link
- Copy buttons with feedback
- Statistics grid (clicks, created, last clicked)
- Loading and error states

**Data Fetching:**
- Fetches from `/api/links/:code` on mount
- Client-side component

---

## Database Schema

### Table: `links`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `code` | VARCHAR(8) | UNIQUE, NOT NULL | Short code (6-8 chars) |
| `original_url` | TEXT | NOT NULL | Original long URL |
| `click_count` | INTEGER | DEFAULT 0 | Number of clicks |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| `last_clicked` | TIMESTAMP | NULL | Last click timestamp |
| `user_id` | UUID | NOT NULL | Owner's user ID |

### Indexes

```sql
CREATE INDEX idx_code ON links(code);
CREATE INDEX idx_user_id ON links(user_id);
CREATE INDEX idx_created_at ON links(created_at DESC);
```

### Example Row

```sql
id:           550e8400-e29b-41d4-a716-446655440000
code:         abc123
original_url: https://example.com/very/long/url
click_count:  42
created_at:   2025-11-22 03:30:00+00
last_clicked: 2025-11-22 05:45:00+00
user_id:      c31c4629-af58-48a1-8f35-f13fbf35817a
```

---

## User Guide

### Creating a Short Link

1. **Enter URL:** Paste your long URL in the "URL" field
2. **Optional:** Enter a custom code (6-8 alphanumeric characters)
3. **Click "Create Link"**
4. **Success!** You'll see:
   - ✅ Success message
   - 🔗 Your short link
   - 📋 Copy button
   - 🔗 Share button

### Copying Links

**From Success State:**
- Click "Copy Link" to copy the short URL
- Click "Share" to use native share (mobile/tablets)

**From Table:**
- Click the copy button next to the short link
- Click the copy button next to the target URL

### Viewing Stats

1. Find your link in the table
2. Click "View Stats" button
3. See detailed analytics:
   - Total clicks
   - Creation date/time
   - Last clicked date/time
   - Both URLs with copy buttons

### Searching Links

1. Type in the search box at the top of the table
2. Search by:
   - Short code (e.g., "abc123")
   - Target URL (e.g., "github.com")
3. Clear search by clicking the X button

### Deleting Links

1. Find the link in the table
2. Click the red "Delete" button
3. Confirm deletion in the popup
4. Link is permanently removed

---

## Developer Guide

### Setup & Installation

```bash
# Clone the repository
git clone https://github.com/SathyaSeelanG/TinyUrl.git
cd TinyUrl

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your DATABASE_URL

# Run database migrations (if needed)
npm run migrate

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file:

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

### Project Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding a New Feature

1. **API Endpoint:** Create in `app/api/`
2. **Page:** Create in `app/`
3. **Component:** Create in `components/`
4. **Utility:** Add to `lib/`
5. **Type:** Define in component or lib file

### Code Style

- **TypeScript:** Strict mode enabled
- **Formatting:** Follow existing patterns
- **Components:** Functional components with hooks
- **Naming:**
  - Components: PascalCase (`LinkForm`)
  - Files: kebab-case (`link-form.tsx`)
  - Functions: camelCase (`handleSubmit`)

---

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
2. **Import to Vercel:**
   - Connect your GitHub repository
   - Vercel auto-detects Next.js
3. **Add Environment Variables:**
   - Add `DATABASE_URL` in Vercel dashboard
4. **Deploy:**
   - Automatic deployment on push to main branch

### Environment Setup

**Production:**
```env
DATABASE_URL=your_neon_postgres_url
```

### Database Setup (Neon)

1. **Create Project:** https://neon.tech
2. **Get Connection String**
3. **Run Migrations:** Execute SQL in Neon console
4. **Update Vercel:** Add DATABASE_URL

---

## Performance Optimizations

### Implemented

- ✅ Server Components for static content
- ✅ Client Components only where needed
- ✅ Database indexes on frequently queried columns
- ✅ Lazy loading of images
- ✅ Minimal JavaScript bundle size

### Future Improvements

- [ ] Implement caching for frequently accessed links
- [ ] Add CDN for static assets
- [ ] Redis for high-traffic links
- [ ] Database connection pooling
- [ ] Image optimization

---

## Security

### Current Implementation

- ✅ Input validation (URL and code format)
- ✅ SQL injection prevention (parameterized queries)
- ✅ HTTPS enforcement
- ✅ Unique user IDs via secure cookies
- ✅ User-scoped link deletion

### Recommendations for Production

- [ ] Rate limiting (prevent abuse)
- [ ] CAPTCHA for link creation
- [ ] URL blacklist (prevent malicious links)
- [ ] CORS configuration
- [ ] Content Security Policy headers

---

## Troubleshooting

### Common Issues

**"Link not found" on stats page:**
- Ensure the link exists in the database
- Check that you're using the correct code
- Clear browser cache and reload

**Database connection errors:**
- Verify `DATABASE_URL` in `.env.local`
- Check database is running
- Ensure connection string is correct

**Hydration errors:**
- Avoid using `window` in Server Components
- Use `"use client"` for interactive components
- Don't use different values for server/client

---

## Testing

### Manual Testing Checklist

- [ ] Create link with custom code
- [ ] Create link with auto-generated code
- [ ] Duplicate code returns 409 error
- [ ] Invalid URL shows error message
- [ ] Redirect increments click count
- [ ] Delete removes link (404 on redirect)
- [ ] Stats page shows correct data
- [ ] Copy buttons work and show feedback
- [ ] Search filters correctly
- [ ] Mobile responsive

### API Testing

```bash
# Test health endpoint
curl http://localhost:3000/healthz

# Test create link
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# Test redirect
curl -I http://localhost:3000/[code]
```

---

## Support & Contributing

### Getting Help

- **Documentation:** Check API_DOCUMENTATION.md
- **GitHub Issues:** https://github.com/SathyaSeelanG/TinyUrl/issues
- **Discussions:** https://github.com/SathyaSeelanG/TinyUrl/discussions

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## License

This project is open source and available under the MIT License.

---

## Changelog

### Version 1.0 (November 2025)
- ✅ Initial release
- ✅ Link creation and management
- ✅ Click tracking
- ✅ Stats page
- ✅ Search/filter functionality
- ✅ Copy to clipboard
- ✅ Share functionality
- ✅ Header and Footer
- ✅ Complete documentation

---

**Last Updated:** November 22, 2025  
**Version:** 1.0  
**Author:** SathyaSeelanG
