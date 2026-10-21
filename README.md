# 🚀 Herems_Plus Hub

A **production-ready, full-stack server** — mostly-HTML frontend + REST API in one project.
Built with Node.js + Express. Everything included: auth, database, real-time updates,
caching, rate limiting, file uploads, admin panel, tests, and Docker.

**v1.2.0 — Catchy UI Edition:** bold Ghana-inspired redesign, animated hero, premium product cards, mobile navigation and memorable URLs (`/shop`, `/stories`, `/my-tasks`, `/live`, `/join`), on top of **SQLite** + full cross-device real-time sync — (`data/hub.sqlite`, WAL mode, indexes,
transactions) for much larger scale — see [INSTALL.md](INSTALL.md) for the
installation package & one-click install scripts (`install.bat` / `install.sh`).

## Quick start

```bash
npm install
npm start          # → http://localhost:3000
npm run dev        # auto-restart on file changes (node --watch)
npm test           # run the test suite (node:test)
npm run seed       # reset + reseed the database
npm run migrate    # one-time import of a legacy data/db.json into SQLite
```

**Seed accounts** (change in production!)

| Role  | Email              | Password   |
|-------|--------------------|------------|
| Admin | heremsplus@gmail.com | *(set in `.env`)* |
| Demo  | demo@example.com   | Demo123!   |

**Docker:** `docker compose up --build` → http://localhost:3000

## What's included

| Area | Features |
|---|---|
| **Frontend (mostly HTML)** | `public/index.html` + `docs.html`, vanilla CSS/JS — products shop, blog, private task board, contact form, image upload, admin panel, live activity feed, API tester, dark responsive UI |
| **Auth & security** | Register/login/logout, JWT access (15 min) + refresh tokens (7 d, revocable, httpOnly cookie), bcrypt hashing, role-based access (user/admin), Helmet headers, CORS, input sanitization, body-size limits |
| **API** | CRUD for Products, Posts, Tasks; Users (admin); Contact messages; search `?q=`, filter, sort `?sort=-price`, pagination `?page=&limit=` on every list; ownership rules |
| **Real-time cross-device sync** | Server-Sent Events at `/api/events` — when any device creates/edits/deletes a product, post or task, every other signed-in device updates instantly (each device refetches only its own private tasks). One central SQLite DB = one source of truth for phone, tablet & desktop |
| **Performance** | gzip compression, in-memory GET cache (30 s TTL, `X-Cache` header, auto-invalidated on writes), static-file caching/ETags |
| **Database** | **SQLite 3** via better-sqlite3 — single file `data/hub.sqlite`, WAL journal for concurrent reads, 7 tables + indexes (email unique, category, owner, status, token), prepared statements, transactions, `SELECT COUNT(*)` stats; handles millions of rows. Legacy `data/db.json` auto-imports on first start (kept as `db.json.bak`) |
| **Reliability** | Rate limiting (300/min global, 20/min auth), central error handler, request logging, `/api/health`, `/api/metrics` (incl. live SQLite info), graceful shutdown |
| **Files** | Image upload (multer, 5 MB, png/jpg/gif/webp) served from `/uploads` |
| **Docs & tests** | `/docs.html` human docs, `/api/openapi.json` OpenAPI 3 spec, 11 automated tests in `tests/` |
| **Deploy** | Dockerfile (non-root, healthcheck), docker-compose with persistent volumes, `.env` config |

## Project structure

```
server.js              ← entry point: middleware, static HTML, API mounting
src/
  config.js            ← all environment config (.env)
  db.js                ← SQLite database (schema, indexes, seed, legacy-JSON auto-import)
  db.legacy-json.js    ← previous JSON engine (kept for reference, not used)
  utils.js             ← JWT, hashing, validation, pagination/search helpers
  middleware.js        ← auth, roles, rate limit, cache, logger, metrics, errors
  events.js            ← Server-Sent Events (real-time)
  routes/
    auth.js            ← register/login/refresh/logout/me
    products.js        ← product CRUD (GH₵ catalogue)
    posts.js           ← blog CRUD
    tasks.js           ← private per-user tasks
    system.js          ← health, metrics, users, messages, upload, OpenAPI
public/
  index.html           ← the web app (mostly HTML)
  docs.html            ← API documentation page
  css/styles.css       ← all styling
  js/app.js            ← frontend logic (vanilla JS + fetch)
data/hub.sqlite        ← SQLite database (auto-created/seeded on first run)
data/db.json.bak       ← legacy JSON database from before the migration (backup)
scripts/migrate-to-sqlite.js ← `npm run migrate`
INSTALL.md · install.sh/.bat · start.sh/.bat ← installation package helpers
uploads/               ← uploaded images
tests/server.test.js   ← automated API tests
Dockerfile · docker-compose.yml · .env.example
```

## Configuration (`.env`)

```bash
cp .env.example .env   # then edit
```
`PORT`, `NODE_ENV`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGIN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, optional `DB_PATH` (custom SQLite file location)

## API at a glance

Full reference: **`/docs.html`** in the browser or `GET /api/openapi.json`.

```
POST   /api/auth/register|login|refresh|logout     GET/PUT /api/auth/me
GET    /api/products?q=&category=&sort=&page=       POST/PUT/DELETE /api/products/:id
GET    /api/posts                                    POST/PUT/DELETE /api/posts/:id
GET    /api/tasks?status=todo      (private)         POST/PUT/DELETE /api/tasks/:id
POST   /api/messages               (contact)         GET  /api/users            (admin)
POST   /api/upload                 (image)           GET  /api/events           (SSE live)
GET    /api/health · /api/stats · /api/metrics · /api/activity · /api/openapi.json
```

## Make it yours

1. **Rebrand** — edit `public/index.html` (title, hero, copy) and colors in `public/css/styles.css` (`:root` variables).
2. **Your data** — change seed products/posts in `src/db.js`, run `npm run seed`.
3. **New resources** — copy `src/routes/posts.js`, rename, mount it in `server.js`.
4. **Scale the DB** — SQLite already handles millions of rows in `data/hub.sqlite` (20k products insert in ~0.25 s). For multi-server deployments, replace `src/db.js` internals with PostgreSQL; routes only call its exported functions.
5. **Production** — set strong `JWT_SECRET`s + admin password in `.env`, run behind HTTPS (e.g. Caddy/Nginx or a platform like Render/Railway/Fly.io), or use the included Docker setup.
