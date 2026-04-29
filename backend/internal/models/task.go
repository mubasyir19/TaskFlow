package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Fullname  string    `json:"fullname"`
	Email     string    `gorm:"unique" json:"email"`
	Password  string    `json:"-"`
	Task      []Task    `gorm:"foreignKey:UserID" json:"tasks,omitempty"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}

type TaskStatus string

const (
	TaskStatusHigh   TaskStatus = "High"
	TaskStatusMedium TaskStatus = "Medium"
	TaskStatusLow    TaskStatus = "Low"
)

type Task struct {
	ID          uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Title       string     `gorm:"not null" json:"title"`
	Description string     `json:"description"`
	Status      TaskStatus `gorm:"type:varchar(20);not null;default:Medium" json:"status"`
	DueDate     time.Time  `gorm:"column:due_date" json:"due_date"`
	IsCompleted bool       `gorm:"column:is_completed;default:false" json:"is_completed"`
	UserID      uuid.UUID  `gorm:"type:uuid;not null" json:"user_id"`
	CreatedAt   time.Time  `gorm:"created_at"`
	UpdatedAt   time.Time  `gorm:"updated_at"`

	User User `gorm:"foreignKey:UserID;reference:ID;constraint:onDelete:CASCADE"`
}

func (u *Task) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}
