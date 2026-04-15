package repositories

import (
	"e-disposisi/internal/entities"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type disposisiRepository struct {
	db *gorm.DB
}

func NewDisposisiRepository(db *gorm.DB) DisposisiRepository {
	return &disposisiRepository{db: db}
}

func (r *disposisiRepository) Create(disposisi *entities.Disposisi) error {
	return r.db.Create(disposisi).Error
}

func (r *disposisiRepository) GetByID(id uuid.UUID) (*entities.Disposisi, error) {
	var disposisi entities.Disposisi
	err := r.db.Preload("Surat").Preload("DariUser").Preload("KeUser").Preload("LaporanHasil").Where("id = ?", id).First(&disposisi).Error
	return &disposisi, err
}

func (r *disposisiRepository) GetByUserID(userID uuid.UUID, offset, limit int) ([]entities.Disposisi, error) {
	var disposisi []entities.Disposisi
	err := r.db.Preload("Surat").Preload("DariUser").Preload("KeUser").
		Where("ke_user_id = ?", userID).
		Offset(offset).Limit(limit).
		Order("created_at DESC").
		Find(&disposisi).Error
	return disposisi, err
}

func (r *disposisiRepository) GetMonitoring(filters map[string]interface{}, offset, limit int) ([]entities.Disposisi, int64, error) {
	var disposisi []entities.Disposisi
	var total int64

	query := r.db.Model(&entities.Disposisi{}).Preload("Surat").Preload("DariUser").Preload("KeUser")

	// Apply filters
	if status, ok := filters["status"].(string); ok && status != "" {
		query = query.Where("disposisi.status = ?", status)
	}
	if unitKerja, ok := filters["unit_kerja"].(string); ok && unitKerja != "" {
		query = query.Joins("JOIN users ON disposisi.ke_user_id = users.id").Where("users.unit_kerja ILIKE ?", "%"+unitKerja+"%")
	}
	if search, ok := filters["search"].(string); ok && search != "" {
		query = query.Joins("JOIN surat_masuk ON disposisi.surat_id = surat_masuk.id").
			Where("surat_masuk.nomor_surat ILIKE ? OR surat_masuk.perihal ILIKE ?", "%"+search+"%", "%"+search+"%")
	}

	// Count total
	query.Count(&total)

	// Get data with pagination
	err := query.Offset(offset).Limit(limit).Order("disposisi.created_at DESC").Find(&disposisi).Error

	return disposisi, total, err
}

func (r *disposisiRepository) Update(disposisi *entities.Disposisi) error {
	return r.db.Save(disposisi).Error
}

func (r *disposisiRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&entities.Disposisi{}, id).Error
}