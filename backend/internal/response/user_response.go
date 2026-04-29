package response

import "backend/internal/models"

type LoginResponse struct {
	Token string       `json:"token"`
	User  UserResponse `json:"user"`
}

type UserResponse struct {
	ID       string `json:"id"`
	Fullname string `json:"fullname"`
	Email    string `json:"email"`
}

func ToUserResponse(user *models.User) UserResponse {
	return UserResponse{
		ID:       user.ID.String(),
		Fullname: user.Fullname,
		Email:    user.Email,
	}
}
