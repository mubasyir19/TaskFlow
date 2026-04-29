package requests

import (
	"backend/internal/models"
	"time"
)

type GetListTasksRequest struct {
	UserId      string `json:"userId"`
	IsCompleted *bool  `json:"is_completed"`
	Search      string `json:"search"`
}

type AddTaskRequest struct {
	Title       string            `json:"title" binding:"required"`
	Description string            `json:"description"`
	Status      string            `json:"status" binding:"required"`
	DueDate     models.CustomDate `json:"due_date" binding:"required"`
}

type UpdateTaskRequest struct {
	Title       string    `json:"title" binding:"required"`
	Description string    `json:"description"`
	Status      string    `json:"status" binding:"required"`
	DueDate     time.Time `json:"due_date" binding:"required"`
	IsCompleted *bool     `json:"is_completed"`
}
