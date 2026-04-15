package usecases

import (
	"e-disposisi/internal/entities"
	"e-disposisi/internal/repositories"
	"errors"
	"github.com/google/uuid"
)

type disposisiUseCase struct {
	disposisiRepo repositories.DisposisiRepository
	userRepo      repositories.UserRepository
	suratRepo     repositories.SuratMasukRepository
}

func NewDisposisiUseCase(disposisiRepo repositories.DisposisiRepository, userRepo repositories.UserRepository, suratRepo repositories.SuratMasukRepository) DisposisiUseCase {
	return &disposisiUseCase{disposisiRepo: disposisiRepo, userRepo: userRepo, suratRepo: suratRepo}
}

func (uc *disposisiUseCase) CreateDisposisi(disposisi *entities.Disposisi, userID uuid.UUID) error {
	// Validate that user is pimpinan
	user, err := uc.userRepo.GetByID(userID)
	if err != nil {
		return errors.New("user not found")
	}
	if user.Role != "pimpinan" {
		return errors.New("only pimpinan can create disposisi")
	}

	disposisi.DariUserID = userID
	return uc.disposisiRepo.Create(disposisi)
}

func (uc *disposisiUseCase) GetMonitoring(filters map[string]interface{}, page, limit int) ([]entities.Disposisi, int64, error) {
	offset := (page - 1) * limit
	return uc.disposisiRepo.GetMonitoring(filters, offset, limit)
}

func (uc *disposisiUseCase) GetByID(id uuid.UUID) (*entities.Disposisi, error) {
	return uc.disposisiRepo.GetByID(id)
}

func (uc *disposisiUseCase) GetSuratMasukList(offset, limit int) ([]entities.SuratMasuk, error) {
	return uc.suratRepo.GetAll(offset, limit)
}