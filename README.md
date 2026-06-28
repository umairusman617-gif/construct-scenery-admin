# Construct Scenery — Admin API

Backend API for the Construct Scenery portfolio admin panel. Built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express + TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |
| Validation | Zod |
| Image Uploads | Multer + Cloudinary |

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in all values in `.env`:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Random secret string (min 32 chars) |
| `JWT_EXPIRES_IN` | Token expiry e.g. `7d` |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard |
| `PORT` | Server port (default `4000`) |
| `ALLOWED_ORIGINS` | Comma-separated frontend URLs |
| `ADMIN_EMAIL` | Seed admin email |
| `ADMIN_PASSWORD` | Seed admin password |
| `ADMIN_NAME` | Seed admin display name |

### 3. Generate Prisma client

```bash
npm run db:generate
```

### 4. Run migrations

```bash
npm run db:migrate
```

### 5. Seed the database

Populates the database with the exact content currently hardcoded in the portfolio frontend.

```bash
npm run db:seed
```

### 6. Start development server

```bash
npm run dev
```

Server runs at `http://localhost:4000`

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Run compiled output |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed with portfolio content |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Reset DB and re-seed |

---

## Authentication

All protected routes require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Obtain a token via `POST /api/auth/login`.

---

## Response Format

All responses follow this shape:

```json
{
  "success": true,
  "data": { ... },
  "message": "OK"
}
```

---

## API Endpoints

### Health

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | Public | Server health check |

---

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Login with email + password → returns JWT |
| POST | `/api/auth/verify` | Protected | Verify token and return current user |

**Login body:**
```json
{ "email": "admin@constructscenery.co.uk", "password": "changeme123" }
```

---

### Upload

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/upload` | Protected | Upload image to Cloudinary (multipart/form-data, field: `image`) |

**Response `data`:**
```json
{ "url": "https://res.cloudinary.com/...", "publicId": "construct-scenery/..." }
```

---

### Hero Section (singleton)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/hero` | Public | Get hero section content |
| PUT | `/api/hero` | Protected | Update hero section |

**Body fields:** `eyebrow`, `headline`, `rotatingItems[]`, `bodyText`, `cta1Label`, `cta1Href`, `cta2Label`, `cta2Href`, `videoUrl?`, `videoPoster?`, `trustStats[]`

---

### Logos

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/logos` | Public | List all logos ordered by `order` |
| POST | `/api/logos` | Protected | Create a logo |
| PUT | `/api/logos/reorder` | Protected | Reorder logos — body: `{ ids: [1,3,2,...] }` |
| PUT | `/api/logos/:id` | Protected | Update a logo |
| DELETE | `/api/logos/:id` | Protected | Delete a logo |

---

### About Section (singleton)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/about` | Public | Get about section |
| PUT | `/api/about` | Protected | Update about section |

**Body fields:** `headline`, `bodyText`, `imageUrl`, `imageAlt`, `stats[]`, `pillars[]`

---

### Services

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/services` | Public | List all services ordered by `order` |
| POST | `/api/services` | Protected | Create a service |
| PUT | `/api/services/:id` | Protected | Update a service |
| DELETE | `/api/services/:id` | Protected | Delete a service |

**Body fields:** `title`, `description`, `iconName` (Lucide icon name), `order`, `visible`

---

### Projects

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/projects` | Public | List all portfolio grid projects |
| POST | `/api/projects` | Protected | Create a project |
| PUT | `/api/projects/:id` | Protected | Update a project |
| DELETE | `/api/projects/:id` | Protected | Delete a project |

**Body fields:** `name`, `type`, `services`, `year`, `slug?`, `imageUrl`, `span?`, `order`, `visible`

---

### Process Steps

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/process` | Public | List all process steps ordered by `order` |
| POST | `/api/process` | Protected | Create a process step |
| PUT | `/api/process/:id` | Protected | Update a process step |
| DELETE | `/api/process/:id` | Protected | Delete a process step |

**Body fields:** `number` (e.g. `"01"`), `title`, `description`, `order`

---

### Testimonials

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/testimonials` | Public | List all testimonials |
| POST | `/api/testimonials` | Protected | Create a testimonial |
| PUT | `/api/testimonials/:id` | Protected | Update a testimonial |
| DELETE | `/api/testimonials/:id` | Protected | Delete a testimonial |

**Body fields:** `text`, `name`, `role`, `imageUrl`, `order`, `visible`

---

### Sustainability Section (singleton + items)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/sustainability` | Public | Get section with all items |
| PUT | `/api/sustainability` | Protected | Update section headline/body/image |
| POST | `/api/sustainability/items` | Protected | Add a sustainability item |
| PUT | `/api/sustainability/items/:id` | Protected | Update a sustainability item |
| DELETE | `/api/sustainability/items/:id` | Protected | Delete a sustainability item |

---

### Contact / CTA Section (singleton)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/contact` | Public | Get contact section |
| PUT | `/api/contact` | Protected | Update contact section |

**Body fields:** `headline`, `bodyText`, `cta1Label`, `cta1Email`, `cta2Label`, `cta2Email`

---

### Footer (singleton)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/footer` | Public | Get footer content |
| PUT | `/api/footer` | Protected | Update footer |

**Body fields:** `brandName`, `tagline`, `columns[]`, `instagram?`, `linkedin?`, `vimeo?`

---

### Worlds / Case Studies

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/worlds` | Public | List all worlds with full relations |
| GET | `/api/worlds/:slug` | Public | Get a single world by slug |
| POST | `/api/worlds` | Protected | Create a world with all relations |
| PUT | `/api/worlds/:slug` | Protected | Update a world (replaces relations if provided) |
| DELETE | `/api/worlds/:slug` | Protected | Delete a world and all relations |

**Body fields:** `slug`, `title`, `summary`, `role`, `year`, `tags[]`, `category`, `heroImage`, `vimeoId`, `intro`, `gallery[]`, `facts[]`, `credits[]`, `process[]`, `results[]`, `order`, `visible`

---

## Database Models

| Model | Type | Notes |
|---|---|---|
| `User` | Auth | Admin accounts |
| `HeroSection` | Singleton | Full-screen hero content |
| `Logo` | List | Client logo marquee |
| `AboutSection` | Singleton | Studio about section |
| `Service` | List | 6 service disciplines |
| `Project` | List | Portfolio grid (8 projects) |
| `ProcessStep` | List | 5-step process timeline |
| `Testimonial` | List | 9 industry testimonials |
| `SustainabilitySection` | Singleton | Has many `SustainabilityItem` |
| `SustainabilityItem` | List | 4 sustainability pillars |
| `ContactSection` | Singleton | CTA / contact info |
| `FooterSection` | Singleton | Footer columns + socials |
| `World` | List | Full case studies |
| `WorldImage` | Relation | Gallery images per world |
| `WorldFact` | Relation | Stats per world |
| `WorldCredit` | Relation | Film credits per world |
| `WorldProcess` | Relation | Process steps per world |
| `WorldResult` | Relation | Result metrics per world |
