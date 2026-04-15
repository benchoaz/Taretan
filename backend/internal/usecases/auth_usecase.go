package usecases

import (
	"e-disposisi/internal/entities"
	"e-disposisi/internal/repositories"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type authUseCase struct {
	userRepo repositories.UserRepository
	secret   string
}

func NewAuthUseCase(userRepo repositories.UserRepository, secret string) AuthUseCase {
	return &authUseCase{userRepo: userRepo, secret: secret}
}

func (uc *authUseCase) Login(email, password string) (string, error) {
	user, err := uc.userRepo.GetByEmail(email)
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	if user.Status != "aktif" {
		return "", errors.New("account is not active")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(uc.secret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func (uc *authUseCase) ValidateToken(tokenString string) (*entities.User, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(uc.secret), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID, err := uuid.Parse(claims["user_id"].(string))
		if err != nil {
			return nil, err
		}
		return uc.userRepo.GetByID(userID)
	}

	return nil, errors.New("invalid token")
}