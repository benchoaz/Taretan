package handlers

import (
	"net/http"
	"strconv"

	"e-disposisi/internal/middleware"
	"e-disposisi/internal/usecases"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type LaporanHandler struct {
	laporanUseCase usecases.LaporanUseCase
}

func NewLaporanHandler(laporanUC usecases.LaporanUseCase) *LaporanHandler {
	return &LaporanHandler{laporanUseCase: laporanUC}
}

func (h *LaporanHandler) UploadLaporan(c *gin.Context) {
	userClaims := middleware.GetUserClaims(c)
	if userClaims.Role != "staf" {
		c.JSON(http.StatusForbidden, gin.H{"status": "error", "message": "Hanya staf yang dapat upload laporan"})
		return
	}

	disposisiIDStr := c.PostForm("disposisi_id")
	disposisiID, err := uuid.Parse(disposisiIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "disposisi_id tidak valid"})
		return
	}

	uraian := c.PostForm("uraian")
	if uraian == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "uraian wajib diisi"})
		return
	}

	latitudeStr := c.PostForm("latitude")
	longitudeStr := c.PostForm("longitude")
	latitude, errLat := strconv.ParseFloat(latitudeStr, 64)
	longitude, errLng := strconv.ParseFloat(longitudeStr, 64)
	if errLat != nil || errLng != nil || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180 {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "latitude/longitude tidak valid"})
		return
	}

	file, header, err := c.Request.FormFile("foto")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "file foto wajib diupload"})
		return
	}
	defer file.Close()

	// Validate file type and size
	if header.Size > 5*1024*1024 { // 5MB
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "ukuran file maksimal 5MB"})
		return
	}
	contentType := header.Header.Get("Content-Type")
	if contentType != "image/jpeg" && contentType != "image/png" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "hanya file JPG atau PNG yang diperbolehkan"})
		return
	}

	laporan, err := h.laporanUseCase.UploadLaporan(disposisiID, userClaims.UserID, uraian, latitude, longitude, file, header)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"message": "Laporan berhasil dikirim",
		"data": gin.H{
			"id": laporan.ID,
			"foto_url": laporan.FotoURL,
			"tanggal": laporan.TanggalLapor,
		},
	})
}