import { Course, CreateCourseData, UpdateCourseData } from "../../types/course";

/**
 * Course Service Interface
 * Defines the contract for all course-related business operations
 * Handles communication with the backend API and implements business logic
 */
export interface ICourseService {
  /**
   * Retrieves all courses for a specific user
   * @param userId - The ID of the user whose courses to retrieve
   * @returns Promise resolving to an array of courses
   * @throws Error when API request fails or user is unauthorized
   */
  getCourses(userId: string): Promise<Course[]>;

  /**
   * Retrieves a specific course by its ID
   * @param id - The course ID to retrieve
   * @param userId - The ID of the user requesting the course (for authorization)
   * @returns Promise resolving to the course data
   * @throws Error when course not found, user unauthorized, or API request fails
   */
  getCourseById(id: string, userId: string): Promise<Course>;

  /**
   * Creates a new course
   * @param data - Course creation data including name, code, instructor, and userId
   * @returns Promise resolving to the created course
   * @throws Error when validation fails, duplicate code exists, or API request fails
   */
  createCourse(data: CreateCourseData): Promise<Course>;

  /**
   * Updates an existing course
   * @param id - The ID of the course to update
   * @param data - Partial course data to update (must include userId for authorization)
   * @returns Promise resolving to the updated course
   * @throws Error when course not found, user unauthorized, validation fails, or API request fails
   */
  updateCourse(id: string, data: UpdateCourseData): Promise<Course>;

  /**
   * Deletes a course
   * @param id - The ID of the course to delete
   * @param userId - The ID of the user attempting to delete (for authorization)
   * @returns Promise that resolves when deletion is complete
   * @throws Error when course not found, user unauthorized, or API request fails
   */
  deleteCourse(id: string, userId: string): Promise<void>;
}
