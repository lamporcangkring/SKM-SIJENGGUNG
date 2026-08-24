import { Router, Request, Response } from 'express';
import {
  getAllResponses,
  insertResponse,
  deleteResponseById,
  getStats,
  authenticateUser,
} from './database.js';

const router = Router();

// ── Health Check ──────────────────────────────────────────
router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Auth Endpoints ────────────────────────────────────────
router.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ success: false, message: 'Username dan password wajib diisi.' });
      return;
    }

    const user = authenticateUser(username, password);
    if (!user) {
      res.status(401).json({ success: false, message: 'Username atau password salah.' });
      return;
    }

    // Token sederhana berbasis timestamp & user id
    const token = Buffer.from(JSON.stringify({ id: user.id, username: user.username, time: Date.now() })).toString('base64');

    res.json({
      success: true,
      message: 'Login berhasil.',
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (err: any) {
    console.error('[API] POST /auth/login error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET semua responses ───────────────────────────────────
router.get('/responses', (_req: Request, res: Response) => {
  try {
    const data = getAllResponses();
    res.json({ success: true, data });
  } catch (err: any) {
    console.error('[API] GET /responses error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST tambah response baru ─────────────────────────────
router.post('/responses', (req: Request, res: Response) => {
  try {
    const { demografi, skm, perilaku, implementasi, kepuasan, komentar } = req.body;

    // Validasi minimal
    if (!demografi || !skm || !perilaku || !implementasi || !kepuasan) {
      res.status(400).json({ success: false, message: 'Data tidak lengkap.' });
      return;
    }

    const result = insertResponse({ demografi, skm, perilaku, implementasi, kepuasan, komentar });
    res.status(201).json({ success: true, id: result.id });
  } catch (err: any) {
    console.error('[API] POST /responses error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE hapus satu response ────────────────────────────
router.delete('/responses/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID tidak valid.' });
      return;
    }

    const deleted = deleteResponseById(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Data tidak ditemukan.' });
      return;
    }

    res.json({ success: true, message: 'Data berhasil dihapus.' });
  } catch (err: any) {
    console.error('[API] DELETE /responses/:id error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET statistik ringkasan ───────────────────────────────
router.get('/stats', (_req: Request, res: Response) => {
  try {
    const stats = getStats();
    res.json({ success: true, data: stats });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
