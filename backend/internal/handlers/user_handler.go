package handlers

import (
	"backend/internal/requests"
	"backend/internal/services"

	"github.com/gofiber/fiber/v3"
)

type userHandler struct {
	service services.UserService
}

func NewUserHandler(service services.UserService) *userHandler {
	return &userHandler{service: service}
}

func (h *userHandler) Register(c fiber.Ctx) error {
	var req requests.RegisterRequest

	if err := c.Bind().Body(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   "Invalid request format",
			"details": err.Error(),
		})
	}

	registerResponse, err := h.service.Register(&req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "register successful",
		"data":    registerResponse,
	})
}

func (h *userHandler) Login(c fiber.Ctx) error {
	var req requests.LoginRequest

	if err := c.Bind().Body(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   "Invalid request format",
			"details": err.Error(),
		})
	}

	loginResponse, err := h.service.Login(req)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "login successful",
		"data":    loginResponse,
	})
}

func (h *userHandler) GetProfile(c fiber.Ctx) error {
	// Get user ID from context (set by middleware)
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	user, err := h.service.GetProfile(userID.(string))
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": user,
	})
}
