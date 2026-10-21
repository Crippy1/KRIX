#!/usr/bin/env bash
# Herems_Plus Hub — installer (Linux/macOS)
set -e
cd "$(dirname "$0")"
echo "🚀 Installing Herems_Plus Hub…"
command -v node >/dev/null 2>&1 || { echo "❌ Node.js not found. Install Node 20+ from https://nodejs.org and try again."; exit 1; }
MAJOR=$(node -p "process.versions.node.split('.')[0]")
[ "$MAJOR" -ge 20 ] || { echo "❌ Node $MAJOR found — version 20 or newer is required."; exit 1; }
echo "✓ Node $(node -v) / npm $(npm -v)"
if [ ! -f .env ]; then cp .env.example .env; echo "📝 Created .env from .env.example — edit it to set your admin email/password & secrets."; fi
mkdir -p data uploads
echo "📦 Installing dependencies (one-time download)…"
npm ci --no-audit --no-fund 2>/dev/null || npm install --no-audit --no-fund
echo "🗄️  Preparing the SQLite database…"
npm run migrate
echo ""
echo "✅ Installation complete!  Start the server with:  ./start.sh"
echo "   Then open http://localhost:3000"
