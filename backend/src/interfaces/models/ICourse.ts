import { Course as PrismaCourse } from "@prisma/client";

/**
 * Data required to create a new course
 */
export interface CreateCourseData {
  /** The name of the course */
  name: string;
  /** The course code (e.g., "CS101") */
  code: string;
  /** The instructor's name */
  instructor: string;
  /** Optional course description */
  description?: string;
  /** The ID of the user who owns this course */
  userId: string;
}

/**
 * Data that can be updated on an existing course
 */
export interface UpdateCourseData {
  /** Updated course name */
  name?: string;
  /** Updated course code */
  code?: string;
  /** Updated instructor name */
  instructor?: string;
  /** Updated course description */
  description?: string;
}

/**
 * Course domain model interface defining business logic and data access methods
 * Extends Prisma's Course type to include business behaviors
 */
export interface ICourse extends PrismaCourse {
  /**
   * Validates the course data according to business rules
   * @throws {ValidationError} When validation fails
   */
  validate(): void;

  /**
   * Checks if this course belongs to the specified user
   * @param userId - The user ID to check ownership against
   * @returns true if the course belongs to the user, false otherwise
   */
  belongsToUser(userId: string): boolean;

  /**
   * Updates the course details with the provided data
   * @param updates - Partial course data to update
   */
  updateDetails(updates: UpdateCourseData): void;

  /**
   * Converts the course instance to a Prisma-compatible object
   * @returns Prisma Course object for database operations
   */
  toPrisma(): PrismaCourse;

  /**
   * Converts the course instance to a JSON representation
   * @returns Plain object suitable for API responses
   */
  toJSON(): {
    id: string;
    name: string;
    code: string;
    instructor: string;
    description: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
