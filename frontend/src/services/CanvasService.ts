import {
  ConnectCanvasData,
  CanvasCourse,
  ImportCanvasCoursesData,
  CanvasConnection,
  CanvasConnectionResponse,
  CanvasError,
} from "@/types/canvas";
import { Course } from "@/types/course";
import { ICanvasService } from "./interfaces/ICanvasService";
import { IApiClient } from "@/lib/api-client";

export class CanvasService implements ICanvasService {
  constructor(private apiClient: IApiClient) {}

  /**
   * Connects to Canvas and stores the connection details
   * SECURITY NOTE: Access tokens should be encrypted in the backend before storage
   * @param data - The connection data including domain and access token
   * @returns A promise that resolves when the connection is established
   */
  async connectCanvas(
    data: ConnectCanvasData
  ): Promise<CanvasConnectionResponse> {
    try {
      const response = await this.apiClient.post<CanvasConnectionResponse>(
        "/api/canvas/connect",
        data
      );
      return response;
    } catch (error) {
      console.error("Canvas connection failed:", error);
      throw this.handleCanvasError(error, "Failed to connect to Canvas");
    }
  }

  /**
   * Disconnects from Canvas and removes the connection details
   * @returns A promise that resolves when the connection is removed
   */
  async disconnectCanvas(): Promise<void> {
    try {
      await this.apiClient.delete("/api/canvas/disconnect");
    } catch (error) {
      console.error("Canvas disconnection failed:", error);
      throw this.handleCanvasError(error, "Failed to disconnect from Canvas");
    }
  }

  /**
   * Fetches the list of courses from Canvas
   * @returns A promise that resolves with the list of courses
   */
  async fetchCanvasCourses(actualUserId?: string): Promise<CanvasCourse[]> {
    try {
      const endpoint = actualUserId
        ? `/api/canvas/courses?actualUserId=${encodeURIComponent(actualUserId)}`
        : "/api/canvas/courses";
      const response = await this.apiClient.get<CanvasCourse[]>(endpoint);
      return response;
    } catch (error) {
      console.error("Failed to fetch Canvas courses:", error);
      throw this.handleCanvasError(error, "Failed to fetch Canvas courses");
    }
  }

  /**
   * Imports the list of courses from Canvas
   * @param data - The data containing the course IDs to import
   * @returns A promise that resolves with the imported courses
   */
  async importCanvasCourses(data: ImportCanvasCoursesData): Promise<Course[]> {
    try {
      const response = await this.apiClient.post<Course[]>(
        "/api/canvas/import-courses",
        data
      );
      return response;
    } catch (error) {
      console.error("Canvas course import failed:", error);
      throw this.handleCanvasError(error, "Failed to import Canvas courses");
    }
  }

  /**
   * Retrieves the current connection status of Canvas
   * Note: This is a workaround since the backend doesn't have a dedicated status endpoint
   * @returns A promise that resolves with the connection status
   */
  async getCanvasStatus(): Promise<CanvasConnection> {
    try {
      // Option 1: Try to fetch courses to test connection
      // If this succeeds, we know Canvas is connected
      await this.fetchCanvasCourses();
      return {
        isConnected: true,
        lastSynced: new Date().toISOString(),
      };
    } catch (error) {
      // If fetching courses fails, check if it's because Canvas isn't connected
      // or if there's another issue
      const apiError = error as { status?: number; message?: string };

      if (
        apiError?.status === 404 ||
        apiError?.message?.includes("credentials not found")
      ) {
        return {
          isConnected: false,
        };
      }

      // For other errors, assume Canvas is connected but there's a temporary issue
      return {
        isConnected: true,
        lastSynced: undefined, // Unknown last sync time
      };
    }
  }

  /**
   * Checks if Canvas is connected by verifying stored credentials
   * @returns A promise that resolves with the connection status
   */
  async isConnected(actualUserId?: string): Promise<{
    isConnected: boolean;
    canvasDomain?: string;
  }> {
    try {
      const endpoint = actualUserId
        ? `/api/canvas/is-connected?actualUserId=${encodeURIComponent(
            actualUserId
          )}`
        : "/api/canvas/is-connected";
      const response = await this.apiClient.get<{
        isConnected: boolean;
        canvasDomain?: string;
      }>(endpoint);
      return response;
    } catch (error) {
      console.error("Failed to check Canvas connection:", error);
      throw this.handleCanvasError(error, "Failed to check Canvas connection");
    }
  }

  /**
   * Handles Canvas API errors and converts them to user-friendly messages
   * @param error - The error from the API call
   * @param defaultMessage - Default message to use if error parsing fails
   * @returns A CanvasError object
   */
  private handleCanvasError(
    error: unknown,
    defaultMessage: string
  ): CanvasError {
    // Type cast error to handle API error structure
    const apiError = error as {
      response?: {
        data?: { message?: string; details?: string };
        status?: number;
        statusText?: string;
      };
      message?: string;
    };

    // Extract meaningful error information
    if (apiError?.response?.data?.message) {
      return {
        message: apiError.response.data.message,
        status: apiError.response.status,
        details: apiError.response.data.details || apiError.response.statusText,
      };
    }

    if (apiError?.message) {
      return {
        message: apiError.message,
        status: apiError?.response?.status,
      };
    }

    return {
      message: defaultMessage,
      status: apiError?.response?.status || 500,
    };
  }
}
