package usecases

import (
	"e-disposisi/internal/entities"
	"mime/multipart"
	"github.com/google/uuid"
)

type AuthUseCase interface {
	Login(email, password string) (string, error)
	ValidateToken(token string) (*entities.User, error)
}

type DisposisiUseCase interface {
	CreateDisposisi(disposisi *entities.Disposisi, userID uuid.UUID) error
	GetMonitoring(filters map[string]interface{}, page, limit int) ([]entities.Disposisi, int64, error)
	GetByID(id uuid.UUID) (*entities.Disposisi, error)
	GetSuratMasukList(offset, limit int) ([]entities.SuratMasuk, error)
}

type LaporanUseCase interface {
	UploadLaporan(disposisiID, userID uuid.UUID, uraian string, latitude, longitude float64, file multipart.File, header *multipart.FileHeader) (*entities.LaporanHasil, error)
	GetByDisposisiID(disposisiID uuid.UUID) ([]entities.LaporanHasil, error)
}

type UserUseCase interface {
	GetProfile(userID uuid.UUID) (*entities.User, error)
	UpdateProfile(user *entities.User) error
	GetUsers() ([]entities.User, error)
}

type SuratMasukUseCase interface {
	CreateSuratMasuk(surat *entities.SuratMasuk, userID uuid.UUID) error
	ListSuratMasuk(offset, limit int) ([]entities.SuratMasuk, error)
}