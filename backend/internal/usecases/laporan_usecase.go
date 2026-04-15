package usecases

import (
	"e-disposisi/internal/entities"
	"e-disposisi/internal/repositories"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"

	"github.com/google/uuid"
)

type laporanUseCase struct {
	laporanRepo repositories.LaporanHasilRepository
	userRepo    repositories.UserRepository
	uploadPath  string
}

func NewLaporanUseCase(laporanRepo repositories.LaporanHasilRepository, userRepo repositories.UserRepository, uploadPath string) LaporanUseCase {
	return &laporanUseCase{laporanRepo: laporanRepo, userRepo: userRepo, uploadPath: uploadPath}
}

func (uc *laporanUseCase) UploadLaporan(disposisiID, userID uuid.UUID, uraian string, latitude, longitude float64, file multipart.File, header *multipart.FileHeader) (*entities.LaporanHasil, error) {
	// Validate user role
	user, err := uc.userRepo.GetByID(userID)
	if err != nil {
		return nil, errors.New("user not found")
	}
	if user.Role != "staf" {
		return nil, errors.New("only staf can upload laporan")
	}

	// Validate coordinates
	if latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180 {
		return nil, errors.New("invalid coordinates")
	}

	// Validate file size (5MB)
	if header.Size > 5*1024*1024 {
		return nil, errors.New("file size exceeds 5MB")
	}

	// Validate file type
	contentType := header.Header.Get("Content-Type")
	if contentType != "image/jpeg" && contentType != "image/png" {
		return nil, errors.New("only JPG and PNG files are allowed")
	}

	// Generate unique filename
	timestamp := time.Now().Unix()
	uuidStr := uuid.New().String()
	ext := filepath.Ext(header.Filename)
	filename := fmt.Sprintf("%d_%s%s", timestamp, uuidStr, ext)
	filePath := filepath.Join(uc.uploadPath, filename)

	// Ensure upload directory exists
	if err := os.MkdirAll(uc.uploadPath, 0755); err != nil {
		return nil, err
	}

	// Save file
	dst, err := os.Create(filePath)
	if err != nil {
		return nil, err
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		return nil, err
	}

	// Create laporan record
	laporan := &entities.LaporanHasil{
		DisposisiID:   disposisiID,
		UserID:        userID,
		Uraian:        uraian,
		FotoURL:       fmt.Sprintf("/uploads/laporan/%s", filename),
		Latitude:      &latitude,
		Longitude:     &longitude,
		TanggalLapor:  time.Now(),
	}

	err = uc.laporanRepo.Create(laporan)
	if err != nil {
		// Clean up file if database insert fails
		os.Remove(filePath)
		return nil, err
	}

	return laporan, nil
}

func (uc *laporanUseCase) GetByDisposisiID(disposisiID uuid.UUID) ([]entities.LaporanHasil, error) {
	return uc.laporanRepo.GetByDisposisiID(disposisiID)
}