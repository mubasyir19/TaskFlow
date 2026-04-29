package routes

import (
	"backend/internal/database"
	"backend/internal/handlers"
	"backend/internal/middlewares"
	"backend/internal/repositories"
	"backend/internal/services"

	"github.com/gofiber/fiber/v3"
)

func UserRoutes(router fiber.Router) {
	db := database.GetDB()
	if db == nil {
		panic("Database not found")
	}

	userRepository := repositories.NewUserRepository(db)
	userService := services.NewUserService(userRepository)
	userHandler := handlers.NewUserHandler(userService)

	user := router.Group("/auth")
	{
		user.Post("/register", userHandler.Register)
		user.Post("/login", userHandler.Login)
	}

	protected := router.Group("/users", middlewares.AuthMiddleware())
	{
		protected.Get("/profile", userHandler.GetProfile)
	}

}
