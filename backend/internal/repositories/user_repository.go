package repositories

import (
	"backend/internal/models"
	"errors"
	"fmt"

	"gorm.io/gorm"
)

type UserRepository interface {
	Create(user *models.User) error
	FindByID(id string) (*models.User, error)
	FindByEmail(email string) (*models.User, error)
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db}
}

func (r *userRepository) Create(user *models.User) error {
	if err := r.db.Create(user).Error; err != nil {
		return fmt.Errorf("create user: %w", err)
	}

	return nil
}

func (r *userRepository) FindByID(id string) (*models.User, error) {
	var user models.User
	if err := r.db.Where("id = ?", id).Error; err != nil {
		return nil, fmt.Errorf("find by id user: %w", err)
	}

	return &user, nil
}

func (r *userRepository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("find by email user: %w", err)
	}

	return &user, nil
}
