export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

export interface ApiError {
  message: string;
  status?: number;
}
