export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
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
