import { ICourse, CreateCourseData, UpdateCourseData } from "../models/ICourse";

/**
 * Service interface for Course business logic operations
 * Orchestrates course-related business operations and enforces business rules
 */
export interface ICourseService {
  /**
   * Creates a new course with business rule validation
   * Ensures course codes are unique per user before creation
   * @param data - Course creation data including name, code, instructor, and userId
   * @returns Promise resolving to the created course
   * @throws {ConflictError} When a course with the same code already exists for the user
   * @throws {ValidationError} When course data is invalid
   */
  createCourse(data: CreateCourseData): Promise<ICourse>;

  /**
   * Retrieves all courses belonging to a specific user
   * @param userId - The ID of the user whose courses to retrieve
   * @returns Promise resolving to an array of courses owned by the user
   */
  getUserCourses(userId: string): Promise<ICourse[]>;

  /**
   * Retrieves a specific course by its ID with user authorization
   * Verifies that the requesting user owns the course
   * @param id - The ID of the course to retrieve
   * @param userId - The ID of the user requesting the course
   * @returns Promise resolving to the course if found and owned by user
   * @throws {NotFoundError} When course with given ID doesn't exist
   * @throws {UnauthorizedError} When user doesn't own the course
   */
  getCourseById(id: string, userId: string): Promise<ICourse>;

  /**
   * Updates an existing course with authorization and business rule validation
   * Verifies user ownership and prevents duplicate course codes
   * @param id - The ID of the course to update
   * @param userId - The ID of the user attempting to update the course
   * @param updates - Partial course data to update
   * @returns Promise resolving to the updated course
   * @throws {NotFoundError} When course with given ID doesn't exist
   * @throws {UnauthorizedError} When user doesn't own the course
   * @throws {ConflictError} When updated code conflicts with existing course
   * @throws {ValidationError} When updated data is invalid
   */
  updateCourse(
    id: string,
    userId: string,
    updates: UpdateCourseData
  ): Promise<ICourse>;

  /**
   * Deletes a course with authorization validation
   * Verifies user ownership before allowing deletion
   * @param id - The ID of the course to delete
   * @param userId - The ID of the user attempting to delete the course
   * @returns Promise that resolves when deletion is complete
   * @throws {NotFoundError} When course with given ID doesn't exist
   * @throws {UnauthorizedError} When user doesn't own the course
   */
  deleteCourse(id: string, userId: string): Promise<void>;
}
