package response

import (
	"backend/internal/models"
	"time"
)

type TaskResponse struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	IsCompleted bool      `json:"is_completed"`
	DueDate     time.Time `json:"due_date"`
	UserID      string    `json:"user_id"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func ToTaskResponse(task *models.Task) *TaskResponse {
	if task == nil {
		return nil
	}

	return &TaskResponse{
		ID:          task.ID.String(),
		Title:       task.Title,
		Description: task.Description,
		Status:      string(task.Status),
		IsCompleted: task.IsCompleted,
		DueDate:     task.DueDate,
		UserID:      task.UserID.String(),
		CreatedAt:   task.CreatedAt,
		UpdatedAt:   task.UpdatedAt,
	}
}
