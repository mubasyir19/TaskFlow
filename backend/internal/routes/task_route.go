package routes

import (
	"backend/internal/database"
	"backend/internal/handlers"
	"backend/internal/middlewares"
	"backend/internal/repositories"
	"backend/internal/services"

	"github.com/gofiber/fiber/v3"
)

func TaskRoutes(router fiber.Router) {
	db := database.GetDB()
	if db == nil {
		panic("Database not found")
	}

	taskRepository := repositories.NewTaskRepository(db)
	taskService := services.NewTaskService(taskRepository)
	taskHandler := handlers.NewTaskHandler(taskService)

	taskRoutes := router.Group("/tasks", middlewares.AuthMiddleware())

	taskRoutes.Get("/", taskHandler.GetTasks)              // Get all tasks -> ?completed=true&search=meeting
	taskRoutes.Get("/summary", taskHandler.GetTaskSummary) // Get task summary by status
	taskRoutes.Get("/:id", taskHandler.GetTaskByID)        // Get task by ID
	taskRoutes.Post("/add", taskHandler.CreateTask)        // Create new task
	taskRoutes.Put("/:id", taskHandler.UpdateTask)         // Update existing task
	taskRoutes.Delete("/:id", taskHandler.DeleteTask)      // Delete task
}
