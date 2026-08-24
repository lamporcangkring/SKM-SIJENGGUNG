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

// ── CRUD RESPONSES ────────────────────────────────────────

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
