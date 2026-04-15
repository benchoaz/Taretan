package repositories

import (
	"fmt"
	"e-disposisi/internal/entities"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

type laporanHasilRepository struct {
	db *gorm.DB
}

func NewLaporanHasilRepository(db *gorm.DB) LaporanHasilRepository {
	return &laporanHasilRepository{db: db}
}

func (r *laporanHasilRepository) Create(laporan *entities.LaporanHasil) error {
	return r.db.Create(laporan).Error
}

func (r *laporanHasilRepository) GetByID(id uuid.UUID) (*entities.LaporanHasil, error) {
	var laporan entities.LaporanHasil
	err := r.db.Preload("Disposisi").Preload("User").Where("id = ?", id).First(&laporan).Error
	return &laporan, err
}

func (r *laporanHasilRepository) GetByDisposisiID(disposisiID uuid.UUID) ([]entities.LaporanHasil, error) {
	var laporan []entities.LaporanHasil
	err := r.db.Preload("User").Where("disposisi_id = ?", disposisiID).Order("created_at DESC").Find(&laporan).Error
	return laporan, err
}

func (r *laporanHasilRepository) Update(laporan *entities.LaporanHasil) error {
	return r.db.Save(laporan).Error
}

func (r *laporanHasilRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&entities.LaporanHasil{}, id).Error
}

// File upload utility
func (r *laporanHasilRepository) SaveUploadedFile(file []byte, filename string) (string, error) {
	// In production, save to cloud storage or local filesystem
	// For now, return the filename (assuming it's handled by the usecase)
	return filename, nil
}

// Generate unique filename
func generateFilename(originalFilename string) string {
	timestamp := time.Now().Unix()
	uuid := uuid.New().String()
	return fmt.Sprintf("%d_%s_%s", timestamp, uuid, originalFilename)
}