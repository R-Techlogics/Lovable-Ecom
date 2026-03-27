export interface Users {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors: any;
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}