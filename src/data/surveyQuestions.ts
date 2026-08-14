export interface Question {
  id: string;
  label: string;
  options: { label: string; value: number }[];
}

export const SKM_QUESTIONS: Question[] = [
  { 
    id: 'U1', 
    label: 'Apakah persyaratan pengajuan pelayanan yang ada pada Kantor Desa Sijenggung telah mempermudah Anda?', 
    options: [
      { label: 'Tidak Mudah', value: 1 }, { label: 'Cukup Mudah', value: 2 }, { label: 'Mudah', value: 3 }, { label: 'Sangat Mudah', value: 4 }
    ] 
  },
  { 
    id: 'U2', 
    label: 'Seberapa mudahkan prosedur pelayanan yang ada di Desa Sijenggung untuk setiap pengajuan permohonan layanan?', 
    options: [
      { label: 'Tidak Mudah', value: 1 }, { label: 'Cukup Mudah', value: 2 }, { label: 'Mudah', value: 3 }, { label: 'Sangat Mudah', value: 4 }
    ] 
  },
  { 
    id: 'U3', 
    label: 'Seberapa cepat waktu yang dibutuhkan dalam proses layanan yang diberikan oleh petugas di Kantor Desa Sijenggung?', 
    options: [
      { label: 'Tidak Cepat', value: 1 }, { label: 'Kurang Cepat', value: 2 }, { label: 'Cepat', value: 3 }, { label: 'Sangat Cepat', value: 4 }
    ] 
  },
  { 
    id: 'U4', 
    label: 'Bagaimana pendapat saudara tentang kesesuaian produk pelayanan antara yang tercantum dalam standar hasil pelayanan dengan hasil yang diberikan?', 
    options: [
      { label: 'Tidak Sesuai', value: 1 }, { label: 'Kurang Sesuai', value: 2 }, { label: 'Sesuai', value: 3 }, { label: 'Sangat Sesuai', value: 4 }
    ] 
  },
  { 
    id: 'U5', 
    label: 'Menurut Anda, berapa tarif/biaya layanan yang diterapkan atas layanan yang diberikan oleh Pemerintah Desa Sijenggung?', 
    options: [
      { label: 'Sangat Mahal', value: 1 }, { label: 'Cukup Mahal', value: 2 }, { label: 'Murah', value: 3 }, { label: 'Gratis', value: 4 }
    ] 
  },
  { 
    id: 'U6', 
    label: 'Menurut Anda, apakah telah tersedia sarana prasarana (komputer, jaringan internet dan lainnya) yang mendukung efektivitas dan efisiensi pelayanan?', 
    options: [
      { label: 'Tidak Tersedia', value: 1 }, { label: 'Cukup tersedia tapi kurang mendukung', value: 2 }, { label: 'Tersedia dan mendukung', value: 3 }, { label: 'Tersedia dan sangat mendukung', value: 4 }
    ] 
  },
  { 
    id: 'U7', 
    label: 'Bagiamana pendapat saudara tentang perilaku petugas dalam memberikan layanan terkait kesopanan dan keramahan?', 
    options: [
      { label: 'Tidak Sopan dan Ramah', value: 1 }, { label: 'Kurang Sopan dan Ramah', value: 2 }, { label: 'Sopan dan Ramah', value: 3 }, { label: 'Sangat Sopan dan Ramah', value: 4 }
    ] 
  },
  { 
    id: 'U8', 
    label: 'Bagaimana pendapat Anda tentang kemampuan perangkat desa dalam memberikan penjelasan mengenai prosedur layanan?', 
    options: [
      { label: 'Tidak Jelas', value: 1 }, { label: 'Kurang Jelas', value: 2 }, { label: 'Jelas', value: 3 }, { label: 'Sangat Jelas', value: 4 }
    ] 
  },
  { 
    id: 'U9', 
    label: 'Bagaimana pendapat Anda tentang ketersediaan dan penanganan layanan pengaduan masyarakat?', 
    options: [
      { label: 'Tidak Ada', value: 1 }, { label: 'Ada tetapi belum dikelola dengan baik', value: 2 }, { label: 'Ada dan sudah dikelola dengan cukup baik', value: 3 }, { label: 'Ada dan sudah dikelola dengan sangat baik', value: 4 }
    ] 
  }
];

export const PERILAKU_QUESTIONS: Question[] = [
  { 
    id: 'P1', 
    label: 'Sikap terhadap seseorang yang menerima uang tambahan dari pasangan di luar gaji/penghasilan biasa, tanpa mempertanyakan asal usulnya.', 
    options: [
      { label: 'Wajar', value: 1 }, { label: 'Cenderung Wajar', value: 2 }, { label: 'Cenderung Tidak Wajar', value: 3 }, { label: 'Tidak Wajar', value: 4 }
    ] 
  },
  { 
    id: 'P2', 
    label: 'Perangkat Desa menggunakan kendaraan dinas untuk keperluan keluarga/pribadi.', 
    options: [
      { label: 'Wajar', value: 1 }, { label: 'Cenderung Wajar', value: 2 }, { label: 'Cenderung Tidak Wajar', value: 3 }, { label: 'Tidak Wajar', value: 4 }
    ] 
  },
  { 
    id: 'P3', 
    label: 'Seseorang memanfaatkan hubungan keluarga yang mempunyai kewenangan agar dipermudah dalam pelayanan publik.', 
    options: [
      { label: 'Wajar', value: 1 }, { label: 'Cenderung Wajar', value: 2 }, { label: 'Cenderung Tidak Wajar', value: 3 }, { label: 'Tidak Wajar', value: 4 }
    ] 
  },
  { 
    id: 'P4', 
    label: 'Seseorang bergaya hidup mewah di luar kemampuan agar diakui/dianggap berada oleh masyarakat.', 
    options: [
      { label: 'Wajar', value: 1 }, { label: 'Cenderung Wajar', value: 2 }, { label: 'Cenderung Tidak Wajar', value: 3 }, { label: 'Tidak Wajar', value: 4 }
    ] 
  },
  { 
    id: 'P5', 
    label: 'Suatu keluarga memberi uang/barang/fasilitas lebih kepada Pejabat/Perangkat Desa ketika hajatan atau menjelang hari raya.', 
    options: [
      { label: 'Wajar', value: 1 }, { label: 'Cenderung Wajar', value: 2 }, { label: 'Cenderung Tidak Wajar', value: 3 }, { label: 'Tidak Wajar', value: 4 }
    ] 
  },
  { 
    id: 'P6', 
    label: 'Ketua RT/RW membantu calon Kepala Desa/Daerah/Legislatif membagikan uang/barang kepada masyarakat agar dipilih.', 
    options: [
      { label: 'Wajar', value: 1 }, { label: 'Cenderung Wajar', value: 2 }, { label: 'Cenderung Tidak Wajar', value: 3 }, { label: 'Tidak Wajar', value: 4 }
    ] 
  },
  { 
    id: 'P7', 
    label: 'Ketua RT/RW/Kepala Desa mengusulkan warganya yang tidak sesuai kriteria untuk mendapatkan bantuan sosial.', 
    options: [
      { label: 'Wajar', value: 1 }, { label: 'Cenderung Wajar', value: 2 }, { label: 'Cenderung Tidak Wajar', value: 3 }, { label: 'Tidak Wajar', value: 4 }
    ] 
  }
];

export const IMPLEMENTASI_QUESTIONS: Question[] = [
  { 
    id: 'I1', 
    label: 'Bagaimana pendapat Anda tentang kesopanan dan keramahan perangkat desa dalam memberikan layanan?', 
    options: [
      { label: 'Tidak Sopan dan Tidak Ramah', value: 1 }, { label: 'Kurang Sopan dan Kurang Ramah', value: 2 }, { label: 'Sopan dan Ramah', value: 3 }, { label: 'Sangat Sopan dan Sangat Ramah', value: 4 }
    ] 
  },
  { 
    id: 'I2', 
    label: 'Apakah Anda mengetahui adanya adat istiadat/budaya yang mendorong upaya pencegahan korupsi di Desa Sijenggung?', 
    options: [
      { label: 'Tidak Tahu', value: 1 }, { label: 'Kurang Tahu', value: 2 }, { label: 'Tahu', value: 3 }, { label: 'Sangat Tahu', value: 4 }
    ] 
  },
  { 
    id: 'I3', 
    label: 'Apakah Anda mengetahui peran Tokoh masyarakat/agama/pemuda/perempuan dalam mendorong upaya pencegahan korupsi?', 
    options: [
      { label: 'Tidak Tahu', value: 1 }, { label: 'Kurang Tahu', value: 2 }, { label: 'Tahu', value: 3 }, { label: 'Sangat Tahu', value: 4 }
    ] 
  }
];

export const KEPUASAN_QUESTIONS: Question[] = [
  {
    id: 'PS1',
    label: 'Seberapa puas Anda dengan Pelayanan yang diberikan oleh Pemerintah Desa Sijenggung?',
    options: [
      { label: 'Sangat Tidak Puas', value: 1 }, { label: 'Kurang Puas', value: 2 }, { label: 'Puas', value: 3 }, { label: 'Sangat Puas', value: 4 }
    ]
  }
];

