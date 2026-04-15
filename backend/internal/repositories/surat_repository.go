package repositories

import (
	"e-disposisi/internal/entities"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type suratMasukRepository struct {
	db *gorm.DB
}

func NewSuratMasukRepository(db *gorm.DB) SuratMasukRepository {
	return &suratMasukRepository{db: db}
}

func (r *suratMasukRepository) Create(surat *entities.SuratMasuk) error {
	return r.db.Create(surat).Error
}

func (r *suratMasukRepository) GetByID(id uuid.UUID) (*entities.SuratMasuk, error) {
	var surat entities.SuratMasuk
	err := r.db.Preload("User").Where("id = ?", id).First(&surat).Error
	return &surat, err
}

func (r *suratMasukRepository) GetAll(offset, limit int) ([]entities.SuratMasuk, error) {
	var surat []entities.SuratMasuk
	err := r.db.Preload("User").
		Offset(offset).Limit(limit).
		Order("created_at DESC").
		Find(&surat).Error
	return surat, err
}

func (r *suratMasukRepository) Update(surat *entities.SuratMasuk) error {
	return r.db.Save(surat).Error
}

func (r *suratMasukRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&entities.SuratMasuk{}, id).Error
}