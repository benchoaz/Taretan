package handlers

import (
	"net/http"
	"strconv"

	"e-disposisi/internal/entities"
	"e-disposisi/internal/middleware"
	"e-disposisi/internal/usecases"

	"github.com/gin-gonic/gin"
)

type SuratMasukHandler struct {
	suratMasukUseCase usecases.SuratMasukUseCase
}

func NewSuratMasukHandler(suratUC usecases.SuratMasukUseCase) *SuratMasukHandler {
	return &SuratMasukHandler{suratMasukUseCase: suratUC}
}

func (h *SuratMasukHandler) CreateSuratMasuk(c *gin.Context) {
	userClaims := middleware.GetUserClaims(c)
	if userClaims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "Unauthorized"})
		return
	}

	var surat entities.SuratMasuk
	if err := c.ShouldBindJSON(&surat); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	err := h.suratMasukUseCase.CreateSuratMasuk(&surat, userClaims.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status":  "success",
		"message": "Surat masuk berhasil dibuat",
		"data":    surat,
	})
}

func (h *SuratMasukHandler) GetSuratMasukList(c *gin.Context) {
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
	surats, err := h.suratMasukUseCase.ListSuratMasuk(offset, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data": gin.H{
			"page":  page,
			"limit": limit,
			"surat": surats,
		},
	})
}