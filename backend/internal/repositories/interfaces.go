package repositories

import (
	"e-disposisi/internal/entities"
	"github.com/google/uuid"
)

type UserRepository interface {
	Create(user *entities.User) error
	GetByID(id uuid.UUID) (*entities.User, error)
	GetByEmail(email string) (*entities.User, error)
	GetAll() ([]entities.User, error)
	Update(user *entities.User) error
	Delete(id uuid.UUID) error
}

type SuratMasukRepository interface {
	Create(surat *entities.SuratMasuk) error
	GetByID(id uuid.UUID) (*entities.SuratMasuk, error)
	GetAll(offset, limit int) ([]entities.SuratMasuk, error)
	Update(surat *entities.SuratMasuk) error
	Delete(id uuid.UUID) error
}

type DisposisiRepository interface {
	Create(disposisi *entities.Disposisi) error
	GetByID(id uuid.UUID) (*entities.Disposisi, error)
	GetByUserID(userID uuid.UUID, offset, limit int) ([]entities.Disposisi, error)
	GetMonitoring(filters map[string]interface{}, offset, limit int) ([]entities.Disposisi, int64, error)
	Update(disposisi *entities.Disposisi) error
	Delete(id uuid.UUID) error
}

type LaporanHasilRepository interface {
	Create(laporan *entities.LaporanHasil) error
	GetByID(id uuid.UUID) (*entities.LaporanHasil, error)
	GetByDisposisiID(disposisiID uuid.UUID) ([]entities.LaporanHasil, error)
	Update(laporan *entities.LaporanHasil) error
	Delete(id uuid.UUID) error
}

type LogAktivitasRepository interface {
	Create(log *entities.LogAktivitas) error
	GetByUserID(userID uuid.UUID, offset, limit int) ([]entities.LogAktivitas, error)
}