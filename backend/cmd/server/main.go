package main

import (
	"log"

	"e-disposisi/internal/config"
	"e-disposisi/internal/entities"
	"e-disposisi/internal/handlers"
	"e-disposisi/internal/middleware"
	"e-disposisi/internal/repositories"
	"e-disposisi/internal/usecases"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	godotenv.Load()

	cfg := config.LoadConfig()

	// Initialize database
	db, err := config.InitDB(cfg)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto migrate
	db.AutoMigrate(&entities.User{}, &entities.UnitKerja{}, &entities.SuratMasuk{}, &entities.Disposisi{}, &entities.LaporanHasil{}, &entities.LogAktivitas{})

	// Initialize repositories
	userRepo := repositories.NewUserRepository(db)
	disposisiRepo := repositories.NewDisposisiRepository(db)
	laporanRepo := repositories.NewLaporanHasilRepository(db)
	suratRepo := repositories.NewSuratMasukRepository(db)

	// Initialize usecases
	authUC := usecases.NewAuthUseCase(userRepo, cfg.JWTSecret)
	disposisiUC := usecases.NewDisposisiUseCase(disposisiRepo, userRepo, suratRepo)
	laporanUC := usecases.NewLaporanUseCase(laporanRepo, userRepo, "uploads/laporan")
	userUC := usecases.NewUserUseCase(userRepo)
	suratUC := usecases.NewSuratMasukUseCase(suratRepo)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authUC)
	disposisiHandler := handlers.NewDisposisiHandler(disposisiUC)
	laporanHandler := handlers.NewLaporanHandler(laporanUC)
	userHandler := handlers.NewUserHandler(userUC)
	suratHandler := handlers.NewSuratMasukHandler(suratUC)

	// Initialize Gin
	r := gin.Default()

	// Global middleware
	r.Use(middleware.LoggerMiddleware())
	r.Use(middleware.CORSMiddleware())
	r.Use(middleware.RateLimitMiddleware())

	// Serve static files
	r.Static("/uploads", "uploads")

	// API routes
	r.POST("/api/login", authHandler.Login)

	api := r.Group("/api")
	api.Use(middleware.AuthMiddleware(authUC))
	{
		api.POST("/disposisi", disposisiHandler.CreateDisposisi)
		api.GET("/disposisi/monitoring", disposisiHandler.GetMonitoring)
		api.POST("/laporan", laporanHandler.UploadLaporan)
		api.GET("/disposisi/surat-masuk", disposisiHandler.GetSuratMasukList) // From Disposisi logic
		api.GET("/surat-masuk", suratHandler.GetSuratMasukList)               // From Surat logic
		api.POST("/surat-masuk", suratHandler.CreateSuratMasuk)
		api.GET("/users", userHandler.GetUsers)
	}

	log.Println("Server starting on :8080")
	r.Run(":8080")
}