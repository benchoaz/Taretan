package handlers

import (
	"net/http"
	"strconv"
	"time"

	"e-disposisi/internal/entities"
	"e-disposisi/internal/middleware"
	"e-disposisi/internal/usecases"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type DisposisiHandler struct {
	disposisiUseCase usecases.DisposisiUseCase
}

func NewDisposisiHandler(disposisiUC usecases.DisposisiUseCase) *DisposisiHandler {
	return &DisposisiHandler{disposisiUseCase: disposisiUC}
}

func (h *DisposisiHandler) CreateDisposisi(c *gin.Context) {
	userClaims := middleware.GetUserClaims(c)
	if userClaims.Role != "pimpinan" {
		c.JSON(http.StatusForbidden, gin.H{"status": "error", "message": "Hanya pimpinan yang dapat membuat disposisi"})
		return
	}

	var req struct {
		SuratID       string `json:"surat_id" binding:"required"`
		KeUserID      string `json:"ke_user_id" binding:"required"`
		Instruksi     string `json:"instruksi" binding:"required"`
		JenisDisposisi string `json:"jenis_disposisi" binding:"required"`
		BatasWaktu    string `json:"batas_waktu"`
		Prioritas     string `json:"prioritas"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	suratID, err := uuid.Parse(req.SuratID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "surat_id tidak valid"})
		return
	}

	keUserID, err := uuid.Parse(req.KeUserID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "ke_user_id tidak valid"})
		return
	}

	disposisi := &entities.Disposisi{
		SuratID:       suratID,
		KeUserID:      keUserID,
		Instruksi:     req.Instruksi,
		JenisDisposisi: req.JenisDisposisi,
		Prioritas:     req.Prioritas,
	}

	if req.BatasWaktu != "" {
		batasWaktu, err := time.Parse("2006-01-02", req.BatasWaktu)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "format batas_waktu tidak valid"})
			return
		}
		disposisi.BatasWaktu = &batasWaktu
	}

	err = h.disposisiUseCase.CreateDisposisi(disposisi, userClaims.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Disposisi berhasil dikirim",
		"data": gin.H{
			"id":         disposisi.ID,
			"status":     disposisi.Status,
			"created_at": disposisi.CreatedAt,
		},
	})
}

func (h *DisposisiHandler) GetMonitoring(c *gin.Context) {
	filters := make(map[string]interface{})

	if status := c.Query("status"); status != "" {
		filters["status"] = status
	}
	if unitKerja := c.Query("unit_kerja"); unitKerja != "" {
		filters["unit_kerja"] = unitKerja
	}
	if search := c.Query("search"); search != "" {
		filters["search"] = search
	}

	page := 1
	limit := 10
	if p := c.Query("page"); p != "" {
		if parsed, err := strconv.Atoi(p); err == nil && parsed > 0 {
			page = parsed
		}
	}
	if l := c.Query("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil && parsed > 0 && parsed <= 100 {
			limit = parsed
		}
	}

	disposisi, total, err := h.disposisiUseCase.GetMonitoring(filters, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data": gin.H{
			"total":     total,
			"page":      page,
			"limit":     limit,
			"disposisi": disposisi,
		},
	})
}

func (h *DisposisiHandler) GetSuratMasukList(c *gin.Context) {
	page := 1
	limit := 10
	if p := c.Query("page"); p != "" {
		if parsed, err := strconv.Atoi(p); err == nil && parsed > 0 {
			page = parsed
		}
	}
	if l := c.Query("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil && parsed > 0 && parsed <= 100 {
			limit = parsed
		}
	}

	offset := (page - 1) * limit

	suratMasuk, err := h.disposisiUseCase.GetSuratMasukList(offset, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data": gin.H{
			"page":       page,
			"limit":      limit,
			"surat_masuk": suratMasuk,
		},
	})
}