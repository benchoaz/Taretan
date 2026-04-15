-- PostgreSQL Database Schema for E-Disposisi System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types
CREATE TYPE user_role AS ENUM ('operator', 'kepala_opd', 'staf');
CREATE TYPE user_status AS ENUM ('aktif', 'nonaktif');
CREATE TYPE surat_sifat AS ENUM ('biasa', 'penting', 'segera');
CREATE TYPE disposisi_prioritas AS ENUM ('rendah', 'sedang', 'tinggi');
CREATE TYPE disposisi_status AS ENUM ('pending', 'proses', 'selesai', 'ditunda', 'dikembalikan');
CREATE TYPE laporan_status AS ENUM ('belum_verifikasi', 'terverifikasi', 'ditolak', 'ditunda', 'dikembalikan');

-- Users Table with SSO support
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama VARCHAR(255) NOT NULL,
    nip VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- Nullable for SSO users
    jabatan VARCHAR(255),
    unit_kerja VARCHAR(255),
    role user_role NOT NULL,
    status user_status NOT NULL DEFAULT 'aktif',
    sso_id VARCHAR(255) UNIQUE, -- SSO identifier
    sso_provider VARCHAR(50), -- SSO provider (google, office365, etc)
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SuratMasuk Table
CREATE TABLE surat_masuk (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nomor_surat VARCHAR(100) UNIQUE NOT NULL,
    tanggal_surat DATE NOT NULL,
    tanggal_terima DATE NOT NULL,
    asal_surat VARCHAR(255) NOT NULL,
    perihal TEXT NOT NULL,
    klasifikasi_arsip VARCHAR(255),
    sifat surat_sifat NOT NULL DEFAULT 'biasa',
    file_pdf_url VARCHAR(500),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disposisi Table
CREATE TABLE disposisi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_disposisi_id UUID REFERENCES disposisi(id) ON DELETE CASCADE,
    surat_id UUID NOT NULL REFERENCES surat_masuk(id) ON DELETE CASCADE,
    dari_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ke_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    instruksi TEXT NOT NULL,
    jenis_disposisi VARCHAR(255),
    batas_waktu DATE,
    prioritas disposisi_prioritas NOT NULL DEFAULT 'sedang',
    status disposisi_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LaporanHasil Table
CREATE TABLE laporan_hasil (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disposisi_id UUID NOT NULL REFERENCES disposisi(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    uraian TEXT NOT NULL,
    foto_url VARCHAR(500),
    latitude DECIMAL(10, 8) CHECK (latitude >= -90 AND latitude <= 90),
    longitude DECIMAL(11, 8) CHECK (longitude >= -180 AND longitude <= 180),
    tanggal_lapor DATE NOT NULL,
    status_verifikasi laporan_status NOT NULL DEFAULT 'belum_verifikasi',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LogAktivitas Table (Audit Trail)
CREATE TABLE log_aktivitas (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    aktivitas VARCHAR(255) NOT NULL,
    referensi_id UUID,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_surat_masuk_nomor ON surat_masuk(nomor_surat);
CREATE INDEX idx_surat_masuk_created_by ON surat_masuk(created_by);
CREATE INDEX idx_disposisi_surat_id ON disposisi(surat_id);
CREATE INDEX idx_disposisi_dari_user_id ON disposisi(dari_user_id);
CREATE INDEX idx_disposisi_ke_user_id ON disposisi(ke_user_id);
CREATE INDEX idx_disposisi_status ON disposisi(status);
CREATE INDEX idx_disposisi_parent_id ON disposisi(parent_disposisi_id);
CREATE INDEX idx_laporan_hasil_disposisi_id ON laporan_hasil(disposisi_id);
CREATE INDEX idx_laporan_hasil_user_id ON laporan_hasil(user_id);
CREATE INDEX idx_log_aktivitas_user_id ON log_aktivitas(user_id);
CREATE INDEX idx_log_aktivitas_created_at ON log_aktivitas(created_at);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_surat_masuk_updated_at BEFORE UPDATE ON surat_masuk FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_disposisi_updated_at BEFORE UPDATE ON disposisi FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();