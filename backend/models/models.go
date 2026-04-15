package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID           uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	NIP          string    `gorm:"unique;not null" json:"nip"`
	Nama         string    `gorm:"not null" json:"nama"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	Jabatan      string    `json:"jabatan"`
	UnitKerja    string    `json:"unit_kerja"`
	Role         string    `json:"role"` // Kepala Dinas/Bidang/Seksi/Staf/Operator
	Status       string    `gorm:"default:'Aktif'" json:"status"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type SuratMasuk struct {
	ID               uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	NomorSurat       string    `gorm:"not null" json:"nomor_surat"`
	TanggalSurat     time.Time `json:"tanggal_surat"`
	TanggalTerima    time.Time `json:"tanggal_terima"`
	AsalSurat        string    `gorm:"not null" json:"asal_surat"`
	Perihal          string    `gorm:"not null" json:"perihal"`
	Sifat            string    `json:"sifat"`
	KlasifikasiArsip string    `json:"klasifikasi_arsip"`
	FilePdfURL       string    `json:"file_pdf_url"`
	StatusDisposisi  string    `gorm:"default:'pending'" json:"status_disposisi"`
	CreatedByID      uuid.UUID `gorm:"type:uuid" json:"created_by_id"`
	CreatedBy        User      `gorm:"foreignKey:CreatedByID" json:"created_by"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type SuratKeluar struct {
	ID               uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	NomorSurat       string    `gorm:"not null" json:"nomor_surat"`
	TanggalSurat     time.Time `json:"tanggal_surat"`
	TujuanSurat      string    `gorm:"not null" json:"tujuan_surat"`
	Perihal          string    `gorm:"not null" json:"perihal"`
	Sifat            string    `json:"sifat"`
	KlasifikasiArsip string    `json:"klasifikasi_arsip"`
	Status           string    `gorm:"default:'Draft'" json:"status"`
	FilePdfURL       string    `json:"file_pdf_url"`
	CreatedByID      uuid.UUID `gorm:"type:uuid" json:"created_by_id"`
	CreatedBy        User      `gorm:"foreignKey:CreatedByID" json:"created_by"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type Disposisi struct {
	ID                 uuid.UUID    `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	ParentDisposisiID  *uuid.UUID   `gorm:"type:uuid" json:"parent_disposisi_id"` // Nullable for root
	ParentDisposisi    *Disposisi   `gorm:"foreignKey:ParentDisposisiID" json:"-"`
	ChildDisposisis    []Disposisi  `gorm:"foreignKey:ParentDisposisiID" json:"child_disposisis,omitempty"`
	Level              int          `gorm:"default:0" json:"level"`
	SuratID            uuid.UUID    `gorm:"type:uuid;not null" json:"surat_id"`
	Surat              SuratMasuk   `gorm:"foreignKey:SuratID" json:"surat"`
	DariUserID         uuid.UUID    `gorm:"type:uuid;not null" json:"dari_user_id"`
	DariUser           User         `gorm:"foreignKey:DariUserID" json:"dari_user"`
	KeUserID           uuid.UUID    `gorm:"type:uuid;not null" json:"ke_user_id"`
	KeUser             User         `gorm:"foreignKey:KeUserID" json:"ke_user"`
	Instruksi          string       `gorm:"not null" json:"instruksi"`
	JenisDisposisi     string       `json:"jenis_disposisi"`
	BatasWaktu         *time.Time   `json:"batas_waktu"`
	Prioritas          string       `json:"prioritas"`
	Status             string       `gorm:"default:'pending'" json:"status"`
	TanggalSelesai     *time.Time   `json:"tanggal_selesai"`
	CreatedAt          time.Time    `json:"created_at"`
	UpdatedAt          time.Time    `json:"updated_at"`
	LaporanHasil       []LaporanHasil `gorm:"foreignKey:DisposisiID" json:"laporan_hasil"`
}

type LaporanHasil struct {
	ID               uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	DisposisiID      uuid.UUID `gorm:"type:uuid;not null" json:"disposisi_id"`
	UserID           uuid.UUID `gorm:"type:uuid;not null" json:"user_id"`
	Uraian           string    `gorm:"not null" json:"uraian"`
	FotoURL          string    `json:"foto_url"`
	Latitude         float64   `json:"latitude"`
	Longitude        float64   `json:"longitude"`
	StatusVerifikasi string    `gorm:"default:'Belum'" json:"status_verifikasi"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type AuditLog struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	UserID      uuid.UUID `gorm:"type:uuid;not null" json:"user_id"`
	Aktivitas   string    `gorm:"not null" json:"aktivitas"`
	ReferensiID string    `json:"referensi_id"`
	IPAddress   string    `json:"ip_address"`
	CreatedAt   time.Time `json:"created_at"`
}

// AutoMigrate all models
func MigrateAll(db *gorm.DB) error {
	// Add pg_trgm and pgcrypto extensions if needed by postgres for gen_random_uuid()
	db.Exec("CREATE EXTENSION IF NOT EXISTS pgcrypto;")
	return db.AutoMigrate(
		&User{},
		&SuratMasuk{},
		&SuratKeluar{},
		&Disposisi{},
		&LaporanHasil{},
		&AuditLog{},
	)
}
