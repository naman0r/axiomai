import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiResponse } from "../types/api";

export interface RequestConfig extends AxiosRequestConfig {}

export interface IApiClient {
  get<T>(endpoint: string, config?: RequestConfig): Promise<T>;
  post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T>;
  put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T>;
  delete<T>(endpoint: string, config?: RequestConfig): Promise<T>;
}

class ApiClient implements IApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = "http://localhost:8000") {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for auth and logging
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available (Clerk will handle this)
        const token = localStorage.getItem("auth_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(
          `API Request: ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      (error) => {
        console.error("Request Error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling and data extraction
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<any>>) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);

        // Extract data from the ApiResponse wrapper
        if (
          response.data &&
          typeof response.data === "object" &&
          "data" in response.data
        ) {
          return response.data.data;
        }

        // Fallback to full response data
        return response.data;
      },
      (error) => {
        console.error("Response Error:", error);

        // Handle different error scenarios
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          console.warn("Unauthorized access - redirecting to login");
          // Remove invalid token
          localStorage.removeItem("auth_token");
          // In a real app, you'd redirect to login page
          // window.location.href = '/sign-in';
        }

        if (error.response?.status === 404) {
          console.warn("Resource not found");
        }

        if (error.response?.status >= 500) {
          console.error("Server error occurred");
        }

        // Extract error message from response
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.errors?.[0] ||
          error.message ||
          "An unexpected error occurred";

        return Promise.reject(new Error(errorMessage));
      }
    );
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.client.get(endpoint, config);
  }

  async post<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.client.post(endpoint, data, config);
  }

  async put<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.client.put(endpoint, data, config);
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.client.delete(endpoint, config);
  }
}

export const apiClient = new ApiClient();
