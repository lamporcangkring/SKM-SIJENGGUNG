import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Pastikan folder data/ ada
const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const DB_PATH = process.env.DB_PATH || path.join(dataDir, 'skm.db');
const db = new Database(DB_PATH);

// Aktifkan WAL mode supaya performa lebih baik
db.pragma('journal_mode = WAL');

// Buat tabel jika belum ada
db.exec(`
  CREATE TABLE IF NOT EXISTS responses (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    jenis_kelamin TEXT,
    usia          TEXT,
    pendidikan    TEXT,
    pekerjaan     TEXT,
    jenis_layanan TEXT,
    skm           TEXT NOT NULL,
    perilaku      TEXT NOT NULL,
    implementasi  TEXT NOT NULL,
    kepuasan      TEXT NOT NULL,
    komentar      TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    username  TEXT UNIQUE NOT NULL,
    password  TEXT NOT NULL,
    name      TEXT NOT NULL,
    role      TEXT DEFAULT 'admin'
  );
`);

// Insert default admin jika belum ada
const adminExists = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
if (!adminExists) {
  db.prepare(`
    INSERT INTO users (username, password, name, role)
    VALUES ('admin', 'admin123', 'Administrator Desa Sijenggung', 'admin')
  `).run();
  console.log('[DB] Akun admin default dibuat (username: admin, password: admin123)');
}

console.log(`[DB] SQLite terhubung: ${DB_PATH}`);

import { INITIAL_RESPONSES } from '../data/seedData.js';

// Auto Seed 215 Responden jika database masih kosong/kurang dari 215
const currentCount = (db.prepare('SELECT COUNT(*) as count FROM responses').get() as any).count;
if (currentCount < 215) {
  console.log(`[DB] Mengisi database dengan ${INITIAL_RESPONSES.length} data responden Desa Sijenggung (10 – 22 Agustus 2026)...`);
  
  // Clear existing jika ada data sedikit
  db.exec('DELETE FROM responses;');
  
  const insertStmt = db.prepare(`
    INSERT INTO responses
      (id, created_at, jenis_kelamin, usia, pendidikan, pekerjaan, jenis_layanan,
       skm, perilaku, implementasi, kepuasan, komentar)
    VALUES
      (@id, @created_at, @jenis_kelamin, @usia, @pendidikan, @pekerjaan, @jenis_layanan,
       @skm, @perilaku, @implementasi, @kepuasan, @komentar)
  `);

  const insertMany = db.transaction((items: typeof INITIAL_RESPONSES) => {
    for (const item of items) {
      // Format datetime string YYYY-MM-DD HH:MM:SS
      const isoStr = item.timestamp.toISOString().slice(0, 19).replace('T', ' ');
      insertStmt.run({
        id: Number(item.id),
        created_at: isoStr,
        jenis_kelamin: item.demografi.jenisKelamin,
        usia:          item.demografi.usia,
        pendidikan:    item.demografi.pendidikan,
        pekerjaan:     item.demografi.pekerjaan,
        jenis_layanan: item.demografi.jenisLayanan,
        skm:          JSON.stringify(item.skm),
        perilaku:     JSON.stringify(item.perilaku),
        implementasi: JSON.stringify(item.implementasi),
        kepuasan:     JSON.stringify(item.kepuasan),
        komentar:     item.komentar ?? null,
      });
    }
  });

  insertMany(INITIAL_RESPONSES);
  console.log(`[DB] Berhasil menginjeksi ${INITIAL_RESPONSES.length} responden ke SQLite!`);
}

export function getAllResponses() {
  const rows = db.prepare('SELECT * FROM responses ORDER BY created_at DESC').all() as any[];
  return rows.map(row => ({
    id: String(row.id),
    timestamp: new Date(row.created_at),
    demografi: {
      jenisKelamin: row.jenis_kelamin,
      usia: row.usia,
      pendidikan: row.pendidikan,
      pekerjaan: row.pekerjaan,
      jenisLayanan: row.jenis_layanan,
    },
    skm:         JSON.parse(row.skm),
    perilaku:    JSON.parse(row.perilaku),
    implementasi:JSON.parse(row.implementasi),
    kepuasan:    JSON.parse(row.kepuasan),
    komentar:    row.komentar ?? undefined,
  }));
}

export function insertResponse(data: {
  demografi: { jenisKelamin: string; usia: string; pendidikan: string; pekerjaan: string; jenisLayanan: string };
  skm: Record<string, number>;
  perilaku: Record<string, number>;
  implementasi: Record<string, number>;
  kepuasan: Record<string, number>;
  komentar?: string;
}) {
  const stmt = db.prepare(`
    INSERT INTO responses
      (jenis_kelamin, usia, pendidikan, pekerjaan, jenis_layanan,
       skm, perilaku, implementasi, kepuasan, komentar)
    VALUES
      (@jenis_kelamin, @usia, @pendidikan, @pekerjaan, @jenis_layanan,
       @skm, @perilaku, @implementasi, @kepuasan, @komentar)
  `);

  const info = stmt.run({
    jenis_kelamin: data.demografi.jenisKelamin,
    usia:          data.demografi.usia,
    pendidikan:    data.demografi.pendidikan,
    pekerjaan:     data.demografi.pekerjaan,
    jenis_layanan: data.demografi.jenisLayanan,
    skm:          JSON.stringify(data.skm),
    perilaku:     JSON.stringify(data.perilaku),
    implementasi: JSON.stringify(data.implementasi),
    kepuasan:     JSON.stringify(data.kepuasan),
    komentar:     data.komentar ?? null,
  });

  return { id: String(info.lastInsertRowid) };
}

export function deleteResponseById(id: number) {
  const result = db.prepare('DELETE FROM responses WHERE id = ?').run(id);
  return result.changes > 0;
}

export function getStats() {
  const total = (db.prepare('SELECT COUNT(*) as count FROM responses').get() as any).count;
  return { total };
}

// ── AUTH USERS ────────────────────────────────────────────

export function authenticateUser(username: string, password: string) {
  const user = db.prepare('SELECT id, username, name, role FROM users WHERE username = ? AND password = ?').get(username, password) as any;
  return user || null;
}

export default db;
