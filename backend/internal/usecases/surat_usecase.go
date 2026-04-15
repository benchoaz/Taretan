package usecases

import (
	"e-disposisi/internal/entities"
	"e-disposisi/internal/repositories"
	"github.com/google/uuid"
)

type suratMasukUseCase struct {
	suratRepo repositories.SuratMasukRepository
}

func NewSuratMasukUseCase(suratRepo repositories.SuratMasukRepository) SuratMasukUseCase {
	return &suratMasukUseCase{suratRepo: suratRepo}
}

func (uc *suratMasukUseCase) CreateSuratMasuk(surat *entities.SuratMasuk, userID uuid.UUID) error {
	surat.CreatedBy = userID
	return uc.suratRepo.Create(surat)
}

func (uc *suratMasukUseCase) ListSuratMasuk(offset, limit int) ([]entities.SuratMasuk, error) {
	return uc.suratRepo.GetAll(offset, limit)
}