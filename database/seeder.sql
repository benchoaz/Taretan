-- Seeder Dummy Data for E-Disposisi System

-- Insert dummy users with SSO support
INSERT INTO users (nama, nip, email, password_hash, jabatan, unit_kerja, role, status, sso_id, sso_provider) VALUES
('Operator Sistem', '123456789', 'operator@disposisi.go.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'IT', 'operator', 'aktif', 'sso_op_001', 'office365'),
('Kepala OPD', '987654321', 'kepala@opd.go.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Kepala Dinas', 'Sekretariat', 'kepala_opd', 'aktif', 'sso_kepala_001', 'office365'),
('Staf Administrasi', '456789123', 'staf.admin@opd.go.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Staf Administrasi', 'Bagian Umum', 'staf', 'aktif', 'sso_staf_001', 'office365'),
('Staf Kepegawaian', '789123456', 'staf.sdm@opd.go.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Staf Kepegawaian', 'Bagian SDM', 'staf', 'aktif', 'sso_staf_002', 'office365'),
('Kasi Perencanaan', '321654987', 'kasi.perencanaan@opd.go.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Kasi Perencanaan', 'Bagian Perencanaan', 'staf', 'aktif', 'sso_staf_003', 'office365');

-- Insert dummy surat masuk
INSERT INTO surat_masuk (nomor_surat, tanggal_surat, tanggal_terima, asal_surat, perihal, sifat, file_pdf_url, created_by) VALUES
('001/SM/2026', '2026-01-01', '2026-01-02', 'Kementerian Dalam Negeri', 'Permohonan Izin Keramaian', 'penting', '/uploads/surat/001.pdf', (SELECT id FROM users WHERE nip = '123456789')),
('002/SM/2026', '2026-01-05', '2026-01-06', 'Dinas Kesehatan', 'Laporan Kesehatan Masyarakat', 'biasa', '/uploads/surat/002.pdf', (SELECT id FROM users WHERE nip = '123456789'));

-- Insert dummy disposisi
INSERT INTO disposisi (surat_id, dari_user_id, ke_user_id, instruksi, batas_waktu, prioritas, status) VALUES
((SELECT id FROM surat_masuk WHERE nomor_surat = '001/SM/2026'), (SELECT id FROM users WHERE nip = '987654321'), (SELECT id FROM users WHERE nip = '456789123'), 'Proses permohonan izin dengan segera', '2026-01-15', 'tinggi', 'pending'),
((SELECT id FROM surat_masuk WHERE nomor_surat = '002/SM/2026'), (SELECT id FROM users WHERE nip = '987654321'), (SELECT id FROM users WHERE nip = '789123456'), 'Koordinasi dengan tim kesehatan', '2026-01-20', 'sedang', 'proses');

-- Insert dummy laporan hasil
INSERT INTO laporan_hasil (disposisi_id, user_id, uraian, foto_url, latitude, longitude, tanggal_lapor, status_verifikasi) VALUES
((SELECT id FROM disposisi WHERE instruksi LIKE '%Proses permohonan%'), (SELECT id FROM users WHERE nip = '456789123'), 'Telah dilakukan verifikasi dokumen izin', '/uploads/laporan/001.jpg', -6.2088, 106.8456, '2026-01-10', 'terverifikasi'),
((SELECT id FROM disposisi WHERE instruksi LIKE '%Koordinasi dengan tim%'), (SELECT id FROM users WHERE nip = '789123456'), 'Rapat koordinasi telah dilaksanakan', '/uploads/laporan/002.jpg', -6.1751, 106.8227, '2026-01-12', 'belum_verifikasi');

-- Insert dummy log aktivitas
INSERT INTO log_aktivitas (user_id, aktivitas, referensi_id, ip_address) VALUES
((SELECT id FROM users WHERE nip = '123456789'), 'Login ke sistem', NULL, '192.168.1.1'),
((SELECT id FROM users WHERE nip = '987654321'), 'Kirim disposisi', (SELECT id FROM disposisi LIMIT 1), '192.168.1.2'),
((SELECT id FROM users WHERE nip = '456789123'), 'Upload laporan', (SELECT id FROM laporan_hasil LIMIT 1), '192.168.1.3');