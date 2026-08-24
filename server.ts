import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './src/api/routes.js';

const app = express();
const PORT = Number(process.env.API_PORT) || 3001;

// ── Middleware ────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'] }));
app.use(express.json());

// Log setiap request
app.use((req, _res, next) => {
  console.log(`[${new Date().toLocaleTimeString('id-ID')}] ${req.method} ${req.url}`);
  next();
});

// ── Routes ────────────────────────────────────────────────
app.use('/api', router);

// ── Fallback 404 ─────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan.' });
});

// ── Start ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Backend SKM Sijenggung berjalan di http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
