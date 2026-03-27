export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: UserDto;
  expiresIn: number;
}
