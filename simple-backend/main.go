package main

import (
	"strings"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// SSO Authentication middleware
	ssoAuth := func(requiredRoles ...string) gin.HandlerFunc {
		return func(c *gin.Context) {
			authHeader := c.GetHeader("Authorization")
			if authHeader == "" {
				c.JSON(401, gin.H{"status": "error", "message": "Authorization header required"})
				c.Abort()
				return
			}

			token := strings.TrimPrefix(authHeader, "Bearer ")
			if token == "" {
				c.JSON(401, gin.H{"status": "error", "message": "Token required"})
				c.Abort()
				return
			}

			// Parse SSO token (format: sso_{sso_id}_{role}_token)
			parts := strings.Split(token, "_")
			if len(parts) < 4 || parts[0] != "sso" || parts[3] != "token" {
				c.JSON(401, gin.H{"status": "error", "message": "Invalid SSO token format"})
				c.Abort()
				return
			}

			userRole := parts[2]

			// Check if user has required role
			hasRequiredRole := false
			for _, requiredRole := range requiredRoles {
				if userRole == requiredRole {
					hasRequiredRole = true
					break
				}
			}

			if !hasRequiredRole {
				c.JSON(403, gin.H{"status": "error", "message": "Insufficient permissions"})
				c.Abort()
				return
			}

			// Store user info in context
			c.Set("sso_id", parts[1])
			c.Set("user_role", userRole)
			c.Next()
		}
	}

	// Simple API endpoints for testing
	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "success",
			"message": "E-Disposisi API is running",
		})
	})

	r.POST("/api/login", func(c *gin.Context) {
		var req struct {
			SSOID    string `json:"sso_id" binding:"required"`
			Email    string `json:"email" binding:"required"`
			Role     string `json:"role" binding:"required"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(400, gin.H{"status": "error", "message": err.Error()})
			return
		}

		// Validate role
		validRoles := []string{"operator", "kepala_opd", "staf"}
		isValidRole := false
		for _, role := range validRoles {
			if req.Role == role {
				isValidRole = true
				break
			}
		}

		if !isValidRole {
			c.JSON(400, gin.H{"status": "error", "message": "Role tidak valid"})
			return
		}

		// Demo SSO token generation (in production, use real SSO provider)
		token := "sso_" + req.SSOID + "_" + req.Role + "_token"

		c.JSON(200, gin.H{
			"status":  "success",
			"message": "SSO Login berhasil",
			"data": gin.H{
				"token": token,
				"user": gin.H{
					"sso_id": req.SSOID,
					"email": req.Email,
					"role": req.Role,
				},
			},
		})
	})

	r.GET("/api/disposisi/monitoring", ssoAuth("operator", "kepala_opd", "staf"), func(c *gin.Context) {
		userRole, _ := c.Get("user_role")

		// Different data based on role
		var disposisi []gin.H
		if userRole == "operator" {
			// Operator sees all disposisi
			disposisi = []gin.H{
				{
					"id":          "550e8400-e29b-41d4-a716-446655440000",
					"surat":       gin.H{"nomor_surat": "001/SM/2026", "perihal": "Permohonan Izin Keramaian"},
					"tujuan":      gin.H{"nama": "Staf Administrasi", "unit_kerja": "Bagian Umum", "role": "staf"},
					"batas_waktu": "2026-01-15",
					"status":      "pending",
					"prioritas":   "tinggi",
				},
				{
					"id":          "550e8400-e29b-41d4-a716-446655440001",
					"surat":       gin.H{"nomor_surat": "002/SM/2026", "perihal": "Laporan Kesehatan"},
					"tujuan":      gin.H{"nama": "Staf Kepegawaian", "unit_kerja": "Bagian SDM", "role": "staf"},
					"batas_waktu": "2026-01-20",
					"status":      "proses",
					"prioritas":   "sedang",
				},
			}
		} else if userRole == "kepala_opd" {
			// Kepala OPD sees disposisi they created
			disposisi = []gin.H{
				{
					"id":          "550e8400-e29b-41d4-a716-446655440000",
					"surat":       gin.H{"nomor_surat": "001/SM/2026", "perihal": "Permohonan Izin Keramaian"},
					"tujuan":      gin.H{"nama": "Staf Administrasi", "unit_kerja": "Bagian Umum", "role": "staf"},
					"batas_waktu": "2026-01-15",
					"status":      "pending",
					"prioritas":   "tinggi",
				},
			}
		} else if userRole == "staf" {
			// Staf sees disposisi assigned to them
			disposisi = []gin.H{
				{
					"id":          "550e8400-e29b-41d4-a716-446655440000",
					"surat":       gin.H{"nomor_surat": "001/SM/2026", "perihal": "Permohonan Izin Keramaian"},
					"dari":        gin.H{"nama": "Kepala OPD", "jabatan": "Kepala Dinas", "role": "kepala_opd"},
					"batas_waktu": "2026-01-15",
					"status":      "pending",
					"prioritas":   "tinggi",
					"instruksi":   "Proses permohonan izin dengan segera",
				},
			}
		}

		c.JSON(200, gin.H{
			"status": "success",
			"data": gin.H{
				"total":     len(disposisi),
				"page":      1,
				"limit":     10,
				"role":      userRole,
				"disposisi": disposisi,
			},
		})
	})

	r.POST("/api/disposisi", ssoAuth("kepala_opd"), func(c *gin.Context) {
		userRole, _ := c.Get("user_role")
		c.JSON(200, gin.H{
			"status":  "success",
			"message": "Disposisi created by " + userRole.(string),
			"data": gin.H{
				"id":     "550e8400-e29b-41d4-a716-446655440001",
				"status": "pending",
			},
		})
	})

	r.POST("/api/laporan", ssoAuth("staf"), func(c *gin.Context) {
		userRole, _ := c.Get("user_role")
		c.JSON(200, gin.H{
			"status":  "success",
			"message": "Laporan uploaded by " + userRole.(string),
			"data": gin.H{
				"id":       "550e8400-e29b-41d4-a716-446655440002",
				"foto_url": "/uploads/laporan/demo.jpg",
				"tanggal":  "2026-01-14",
			},
		})
	})

	r.Run(":8080")
}