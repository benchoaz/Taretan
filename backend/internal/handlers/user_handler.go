package handlers

import (
	"net/http"

	"e-disposisi/internal/usecases"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userUseCase usecases.UserUseCase
}

func NewUserHandler(userUC usecases.UserUseCase) *UserHandler {
	return &UserHandler{userUseCase: userUC}
}

func (h *UserHandler) GetUsers(c *gin.Context) {
	users, err := h.userUseCase.GetUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data": users,
	})
}