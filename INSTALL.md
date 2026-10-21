# 📦 Installing Herems_Plus Hub (v1.2.0 — SQLite edition)

> ⚠️ **This download is PRIVATE** — it contains a `.env` file with the owner's
> admin password and secret keys, plus the live database. Do not share this
> zip publicly. To share a clean copy, first delete `.env` and
> `data/hub.sqlite` (the new owner then sets their own credentials).

## Requirements

- **Node.js 20 or newer** — free from https://nodejs.org (includes npm)
- Internet connection for the first install (downloads dependencies once)
- **Or:** Docker (no Node.js needed) — see Option C

## Option A — Windows (easiest)

1. Extract the zip (right-click → *Extract All*).
2. Open the `herems-plus-hub` folder and double-click **`install.bat`**.
3. Double-click **`start.bat`**.
4. Open **http://localhost:3000** in your browser.

## Option B — Linux / macOS

```bash
unzip herems-plus-hub-v1.2.0-catchy-ui.zip
cd herems-plus-hub
./install.sh
./start.sh
```
Then open **http://localhost:3000**.

## Option C — Docker

```bash
cd herems-plus-hub
docker compose up --build
```
Open **http://localhost:3000**. Database & uploads persist in `./data` and `./uploads`.

## Option D — Manual (any OS)

```bash
cd herems-plus-hub
npm ci            # or: npm install
npm run migrate   # creates/imports the SQLite database (data/hub.sqlite)
npm start
```

## Logging in

- **Admin:** `heremsplus@gmail.com` — password is the value of
  `ADMIN_PASSWORD` in your private `.env` file.
- **Demo user:** `demo@example.com` / `Demo123!` (delete it from the Admin
  Panel before using the site publicly).

## Useful commands

| Command | What it does |
|---|---|
| `npm start` | Start the server (http://localhost:3000) |
| `npm run dev` | Start with auto-restart on file changes |
| `npm test` | Run the automated test suite (12 tests) |
| `npm run migrate` | Import a legacy `data/db.json` into SQLite (one-time, safe to repeat) |
| `npm run seed` | ⚠️ **Erase and reseed** the database with demo data |

## Your data — where it lives & backups

- **Database:** single file `data/hub.sqlite` (SQLite, WAL mode).
  *Backup:* stop the server and copy that one file.
- **Uploaded images:** `uploads/` folder.
- **Secrets & admin credentials:** `.env` file — back it up privately.
- The original pre-migration JSON database is kept as `data/db.json.bak`.

## Configuration

Edit `.env`: `PORT`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (applied on seed),
`JWT_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGIN`, optional `DB_PATH`
(custom location for the SQLite file). Restart the server after changes.
To change the admin password on a running site, log in as admin and use
`PUT /api/auth/me`, or edit `.env` and run `npm run seed` (erases data).

## Troubleshooting

- **"Port 3000 already in use"** → change `PORT` in `.env` (e.g. 3001).
- **"node is not recognized"** → install Node.js 20+ and reopen the terminal.
- **Install errors around better-sqlite3** → it normally uses a prebuilt
  binary; if your platform lacks one it compiles from source, which needs
  Python 3 + a C++ compiler (Windows: `npm i -g windows-build-tools` is
  obsolete — install *Visual Studio Build Tools* with "Desktop C++";
  macOS: `xcode-select --install`; Debian/Ubuntu: `sudo apt install python3 make g++`).
- **Start completely fresh** → stop the server, delete `data/hub.sqlite*`,
  run `npm run seed`, then `npm start`.
- **Deploying to the internet** → put it behind HTTPS (Caddy/Nginx or a
  host like Render/Railway/Fly.io/VPS + Docker), set `NODE_ENV=production`,
  strong secrets in `.env`, and delete the demo account.
