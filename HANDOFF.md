# Construct Scenery Admin Panel — Session Handoff

**Date:** 2026-06-29  
**Session summary:** Built a complete admin panel (backend API + React frontend) for the Construct Scenery portfolio website from scratch, in a single session.  
**GitHub repo:** https://github.com/umairusman617-gif/construct-scenery-admin  
**Portfolio repo:** `/Users/umairusman/scenic-builds-elevated` (TanStack Start, not this repo)

---

## 1. Projects Involved

There are **two separate projects** on this machine. Do not confuse them.

| Project | Path | Purpose |
|---|---|---|
| Portfolio website | `/Users/umairusman/scenic-builds-elevated` | The live public-facing site (TanStack Start + React). All content is **still hardcoded** in source files — the admin panel does not yet feed into it. |
| Admin panel | `/Users/umairusman/construct-scenery-admin` | This repo. Backend API (root) + React frontend (`client/`). Manages content in PostgreSQL. |

---

## 2. What Was Completed This Session

### Step 1 — Content Audit
Performed a full audit of every hardcoded string in the portfolio. The audit covered:
- Nav links, logo/brand name, hero headline, rotating subtitles, trust stats
- 8 client logo names (BBC, ITV, Netflix, Sky, Channel 4, Amazon Studios, Apple TV+, Disney+)
- About section: headline, body, 4 stats, 5 service pillars
- 6 services with Lucide icon names
- 8 portfolio grid projects (3 with full case study pages, 5 without)
- 5 process steps
- 9 testimonials with Unsplash avatar URLs
- Sustainability section + 4 items
- Contact CTA: headline, body, 2 CTAs → `hello@constructscenery.co.uk`
- Footer: brand, tagline, 4 nav columns, 3 social links (all `href="#"` — dead)
- 3 full case studies: Clayface, You, Trespass Against Us (each with gallery, facts, credits, process, results)

**Key finding:** All Vimeo IDs in worlds-data.ts are the same placeholder (`76979871`). All testimonial photos are generic Unsplash URLs. All footer social links are `href="#"`.

### Step 2 — Backend API ✅ COMPLETE
- Created private GitHub repo `construct-scenery-admin` via `gh` CLI
- Built full Express + TypeScript + Prisma API in the repo root
- 19 Prisma models covering every portfolio section exactly
- 35 API endpoints across 13 route groups
- Seeded with exact current hardcoded content from the portfolio

### Step 3 — Admin Frontend ✅ COMPLETE
- Built React + Vite + TypeScript admin panel in `client/`
- 15 routes covering every section
- Fully functional: auth, forms, CRUD, image upload, toasts, skeletons, confirm dialogs

### Step 4 — Local Setup ✅ COMPLETE
- Installed PostgreSQL 16 via Homebrew (`brew install postgresql@16`)
- Created database `construct_scenery_admin`
- Ran migrations, seeded all data
- Both servers running

---

## 3. Decisions Made and Why

| Decision | Reason |
|---|---|
| Admin panel in a **separate repo** from the portfolio | Clean separation of concerns. The portfolio is a public-facing TanStack Start app; the admin is a private internal tool. Mixing them would complicate deployments and permissions. |
| Backend in repo **root**, frontend in `client/` | Monorepo structure keeps both in one private repo. Makes deployment to a single server (e.g. a VPS running both) straightforward. |
| **PostgreSQL** as the database | Production-grade, relational (needed for Worlds' relational sub-tables), Prisma support is excellent. |
| **Singleton models** for Hero, About, Contact, Footer, Sustainability | These sections each have exactly one instance. Using a single-row pattern (always upsert) keeps the API simple. The frontend just does a GET then PUT. |
| **Relational sub-tables** for World (gallery, facts, credits, process, results) | World data is complex and deeply nested. Normalising into separate tables gives clean CRUD and correct cascade deletes. Each sub-table has an `order` column for client-side ordering. |
| **String arrays** for simpler array fields (rotatingItems, tags) | Stored as PostgreSQL native `String[]`. Simpler than a join table for plain string lists. In the admin form they're entered as comma-separated values. |
| **JSON columns** for stats/pillars in About, trustStats in Hero, columns in Footer | These are tightly coupled to their parent (never queried independently) and have variable structure. JSON avoids unnecessary join tables for low-complexity embedded objects. |
| **Tailwind CSS v3** (not v4) for the admin frontend | The portfolio uses Tailwind v4, but shadcn/ui components are authored for v3. The admin panel uses a different styling context anyway, so v3 was used for full shadcn compatibility. |
| **React Router v6** (not TanStack Router) | The portfolio uses TanStack Router, but the admin is completely separate. React Router v6 is the standard for a standalone React SPA admin. |
| **JWT in localStorage** (not httpOnly cookies) | Simpler for a dev setup. For production this should be moved to httpOnly cookies. The 401 interceptor in `axios.ts` handles auto-logout. |
| **Cloudinary placeholder** credentials in `.env` | Image upload is wired up end-to-end but Cloudinary isn't configured yet. The `ImageUpload` component accepts a URL text field as fallback, so the admin is still fully usable without Cloudinary — just type in image URLs manually. |
| **Footer columns as JSON textarea** | The nested `[{ title, links[] }]` structure is too complex for a dynamic field array in a dialog. A JSON textarea is honest, fast to edit, and validated on save. |
| **World form as a full page with 6 tabs** (not a dialog) | Worlds have 6 nested sub-types (gallery, facts, credits, process, results). A dialog is too constrained; a dedicated route with tabs is the right UX. |
| `gh` CLI installed via Homebrew | GitHub CLI was not on the machine. Installed to create the repo programmatically without leaving the terminal. |

---

## 4. Current File & Folder Structure

```
/Users/umairusman/construct-scenery-admin/
│
├── .env                          ✅ Created (dev only, not committed)
├── .env.example                  ✅ Template with all required vars
├── .gitignore                    ✅
├── README.md                     ✅ Full setup + endpoint docs
├── HANDOFF.md                    ✅ This file
├── package.json                  ✅ Backend deps
├── tsconfig.json                 ✅
│
├── prisma/
│   ├── schema.prisma             ✅ 19 models (User, HeroSection, Logo, AboutSection,
│   │                                Service, Project, ProcessStep, Testimonial,
│   │                                SustainabilitySection, SustainabilityItem,
│   │                                ContactSection, FooterSection, World,
│   │                                WorldImage, WorldFact, WorldCredit,
│   │                                WorldProcess, WorldResult)
│   ├── seed.ts                   ✅ Full seed with exact portfolio content
│   └── migrations/               ✅ Migration 20260628214007_init applied
│
├── src/
│   ├── index.ts                  ✅ Server entry point (port 4000)
│   ├── app.ts                    ✅ Express app + CORS + all routes mounted
│   │
│   ├── lib/
│   │   ├── prisma.ts             ✅ Singleton PrismaClient
│   │   └── cloudinary.ts        ✅ Cloudinary SDK config (needs real credentials)
│   │
│   ├── middleware/
│   │   ├── auth.ts               ✅ JWT Bearer token guard (requireAuth)
│   │   ├── errorHandler.ts       ✅ Global error handler (Zod + generic)
│   │   └── validate.ts           ✅ Zod schema middleware factory
│   │
│   ├── schemas/                  ✅ 12 Zod schemas (one per section)
│   │   ├── auth.schema.ts
│   │   ├── hero.schema.ts
│   │   ├── logo.schema.ts
│   │   ├── about.schema.ts
│   │   ├── service.schema.ts
│   │   ├── project.schema.ts
│   │   ├── processStep.schema.ts
│   │   ├── testimonial.schema.ts
│   │   ├── sustainability.schema.ts
│   │   ├── contact.schema.ts
│   │   ├── footer.schema.ts
│   │   └── world.schema.ts
│   │
│   ├── controllers/              ✅ 13 controllers
│   │   ├── auth.controller.ts        login + verify
│   │   ├── upload.controller.ts      Cloudinary upload
│   │   ├── hero.controller.ts        singleton GET/PUT
│   │   ├── logos.controller.ts       list/create/update/delete/reorder
│   │   ├── about.controller.ts       singleton GET/PUT
│   │   ├── services.controller.ts    list/create/update/delete
│   │   ├── projects.controller.ts    list/create/update/delete
│   │   ├── process.controller.ts     list/create/update/delete
│   │   ├── testimonials.controller.ts list/create/update/delete
│   │   ├── sustainability.controller.ts section + items CRUD
│   │   ├── contact.controller.ts     singleton GET/PUT
│   │   ├── footer.controller.ts      singleton GET/PUT
│   │   └── worlds.controller.ts      list/getBySlug/create/update/delete
│   │
│   └── routes/                   ✅ 13 route files
│       (mirrors controllers, all mounted under /api/*)
│
└── client/                       ✅ React admin frontend
    ├── .env                      ✅ VITE_API_URL=http://localhost:4000
    ├── .env.example              ✅
    ├── index.html                ✅
    ├── package.json              ✅ Frontend deps
    ├── vite.config.ts            ✅ Port 5174, path alias @/*
    ├── tsconfig.json             ✅
    ├── tailwind.config.js        ✅ Tailwind v3 with CSS custom properties
    ├── postcss.config.js         ✅
    │
    └── src/
        ├── main.tsx              ✅ React root
        ├── App.tsx               ✅ Router + QueryClientProvider + AuthProvider + Toaster
        ├── index.css             ✅ Tailwind directives + CSS variables (light mode)
        │
        ├── types/
        │   └── index.ts          ✅ All TypeScript interfaces matching Prisma models
        │
        ├── lib/
        │   ├── utils.ts          ✅ cn() + getErrorMessage()
        │   └── queryClient.ts    ✅ TanStack Query client (1 min stale, retry 1)
        │
        ├── api/                  ✅ 14 files — one per section + axios instance
        │   ├── axios.ts          JWT interceptor + 401 auto-logout
        │   ├── auth.ts
        │   ├── upload.ts
        │   ├── hero.ts
        │   ├── logos.ts
        │   ├── about.ts
        │   ├── services.ts
        │   ├── projects.ts
        │   ├── process.ts
        │   ├── testimonials.ts
        │   ├── sustainability.ts
        │   ├── contact.ts
        │   ├── footer.ts
        │   └── worlds.ts
        │
        ├── context/
        │   └── AuthContext.tsx   ✅ JWT auth state, localStorage persistence, verify on mount
        │
        ├── components/
        │   ├── ui/               ✅ 14 shadcn-style components (Radix UI + Tailwind)
        │   │   ├── button.tsx       (with CVA variants)
        │   │   ├── input.tsx
        │   │   ├── label.tsx
        │   │   ├── textarea.tsx
        │   │   ├── card.tsx         (+ CardHeader, CardTitle, CardContent, CardFooter)
        │   │   ├── dialog.tsx       (Radix Dialog)
        │   │   ├── alert-dialog.tsx (Radix AlertDialog — used for confirms)
        │   │   ├── table.tsx        (+ TableHeader, TableBody, TableRow, TableHead, TableCell)
        │   │   ├── badge.tsx
        │   │   ├── skeleton.tsx
        │   │   ├── switch.tsx       (Radix Switch)
        │   │   ├── select.tsx       (Radix Select)
        │   │   ├── separator.tsx    (Radix Separator)
        │   │   └── tabs.tsx         (Radix Tabs — used in World form)
        │   │
        │   ├── layout/
        │   │   ├── Sidebar.tsx   ✅ Dark sidebar, 12 nav links, user email, sign out
        │   │   └── AppLayout.tsx ✅ Protected route wrapper + loading skeleton
        │   │
        │   └── shared/
        │       ├── PageHeader.tsx    ✅ Title + description + optional action slot
        │       ├── FormField.tsx     ✅ Label + children + error + hint
        │       ├── ConfirmDialog.tsx ✅ Wraps AlertDialog for delete confirmations
        │       └── ImageUpload.tsx   ✅ URL input + file picker → Cloudinary upload + preview
        │
        └── pages/
            ├── Login.tsx         ✅ Centered card, email/password, redirects to /dashboard
            ├── Dashboard.tsx     ✅ Live count cards for all 6 list sections + 5 singleton cards
            ├── Hero.tsx          ✅ Singleton form (eyebrow, headline, rotating items, body, CTAs,
            │                          video, trust stats array via useFieldArray)
            ├── Logos.tsx         ✅ Table + add/edit/delete dialogs + visibility badge
            ├── About.tsx         ✅ Singleton form (headline, body, image, stats[], pillars[])
            ├── Services.tsx      ✅ Table + add/edit/delete dialogs
            ├── Projects.tsx      ✅ Table with image preview + slug badge + add/edit/delete
            ├── Process.tsx       ✅ Table + add/edit/delete dialogs
            ├── Testimonials.tsx  ✅ Table with avatar + truncated quote + add/edit/delete
            ├── Sustainability.tsx ✅ Section form + items table on same page
            ├── Contact.tsx       ✅ Singleton form (headline, body, 2 CTA emails)
            ├── Footer.tsx        ✅ Singleton form (brandName, tagline, columns JSON textarea,
            │                          instagram, linkedin, vimeo)
            └── Worlds/
                ├── index.tsx     ✅ Table with tag badges + Live/Hidden status
                └── WorldForm.tsx ✅ 6-tab form: Basic Info / Gallery / Facts /
                                       Credits / Process / Results
                                       (new world: /worlds/new, edit: /worlds/:slug/edit)
```

---

## 5. What Is Incomplete / Not Started

### Critical — Must do before this admin panel is useful

| # | Item | Status | Notes |
|---|---|---|---|
| 1 | **Portfolio reads from API** | ❌ Not started | The portfolio (`scenic-builds-elevated`) still reads from hardcoded `worlds-data.ts` and component files. The admin panel saves to PostgreSQL, but the portfolio never fetches from it. This is the most important next step. |
| 2 | **Cloudinary credentials** | ⚠️ Placeholder | `.env` has `placeholder` for all 3 Cloudinary vars. Image upload will fail until real credentials are added. The admin is still usable by typing URLs manually. |
| 3 | **Dark mode for admin** | ❌ Not started | The `index.css` only defines light-mode CSS variables. No dark mode toggle exists in the admin panel. |

### Important — Should do soon

| # | Item | Status | Notes |
|---|---|---|---|
| 4 | **Deployment** | ❌ Not started | Neither the API nor the admin frontend are deployed. No hosting provider chosen. The portfolio deploys to Vercel; the admin API should go somewhere separate (Railway, Render, or a VPS). |
| 5 | **Logo reorder UI** | ⚠️ Partial | The backend has `PUT /api/logos/reorder` (accepts `{ ids: number[] }`) but the frontend Logos page has no drag-and-drop reorder UI. You can change order via the edit dialog's `order` field. |
| 6 | **Worlds gallery image reorder** | ⚠️ Partial | Gallery images have an `order` field in the database and form, but there is no drag-and-drop UI. Order is set via the numeric input. |
| 7 | **JWT in httpOnly cookie** | ⚠️ Dev compromise | Currently uses `localStorage`. Fine for local dev, but for production should be moved to httpOnly cookies to prevent XSS. |
| 8 | **Admin user management** | ❌ Not started | There is only one admin user created by the seed. There is no UI to add/change admin users or reset passwords. The `User` model exists in Prisma. |
| 9 | **Social link URLs in Footer** | ⚠️ Dead | All three social links in the portfolio footer (`Instagram`, `LinkedIn`, `Vimeo`) are `href="#"`. The admin footer page has the input fields; someone just needs to add the real URLs. |

### Nice to have

| # | Item | Status |
|---|---|---|
| 10 | Drag-and-drop reorder for all list sections | ❌ Not started |
| 11 | Bulk delete / bulk visibility toggle | ❌ Not started |
| 12 | Rich text editor for long body fields (intro, process body) | ❌ Not started |
| 13 | Image optimisation / aspect ratio cropping in ImageUpload | ❌ Not started |
| 14 | Preview link to live portfolio from each section | ❌ Not started |
| 15 | Activity log / audit trail of changes | ❌ Not started |
| 16 | `vercel.json` or deployment config for the admin | ❌ Not started |

---

## 6. Known Bugs and Issues

### Bug 1 — Image upload silently fails without Cloudinary
**File:** `client/src/components/shared/ImageUpload.tsx`  
**Symptom:** Clicking the upload button shows "Upload failed" toast because Cloudinary creds are placeholders.  
**Fix:** Add real Cloudinary credentials to `/Users/umairusman/construct-scenery-admin/.env` (see env vars section below). The URL text input works as a fallback in the meantime.

### Bug 2 — Footer columns JSON can break on bad input
**File:** `client/src/pages/Footer.tsx`  
**Symptom:** If the user edits the JSON textarea and introduces invalid JSON, the error toast says "Columns JSON is invalid" but does not highlight which line is wrong.  
**Fix:** Add a live JSON parse validation indicator below the textarea, or replace with a structured field array editor.

### Bug 3 — World update replaces all relations on every save
**File:** `src/controllers/worlds.controller.ts` — `updateWorld` function  
**Behaviour:** On every PUT to `/api/worlds/:slug`, if `gallery`, `facts`, `credits`, `process`, or `results` are included in the body, all existing rows for that relation are deleted and recreated. This is intentional (simpler than diffing) but means any relation IDs change on save. This is fine for now but would break any external system that stores WorldImage IDs.

### Bug 4 — No mobile layout in admin sidebar
**File:** `client/src/components/layout/Sidebar.tsx`  
**Symptom:** On screens narrower than ~900px the sidebar takes up too much space and the content area is unusable.  
**Fix:** Add a mobile hamburger menu that collapses the sidebar. Not urgent since admin panels are typically desktop-only tools.

### Bug 5 — Dashboard singleton cards don't show real status
**File:** `client/src/pages/Dashboard.tsx`  
**Symptom:** The 5 singleton section cards (Hero, About, Contact, Footer, Sustainability) just say "Singleton section — click to edit". They don't indicate whether the section has been populated or is empty.  
**Fix:** Fetch each singleton and show a green/grey dot indicating whether it has content.

---

## 7. Environment Variables

### Backend — `/Users/umairusman/construct-scenery-admin/.env`

```env
# Required — PostgreSQL connection string
DATABASE_URL="postgresql://umairusman@localhost:5432/construct_scenery_admin"

# Required — JWT signing secret (change before production deployment)
JWT_SECRET="cs-admin-dev-secret-key-change-in-production-2024"
JWT_EXPIRES_IN="7d"

# Required for image upload — get from https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME="placeholder"        # ← REPLACE
CLOUDINARY_API_KEY="placeholder"           # ← REPLACE
CLOUDINARY_API_SECRET="placeholder"        # ← REPLACE

# Server config
PORT=4000
NODE_ENV="development"

# CORS — comma-separated list of allowed frontend origins
ALLOWED_ORIGINS="http://localhost:5174,http://localhost:5173"

# Used only by db:seed script
ADMIN_EMAIL="admin@constructscenery.co.uk"
ADMIN_PASSWORD="admin123"                  # ← CHANGE before production
ADMIN_NAME="Admin"
```

### Frontend — `/Users/umairusman/construct-scenery-admin/client/.env`

```env
# Backend API base URL
VITE_API_URL=http://localhost:4000
```

**Important:** Neither `.env` file is committed to git (both are in `.gitignore`). They must be recreated from `.env.example` on any new machine.

---

## 8. Commands to Install and Run

### Prerequisites (macOS)
```bash
# Homebrew must be installed
# PostgreSQL 16 installed and running (was installed this session)
brew services start postgresql@16

# gh CLI installed (was installed this session)
/opt/homebrew/bin/gh --version
```

### First-time setup (new machine)

```bash
# 1. Clone the repo
git clone https://github.com/umairusman617-gif/construct-scenery-admin.git
cd construct-scenery-admin

# 2. Create backend .env
cp .env.example .env
# Edit .env — set DATABASE_URL, JWT_SECRET, Cloudinary creds

# 3. Create frontend .env
cp client/.env.example client/.env
# Edit client/.env — set VITE_API_URL

# 4. Install backend deps
npm install

# 5. Install frontend deps
cd client && npm install && cd ..

# 6. Create the database (PostgreSQL must be running)
createdb construct_scenery_admin

# 7. Generate Prisma client
npx prisma generate

# 8. Run migrations
npx prisma migrate dev --name init

# 9. Seed the database with portfolio content
npm run db:seed
```

### Running locally (every subsequent time)

```bash
# Make sure PostgreSQL is running
brew services start postgresql@16

# Terminal 1 — Backend API (port 4000)
cd /Users/umairusman/construct-scenery-admin
npm run dev

# Terminal 2 — Frontend (port 5174)
cd /Users/umairusman/construct-scenery-admin/client
npm run dev
```

**URLs:**
- Admin panel: http://localhost:5174
- Backend API: http://localhost:4000
- Health check: http://localhost:4000/health

**Login:**
- Email: `admin@constructscenery.co.uk`
- Password: `admin123`

### Database management

```bash
# Visual DB browser
npm run db:studio        # opens Prisma Studio at http://localhost:5555

# Reset and re-seed (wipes all data)
npm run db:reset

# Re-seed without resetting (safe to run multiple times — uses upsert for user)
npm run db:seed

# Create a new migration after schema changes
npx prisma migrate dev --name describe_change_here
```

---

## 9. Next Steps (Priority Order)

### Priority 1 — Wire portfolio to the API (most impactful)
The entire point of the admin panel is to make the portfolio dynamic. Right now the admin saves to PostgreSQL but the portfolio reads from hardcoded files. This connection must be built.

**What to do:**
1. In `scenic-builds-elevated`, create a server-side data-fetching layer (TanStack Start loader functions)
2. Replace `src/lib/worlds-data.ts` with API calls to `http://localhost:4000/api/worlds`
3. Replace each landing component's hardcoded data with API calls to the relevant endpoints:
   - `Hero.tsx` → `GET /api/hero`
   - `Logos.tsx` → `GET /api/logos`
   - `About.tsx` → `GET /api/about`
   - `Services.tsx` → `GET /api/services`
   - `Projects.tsx` → `GET /api/projects`
   - `Process.tsx` → `GET /api/process`
   - `Testimonials.tsx` → `GET /api/testimonials`
   - `Sustainability.tsx` → `GET /api/sustainability`
   - `FinalCTA.tsx` → `GET /api/contact`
   - `Footer.tsx` → `GET /api/footer`
4. The world detail page (`worlds.$slug.tsx`) uses `worldBySlug()` and `nextWorld()` from `worlds-data.ts` — replace these with `GET /api/worlds/:slug` and add a "next world" lookup
5. Add a `VITE_API_URL` or server-side env var to the portfolio project pointing to the backend

### Priority 2 — Set up Cloudinary
1. Create a free account at https://cloudinary.com
2. Copy Cloud Name, API Key, API Secret into the backend `.env`
3. Test by uploading an image via the admin panel
4. Update existing portfolio images: the seed uses local asset paths (e.g. `/assets/project-3.jpg`) which only work on the local machine — these need to be replaced with real Cloudinary URLs

### Priority 3 — Deploy
Recommended stack for production:
- **Backend API:** Railway or Render (free tier, auto-deploys from GitHub)
- **Database:** Railway PostgreSQL or Supabase (managed PostgreSQL)
- **Admin frontend:** Vercel or Netlify (static deploy of `client/dist/`)
- **Portfolio:** Already on Vercel

Steps:
1. Create a PostgreSQL database on Railway/Supabase — get the connection string
2. Deploy backend to Railway — set all env vars
3. Run `npm run db:seed` against production DB (change admin password first)
4. Update `client/.env` → `VITE_API_URL=https://your-api-domain.railway.app`
5. Deploy `client/` to Vercel — build command: `npm run build`, output: `dist/`
6. Update portfolio's API URL env var

### Priority 4 — Cloudinary for existing images
Currently all images in the seed are local asset paths (`/assets/project-1.jpg`, etc.) which reference the portfolio's bundled assets. Once Cloudinary is set up:
1. Upload all 11 images from `scenic-builds-elevated/src/assets/` to Cloudinary
2. Update the seed with the real Cloudinary URLs
3. Run `npm run db:reset` to re-seed with proper URLs

### Priority 5 — Security hardening (before production)
1. Change `ADMIN_PASSWORD` from `admin123` to something strong
2. Change `JWT_SECRET` to a 64-character random string
3. Move JWT from `localStorage` to httpOnly cookies (requires backend change to set `Set-Cookie` header and frontend to remove the interceptor pattern)
4. Add rate limiting to `POST /api/auth/login` (use `express-rate-limit`)
5. Consider adding `helmet` middleware to the Express app

### Priority 6 — Fill in dead content
From the audit:
- Footer social links are all `href="#"` — add real Instagram, LinkedIn, Vimeo URLs via the admin Footer page
- All three case studies have the same placeholder Vimeo ID `76979871` — update with real video IDs via the admin Worlds editor
- 5 portfolio grid projects have no case study pages (Aurora Pavilion, Bloom Couture, Vanguard Awards, The Late Edit, Maison Pop-Up) — either create Worlds entries for them or leave as "enquire" links

---

## 10. Important Context for the Next Session

### The portfolio is NOT yet connected to the backend
Do not assume edits in the admin panel appear on the live portfolio. They save to PostgreSQL only. The portfolio is still fully static/hardcoded. See Priority 1 above.

### Two separate repos, two separate servers
- Portfolio: runs on port 8080 (Vite), `cd /Users/umairusman/scenic-builds-elevated && npm run dev`
- Admin backend: runs on port 4000 (Express), `cd /Users/umairusman/construct-scenery-admin && npm run dev`
- Admin frontend: runs on port 5174 (Vite), `cd /Users/umairusman/construct-scenery-admin/client && npm run dev`

### PostgreSQL is local, installed via Homebrew
If PostgreSQL isn't running: `brew services start postgresql@16`  
Database name: `construct_scenery_admin`  
User: `umairusman` (macOS system user, no password)

### The seed is idempotent for the admin user only
Running `npm run db:seed` again will skip recreating the admin user (uses `upsert`) but will **delete and recreate all other content** (logos, projects, worlds, etc.). Only re-seed if you want to reset all content to the original portfolio defaults.

### GitHub CLI is installed at `/opt/homebrew/bin/gh`
It's not in the default PATH on this machine. Either use the full path or add it: `export PATH="/opt/homebrew/bin:$PATH"`

### Prisma migrations folder is committed to git
`prisma/migrations/20260628214007_init/migration.sql` is in the repo. Any future schema changes require `npx prisma migrate dev --name your_description_here` to create a new migration file, which must also be committed.

### Cloudinary upload is wired but non-functional
The backend route `POST /api/upload` exists and is protected by JWT. The `ImageUpload` component in the frontend will attempt to call it. It will return a 500 error until real Cloudinary credentials are in `.env`. The URL text input in `ImageUpload` works as a bypass — just paste any image URL directly.

### Admin frontend uses Tailwind v3, portfolio uses Tailwind v4
These are completely independent projects with separate `node_modules`. Do not mix their configs. The admin's `tailwind.config.js` uses the old `module.exports` format; the portfolio uses the new `@import "tailwindcss"` CSS-first approach.

### World form sends full relation arrays on every save
When editing a World in the admin, all 5 relation arrays (gallery, facts, credits, process, results) are deleted and recreated on every save if included in the payload. This is the current implementation in `worlds.controller.ts` `updateWorld()`. It is safe and correct — just be aware that sub-table row IDs change on each save.
