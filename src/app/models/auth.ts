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

export interface AuthData {
  token: string;
  user: UserDto;
  expiresIn: number;
}

export interface AuthResponse {
  success: boolean;
  data: AuthData;
  message: string;
  errors: any;
  totalCount: number | null;
  page: number | null;
  pageSize: number | null;
  totalPages: number | null;
}
