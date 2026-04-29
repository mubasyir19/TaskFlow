package handlers

import (
	"backend/internal/models"
	"backend/internal/requests"
	"backend/internal/response"
	"backend/internal/services"
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
)

type taskHandler struct {
	service services.TaskService
}

func NewTaskHandler(service services.TaskService) *taskHandler {
	return &taskHandler{service}
}

func (h *taskHandler) GetTasks(c fiber.Ctx) error {
	// Get user ID from context (set by auth middleware)
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	req := requests.GetListTasksRequest{
		UserId: userID.(string),
	}

	// Parse completed filter
	if completed := c.Query("completed"); completed != "" {
		isCompleted, err := strconv.ParseBool(completed)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid completed parameter. Use true or false",
			})
		}
		req.IsCompleted = &isCompleted
	}

	// Parse search query
	if search := c.Query("search"); search != "" {
		req.Search = search
	}

	tasks, err := h.service.GetListTasks(req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// Return empty array instead of null if no tasks
	if tasks == nil {
		tasks = []models.Task{}
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Tasks retrieved successfully",
		"data":    tasks,
		"count":   len(tasks),
	})
}

// GetTaskByID
func (h *taskHandler) GetTaskByID(c fiber.Ctx) error {
	// Get task ID from URL parameter
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   "Task ID is required",
		})
	}

	// Get user ID from context
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"error":   "Unauthorized",
		})
	}

	task, err := h.service.GetTaskByID(id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}

	// Verify that task belongs to the user
	if task.UserID.String() != userID.(string) {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"success": false,
			"error":   "You don't have permission to access this task",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Task retrieved successfully",
		"data":    task,
	})
}

// Create Task
func (h *taskHandler) CreateTask(c fiber.Ctx) error {
	var req requests.AddTaskRequest

	// Parse request body
	if err := c.Bind().Body(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   "Invalid request format",
			"details": err.Error(),
		})
	}

	// Get user ID from context
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"error":   "Unauthorized",
		})
	}

	// Create task
	task, err := h.service.AddNewTask(userID.(string), &req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"message": "Task created successfully",
		"data":    task,
	})
}

// Update Task
func (h *taskHandler) UpdateTask(c fiber.Ctx) error {
	// Get task ID from URL parameter
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   "Task ID is required",
		})
	}

	var req requests.UpdateTaskRequest

	// Parse request body
	if err := c.Bind().Body(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   "Invalid request format",
			"details": err.Error(),
		})
	}

	// Get user ID from context
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"error":   "Unauthorized",
		})
	}

	// check if task exists and belongs to user
	existingTask, err := h.service.GetTaskByID(id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"error":   "Task not found",
		})
	}

	// Verify ownership
	if existingTask.UserID.String() != userID.(string) {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"success": false,
			"error":   "You don't have permission to update this task",
		})
	}

	// Update task
	updatedTask, err := h.service.UpdateTask(id, &req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}

	// Convert to response
	taskResponse := response.ToTaskResponse(updatedTask)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Task updated successfully",
		"data":    taskResponse,
	})
}

// DeleteTask menghapus task
func (h *taskHandler) DeleteTask(c fiber.Ctx) error {
	// Get task ID from URL parameter
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   "Task ID is required",
		})
	}

	// Get user ID from context
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"error":   "Unauthorized",
		})
	}

	// First, check if task exists and belongs to user
	existingTask, err := h.service.GetTaskByID(id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"error":   "Task not found",
		})
	}

	// Verify ownership
	if existingTask.UserID.String() != userID.(string) {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"success": false,
			"error":   "You don't have permission to delete this task",
		})
	}

	// Delete task
	if err := h.service.DeleteTask(id); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Task deleted successfully",
	})
}

func (h *taskHandler) GetTaskSummary(c fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"error":   "Unauthorized",
		})
	}

	req := requests.GetListTasksRequest{
		UserId: userID.(string),
	}

	tasks, err := h.service.GetListTasks(req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}

	// Calculate summary
	summary := map[string]int{
		"total":  len(tasks),
		"high":   0,
		"medium": 0,
		"low":    0,
	}

	for _, task := range tasks {
		switch task.Status {
		case "High":
			summary["high"]++
		case "Medium":
			summary["medium"]++
		case "Low":
			summary["low"]++
		}
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"data":    summary,
	})
}

func (h *taskHandler) UpdateTaskStatus(c fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "id is required",
		})
	}

	if _, err := uuid.Parse(id); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "invalid id format",
		})
	}

	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"error":   "Unauthorized",
		})
	}

	var req struct {
		IsCompleted bool `json:"is_completed"`
	}

	bodyString := string(c.Body())
	if bodyString == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "invalid request body, expected: { \"is_completed\": true/false }",
		})
	}

	if err := json.Unmarshal(c.Body(), &req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "invalid request body, expected: { \"is_completed\": true/false }",
		})
	}

	existingTask, err := h.service.GetTaskByID(id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"message": "task not found",
		})
	}

	if existingTask.UserID.String() != userID.(string) {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"success": false,
			"message": "You don't have permission to update this task",
		})
	}

	err = h.service.CompleteTask(id, req.IsCompleted)

	if err != nil {
		statusCode := fiber.StatusInternalServerError
		message := "failed to update task status"

		switch {
		case errors.Is(err, errors.New("task not found")) || err.Error() == "task not found":
			statusCode = fiber.StatusNotFound
			message = "task not found"
		case strings.Contains(err.Error(), "task not found"):
			statusCode = fiber.StatusNotFound
			message = "task not found"
		case strings.Contains(err.Error(), "task is already completed"):
			statusCode = fiber.StatusBadRequest
			message = "task is already completed"
		case strings.Contains(err.Error(), "task is already uncompleted"):
			statusCode = fiber.StatusBadRequest
			message = "task is already uncompleted"
		}

		return c.Status(statusCode).JSON(fiber.Map{
			"success": false,
			"message": message,
		})
	}

	task, err := h.service.GetTaskByID(id)
	if err != nil {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"success": true,
			"message": fmt.Sprintf("successfully updated task status to %v", req.IsCompleted),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": fmt.Sprintf("successfully updated task status to %v", req.IsCompleted),
		"data":    task,
	})
}
