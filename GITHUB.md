# 🐙 Using Herems_Plus Hub with GitHub

## The short answer

- ✅ **GitHub repo** — store/backup/version your code. Great idea.
- ❌ **GitHub Pages alone cannot run this server** — Pages only serves static
  HTML/CSS/JS. It cannot run Node.js/Express, the SQLite database, logins,
  file uploads or real-time sync. (You *could* put only the `public/` pages
  on Pages as a static showcase, but nothing would save or sync.)
- ✅ **GitHub + an app host = full cross-device sync.** Connect your GitHub
  repo to Render / Railway / Fly.io, or `git clone` it onto a VPS. The host
  runs the server 24/7; every phone/tablet/laptop then syncs through it.
- ⚠️ **GitHub Codespaces** can run it temporarily for testing, but it times
  out — not a production server.

## 🔐 Safety first — what must NEVER go to GitHub

Already handled for you: `.gitignore` excludes all of these, and this
"GitHub-ready" package was exported from git itself, so they are absent:

- `.env` — your admin password + JWT secrets
- `data/hub.sqlite*`, `data/db.json.bak` — your live database (password hashes, user data)
- `uploads/*` (your uploaded files), `node_modules/`

If a password/secret ever *does* get pushed by accident: change it
immediately (`.env` + reseed or profile change) — deleting the file later
does not remove it from git history.

## Step 1 — Create the repo on github.com

1. Log in (or sign up) at **github.com** → **New repository**
2. Name: `herems-plus-hub` · Visibility: **Private** (recommended)
3. **Do NOT** tick "Add a README / .gitignore / license" — this project has them
4. Create repository

## Step 2 — Push this code up

**Easy way (no terminal):** install **GitHub Desktop**, then
*File → Add local repository* → choose the extracted `herems-plus-hub`
folder → *Publish repository*.

**Terminal way** (Git from git-scm.com), inside the extracted folder:

```bash
git init -b main
git add .
git status        # CHECK: no .env, no hub.sqlite in the list!
git commit -m "Herems_Plus Hub v1.2.0 — SQLite + cross-device sync"
git remote add origin https://github.com/YOUR-USERNAME/herems-plus-hub.git
git push -u origin main
```

Every future push automatically runs the test suite
(`.github/workflows/ci.yml` → see the repo's **Actions** tab).

## Step 3 — Deploy it so devices can sync (pick one)

**Option A — Cloud host connected to GitHub (easiest for anywhere-sync)**
1. Render / Railway / Fly.io → *New service → Deploy from GitHub* → pick
   `herems-plus-hub` (they detect the included `Dockerfile`).
2. Add a **persistent disk/volume** mounted at `/app/data` (this is what
   keeps your SQLite database between restarts). Without it, free tiers
   may wipe data on redeploy.
3. In the host's *Environment* settings, set: `NODE_ENV=production`,
   `JWT_SECRET`, `JWT_REFRESH_SECRET` (long random strings),
   `ADMIN_EMAIL`, `ADMIN_PASSWORD`. **Never** commit these to GitHub.
4. You get an HTTPS URL like `https://herems-plus-hub.onrender.com` —
   open it on every device, log in, done. Pushes to GitHub redeploy.

**Option B — Your own VPS/computer (full control, can be cheapest)**
```bash
git clone https://github.com/YOUR-USERNAME/herems-plus-hub.git
cd herems-plus-hub
cp .env.example .env     # then edit .env (admin email/password, secrets)
docker compose up -d --build
```
Update later with: `git pull && docker compose up -d --build`
(Database + uploads persist in Docker volumes — see `docker-compose.yml`.)

**Option C — Home Wi-Fi only (no cloud at all)**
Run it on a PC at home (`install.bat`/`install.sh`, then start), and on
other devices open `http://<that-PC's-LAN-IP>:3000`. GitHub is then just
your code backup — sync happens over your Wi-Fi.

## First run on any new server

No database file in the repo is *correct*: on first start the server
creates `data/hub.sqlite` and seeds your admin account from the
`ADMIN_EMAIL` / `ADMIN_PASSWORD` environment values. Delete the seeded
`demo@example.com` account from the Admin Panel before going public.

## Backups (not GitHub!)

GitHub backs up **code**, not data. Back up these three from your server
privately and regularly: `data/hub.sqlite`, the `uploads/` folder, `.env`.
