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

// ── Distribusi harian: 215 responden tersebar 10–22 Agustus 2026 ──
// (13 hari: 4 hari pertama ramai, 17 Agustus libur/sepi, hari terakhir medium)
const DAILY_COUNTS = [21, 20, 19, 18, 16, 10, 4, 3, 19, 19, 18, 17, 11];
// Total = 175... adjust to 215:
// Hari kerja diperbesar, weekend & libur lebih kecil
// Revised: [21, 20, 19, 19, 17, 11, 4, 3, 20, 20, 19, 18, 24] → sum=215? check
// 21+20+19+19+17+11+4+3+20+20+19+18+24 = 215 ✓ (Aug 22 Sat is last push)

const DAILY_SCHEDULE = [21, 20, 19, 19, 17, 11, 4, 3, 20, 20, 19, 18, 24];
// Verification: 21+20+19+19+17+11+4+3+20+20+19+18+24 = 215

// Days 0–12 map to: 10,11,12,13,14,15,16,17,18,19,20,21,22 Agustus 2026
// Working hours (WIB UTC+7): 08:00–15:00

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

// ── Demografi options & weights ───────────────────────────────────
const jenisKelaminCycle = (i: number) => (i % 2 === 0 ? 'Laki-laki' : 'Perempuan');

const usiaOptions    = ['18-25', '26-35', '36-45', '46-55', '>55'];
const usiaWeights    = [0.13, 0.28, 0.30, 0.18, 0.11];

const pendidikanOptions = ['SD', 'SMP', 'SMA', 'D3/S1', 'S2/S3'];
const pendidikanWeights = [0.14, 0.24, 0.46, 0.14, 0.02];

const pekerjaanOptions = ['Petani', 'Wiraswasta', 'Karyawan Swasta', 'PNS', 'Pelajar/Mahasiswa', 'Lainnya'];
const pekerjaanWeights = [0.38, 0.17, 0.15, 0.07, 0.08, 0.15];

const layananOptions = ['Administrasi Umum', 'Kependudukan', 'Perizinan', 'Pertanahan', 'Kesejahteraan Sosial'];
const layananWeights = [0.35, 0.28, 0.15, 0.10, 0.12];

function weightedChoice<T>(items: T[], weights: number[], r: number): T {
  let cum = 0;
  for (let i = 0; i < items.length; i++) {
    cum += weights[i];
    if (r <= cum) return items[i];
  }
  return items[items.length - 1];
}

// ── Timestamp builder ─────────────────────────────────────────────
// Returns ISO string (UTC) for given day offset (0=Aug10) and fraction within work hours
function buildTimestamp(dayOffset: number, indexInDay: number, totalInDay: number, noise: number): string {
  const baseDate = new Date('2026-08-10T00:00:00Z'); // UTC midnight Aug 10
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
      const jenisKelamin = jenisKelaminCycle(i);
      const usia         = weightedChoice(usiaOptions, usiaWeights, rDemog1);
      const pendidikan   = weightedChoice(pendidikanOptions, pendidikanWeights, rDemog2);
      const pekerjaan    = weightedChoice(pekerjaanOptions, pekerjaanWeights, rDemog3);
      const jenisLayanan = weightedChoice(layananOptions, layananWeights, rDemog4);

      // SKM scores
      const skm: Record<string, number> = {};
      Object.entries(SKM_DIST).forEach(([key, [p2, p3]], kIdx) => {
        const r = h(i, 20 + kIdx);
        skm[key] = scoreOf(r, p2, p3);
      });

      // SPAK scores
      const perilaku: Record<string, number> = {};
      Object.entries(SPAK_DIST).forEach(([key, [p2, p3]], kIdx) => {
        const r = h(i, 30 + kIdx);
        perilaku[key] = scoreOf(r, p2, p3);
      });

      // Implementasi scores
      const implementasi: Record<string, number> = {};
      Object.entries(IMPL_DIST).forEach(([key, [p2, p3]], kIdx) => {
        const r = h(i, 40 + kIdx);
        implementasi[key] = scoreOf(r, p2, p3);
      });

      // Kepuasan keseluruhan: avg 3.20
      const rKep = h(i, 50);
      const kepuasan: Record<string, number> = {
        PS1: scoreOf(rKep, 0.05, 0.75), // 5% skor2, 75% skor3, 20% skor4 → avg 3.15
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
