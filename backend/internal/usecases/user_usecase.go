package usecases

import (
	"e-disposisi/internal/entities"
	"e-disposisi/internal/repositories"
	"github.com/google/uuid"
)

type userUseCase struct {
	userRepo repositories.UserRepository
}

func NewUserUseCase(userRepo repositories.UserRepository) UserUseCase {
	return &userUseCase{userRepo: userRepo}
}

func (uc *userUseCase) GetProfile(userID uuid.UUID) (*entities.User, error) {
	return uc.userRepo.GetByID(userID)
}

func (uc *userUseCase) UpdateProfile(user *entities.User) error {
	return uc.userRepo.Update(user)
}

func (uc *userUseCase) GetUsers() ([]entities.User, error) {
	return uc.userRepo.GetAll()
}