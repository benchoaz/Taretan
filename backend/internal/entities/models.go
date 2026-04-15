package entities

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID           uuid.UUID `json:"id" gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	Nama         string    `json:"nama" gorm:"not null"`
	NIP          string    `json:"nip" gorm:"unique;not null"`
	Email        string    `json:"email" gorm:"unique;not null"`
	PasswordHash string    `json:"-" gorm:"not null"`
	Jabatan      string    `json:"jabatan"`
	UnitID       *uuid.UUID `json:"unit_id" gorm:"type:uuid"`
	UnitKerja    string    `json:"unit_kerja"` // Legacy field for display mapping
	Role         string    `json:"role" gorm:"type:user_role;not null"`
	Status       string    `json:"status" gorm:"type:user_status;default:'aktif'"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type UnitKerja struct {
	ID        uuid.UUID   `json:"id" gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	Nama      string      `json:"nama" gorm:"not null"`
	Kode      string      `json:"kode" gorm:"unique"`
	Level     int         `json:"level"` // 0: Kabupaten, 1: OPD/Kec, 2: Bidang, 3: Seksi
	ParentID  *uuid.UUID  `json:"parent_id" gorm:"type:uuid"`
	Children  []UnitKerja `json:"children" gorm:"foreignKey:ParentID"`
	Template  string      `json:"template"` // Numbering template e.g. "{klas}/{no}/{unit}/{year}"
	CreatedAt time.Time   `json:"created_at"`
}

type SuratMasuk struct {
	ID           uuid.UUID `json:"id" gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	NomorSurat   string    `json:"nomor_surat" gorm:"unique;not null"`
	TanggalSurat time.Time `json:"tanggal_surat" gorm:"type:date;not null"`
	TanggalTerima time.Time `json:"tanggal_terima" gorm:"type:date;not null"`
	AsalSurat    string    `json:"asal_surat" gorm:"not null"`
	Perihal      string    `json:"perihal" gorm:"type:text;not null"`
	Sifat        string    `json:"sifat" gorm:"type:surat_sifat;default:'biasa'"`

	KlasifikasiArsip string `json:"klasifikasi_arsip"`
	FilePdfURL   string    `json:"file_pdf_url"`
	CreatedBy    uuid.UUID `json:"created_by" gorm:"not null"`
	User         User      `json:"-" gorm:"foreignKey:CreatedBy"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type Disposisi struct {
	ID         uuid.UUID `json:"id" gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	SuratID    uuid.UUID `json:"surat_id" gorm:"not null"`
	Surat      SuratMasuk `json:"surat" gorm:"foreignKey:SuratID"`
	DariUserID uuid.UUID `json:"dari_user_id" gorm:"not null"`
	DariUser   User      `json:"dari_user" gorm:"foreignKey:DariUserID"`
	KeUserID   uuid.UUID `json:"ke_user_id" gorm:"not null"`
	KeUser     User      `json:"ke_user" gorm:"foreignKey:KeUserID"`
	Instruksi  string    `json:"instruksi" gorm:"type:text;not null"`
	BatasWaktu *time.Time `json:"batas_waktu" gorm:"type:date"`
	Prioritas  string    `json:"prioritas" gorm:"type:disposisi_prioritas;default:'sedang'"`
	Status     string    `json:"status" gorm:"type:disposisi_status;default:'pending'"`

	JenisDisposisi    string     `json:"jenis_disposisi"`

	ParentDisposisiID *uuid.UUID `json:"parent_disposisi_id"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type LaporanHasil struct {
	ID              uuid.UUID `json:"id" gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	DisposisiID     uuid.UUID `json:"disposisi_id" gorm:"not null"`
	Disposisi       Disposisi `json:"disposisi" gorm:"foreignKey:DisposisiID"`
	UserID          uuid.UUID `json:"user_id" gorm:"not null"`
	User            User      `json:"user" gorm:"foreignKey:UserID"`
	Uraian          string    `json:"uraian" gorm:"type:text;not null"`
	FotoURL         string    `json:"foto_url"`
	Latitude        *float64  `json:"latitude" gorm:"type:decimal(10,8);check:latitude >= -90 AND latitude <= 90"`
	Longitude       *float64  `json:"longitude" gorm:"type:decimal(11,8);check:longitude >= -180 AND longitude <= 180"`
	TanggalLapor    time.Time `json:"tanggal_lapor" gorm:"type:date;not null"`
	StatusVerifikasi string   `json:"status_verifikasi" gorm:"type:laporan_status;default:'belum_verifikasi'"`
	CreatedAt       time.Time `json:"created_at"`
}

type LogAktivitas struct {
	ID         uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID     *uuid.UUID `json:"user_id"`
	User       User      `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Aktivitas  string    `json:"aktivitas" gorm:"not null"`
	ReferensiID *uuid.UUID `json:"referensi_id"`
	IPAddress  string    `json:"ip_address" gorm:"type:inet"`
	CreatedAt  time.Time `json:"created_at"`
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	u.ID = uuid.New()
	return
}

func (s *SuratMasuk) BeforeCreate(tx *gorm.DB) (err error) {
	s.ID = uuid.New()
	return
}

func (d *Disposisi) BeforeCreate(tx *gorm.DB) (err error) {
	d.ID = uuid.New()
	return
}

func (l *LaporanHasil) BeforeCreate(tx *gorm.DB) (err error) {
	l.ID = uuid.New()
	return
}