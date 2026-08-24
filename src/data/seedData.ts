import { SurveyResponse } from '../context/SurveyContext';

// Seed data 215 responden Warga Desa Sijenggung
// Tanggal: 10 Agustus 2026 (Pagi jam 08.00 s/d Siang jam 14.00 WIB)
// Seluruh penilaian indikator berkategori "Sangat Baik" / "Sangat Puas" (Skor 3 & 4)

const COMMENTS_POOL = [
  "Pelayanan di Kantor Desa Sijenggung sangat cepat, ramah, dan transparan. Terima kasih Pemdes!",
  "Prosedur pengurusan KTP & Kartu Keluarga mudah sekali, tidak dipungut biaya sepeserpun (100% Gratis).",
  "Perangkat desa Sijenggung melayani warga dengan senyum dan sangat membantu dari awal sampai selesai.",
  "Sangat puas dengan inovasi pelayanan digital dan loket pengaduan yang responsif.",
  "Tidak ada pungli sama sekali, pelayanan bersih dan profesional. Pertahankan Pak Kades!",
  "Pengurusan surat keterangan usaha sangat cepat, langsung jadi dalam hitungan menit.",
  "Petayanan kantor desa sekarang jauh lebih tertib, bersih, dan nyaman bagi warga senior.",
  "Fasilitas ruang tunggu nyaman dan perangkat desa menjelaskan syarat-syarat dengan sangat jelas.",
  "Sistem yang sangat berintegritas dan menolak segala bentuk gratifikasi. Salut buat Pemdes Sijenggung!",
  "Sangat mendukung transparansi anggaran dan pelayanan publik di Desa Sijenggung.",
  "Pengurusan bansos dan administrasi warga sangat adil dan tepat sasaran.",
  "Pelayanan luar biasa, perangkat desa ramah dan tidak berbelit-belit.",
  "Proses surat pengantar pembuatan akta kelahiran anak saya sangat cepat dan terbantu.",
  "Terima kasih atas pelayanan publik Desa Sijenggung yang semakin modern dan antikorupsi.",
  "Maju terus Desa Sijenggung! Pelayanan publiknya terbaik dan menjadi contoh.",
];

function generate215Responses(): SurveyResponse[] {
  const responses: SurveyResponse[] = [];
  const total = 215;

  const jenisKelaminOptions = ['Laki-laki', 'Perempuan'];
  const usiaOptions = ['18-25', '26-35', '36-45', '46-55', '>55'];
  const usiaWeights = [0.15, 0.30, 0.30, 0.15, 0.10];

  const pendidikanOptions = ['SD', 'SMP', 'SMA', 'D3/S1', 'S2/S3'];
  const pendidikanWeights = [0.12, 0.23, 0.48, 0.15, 0.02];

  const pekerjaanOptions = ['Petani', 'Wiraswasta', 'Karyawan Swasta', 'PNS', 'Pelajar/Mahasiswa', 'Lainnya'];
  const pekerjaanWeights = [0.35, 0.25, 0.20, 0.08, 0.07, 0.05];

  const layananOptions = [
    'Administrasi Umum',
    'Kependudukan',
    'Perizinan',
    'Pertanahan',
    'Kesejahteraan Sosial'
  ];
  const layananWeights = [0.35, 0.30, 0.15, 0.10, 0.10];

  // Helper weighted choice
  function getWeightedChoice<T>(items: T[], weights: number[], rand: number): T {
    let cumulative = 0;
    for (let i = 0; i < items.length; i++) {
      cumulative += weights[i];
      if (rand <= cumulative) return items[i];
    }
    return items[items.length - 1];
  }

  // Rentang Waktu: 10 Agustus 2026 jam 08:00:00 - 13:59:59 (Total 6 jam = 21,600 detik)
  // 21,600 detik / 215 responden = ~100 detik per respon
  const baseTime = new Date('2026-08-10T08:00:00+07:00').getTime();
  const timeStepMs = (6 * 3600 * 1000) / total; // ~100.46 detik

  for (let i = 0; i < total; i++) {
    // Pseudo-random deterministic seed per index
    const r1 = (Math.sin(i * 1.7 + 0.1) + 1) / 2;
    const r2 = (Math.cos(i * 2.3 + 0.5) + 1) / 2;
    const r3 = (Math.sin(i * 3.1 + 0.8) + 1) / 2;
    const r4 = (Math.cos(i * 4.7 + 1.2) + 1) / 2;
    const r5 = (Math.sin(i * 5.3 + 1.9) + 1) / 2;

    const jenisKelamin = i % 2 === 0 ? 'Laki-laki' : 'Perempuan';
    const usia = getWeightedChoice(usiaOptions, usiaWeights, r1);
    const pendidikan = getWeightedChoice(pendidikanOptions, pendidikanWeights, r2);
    const pekerjaan = getWeightedChoice(pekerjaanOptions, pekerjaanWeights, r3);
    const jenisLayanan = getWeightedChoice(layananOptions, layananWeights, r4);

    // SKM (U1 - U9): 88% pilihan 4 (Sangat Baik), 12% pilihan 3 (Baik). Tanpa 1/2.
    const skm: Record<string, number> = {};
    const uKeys = ['U1', 'U2', 'U3', 'U4', 'U5', 'U6', 'U7', 'U8', 'U9'];
    uKeys.forEach((key, kIdx) => {
      const rSkor = (Math.sin(i * 11.3 + kIdx * 3.7) + 1) / 2;
      skm[key] = rSkor > 0.12 ? 4 : 3;
    });

    // SPAK Perilaku (P1 - P7): 92% pilihan 4 (Tidak Wajar - Antikorupsi), 8% pilihan 3. Tanpa 1/2.
    const perilaku: Record<string, number> = {};
    const pKeys = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'];
    pKeys.forEach((key, kIdx) => {
      const rSkor = (Math.cos(i * 7.1 + kIdx * 2.9) + 1) / 2;
      perilaku[key] = rSkor > 0.08 ? 4 : 3;
    });

    // Implementasi (I1 - I3): 90% pilihan 4, 10% pilihan 3
    const implementasi: Record<string, number> = {};
    const iKeys = ['I1', 'I2', 'I3'];
    iKeys.forEach((key, kIdx) => {
      const rSkor = (Math.sin(i * 9.7 + kIdx * 4.1) + 1) / 2;
      implementasi[key] = rSkor > 0.10 ? 4 : 3;
    });

    // Kepuasan (PS1): 93% pilihan 4 (Sangat Puas), 7% pilihan 3 (Puas)
    const kepuasan: Record<string, number> = {
      PS1: r5 > 0.07 ? 4 : 3
    };

    // Komentar (Sekitar ~45% responden mengisi komentar positif)
    let komentar: string | undefined = undefined;
    if (r5 > 0.55) {
      const commentIdx = Math.floor(r5 * COMMENTS_POOL.length) % COMMENTS_POOL.length;
      komentar = COMMENTS_POOL[commentIdx];
    }

    // Timestamp tepat 10 Agustus 2026 antara 08:00 WIB s/d 14:00 WIB
    const timestampOffset = i * timeStepMs + (r1 * 45000 - 22500); // variasi +/- 22.5 detik
    const timestamp = new Date(baseTime + timestampOffset);

    responses.push({
      id: String(i + 1),
      demografi: {
        jenisKelamin,
        usia,
        pendidikan,
        pekerjaan,
        jenisLayanan
      },
      skm,
      perilaku,
      implementasi,
      kepuasan,
      komentar,
      timestamp
    });
  }

  return responses;
}

export const INITIAL_RESPONSES: SurveyResponse[] = generate215Responses();
