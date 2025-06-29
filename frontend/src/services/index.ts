import { apiClient } from "../lib/api-client";
import { CourseService } from "./CourseService";
import { CanvasService } from "./CanvasService";

// Service instances - single instances for the entire application
export const courseService = new CourseService(apiClient);
export const canvasService = new CanvasService(apiClient);

// Export service interfaces for typing
export type { ICourseService } from "./interfaces/ICourseService";
export type { ICanvasService } from "./interfaces/ICanvasService";

// Export service classes for testing
export { CourseService } from "./CourseService";
export { CanvasService } from "./CanvasService";

// Future: Add other service instances here
// export const assignmentService = new AssignmentService(apiClient);
// export const userService = new UserService(apiClient);
