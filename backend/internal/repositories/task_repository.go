package repositories

import (
	"backend/internal/models"
	"backend/internal/requests"
	"fmt"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TaskRepository interface {
	// FindAll(userId string) ([]models.Task, error)
	FindAll(req requests.GetListTasksRequest) ([]models.Task, error)
	FindByID(id string) (*models.Task, error)
	FindByStatus(status string) (*models.Task, error)
	Create(task *models.Task) error
	Update(task *models.Task) error
	Delete(id string) error
}

type taskRepository struct {
	db *gorm.DB
}

func NewTaskRepository(db *gorm.DB) TaskRepository {
	return &taskRepository{db}
}

// func (r *taskRepository) FindAll(userId string) ([]models.Task, error) {
func (r *taskRepository) FindAll(req requests.GetListTasksRequest) ([]models.Task, error) {
	query := r.db.Where("user_id = ? ", req.UserId)

	// filter by isCompleted
	if req.IsCompleted != nil {
		query = query.Where("is_completed = ?", *req.IsCompleted)
	}

	// filter by search
	if req.Search != "" {
		searchPattern := "%" + req.Search + "%"
		query = query.Where("title ILIKE ? OR description ILIKE ?", searchPattern, searchPattern)
	}

	var tasks []models.Task
	// if err := r.db.Where("user_id = ?", userId).Find(&tasks).Error; err != nil {
	// 	return nil, fmt.Errorf("find all task: %w", err)
	// }

	err := query.Find(&tasks).Error

	return tasks, err
}

func (r *taskRepository) FindByID(id string) (*models.Task, error) {
	var task models.Task
	if err := r.db.Where("id = ? ", id).First(&task).Error; err != nil {
		return nil, fmt.Errorf("find by id task: %w", err)
	}

	return &task, nil
}

func (r *taskRepository) FindByStatus(status string) (*models.Task, error) {
	var task models.Task
	if err := r.db.Where("status = ? ", status).First(&task).Error; err != nil {
		return nil, fmt.Errorf("find by status task: %w", err)
	}

	return &task, nil
}

func (r *taskRepository) Create(task *models.Task) error {
	if err := r.db.Create(task).Error; err != nil {
		return fmt.Errorf("create task: %w", err)
	}

	return nil
}

func (r *taskRepository) Update(task *models.Task) error {
	if err := r.db.Save(&task).Error; err != nil {
		return fmt.Errorf("update task: %w", err)
	}

	return nil
}

func (r *taskRepository) Delete(id string) error {
	taskUUID, err := uuid.Parse(id)
	if err != nil {
		return fmt.Errorf("invalid task ID format: %w", err)
	}

	if err := r.db.Where("id = ?", taskUUID).Delete(&models.Task{}).Error; err != nil {
		return fmt.Errorf("delete task: %w", err)
	}

	return nil
}
