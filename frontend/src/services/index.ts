import { apiClient } from "../lib/api-client";
import { CourseService } from "./CourseService";

// Service instances - single instances for the entire application
export const courseService = new CourseService(apiClient);

// Export service classes for testing and direct use
export { CourseService } from "./CourseService";

// Future: Add other service instances here
// export const assignmentService = new AssignmentService(apiClient);
// export const userService = new UserService(apiClient);
