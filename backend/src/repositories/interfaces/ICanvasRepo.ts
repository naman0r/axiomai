import { CanvasCourse } from "../../models/Course";

interface ICanvasRepo {
  // Integration methods
  findIntegrationByUserId(userId: string): Promise<CanvasIntegration | null>;
  createIntegration(integration: CanvasIntegration): Promise<CanvasIntegration>;
  updateIntegration(integration: CanvasIntegration): Promise<CanvasIntegration>;
  deleteIntegration(userId: string): Promise<void>;

  // Course methods
  findCoursesByIntegrationId(integrationId: string): Promise<CanvasCourse[]>;
  saveCourses(courses: CanvasCourse[]): Promise<CanvasCourse[]>;
  markCourseAsImported(courseId: string): Promise<void>;
}
