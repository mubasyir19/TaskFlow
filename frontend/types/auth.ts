export interface User {
  id: string;
  fullname: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
}
