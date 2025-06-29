import { ICourse } from "../models/ICourse";

/**
 * Repository interface for Course data access operations
 * Defines the contract for all course-related database operations
 */
export interface ICourseRepository {
  /**
   * Finds a course by its unique identifier
   * @param id - The course ID to search for
   * @returns Promise resolving to the course if found, null otherwise
   */
  findById(id: string): Promise<ICourse | null>;

  /**
   * Finds all courses belonging to a specific user
   * @param userId - The user ID to search courses for
   * @returns Promise resolving to an array of courses owned by the user
   */
  findByUserId(userId: string): Promise<ICourse[]>;

  /**
   * Finds a course by its code within a specific user's courses
   * Used to prevent duplicate course codes per user
   * @param code - The course code to search for
   * @param userId - The user ID to limit the search to
   * @returns Promise resolving to the course if found, null otherwise
   */
  findByCodeAndUser(code: string, userId: string): Promise<ICourse | null>;

  /**
   * Creates a new course in the database
   * @param course - The course instance to create
   * @returns Promise resolving to the created course
   * @throws {ValidationError} When course data is invalid
   */
  create(course: ICourse): Promise<ICourse>;

  /**
   * Updates an existing course in the database
   * @param id - The ID of the course to update
   * @param updates - Partial course data to update
   * @returns Promise resolving to the updated course
   * @throws {NotFoundError} When course with given ID doesn't exist
   */
  update(id: string, updates: Partial<ICourse>): Promise<ICourse>;

  /**
   * Deletes a course from the database
   * @param id - The ID of the course to delete
   * @returns Promise that resolves when deletion is complete
   * @throws {NotFoundError} When course with given ID doesn't exist
   */
  delete(id: string): Promise<void>;
}
