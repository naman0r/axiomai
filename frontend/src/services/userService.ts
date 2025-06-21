// User service - handles all user-related API calls
// No business logic here, just API communication

interface CreateUserPayload {
  id: string; // Clerk user ID
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
}

interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class UserService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  async createUser(userData: CreateUserPayload): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error("Failed to create user:", error);
      return {
        error: error instanceof Error ? error.message : "Failed to create user",
      };
    }
  }

  async syncUser(userData: CreateUserPayload): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/users/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error("Failed to sync user:", error);
      return {
        error: error instanceof Error ? error.message : "Failed to sync user",
      };
    }
  }
}

// Export singleton instance
export const userService = new UserService();
export type { CreateUserPayload, ApiResponse };
