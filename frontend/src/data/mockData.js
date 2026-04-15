// ═══════════════════════════════════════════
//  TARETAN — Mock Data (Demo)
//  Dinas Pendidikan dan Kebudayaan Kab. Probolinggo
// ═══════════════════════════════════════════

export const MOCK_OPD = [
  { 
    id: 'opd-1', nama: 'Sekretariat Daerah', kode: 'SETDA', level: 0, 
    template: '{klas}/{no}/SETDA/{year}',
    children: [
      { id: 'opd-1-1', nama: 'Bagian Organisasi', kode: 'ORG', level: 1, parent_id: 'opd-1' },
      { id: 'opd-1-2', nama: 'Bagian Hukum', kode: 'HKM', level: 1, parent_id: 'opd-1' },
    ]
  },
  { 
    id: 'opd-2', nama: 'Dinas Pendidikan dan Kebudayaan', kode: 'DISDIK', level: 0,
    template: '{klas}/{no}/DISDIK/{year}',
    children: [
      { id: 'opd-2-1', nama: 'Bidang Administrasi Umum', kode: 'ADM', level: 1, parent_id: 'opd-2' },
      { id: 'opd-2-2', nama: 'Bidang Pendidikan Dasar', kode: 'DIKDAS', level: 1, parent_id: 'opd-2' },
    ]
  },
  { 
    id: 'opd-3', nama: 'Kecamatan Besuk', kode: 'KEC-BSK', level: 0,
    template: '{klas}/{no}/KEC.BSK/{year}',
    children: [
      { id: 'opd-3-1', nama: 'Sekretariat Kecamatan', kode: 'SEKCAM', level: 1, parent_id: 'opd-3' },
      { id: 'opd-3-2', nama: 'Seksi Trantib', kode: 'TRANTIB', level: 1, parent_id: 'opd-3' },
    ]
  }
];

export const MOCK_USERS = [
  { id: 'u1', nama: 'Dr. H. Ahmad Suryadi, M.Pd',    nip: '196501011990031001', jabatan: 'Kepala Dinas Pendidikan dan Kebudayaan', unit_id: 'opd-2', unit_kerja: 'Pimpinan', role: 'kepala_dinas',  email: 'ahmad.suryadi@disdik.go.id',  avatar: 'AS', phone: '08123456001' },
  { id: 'u2', nama: 'Dra. Rina Sari Dewi, M.Si',     nip: '197203152000122001', jabatan: 'Kepala Bidang Administrasi Umum',       unit_id: 'opd-2-1', unit_kerja: 'Bidang Adm. Umum',  role: 'kepala_bidang', email: 'rina.sari@disdik.go.id',     avatar: 'RS', phone: '08123456002' },
  { id: 'u3', nama: 'Hendra Gunawan, S.H., M.H.',    nip: '197805102003121002', jabatan: 'Kepala Bidang Pendidikan Dasar',          unit_id: 'opd-2-2', unit_kerja: 'Bidang Dikdas',     role: 'kepala_bidang', email: 'hendra.g@disdik.go.id',      avatar: 'HG', phone: '08123456003' },
  { id: 'u4', nama: 'Budi Santoso, S.Sos.',           nip: '198506202010011002', jabatan: 'Kepala Seksi Dokumentasi dan Arsip',     unit_id: 'opd-2-1', unit_kerja: 'Seksi Dokumentasi', role: 'kepala_seksi',  email: 'budi.santoso@disdik.go.id',  avatar: 'BS', phone: '08123456004' },
  { id: 'u5', nama: 'Sri Wahyuni, S.Pd.',             nip: '198912012014042001', jabatan: 'Kepala Seksi Kurikulum',                 unit_id: 'opd-2-2', unit_kerja: 'Seksi Kurikulum',   role: 'kepala_seksi',  email: 'sri.wahyuni@disdik.go.id',   avatar: 'SW', phone: '08123456005' },
  { id: 'u6', nama: 'Dewi Rahayu, A.Md.',             nip: '199201042015042003', jabatan: 'Staf Administrasi',                      unit_id: 'opd-2-1', unit_kerja: 'Seksi Dokumentasi', role: 'staf',          email: 'dewi.rahayu@disdik.go.id',   avatar: 'DR', phone: '08123456006' },
  { id: 'u7', nama: 'Rizky Firmansyah',               nip: '199507152018011001', jabatan: 'Staf Teknis',                            unit_id: 'opd-2-2', unit_kerja: 'Seksi Kurikulum',   role: 'staf',          email: 'rizky.f@disdik.go.id',       avatar: 'RF', phone: '08123456007' },
  { id: 'u8', nama: 'Agus Wahyu Nugroho',             nip: '199809102020011002', jabatan: 'Operator Sistem',                        unit_id: 'opd-2-1', unit_kerja: 'Bidang Adm. Umum',  role: 'operator',      email: 'agus.wahyu@disdik.go.id',    avatar: 'AW', phone: '08123456008' },
];

export const DEMO_ACCOUNTS = [
  { label: 'Kepala Dinas',  role: 'kepala_dinas',  userId: 'u1', password: '123456' },
  { label: 'Kepala Bidang', role: 'kepala_bidang', userId: 'u2', password: '123456' },
  { label: 'Kepala Seksi',  role: 'kepala_seksi',  userId: 'u4', password: '123456' },
  { label: 'Staf',          role: 'staf',          userId: 'u6', password: '123456' },
  { label: 'Operator',      role: 'operator',      userId: 'u8', password: '123456' },
];

export const KLASIFIKASI_ARSIP = [
  { kode: '000', nama: 'Umum' },
  { kode: '100', nama: 'Pemerintahan' },
  { kode: '170', nama: 'Organisasi & Tata Kerja' },
  { kode: '200', nama: 'Politik' },
  { kode: '300', nama: 'Keamanan & Ketertiban' },
  { kode: '400', nama: 'Kesejahteraan' },
  { kode: '420', nama: 'Pendidikan' },
  { kode: '421', nama: 'Kurikulum' },
  { kode: '422', nama: 'Sarana Prasarana Pendidikan' },
  { kode: '430', nama: 'Kebudayaan' },
  { kode: '500', nama: 'Perekonomian' },
  { kode: '600', nama: 'Pekerjaan Umum & Ketenagaan' },
  { kode: '800', nama: 'Kepegawaian' },
  { kode: '900', nama: 'Keuangan' },
];

export const MOCK_SURAT_MASUK = [
  {
    id: 'sm1', nomor_surat: '421.1/1234/KCD/2026', tanggal_surat: '2026-04-10', tanggal_terima: '2026-04-11',
    asal_surat: 'Dinas Pendidikan Provinsi Jawa Timur', perihal: 'Petunjuk Teknis Pelaksanaan Ujian Nasional Tahun 2026',
    sifat: 'segera', klasifikasi_arsip: '421', file_pdf_url: '#', created_by: 'u8',
    status_disposisi: 'proses', created_at: '2026-04-11T08:30:00Z',
  },
  {
    id: 'sm2', nomor_surat: '005/789/BKPSDM/2026', tanggal_surat: '2026-04-08', tanggal_terima: '2026-04-09',
    asal_surat: 'BKPSDM Kabupaten Probolinggo', perihal: 'Undangan Rapat Koordinasi Pengembangan Kompetensi ASN',
    sifat: 'biasa', klasifikasi_arsip: '800', file_pdf_url: '#', created_by: 'u8',
    status_disposisi: 'selesai', created_at: '2026-04-09T09:15:00Z',
  },
  {
    id: 'sm3', nomor_surat: '900/456/BPKAD/2026', tanggal_surat: '2026-04-07', tanggal_terima: '2026-04-08',
    asal_surat: 'BPKAD Kabupaten Probolinggo', perihal: 'Permohonan Laporan Realisasi Anggaran Triwulan I 2026',
    sifat: 'penting', klasifikasi_arsip: '900', file_pdf_url: '#', created_by: 'u8',
    status_disposisi: 'pending', created_at: '2026-04-08T10:00:00Z',
  },
  {
    id: 'sm4', nomor_surat: '420/321/KEMDIKBUD/2026', tanggal_surat: '2026-04-05', tanggal_terima: '2026-04-06',
    asal_surat: 'Kementerian Pendidikan dan Kebudayaan RI', perihal: 'Surat Edaran Implementasi Merdeka Belajar Episode 26',
    sifat: 'biasa', klasifikasi_arsip: '420', file_pdf_url: '#', created_by: 'u8',
    status_disposisi: 'selesai', created_at: '2026-04-06T11:30:00Z',
  },
  {
    id: 'sm5', nomor_surat: '170/567/SETDA/2026', tanggal_surat: '2026-04-12', tanggal_terima: '2026-04-12',
    asal_surat: 'Sekretariat Daerah Kabupaten Probolinggo', perihal: 'Instruksi Penyusunan Laporan Kinerja SKPD Semester I 2026',
    sifat: 'segera', klasifikasi_arsip: '170', file_pdf_url: '#', created_by: 'u8',
    status_disposisi: 'pending', created_at: '2026-04-12T07:45:00Z',
  },
  {
    id: 'sm6', nomor_surat: '422/890/KEMENDIKBUD/2026', tanggal_surat: '2026-04-01', tanggal_terima: '2026-04-02',
    asal_surat: 'Direktorat Jenderal Sarana Prasarana', perihal: 'Pemberitahuan Dana Alokasi Khusus Fisik Sekolah 2026',
    sifat: 'penting', klasifikasi_arsip: '422', file_pdf_url: '#', created_by: 'u8',
    status_disposisi: 'proses', created_at: '2026-04-02T13:00:00Z',
  },
];

export const MOCK_SURAT_KELUAR = [
  {
    id: 'sk1', nomor_surat: '421.1/256/DISDIK/2026', tanggal_surat: '2026-04-11',
    tujuan_surat: 'Kepala UPT SD/SMP se-Kab. Probolinggo', perihal: 'Penyampaian Juknis Pelaksanaan Ujian Nasional 2026',
    sifat: 'segera', klasifikasi_arsip: '421',
    status: 'terkirim', created_by: 'u8', approved_by: 'u1', disposisi_id: 'disp1',
    created_at: '2026-04-11T14:00:00Z',
  },
  {
    id: 'sk2', nomor_surat: '005/257/DISDIK/2026', tanggal_surat: '2026-04-12',
    tujuan_surat: 'Kepala BKPSDM Kab. Probolinggo', perihal: 'Konfirmasi Kehadiran Rapat Koordinasi ASN',
    sifat: 'biasa', klasifikasi_arsip: '800',
    status: 'terkirim', created_by: 'u8', approved_by: 'u1', disposisi_id: 'disp2',
    created_at: '2026-04-12T09:00:00Z',
  },
  {
    id: 'sk3', nomor_surat: '900/258/DISDIK/2026', tanggal_surat: '2026-04-13',
    tujuan_surat: 'Kepala BPKAD Kab. Probolinggo', perihal: 'Laporan Realisasi Anggaran Dinas Pendidikan Triwulan I 2026',
    sifat: 'penting', klasifikasi_arsip: '900',
    status: 'draft', created_by: 'u8', approved_by: null, disposisi_id: null,
    created_at: '2026-04-13T10:30:00Z',
  },
  {
    id: 'sk4', nomor_surat: '420/255/DISDIK/2026', tanggal_surat: '2026-04-08',
    tujuan_surat: 'Kepala Sekolah SMA/SMK se-Kab. Probolinggo', perihal: 'Petunjuk Teknis Merdeka Belajar Episode 26',
    sifat: 'biasa', klasifikasi_arsip: '420',
    status: 'dikirim', created_by: 'u8', approved_by: 'u1', disposisi_id: null,
    created_at: '2026-04-08T13:45:00Z',
  },
];

export const MOCK_DISPOSISI = [
  // ── Level 0: Kepala Dinas → Kepala Bidang Adm
  {
    id: 'disp1', parent_disposisi_id: null, level: 0,
    surat_id: 'sm1', surat: MOCK_SURAT_MASUK[0],
    dari_user_id: 'u1', dari_user: MOCK_USERS[0],
    ke_user_id: 'u2',   ke_user: MOCK_USERS[1],
    instruksi: 'Kepada Kabid Administrasi: Tolong koordinasikan dengan seksi terkait dan sampaikan ke sekolah-sekolah. Buat surat edaran segera.',
    jenis_disposisi: 'Untuk Ditindaklanjuti',
    batas_waktu: '2026-04-18', prioritas: 'tinggi', status: 'proses',
    tanggal_selesai: null, catatan_balikan: null,
    created_at: '2026-04-11T09:00:00Z', updated_at: '2026-04-11T09:00:00Z',
    laporan_hasil: [],
  },
  // ── Level 1: Kabid Adm → Kasi Dokumentasi
  {
    id: 'disp1a', parent_disposisi_id: 'disp1', level: 1,
    surat_id: 'sm1', surat: MOCK_SURAT_MASUK[0],
    dari_user_id: 'u2', dari_user: MOCK_USERS[1],
    ke_user_id: 'u4',   ke_user: MOCK_USERS[3],
    instruksi: 'Pak Budi, mohon siapkan daftar distribusi sekolah dan koordinasi dengan staf untuk pengiriman surat edaran.',
    jenis_disposisi: 'Untuk Dilaksanakan',
    batas_waktu: '2026-04-16', prioritas: 'tinggi', status: 'proses',
    tanggal_selesai: null, catatan_balikan: null,
    created_at: '2026-04-11T10:30:00Z', updated_at: '2026-04-11T10:30:00Z',
    laporan_hasil: [],
  },
  // ── Level 2: Kasi Dokumentasi → Staf
  {
    id: 'disp1b', parent_disposisi_id: 'disp1a', level: 2,
    surat_id: 'sm1', surat: MOCK_SURAT_MASUK[0],
    dari_user_id: 'u4', dari_user: MOCK_USERS[3],
    ke_user_id: 'u6',   ke_user: MOCK_USERS[5],
    instruksi: 'Bu Dewi, tolong siapkan list sekolah dan cetak surat edaran. Kirim via email ke semua kepala sekolah hari ini.',
    jenis_disposisi: 'Untuk Dikerjakan',
    batas_waktu: '2026-04-15', prioritas: 'tinggi', status: 'proses',
    tanggal_selesai: null, catatan_balikan: null,
    created_at: '2026-04-11T13:00:00Z', updated_at: '2026-04-11T13:00:00Z',
    laporan_hasil: [],
  },
  // ── Disposisi selesai (surat 2)
  {
    id: 'disp2', parent_disposisi_id: null, level: 0,
    surat_id: 'sm2', surat: MOCK_SURAT_MASUK[1],
    dari_user_id: 'u1', dari_user: MOCK_USERS[0],
    ke_user_id: 'u2',   ke_user: MOCK_USERS[1],
    instruksi: 'Harap diwakili dan dilaporkan hasilnya.',
    jenis_disposisi: 'Untuk Dihadiri',
    batas_waktu: '2026-04-10', prioritas: 'sedang', status: 'selesai',
    tanggal_selesai: '2026-04-10T16:00:00Z', catatan_balikan: null,
    created_at: '2026-04-09T10:00:00Z', updated_at: '2026-04-10T16:00:00Z',
    laporan_hasil: [
      {
        id: 'lap1', disposisi_id: 'disp2', user_id: 'u2', user: MOCK_USERS[1],
        uraian: 'Rapat koordinasi telah dihadiri. Keputusan: Dinas Pendidikan akan mengirim 5 peserta untuk pelatihan kompetensi ASN pada tanggal 20-22 Mei 2026.',
        foto_url: null, latitude: -7.7456, longitude: 113.2105,
        tanggal_lapor: '2026-04-10', status_verifikasi: 'terverifikasi',
        created_at: '2026-04-10T16:30:00Z',
      }
    ],
  },
  // ── Pending (surat 3)
  {
    id: 'disp3', parent_disposisi_id: null, level: 0,
    surat_id: 'sm3', surat: MOCK_SURAT_MASUK[2],
    dari_user_id: 'u1', dari_user: MOCK_USERS[0],
    ke_user_id: 'u2',   ke_user: MOCK_USERS[1],
    instruksi: 'Koordinasikan dengan bagian keuangan dan siapkan laporan realisasi anggaran.',
    jenis_disposisi: 'Untuk Ditindaklanjuti',
    batas_waktu: '2026-04-20', prioritas: 'tinggi', status: 'pending',
    tanggal_selesai: null, catatan_balikan: null,
    created_at: '2026-04-12T08:00:00Z', updated_at: '2026-04-12T08:00:00Z',
    laporan_hasil: [],
  },
  // ── Ditunda (surat 6)
  {
    id: 'disp4', parent_disposisi_id: null, level: 0,
    surat_id: 'sm6', surat: MOCK_SURAT_MASUK[5],
    dari_user_id: 'u1', dari_user: MOCK_USERS[0],
    ke_user_id: 'u3',   ke_user: MOCK_USERS[2],
    instruksi: 'Koordinasikan dengan bidang sarana prasarana untuk inventarisasi kebutuhan rehabilitasi gedung sekolah.',
    jenis_disposisi: 'Untuk Dikoordinasikan',
    batas_waktu: '2026-04-25', prioritas: 'sedang', status: 'ditunda',
    tanggal_selesai: null, catatan_balikan: 'Menunggu data inventaris dari field survey.',
    created_at: '2026-04-02T14:00:00Z', updated_at: '2026-04-05T09:00:00Z',
    laporan_hasil: [],
  },
];

export const MOCK_LOG_AKTIVITAS = [
  { id: 1, user: MOCK_USERS[0], aktivitas: 'Login ke sistem', referensi_id: null, ip_address: '192.168.1.10', created_at: '2026-04-14T08:00:00Z' },
  { id: 2, user: MOCK_USERS[0], aktivitas: 'Membuat disposisi untuk surat 421.1/1234/KCD/2026', referensi_id: 'disp1', ip_address: '192.168.1.10', created_at: '2026-04-11T09:00:00Z' },
  { id: 3, user: MOCK_USERS[1], aktivitas: 'Meneruskan disposisi disp1 ke Kasi Dokumentasi', referensi_id: 'disp1a', ip_address: '192.168.1.11', created_at: '2026-04-11T10:30:00Z' },
  { id: 4, user: MOCK_USERS[7], aktivitas: 'Input surat masuk 421.1/1234/KCD/2026', referensi_id: 'sm1', ip_address: '192.168.1.20', created_at: '2026-04-11T08:30:00Z' },
  { id: 5, user: MOCK_USERS[1], aktivitas: 'Menyelesaikan disposisi 005/789/BKPSDM/2026', referensi_id: 'disp2', ip_address: '192.168.1.11', created_at: '2026-04-10T16:00:00Z' },
  { id: 6, user: MOCK_USERS[3], aktivitas: 'Meneruskan disposisi disp1a ke Staf Administrasi', referensi_id: 'disp1b', ip_address: '192.168.1.12', created_at: '2026-04-11T13:00:00Z' },
  { id: 7, user: MOCK_USERS[7], aktivitas: 'Input surat keluar 421.1/256/DISDIK/2026', referensi_id: 'sk1', ip_address: '192.168.1.20', created_at: '2026-04-11T14:00:00Z' },
  { id: 8, user: MOCK_USERS[0], aktivitas: 'Menyetujui surat keluar 421.1/256/DISDIK/2026', referensi_id: 'sk1', ip_address: '192.168.1.10', created_at: '2026-04-11T15:00:00Z' },
];

// Stats helpers
export const getStats = () => ({
  totalSuratMasuk: MOCK_SURAT_MASUK.length,
  totalSuratKeluar: MOCK_SURAT_KELUAR.length,
  totalDisposisi: MOCK_DISPOSISI.length,
  disposisiPending: MOCK_DISPOSISI.filter(d => d.status === 'pending').length,
  disposisiProses: MOCK_DISPOSISI.filter(d => d.status === 'proses').length,
  disposisiSelesai: MOCK_DISPOSISI.filter(d => d.status === 'selesai').length,
  disposisiDitunda: MOCK_DISPOSISI.filter(d => d.status === 'ditunda').length,
});

export const getDisposisiForUser = (userId, role) => {
  if (role === 'kepala_dinas' || role === 'operator') return MOCK_DISPOSISI;
  if (role === 'kepala_bidang') return MOCK_DISPOSISI.filter(d => d.ke_user_id === userId || d.dari_user_id === userId);
  if (role === 'kepala_seksi') return MOCK_DISPOSISI.filter(d => d.ke_user_id === userId || d.dari_user_id === userId);
  if (role === 'staf') return MOCK_DISPOSISI.filter(d => d.ke_user_id === userId);
  return [];
};

// Disposisi chain builder (breadcrumb of hierarchy)
export const getDisposisiChain = (disposisiId) => {
  const chain = [];
  let current = MOCK_DISPOSISI.find(d => d.id === disposisiId);
  while (current) {
    chain.unshift(current);
    current = current.parent_disposisi_id
      ? MOCK_DISPOSISI.find(d => d.id === current.parent_disposisi_id)
      : null;
  }
  return chain;
};

export const JENIS_DISPOSISI_OPTIONS = [
  'Untuk Ditindaklanjuti',
  'Untuk Dilaksanakan',
  'Untuk Dikoordinasikan',
  'Untuk Dikerjakan',
  'Untuk Dihadiri',
  'Untuk Diperiksa',
  'Untuk Dijawab',
  'Untuk Diketahui',
  'Sebagai Bahan',
];

export const ROLE_LABELS = {
  kepala_dinas:  'Kepala Dinas',
  kepala_bidang: 'Kepala Bidang',
  kepala_seksi:  'Kepala Seksi',
  staf:          'Staf',
  operator:      'Operator',
};

export const ROLE_COLORS = {
  kepala_dinas:  'bg-purple-100 text-purple-700',
  kepala_bidang: 'bg-blue-100 text-blue-700',
  kepala_seksi:  'bg-cyan-100 text-cyan-700',
  staf:          'bg-green-100 text-green-700',
  operator:      'bg-amber-100 text-amber-700',
};

// Utils for Numbering Templates
export const generateNomorSurat = (template, data) => {
  if (!template) return '';
  const year = new Date().getFullYear();
  return template
    .replace('{klas}', data.klasifikasi || '420')
    .replace('{no}',   data.nomor_urut || '0001')
    .replace('{unit}', data.unit_kode || 'UNIT')
    .replace('{year}', year.toString());
};
