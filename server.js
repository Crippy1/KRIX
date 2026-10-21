'use strict';
/**
 * Herems_Plus Hub — Comprehensive Full-Stack Server
 * HTML frontend (public/) + REST API (/api) + real-time SSE + auth + CRUD +
 * caching + rate limiting + security headers + uploads + metrics + tests.
 * Run: npm install && npm start   →   http://localhost:3000
 */
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const config = require('./src/config');
const db = require('./src/db');
const { requestLogger, rateLimit, notFoundApi, errorHandler } = require('./src/middleware');

db.seed(); // creates data/hub.sqlite with admin + demo data on first run

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

/* security + performance */
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: config.corsOrigin === '*' ? true : config.corsOrigin.split(','), credentials: true }));
app.use(compression({
  filter: (req, res) => (req.path === '/api/events' ? false : compression.filter(req, res)),
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(requestLogger);

/* frontend — mostly HTML, served from public/ */
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1h', etag: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), { maxAge: '1d' }));

/* Catchy, memorable page URLs — the frontend keeps these paths in the
   address bar (e.g. heremsplushub.com/shop) and smooth-scrolls to the
   matching experience. The SPA fallback below also covers trailing slashes. */
const CATCHY_ROUTES = [
  '/hub', '/dashboard', '/shop', '/store', '/marketplace',
  '/stories', '/blog', '/posts', '/my-tasks', '/tasks', '/flow',
  '/live', '/activity', '/contact-us', '/contact',
  '/join', '/login', '/register', '/upload', '/admin',
];
app.get(CATCHY_ROUTES, (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get(['/developers', '/docs', '/api-docs'], (_req, res) => res.sendFile(path.join(__dirname, 'public', 'docs.html')));

/* api */
app.use('/api', rateLimit({ windowMs: 60_000, max: 300 }));
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/products', require('./src/routes/products'));
app.use('/api/posts', require('./src/routes/posts'));
app.use('/api/tasks', require('./src/routes/tasks'));
app.use('/api', require('./src/routes/system'));
app.use('/api', notFoundApi);

/* SPA fallback — any other GET serves the app shell */
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return notFoundApi(req, res);
  return res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use(errorHandler);

if (require.main === module) {
  const server = app.listen(config.port, config.host, () => {
    console.log(`\n🚀 Herems_Plus Hub running`);
    console.log(`   Website : http://localhost:${config.port}`);
    console.log(`   API     : http://localhost:${config.port}/api/health`);
    console.log(`   Catchy  : /shop  /stories  /my-tasks  /live  /join`);
    console.log(`   Docs    : http://localhost:${config.port}/developers`);
    console.log(`   Admin   : ${config.adminEmail} (password in .env)`);
    console.log(`   Database: SQLite (${require('./src/db').info().sqliteVersion}) at data/hub.sqlite`);
    console.log(`   Demo    : demo@example.com / Demo123!\n`);
  });
  const shutdown = (sig) => { console.log(`\n${sig} — shutting down gracefully…`); server.close(() => process.exit(0)); setTimeout(() => process.exit(1), 5000).unref(); };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

module.exports = app;
