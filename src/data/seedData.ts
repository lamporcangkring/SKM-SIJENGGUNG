import { SurveyResponse } from '../context/SurveyContext';

/**
 * Seed data 215 responden — Warga Desa Sijenggung
 * Periode  : 10 – 22 Agustus 2026
 * Target   : IKM ≈ 85 (Sangat Baik / B), SPAK ≈ 3.20
 * Distribusi skor dibuat realistis: campuran 2, 3, 4 per indikator
 * ────────────────────────────────────────────────────────────────
 * Rumus IKM (PermenPAN-RB 14/2017):
 *   IKM = (Σ NRR_tertimbang) × 25   di mana NRR_tertimbang = avg_unsur × (1/9)
 *   Target avg_per_unsur ≈ 3.40  →  IKM = 3.40 × 25 = 85.00
 *
 * Distribusi tiap unsur SKM (p4 | p3 | p2):
 *   U1 Persyaratan    : 45% | 55% |  0%  → avg 3.45
 *   U2 Prosedur       : 45% | 55% |  0%  → avg 3.45
 *   U3 Waktu          : 30% | 70% |  0%  → avg 3.30
 *   U4 Kesesuaian     : 50% | 50% |  0%  → avg 3.50
 *   U5 Biaya (Gratis) : 75% | 25% |  0%  → avg 3.75
 *   U6 Sarana         : 20% | 70% | 10%  → avg 3.10
 *   U7 Perilaku       : 45% | 55% |  0%  → avg 3.45
 *   U8 Kompetensi     : 40% | 60% |  0%  → avg 3.40
 *   U9 Pengaduan      : 20% | 70% | 10%  → avg 3.10
 *   ──────────────────────────────────────────────────
 *   Sum = 31.50 / 9 = 3.500... koreksi ke:
 *
 * Koreksi akhir untuk IKM = 85:
 *   avg = 85/25 = 3.40
 *   Rekalkulasi:
 *   U1:3.45 U2:3.45 U3:3.30 U4:3.50 U5:3.75 U6:3.10 U7:3.45 U8:3.40 U9:3.10
 *   Sum=30.50 / 9 = 3.389 × 25 = 84.7 ✓ (≈85)
 *
 * Distribusi tiap indikator SPAK (p4 | p3 | p2):
 *   P1 : 25% | 75% |  0%  → avg 3.25
 *   P2 : 15% | 75% | 10%  → avg 3.05
 *   P3 : 20% | 80% |  0%  → avg 3.20
 *   P4 : 30% | 70% |  0%  → avg 3.30
 *   P5 : 15% | 70% | 15%  → avg 3.00
 *   P6 : 25% | 75% |  0%  → avg 3.25
 *   P7 : 20% | 80% |  0%  → avg 3.20
 *   Avg = (3.25+3.05+3.20+3.30+3.00+3.25+3.20)/7 = 22.25/7 = 3.179 ≈ 3.20 ✓
 */

// ── Komentar realistis (positif & saran) ──────────────────────────
const COMMENTS_POOL = [
  // Positif
  'Pelayanan sudah cukup baik, petugas ramah dan membantu.',
  'Pengurusan surat keterangan domisili selesai dengan cepat. Terima kasih.',
  'Tidak ada biaya sama sekali, gratis dan transparan.',
  'Petugas loket bersikap ramah, urusan KTP dan KK lancar.',
  'Pelayanan di desa Sijenggung sudah jauh lebih baik dari dulu.',
  'Informasi syarat-syarat disampaikan dengan jelas oleh perangkat desa.',
  'Proses surat pengantar akta kelahiran cepat dan tidak berbelit.',
  'Ruang tunggu bersih, nyaman untuk warga yang antri.',
  // Saran / kritik membangun
  'Mohon waktu tunggu di loket bisa lebih cepat lagi, kadang antriannya panjang.',
  'Sarana pendukung seperti komputer dan printer perlu ditambah agar lebih optimal.',
  'Alangkah baiknya ada nomor antrian agar lebih tertib.',
  'Kadang informasi persyaratan tidak konsisten antara satu petugas dengan lainnya.',
  'Semoga ada layanan online untuk pengajuan dokumen agar warga tidak perlu jauh-jauh ke kantor.',
  'Penanganan pengaduan harap lebih cepat direspons, kadang butuh waktu lama.',
  'Perlu ada papan informasi yang jelas tentang alur dan waktu pelayanan.',
  'Jam pelayanan agar konsisten, kadang petugas belum ada padahal sudah jam buka.',
  // Campuran
  'Petugas sudah cukup ramah meski kadang terlihat sibuk.',
  'Secara umum sudah baik, terus ditingkatkan.',
  'Pelayanan surat keterangan usaha bagus, hanya saja agak lama karena antrean.',
  'Harap ada kemudahan akses bagi warga lansia dan penyandang disabilitas.',
];

// ── Distribusi harian: 255 responden tersebar 30 Juni – 19 Agustus 2026 ──
// 51 Hari (36 hari kerja efektif, libur weekend & 17 Agustus)

const DAILY_SCHEDULE = [
  8,8,8,7,0,0,7,7,7,7,7,0,0,7,7,7,7,7,0,0,7,7,7,7,7,0,0,7,7,7,7,7,0,0,7,7,7,7,7,0,0,7,7,7,7,7,0,0,0,7,7
];
// Verifikasi total: 255 ✅


// ── Pseudo-random helper ─────────────────────────────────────────
// Deterministic, different per (respondent, question)
function h(i: number, j: number): number {
  return ((Math.abs(Math.sin(i * 127.1 + j * 311.7) * 43758.5453)) % 1);
}

// ── Score generator ───────────────────────────────────────────────
// p2: threshold for score 2 (lowest tier), p34: threshold for score 3 vs 4
// if r < p2 → 2, if r < p2+p3 → 3, else → 4
function scoreOf(r: number, p2: number, p3: number): number {
  if (r < p2) return 2;
  if (r < p2 + p3) return 3;
  return 4;
}

// ── SKM distributions [p2, p3] (p4 = 1 - p2 - p3) ───────────────
const SKM_DIST: Record<string, [number, number]> = {
  U1: [0.00, 0.55], // avg 3.45
  U2: [0.00, 0.55], // avg 3.45
  U3: [0.00, 0.70], // avg 3.30
  U4: [0.00, 0.50], // avg 3.50
  U5: [0.00, 0.25], // avg 3.75
  U6: [0.10, 0.70], // avg 3.10
  U7: [0.00, 0.55], // avg 3.45
  U8: [0.00, 0.60], // avg 3.40
  U9: [0.10, 0.70], // avg 3.10
};

// ── SPAK distributions [p2, p3] ──────────────────────────────────
const SPAK_DIST: Record<string, [number, number]> = {
  P1: [0.00, 0.75], // avg 3.25
  P2: [0.10, 0.75], // avg 3.05
  P3: [0.00, 0.80], // avg 3.20
  P4: [0.00, 0.70], // avg 3.30
  P5: [0.15, 0.70], // avg 3.00
  P6: [0.00, 0.75], // avg 3.25
  P7: [0.00, 0.80], // avg 3.20
};

// ── Implementasi distributions [p2, p3] ──────────────────────────
const IMPL_DIST: Record<string, [number, number]> = {
  I1: [0.05, 0.55], // avg 3.35
  I2: [0.10, 0.65], // avg 3.15
  I3: [0.05, 0.70], // avg 3.20
};

// ── Demografi Helpers ──
function getGender(rng: () => number) {
  return rng() < 0.65 ? 'Perempuan' : 'Laki-Laki';
}

function getUsia(rng: () => number) {
  const r = rng();
  if (r < 0.3) return '18-25';
  if (r < 0.65) return '26-35';
  if (r < 0.9) return '36-45';
  return '>45';
}

function getPendidikan(rng: () => number) {
  const r = rng();
  if (r < 0.4) return 'SMA';
  if (r < 0.7) return 'S1';
  if (r < 0.9) return 'SMP';
  return 'D1-D3-D4';
}

function getPekerjaan(rng: () => number) {
  const r = rng();
  if (r < 0.4) return 'Wiraswasta';
  if (r < 0.7) return 'Karyawan Swasta';
  if (r < 0.85) return 'PNS';
  return 'Lainnya';
}

// ── Target Skor (menyesuaikan Excel: IKM ~83.02 (3.32), SPAK ~82.5 (3.30)) ──
function getSkmScore(index: number, rng: () => number) {
  const r = rng();
  if (index === 5 || index === 8) {
    if (r < 0.15) return 2;
    if (r < 0.75) return 3;
    return 4;
  }
  return r < 0.32 ? 4 : 3;
}

function getSpakScore(index: number, rng: () => number) {
  const r = rng();
  if (index === 1 || index === 4) {
    if (r < 0.15) return 2;
    if (r < 0.75) return 3;
    return 4;
  }
  return r < 0.35 ? 4 : 3;
}

function weightedChoice<T>(items: T[], weights: number[], r: number): T {
  let cum = 0;
  for (let i = 0; i < items.length; i++) {
    cum += weights[i];
    if (r <= cum) return items[i];
  }
  return items[items.length - 1];
}

// ── Timestamp builder ─────────────────────────────────────────────
// Returns ISO string (UTC) for given day offset (0=Jun30) and fraction within work hours
function buildTimestamp(dayOffset: number, indexInDay: number, totalInDay: number, noise: number): string {
  const baseDate = new Date('2026-06-30T00:00:00Z'); // UTC midnight Jun 30
  // WIB = UTC+7, work hours 08:00–15:00 WIB = 01:00–08:00 UTC
  const workStartUTC = 1 * 3600; // 01:00 UTC = 08:00 WIB
  const workDurationSec = 7 * 3600; // 7 jam
  const daySec = dayOffset * 86400;
  const fracWithinDay = (indexInDay + noise) / totalInDay;
  const offsetSec = daySec + workStartUTC + Math.round(fracWithinDay * workDurationSec);
  const ts = new Date(baseDate.getTime() + offsetSec * 1000);
  return ts.toISOString().slice(0, 19).replace('T', ' ');
}

// ── Main generator ────────────────────────────────────────────────
function generate215Responses(): SurveyResponse[] {
  const responses: SurveyResponse[] = [];
  let globalIdx = 0;

  for (let dayOff = 0; dayOff < DAILY_SCHEDULE.length; dayOff++) {
    const countToday = DAILY_SCHEDULE[dayOff];
    for (let di = 0; di < countToday; di++) {
      const i = globalIdx;

      // Pseudo-random seeds
      const rDemog1 = h(i, 10);
      const rDemog2 = h(i, 11);
      const rDemog3 = h(i, 12);
      const rDemog4 = h(i, 13);
      const rComment = h(i, 14);
      const rNoise   = h(i, 15);

      // Demografi
      const jenisKelamin = getGender(() => h(i, 16));
      const usia         = getUsia(() => h(i, 17));
      const pendidikan   = getPendidikan(() => h(i, 18));
      const pekerjaan    = getPekerjaan(() => h(i, 19));
      const jenisLayanan = weightedChoice(['Administrasi Umum', 'Kependudukan', 'Perizinan', 'Pertanahan', 'Kesejahteraan Sosial'], [0.35, 0.28, 0.15, 0.10, 0.12], rDemog4);

      // SKM scores
      const skm: Record<string, number> = {};
      for (let k = 0; k < 9; k++) {
        skm[`U${k+1}`] = getSkmScore(k, () => h(i, 20 + k));
      }

      // SPAK scores
      const perilaku: Record<string, number> = {};
      for (let k = 0; k < 7; k++) {
        perilaku[`P${k+1}`] = getSpakScore(k, () => h(i, 30 + k));
      }

      // Implementasi scores
      const implementasi: Record<string, number> = {};
      Object.entries(IMPL_DIST).forEach(([key, [p2, p3]], kIdx) => {
        const r = h(i, 40 + kIdx);
        implementasi[key] = scoreOf(r, p2, p3);
      });

      // Kepuasan keseluruhan
      const rKep = h(i, 50);
      const kepuasan: Record<string, number> = {
        PS1: scoreOf(rKep, 0.05, 0.75),
      };

      // Komentar: ~40% responden mengisi komentar
      let komentar: string | undefined = undefined;
      if (rComment < 0.40) {
        const cIdx = Math.floor(rComment * COMMENTS_POOL.length * 2.5) % COMMENTS_POOL.length;
        komentar = COMMENTS_POOL[cIdx];
      }

      // Timestamp
      const tsStr = buildTimestamp(dayOff, di, countToday, rNoise * 0.8);
      const timestamp = new Date(tsStr.replace(' ', 'T') + 'Z');

      responses.push({
        id: String(i + 1),
        demografi: { jenisKelamin, usia, pendidikan, pekerjaan, jenisLayanan },
        skm,
        perilaku,
        implementasi,
        kepuasan,
        komentar,
        timestamp,
      });

      globalIdx++;
    }
  }

  return responses;
}

export const INITIAL_RESPONSES: SurveyResponse[] = generate215Responses();
