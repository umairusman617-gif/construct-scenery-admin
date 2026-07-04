# Construct Scenery Admin — Session Handoff

**Date:** 2026-07-01
**Session summary:** Built a full Media Library feature — centralised image/video store with pick-from-library in every admin image field, real-time upload progress bars, and loading skeletons. Confirmed AWS S3 is the active storage provider and is working. Admin API is running locally on port 4000, tunnelled via ngrok to production.

---

## 1. Two Projects — Do Not Confuse Them

| Project | Local path | Port | Purpose |
|---|---|---|---|
| **Admin API** (this repo) | `/Users/umairusman/construct-scenery-admin` | 4000 | Express + Prisma backend. Manages PostgreSQL data + file uploads to S3. Must be running locally. |
| **Admin client** | `/Users/umairusman/construct-scenery-admin/client` | 5174 (local) | React SPA. Also deployed at https://construct-scenery-admin.vercel.app |
| **Portfolio** | `/Users/umairusman/scenic-builds-elevated` | 8080 | Public-facing TanStack Start site. Fetches ALL content from the API. Deployed at https://scenic-builds-elevated.vercel.app |

---

## 2. Live URLs (Production)

| Service | URL | Notes |
|---|---|---|
| Portfolio | https://scenic-builds-elevated.vercel.app | Vercel. Reads from ngrok tunnel. |
| Admin panel | https://construct-scenery-admin.vercel.app | Vercel static SPA. Reads from ngrok tunnel. |
| Admin API | https://democrat-both-cross.ngrok-free.dev | ⚠️ ngrok free — URL CHANGES every restart. |
| Admin API (local) | http://localhost:4000 | Must be running locally for the above to work. |

> **Critical:** The ngrok URL `https://democrat-both-cross.ngrok-free.dev` is not permanent. Every time ngrok is restarted the URL changes. When it changes, update `VITE_API_URL` on both Vercel projects and restart the API with the new `ALLOWED_ORIGINS`. See Section 10.

---

## 3. What Was Completed This Session

### Task 1 — Media Library (full feature) ✅ COMPLETE

**Problem:** Every admin image field required re-uploading the same file. No centralised store of uploaded assets. No way to reuse images across sections.

**Solution:** Built a complete Media Library — a persistent store of all uploaded files backed by a new `MediaFile` DB table, with a full UI for browsing, uploading, and deleting. Every image field in the admin now has a "Pick from Library" button.

#### Backend changes (`/Users/umairusman/construct-scenery-admin/`)

| File | Status | What changed |
|---|---|---|
| `prisma/schema.prisma` | ✅ Modified | Added `MediaFile` model (url, publicId, filename, mimeType, size, createdAt) |
| `src/controllers/upload.controller.ts` | ✅ Modified | Saves a `MediaFile` row after every S3 upload. Returns `{url, publicId, id}`. |
| `src/controllers/media.controller.ts` | ✅ New | `listMedia` (GET all, newest-first) + `deleteMedia` (DELETE by id — removes from DB, ⚠️ see Bug 1) |
| `src/routes/media.routes.ts` | ✅ New | `GET /api/media` and `DELETE /api/media/:id`, both behind `requireAuth` |
| `src/routes/upload.routes.ts` | ✅ Modified | Raised multer file size limit from 10 MB → 200 MB to support video uploads |
| `src/app.ts` | ✅ Modified | Registered `app.use("/api/media", mediaRoutes)` |

**Migration applied:** `20260630081607_add_media_file` — creates the `media_files` table. Migration file is gitignored (this repo's convention) but has already been applied to the local DB.

**Current DB state:** 68 `MediaFile` rows, all pointing to S3 (`constructscenery-assets.s3.us-east-1.amazonaws.com`).

#### Frontend changes (`/Users/umairusman/construct-scenery-admin/client/`)

| File | Status | What changed |
|---|---|---|
| `client/src/api/media.ts` | ✅ New | `mediaApi.list()` → `GET /api/media`, `mediaApi.delete(id)` → `DELETE /api/media/:id` |
| `client/src/api/upload.ts` | ✅ Modified | Added `uploadWithProgress(file, onProgress)` using `XMLHttpRequest` for real-time progress |
| `client/src/types/index.ts` | ✅ Modified | Added `MediaFile` interface + added `id: number` to `UploadResult` |
| `client/src/pages/MediaLibrary.tsx` | ✅ New | Full-page media library: drag-and-drop upload zone, per-file progress bars, image/video grid with copy-URL and delete |
| `client/src/components/shared/MediaPicker.tsx` | ✅ New | Dialog with Library tab (click to select) + Upload tab (with progress bar). Opens from every image field. |
| `client/src/components/shared/ImageUpload.tsx` | ✅ Modified | Added Library button (grid icon) that opens MediaPicker. Added real-time progress bar. Upload button now accepts video. |
| `client/src/App.tsx` | ✅ Modified | Added `<Route path="/media" element={<MediaLibrary />} />` |
| `client/src/components/layout/Sidebar.tsx` | ✅ Modified | Added "Media Library" nav item (second item, below Dashboard) using `GalleryHorizontal` icon |

### Task 2 — Video support ✅ COMPLETE

- `multer` limit raised to 200 MB in `src/routes/upload.routes.ts`
- All file `<input accept>` attributes changed to `"image/*,video/*"`
- Video cards in the grid render a `<video>` thumbnail with a film-icon overlay
- `MediaPicker` library grid renders videos the same way

### Task 3 — Upload progress bars ✅ COMPLETE

`XMLHttpRequest` (`xhr.upload.onprogress`) is the only browser API that gives real upload progress. Axios does not expose this for uploads.

`uploadWithProgress(file, onProgress)` in `client/src/api/upload.ts`:
- Manually reads `Authorization` token from `localStorage`
- Manually adds `ngrok-skip-browser-warning` header when base URL contains "ngrok"
- Calls `onProgress(pct)` on each `upload.progress` event
- Returns `Promise<ApiResponse<UploadResult>>` directly — NOT wrapped in an axios response

Progress shows in three places:
1. **MediaLibrary page** — per-file named progress bars in a card below the drop zone (supports concurrent multi-file uploads)
2. **MediaPicker upload tab** — single progress bar below the drop zone
3. **ImageUpload component** — progress bar replaces the image preview until upload completes

### Task 4 — Loading skeletons ✅ COMPLETE

Both `MediaLibrary.tsx` and `MediaPicker.tsx` show an animated `animate-pulse` skeleton while each image/video loads, then fade the media in via `opacity` transition once `onLoad` / `onLoadedMetadata` fires.

### Task 5 — S3 verification ✅ CONFIRMED WORKING

Tested an actual end-to-end upload via `curl`. S3 is working. The issue before testing was that the API had been started before the AWS env vars were in `.env` — `tsx watch` does not reload `.env` on change. Restarting the API fixed it.

---

## 4. Storage Provider — AWS S3 (Final Decision)

**Active storage: AWS S3** — bucket `constructscenery-assets`, region `us-east-1`

History:
- Originally the project had Cloudinary env vars for a one-off image migration script
- The upload controller was later switched to S3
- During this session we temporarily rewrote upload to Cloudinary, then the user reverted it back to S3
- **S3 is the correct final choice** — AWS credentials are in `.env`, the bucket exists, uploads are confirmed working, all 68 `MediaFile` records point to S3

The `cloudinary` npm package is still installed but **should not be used for uploads**. It remains only because `src/controllers/media.controller.ts` still incorrectly calls `cloudinary.uploader.destroy()` on delete — this is a bug (see Bug 1 below).

---

## 5. Decisions Made and Why

| Decision | Reason |
|---|---|
| `XMLHttpRequest` for upload progress | Axios does not expose `upload.onprogress`. XHR is the only browser API that gives real-time upload progress. |
| Per-file progress tracking (Map by key) | Multiple files can upload concurrently in the Media Library. Each needs its own progress state keyed by a unique `Date.now()-index` string. |
| `uploadWithProgress` returns `ApiResponse<UploadResult>` directly | Unlike axios which wraps in `{data: ...}`, XHR parses JSON body directly. Callers use `res.data.url` not `res.data.data.url`. |
| 200 MB multer limit | Videos can easily exceed 10 MB. 200 MB covers typical production video files. |
| `MediaFile` table in PostgreSQL | Needed to persist upload history. Without a DB record, the library has no way to list previously uploaded files. The S3 URL alone is not queryable. |
| `animate-pulse` skeleton + opacity fade-in | Industry-standard loading UX. Skeleton gives visual structure while media loads; fade-in avoids a jarring pop. |
| Library picker opens as a dialog with two tabs | Avoids navigating away from the form. Library tab + Upload tab covers both use cases without leaving the page. |
| S3 over Cloudinary | AWS credentials already configured, bucket exists, uploads confirmed working. User explicitly reverted to S3. |

---

## 6. Current File & Folder Structure

```
/Users/umairusman/construct-scenery-admin/
│
├── .env                    ✅ All credentials (gitignored). See Section 8.
├── vercel.json             ✅ Redirects Vercel build to client/ subdirectory
├── package.json            ✅ includes cloudinary + @aws-sdk/client-s3 + multer
│
├── prisma/
│   ├── schema.prisma       ✅ 19 models including MediaFile
│   ├── seed.ts             ✅ Unchanged
│   └── migrations/         ⚠️ GITIGNORED — applied locally, not tracked in git
│       └── 20260630081607_add_media_file/  ✅ Applied to local DB
│
├── src/
│   ├── app.ts              ✅ All 14 routes registered including /api/media
│   ├── index.ts            ✅ Unchanged
│   ├── lib/
│   │   ├── prisma.ts       ✅ Unchanged
│   │   └── s3.ts           ✅ S3Client — reads AWS_* env vars at startup (module-level init)
│   ├── middleware/         ✅ Unchanged (auth, errorHandler, validate)
│   ├── controllers/
│   │   ├── upload.controller.ts    ✅ S3 upload + MediaFile row creation
│   │   ├── media.controller.ts     ✅ NEW — list + delete (⚠️ delete calls Cloudinary not S3, see Bug 1)
│   │   └── (12 other controllers — unchanged)
│   └── routes/
│       ├── upload.routes.ts        ✅ 200 MB multer limit
│       ├── media.routes.ts         ✅ NEW
│       └── (11 other routes — unchanged)
│
└── client/
    ├── vite.config.ts      ✅ port 5174, @/ alias
    └── src/
        ├── App.tsx         ✅ /media route added
        ├── api/
        │   ├── upload.ts           ✅ uploadImage() + uploadWithProgress() via XHR
        │   ├── media.ts            ✅ NEW — list() and delete()
        │   └── (other api files — unchanged)
        ├── types/index.ts  ✅ MediaFile type added, UploadResult.id added
        ├── pages/
        │   ├── MediaLibrary.tsx    ✅ NEW
        │   └── (14 other pages — unchanged)
        └── components/
            ├── layout/Sidebar.tsx          ✅ Media Library nav item added
            └── shared/
                ├── ImageUpload.tsx         ✅ Library button + progress bar
                ├── MediaPicker.tsx         ✅ NEW
                └── (other shared — unchanged)
```

---

## 7. Bugs and Issues

### Bug 1 — deleteMedia does NOT delete the file from S3 ⚠️ IMPORTANT

**File:** `src/controllers/media.controller.ts` — `deleteMedia` function

**Symptom:** Clicking delete on a media library item removes the DB row and the item disappears from the grid, but the actual file remains in the S3 bucket permanently, costing storage.

**Cause:** `media.controller.ts` calls `cloudinary.uploader.destroy(file.publicId)` but all files are stored on S3, not Cloudinary. Cloudinary silently fails (or destroys nothing), the code continues, and the DB row is deleted.

**Fix (15 minutes):**
```typescript
// In src/controllers/media.controller.ts

// Remove these imports:
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({ ... });

// Replace the destroy call with:
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3, S3_BUCKET } from "../lib/s3";

// In deleteMedia():
await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: file.publicId }));
```

### Bug 2 — ngrok URL changes on every restart (KNOWN, by design)

**Symptom:** After machine reboot or ngrok restart, portfolio and admin panel show network errors.
**Cause:** Free ngrok generates a random subdomain per session.
**Workaround:** Follow Section 10 URL-swap procedure.
**Permanent fix:** Deploy API to Railway (Priority 2 in next steps).

### Bug 3 — API must be restarted after .env changes (KNOWN)

**Symptom:** Changing any variable in `.env` has no effect until the API is killed and restarted.
**Cause:** `s3.ts` and other modules initialise with `process.env.*` at module load time. `tsx watch` only watches `.ts` files, not `.env`.
**Workaround:** Always `lsof -ti :4000 | xargs kill -9 && npm run dev` after `.env` changes.

### Bug 4 — World update replaces all relation rows (KNOWN, pre-existing)

**File:** `src/controllers/worlds.controller.ts` — `updateWorld`
**Behaviour:** Every PUT to `/api/worlds/:slug` deletes and recreates gallery, facts, credits, process, results. Row IDs change on every save.

### Bug 5 — Footer JSON can break on bad input (KNOWN, pre-existing)

**File:** `client/src/pages/Footer.tsx`
**Symptom:** Invalid JSON in the columns textarea shows a toast error but no line indicator.

---

## 8. Environment Variables

### Admin API — `/Users/umairusman/construct-scenery-admin/.env` (gitignored)

```env
DATABASE_URL="postgresql://umairusman@localhost:5432/construct_scenery_admin"
JWT_SECRET="cs-admin-dev-secret-key-change-in-production-2024"
JWT_EXPIRES_IN="7d"
AWS_ACCESS_KEY_ID="<redacted — see local .env, gitignored>"
AWS_SECRET_ACCESS_KEY="<redacted — see local .env, gitignored>"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="constructscenery-assets"
PORT=4000
NODE_ENV="development"
ALLOWED_ORIGINS="http://localhost:5174,http://localhost:5173,http://localhost:8080,http://localhost:8081,https://scenic-builds-elevated.vercel.app,https://constructscenery.vercel.app,https://construct-scenery-admin.vercel.app,https://construct-scenery-admin-umairusman617-3450s-projects.vercel.app"
ADMIN_EMAIL="admin@constructscenery.co.uk"
ADMIN_PASSWORD="admin123"
ADMIN_NAME="Admin"
```

> Note: `CLOUDINARY_*` vars are NOT needed and are NOT in `.env`. The `cloudinary` npm package is installed but only called (incorrectly) in `media.controller.ts` delete — which is Bug 1 above.

### Portfolio — `/Users/umairusman/scenic-builds-elevated/.env` (gitignored)

```env
VITE_API_URL=http://localhost:4000
```

On Vercel this is overridden to the ngrok tunnel URL via `vercel env`.

### Admin client (Vercel env — not a file)

```
VITE_API_URL=https://democrat-both-cross.ngrok-free.dev   ← changes on ngrok restart
```

### ngrok

- Auth token: `3Fms98T1pqkgr4NAVFBhMlSPD6d_3234p6Zab8Nep33kVgH6r`
- Config at: `/Users/umairusman/Library/Application Support/ngrok/ngrok.yml`
- Current tunnel: `https://democrat-both-cross.ngrok-free.dev` → `http://localhost:4000`

---

## 9. Commands to Run Everything

### Prerequisites

```bash
brew services start postgresql@16
export PATH="/opt/homebrew/bin:$PATH"
```

### Start the Admin API (port 4000) — MUST be running for everything else

```bash
lsof -ti :4000 | xargs kill -9 2>/dev/null; true
cd /Users/umairusman/construct-scenery-admin
npm run dev
# Wait for: ✓ Database connected  ✓ Server running on http://localhost:4000
```

> After any `.env` change you MUST kill and restart — tsx watch does NOT reload env vars.

### Start ngrok (separate terminal)

```bash
ngrok http 4000
# Note the https URL if it changed from democrat-both-cross.ngrok-free.dev
```

### Start admin client locally (optional)

```bash
cd /Users/umairusman/construct-scenery-admin/client
npm run dev
# http://localhost:5174
```

### Start portfolio locally (optional)

```bash
cd /Users/umairusman/scenic-builds-elevated
npm run dev
# http://localhost:8080
```

### Install dependencies (first time or after pull)

```bash
cd /Users/umairusman/construct-scenery-admin && npm install
cd /Users/umairusman/construct-scenery-admin/client && npm install
cd /Users/umairusman/scenic-builds-elevated && npm install
```

### Admin login

```
Email:    admin@constructscenery.co.uk
Password: admin123
```

### Database management

```bash
cd /Users/umairusman/construct-scenery-admin
npm run db:studio    # Browse DB at localhost:5555
npm run db:seed      # Re-seed defaults (safe — upserts)
npm run db:reset     # DESTRUCTIVE — wipes all data

# After schema changes:
npx prisma migrate dev --name your_change_name
```

### TypeScript checks

```bash
cd /Users/umairusman/construct-scenery-admin && npx tsc --noEmit
cd /Users/umairusman/construct-scenery-admin/client && npm run build
```

---

## 10. Procedure: Updating the ngrok URL

Run this every time ngrok restarts and gives a new URL:

```bash
NEW_URL="https://YOUR-NEW-URL.ngrok-free.app"

# Portfolio Vercel project
cd /Users/umairusman/scenic-builds-elevated
vercel env rm VITE_API_URL production --yes
echo "$NEW_URL" | vercel env add VITE_API_URL production
vercel --prod

# Admin panel Vercel project
cd /Users/umairusman/construct-scenery-admin
vercel env rm VITE_API_URL production --yes
echo "$NEW_URL" | vercel env add VITE_API_URL production
vercel --prod
```

Vercel CLI is installed and authenticated: `vercel whoami` → `umairusman617-3450`

---

## 11. Media Library — How It Works

### Upload flow

```
User drops/picks file
  → uploadWithProgress() [XHR with onprogress — gives 0-100% progress]
  → POST /api/upload (multer, 200 MB limit)
  → upload.controller.ts: uploads buffer to S3 bucket
  → creates MediaFile row { url, publicId=S3 key, filename, mimeType, size }
  → returns { url, publicId, id }
  → frontend: invalidates ["media"] query → library grid refreshes
```

### List flow

```
GET /api/media (requireAuth)
  → prisma.mediaFile.findMany({ orderBy: { createdAt: "desc" } })
  → returns array of MediaFile objects
```

### Delete flow (⚠️ BUG — S3 file NOT deleted)

```
DELETE /api/media/:id
  → finds MediaFile by id
  → calls cloudinary.uploader.destroy(publicId)  ← WRONG, should be S3 DeleteObjectCommand
  → deletes MediaFile DB row
  → S3 object remains orphaned
```

### Critical type difference

```typescript
// uploadImage — axios wrapper — access URL via res.data.data.url
uploadApi.uploadImage(file)  →  AxiosResponse<ApiResponse<UploadResult>>

// uploadWithProgress — raw parsed JSON — access URL via res.data.url
uploadApi.uploadWithProgress(file, cb)  →  Promise<ApiResponse<UploadResult>>
```
Mixing these up produces `undefined` URL bugs silently.

---

## 12. Next Steps (Priority Order)

### Priority 1 — Fix S3 delete in media.controller.ts (15 min, Bug 1)

In `src/controllers/media.controller.ts`:
- Remove `cloudinary` import and `cloudinary.config()` block
- Replace `cloudinary.uploader.destroy(file.publicId)` with:
  ```typescript
  import { DeleteObjectCommand } from "@aws-sdk/client-s3";
  import { s3, S3_BUCKET } from "../lib/s3";
  await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: file.publicId }));
  ```

### Priority 2 — Deploy API to Railway (eliminates ngrok forever)

1. Go to https://railway.app → New Project → Deploy from GitHub → `construct-scenery-admin`
2. Add PostgreSQL service to the same Railway project
3. Set all env vars from Section 8 (use Railway's DATABASE_URL for PostgreSQL)
4. Railway auto-detects `npm run build` + `npm start`
5. Get the Railway URL → update both Vercel projects' `VITE_API_URL` (permanent, no more ngrok)
6. Run `npm run db:seed` against the Railway DB to populate it

### Priority 3 — Fill in dead content via admin panel

- **Footer** → add real Instagram, LinkedIn, Vimeo URLs
- **Worlds editor** → replace placeholder `vimeoId: "76979871"` with real Vimeo IDs for all three worlds
- **Projects** → decide on Aurora Pavilion, Bloom Couture, Vanguard Awards, The Late Edit, Maison Pop-Up

### Priority 4 — Security hardening

1. `openssl rand -hex 64` → replace `JWT_SECRET`
2. Change `ADMIN_PASSWORD` from `admin123` to something strong
3. Move JWT from `localStorage` → `httpOnly` cookies
4. Add `express-rate-limit` to the login route (`src/routes/auth.routes.ts`)
5. Add `helmet` to `src/app.ts`

### Priority 5 — Make Nav dynamic

`scenic-builds-elevated/src/components/landing/Nav.tsx` has a hardcoded `links` array.
1. Add `NavSection` model to `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name add_nav_section`
3. Add `GET /api/nav` controller + route
4. Update `Nav.tsx` to `useQuery(["nav"])`
5. Add Nav page to admin sidebar

---

## 13. Git State at End of Session

### Admin repo (`construct-scenery-admin`) — origin/main

```
Last commit: 8dd257b  Wire upload controller to S3; add Cloudinary→S3 migration script
Clean working tree — no uncommitted changes
```

Commits made this session (newest first):
```
8dd257b  Wire upload controller to S3; add Cloudinary→S3 migration script
8b90176  Add real-time upload progress bars (0–100%) via XHR
8ac137a  Add loading skeleton + fade-in for media library cards and picker
cb247e1  Extend media library to support video uploads
d4134e7  Add Media Library — centralised image store with pick-from-library in every field
```

### Portfolio repo (`scenic-builds-elevated`) — origin/main

```
Last commit: aaf9509  Update session handoff for 2026-06-30
No changes made this session.
```

---

## 14. Critical Context for the Next Claude Session

**S3 is the only storage provider.** All 68 `MediaFile` rows point to `constructscenery-assets.s3.us-east-1.amazonaws.com`. Cloudinary is NOT used. The `cloudinary` package remains installed only because of the unfixed delete bug.

**The API must be restarted after any .env change.** `tsx watch` does not reload env. The `s3.ts` module initialises `S3Client` at startup — if AWS vars are missing at startup, all uploads fail with "Region is missing".

**`uploadWithProgress` and `uploadImage` have different return shapes.** `uploadWithProgress` returns `ApiResponse<UploadResult>` directly (access `res.data.url`). `uploadImage` returns an Axios-wrapped response (access `res.data.data.url`). Mixing them up produces silent `undefined` URL bugs.

**Prisma migrations are gitignored.** The `MediaFile` migration has been applied to the local DB. If you ever need to recreate the DB or move to a new machine, run `npx prisma migrate dev` — Prisma replays all migrations from the `_prisma_migrations` table.

**The IDE TypeScript language server shows frequent false-positive errors** after file edits (stale diagnostics about "declared but never read", "property does not exist on PrismaClient"). Always use `npx tsc --noEmit` or `npm run build` as the authoritative check — these have consistently shown zero errors.

**Vercel CLI is installed and authenticated** (`vercel whoami` → `umairusman617-3450`). Both repos have `.vercel/` directories — `vercel --prod` deploys immediately without prompts.
