import {
  ConnectCanvasData,
  CanvasCourse,
  ImportCanvasCoursesData,
  CanvasConnection,
} from "@/types/canvas";
import { Course } from "@/types/course";
import { ICanvasService } from "./interfaces/ICanvasService";
import { IApiClient } from "@/lib/api-client";

export class CanvasService implements ICanvasService {
  constructor(private apiClient: IApiClient) {}

  /**
   * Connects to Canvas and stores the connection details
   * @param data - The connection data including domain and access token
   * @returns A promise that resolves when the connection is established
   */
  connectCanvas(data: ConnectCanvasData): Promise<void> {
    return this.apiClient.post("/api/canvas/connect", data); // ✅ FIXED: return instead of throw
  }

  /**
   * Disconnects from Canvas and removes the connection details
   * @returns A promise that resolves when the connection is removed
   */
  disconnectCanvas(): Promise<void> {
    return this.apiClient.delete("/api/canvas/disconnect"); // ✅ FIXED: DELETE method + return instead of throw
  }

  /**
   * Fetches the list of courses from Canvas
   * @returns A promise that resolves with the list of courses
   */
  fetchCanvasCourses(): Promise<CanvasCourse[]> {
    return this.apiClient.get("/api/canvas/courses"); // ✅ FIXED: return instead of throw
  }

  /**
   * Imports the list of courses from Canvas
   * @param data - The data containing the course IDs to import
   * @returns A promise that resolves with the imported courses
   */
  importCanvasCourses(data: ImportCanvasCoursesData): Promise<Course[]> {
    return this.apiClient.post("/api/canvas/import-courses", data); // ✅ FIXED: POST to correct endpoint
  }

  /**
   * Retrieves the current connection status of Canvas
   * Note: Backend doesn't have this endpoint yet, so we'll work around it
   * @returns A promise that resolves with the connection status
   */
  async getCanvasStatus(): Promise<CanvasConnection> {
    // ✅ FIXED: Since /api/user/canvas-status doesn't exist, we need to either:
    // Option 1: Create this endpoint in backend
    // Option 2: Get status from user profile
    // For now, let's use Option 2:

    try {
      // This assumes you have a user profile endpoint that includes canvas info
      const userProfile = await this.apiClient.get<{
        canvasDomain?: string;
        updatedAt?: string;
      }>("/api/user/profile");
      return {
        isConnected: !!userProfile.canvasDomain,
        domain: userProfile.canvasDomain || undefined,
        lastSynced: userProfile.updatedAt,
      };
    } catch {
      // Fallback if user profile doesn't exist
      return {
        isConnected: false,
      };
    }
  }
}
