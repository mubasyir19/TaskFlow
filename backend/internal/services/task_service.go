package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"backend/internal/requests"
	"backend/internal/response"
	"errors"
	"fmt"
	"strings"

	"github.com/google/uuid"
)

type TaskService interface {
	// GetListTasks(userId string) ([]models.Task, error)
	GetListTasks(req requests.GetListTasksRequest) ([]models.Task, error)
	GetTaskByID(id string) (*models.Task, error)
	AddNewTask(userID string, req *requests.AddTaskRequest) (*response.TaskResponse, error)
	UpdateTask(id string, req *requests.UpdateTaskRequest) (*models.Task, error)
	DeleteTask(id string) error
}

type taskService struct {
	repositories repositories.TaskRepository
}

func NewTaskService(repository repositories.TaskRepository) TaskService {
	return &taskService{repository}
}

func (s *taskService) GetListTasks(req requests.GetListTasksRequest) ([]models.Task, error) {
	tasks, err := s.repositories.FindAll(req)
	if err != nil {
		return nil, errors.New("failed get list tasks")
	}

	return tasks, nil
}

func (s *taskService) GetTaskByID(id string) (*models.Task, error) {
	task, err := s.repositories.FindByID(id)
	if err != nil {
		return nil, errors.New("fauiled to get detail task")
	}

	if task == nil {
		return nil, errors.New("task not found")
	}

	return task, nil
}

func (s *taskService) AddNewTask(userID string, req *requests.AddTaskRequest) (*response.TaskResponse, error) {
	if req.Title == "" || req.Status == "" {
		return nil, errors.New("title, status, and due date are required")
	}

	if req.DueDate.Time().IsZero() {
		return nil, errors.New("due date is required")
	}

	// Validate status value
	validStatus := false
	validStatuses := []string{"High", "Medium", "Low"}
	for _, status := range validStatuses {
		if strings.EqualFold(req.Status, status) {
			req.Status = status
			validStatus = true
			break
		}
	}

	if !validStatus {
		return nil, errors.New("invalid status. Status must be High, Medium, or Low")
	}

	isCompleted := false
	if strings.EqualFold(req.Status, "Completed") {
		isCompleted = true
	}

	userUUID, err := uuid.Parse(userID)
	if err != nil {
		return nil, errors.New("invalid user ID format")
	}

	newTask := models.Task{
		Title:       req.Title,
		Description: req.Description,
		Status:      models.TaskStatus(req.Status),
		IsCompleted: isCompleted,
		DueDate:     req.DueDate.Time(),
		UserID:      userUUID,
	}

	if err := s.repositories.Create(&newTask); err != nil {
		return nil, fmt.Errorf("failed to create new task: %w", err)
	}

	return response.ToTaskResponse(&newTask), nil
}

func (s *taskService) UpdateTask(id string, req *requests.UpdateTaskRequest) (*models.Task, error) {
	existingTask, err := s.repositories.FindByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to find task: %w", err)
	}

	if existingTask == nil {
		return nil, errors.New("task not found")
	}

	if req.Title != "" {
		existingTask.Title = req.Title
	}

	// Description can be updated to empty string (optional)
	if req.Description != existingTask.Description {
		existingTask.Description = req.Description
	}

	if req.Status != "" {
		// Validate status value
		validStatus := false
		validStatuses := []string{"High", "Medium", "Low"}
		for _, status := range validStatuses {
			if strings.EqualFold(req.Status, status) {
				req.Status = status
				validStatus = true
				break
			}
		}

		if !validStatus {
			return nil, errors.New("invalid status. Status must be High, Medium, or Low")
		}
		existingTask.Status = models.TaskStatus(req.Status)
		if strings.EqualFold(req.Status, "Completed") {
			existingTask.IsCompleted = true
		} else {
			existingTask.IsCompleted = false
		}
	}

	if req.IsCompleted != nil { // Assuming req.IsCompleted is *bool
		existingTask.IsCompleted = *req.IsCompleted

		// Sync Status based on IsCompleted
		if *req.IsCompleted {
			existingTask.Status = models.TaskStatus("Completed")
		} else if existingTask.Status == models.TaskStatus("Completed") {
			// If task was completed but now marked incomplete, set to default status
			existingTask.Status = models.TaskStatus("Pending")
		}
	}

	if !req.DueDate.IsZero() {
		existingTask.DueDate = req.DueDate
	}

	if err := s.repositories.Update(existingTask); err != nil {
		return nil, fmt.Errorf("failed to update task: %w", err)
	}

	return existingTask, nil
}

func (s *taskService) DeleteTask(id string) error {
	existingTask, err := s.repositories.FindByID(id)
	if err != nil {
		return fmt.Errorf("failed to find task: %w", err)
	}

	if existingTask == nil {
		return errors.New("task not found")
	}

	// Delete task
	if err := s.repositories.Delete(id); err != nil {
		return fmt.Errorf("failed to delete task: %w", err)
	}

	return nil
}
