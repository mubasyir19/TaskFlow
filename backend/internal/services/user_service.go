package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"backend/internal/requests"
	"backend/internal/response"
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	Register(req *requests.RegisterRequest) (*models.User, error)
	GenerateToken(user *models.User) (string, error)
	Login(req requests.LoginRequest) (*response.LoginResponse, error)
	GetProfile(id string) (*response.UserResponse, error)
}

type userService struct {
	repository repositories.UserRepository
}

func NewUserService(repository repositories.UserRepository) UserService {
	return &userService{repository: repository}
}

func (s *userService) Register(req *requests.RegisterRequest) (*models.User, error) {
	if req.Password == "" {
		return nil, errors.New("password is required")
	}

	if req.ConfirmPassword == "" {
		return nil, errors.New("confirm password is required")
	}

	if req.Password != req.ConfirmPassword {
		return nil, errors.New("password doesn't match with confirm password")
	}

	existingUser, err := s.repository.FindByEmail(req.Email)
	if err != nil {
		return nil, fmt.Errorf("check existing user: %w", err)
	}
	if existingUser != nil {
		return nil, errors.New("email already exists")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	user := models.User{
		Fullname: req.Fullname,
		Email:    req.Email,
		Password: string(hashedPassword),
	}

	if err := s.repository.Create(&user); err != nil {
		return nil, fmt.Errorf("failed to create new user: %w", err)
	}

	user.Password = ""
	return &user, nil
}

func (s *userService) GenerateToken(user *models.User) (string, error) {
	secretKey := os.Getenv("SECRET_KEY")
	if secretKey == "" {
		return "", errors.New("missing secret key")
	}

	claims := jwt.MapClaims{
		"user_id":  user.ID,
		"fullname": user.Fullname,
		"email":    user.Email,
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

func (s *userService) Login(req requests.LoginRequest) (*response.LoginResponse, error) {
	if req.Email == "" {
		return nil, errors.New("email required")
	}

	if req.Password == "" {
		return nil, errors.New("password required")
	}

	existingUser, err := s.repository.FindByEmail(req.Email)
	if err != nil {
		return nil, fmt.Errorf("check existing user: %w", err)
	}

	if existingUser == nil {
		return nil, errors.New("invalid email or password")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(existingUser.Password), []byte(req.Password)); err != nil {
		return nil, fmt.Errorf("compare password: %w", err)
	}

	token, err := s.GenerateToken(existingUser)
	if err != nil {
		return nil, fmt.Errorf("generate token: %w", err)
	}

	existingUser.Password = ""
	return &response.LoginResponse{
		Token: token,
		User:  response.ToUserResponse(existingUser),
	}, nil
}

func (s *userService) GetProfile(id string) (*response.UserResponse, error) {
	userID, err := uuid.Parse(id)
	if err != nil {
		return nil, errors.New("invalid user id")
	}

	user, err := s.repository.FindByID(userID.String())
	if err != nil {
		return nil, fmt.Errorf("get profile user : %w", err)
	}

	if user == nil {
		return nil, errors.New("user not found")
	}

	userResponse := response.ToUserResponse(user)
	return &userResponse, nil
}
