import { ICourse } from "../models/ICourse";

/**
 * This is an interface which represents a course from canvas.
 */
export interface CanvasCourse {
  id: number; // Canvas returns numeric IDs
  name: string;
  course_code: string;
  enrollment_state: string;
}

/**
 * this is an interface which represents an assignment from canvas.
 */
export interface CanvasAssignment {
  id: string;
  name: string;
  description?: string;
  due_at?: string;
  points_possible?: number;
  html_url?: string;
}

/**
 * This is an interface which represents the canvas service.
 */
export interface ICanvasService {
  /**
   * This method is used to connect to canvas.
   * @param userId - The user id of the user who is connecting to canvas.
   * @param domain - The domain of the canvas instance.
   * @param accessToken - The access token for the user.
   */
  connectCanvas(
    userId: string,
    domain: string,
    accessToken: string
  ): Promise<void>;

  /**
   * This method is used to disconnect from canvas.
   * @param userId - The user id of the user who is disconnecting from canvas.
   */
  disconnectCanvas(userId: string): Promise<void>;

  /**
   *
   * @param userI
   */
  fetchCanvasCourses(userId: string): Promise<CanvasCourse[]>;
  importCanvasCourses(userId: string, courseIds: number[]): Promise<ICourse[]>;
  fetchCourseAssignments(
    userId: string,
    canvasCourseId: string
  ): Promise<CanvasAssignment[]>;
  importAssignments(
    userId: string,
    courseId: string,
    assignmentIds: string[]
  ): Promise<CanvasAssignment[]>;
}
