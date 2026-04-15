package middleware

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"e-disposisi/internal/usecases"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type UserClaims struct {
	UserID uuid.UUID `json:"user_id"`
	Role   string    `json:"role"`
}

func GetUserClaims(c *gin.Context) *UserClaims {
	claims, exists := c.Get("user_claims")
	if !exists {
		return nil
	}
	return claims.(*UserClaims)
}

func AuthMiddleware(authUC usecases.AuthUseCase) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "Authorization header required"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		user, err := authUC.ValidateToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "Invalid token"})
			c.Abort()
			return
		}

		claims := &UserClaims{
			UserID: user.ID,
			Role:   user.Role,
		}
		c.Set("user_claims", claims)
		c.Next()
	}
}

func LoggerMiddleware() gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return fmt.Sprintf(
			"[%s] %s %s %d %s %s\n",
			param.TimeStamp.Format(time.RFC1123),
			param.Method,
			param.Path,
			param.StatusCode,
			param.Latency,
			param.ClientIP,
		)
	})
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

func RateLimitMiddleware() gin.HandlerFunc {
	// Simple in-memory rate limiter (for production, use Redis)
	requests := make(map[string][]time.Time)
	return func(c *gin.Context) {
		ip := c.ClientIP()
		now := time.Now()

		// Clean old requests
		for i, t := range requests[ip] {
			if now.Sub(t) > time.Minute {
				requests[ip] = requests[ip][i+1:]
				break
			}
		}

		if len(requests[ip]) >= 100 { // 100 requests per minute
			c.JSON(http.StatusTooManyRequests, gin.H{"status": "error", "message": "Rate limit exceeded"})
			c.Abort()
			return
		}

		requests[ip] = append(requests[ip], now)
		c.Next()
	}
}