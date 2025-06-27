import { IApiClient } from "../lib/api-client";
import { Course, CreateCourseData, UpdateCourseData } from "../types/course";

/**
 * Course Service - handles all course-related API communication
 */
export class CourseService {
  constructor(private apiClient: IApiClient) {}

  /**
   * Get all courses for a user
   */
  async getCourses(userId: string): Promise<Course[]> {
    try {
      if (!userId?.trim()) {
        throw new Error("User ID is required to fetch courses");
      }

      const courses = await this.apiClient.get<Course[]>(
        `/api/courses?userId=${userId}`
      );

      return courses;
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch courses: ${error.message}`);
      }
      throw new Error("Failed to fetch courses due to an unexpected error");
    }
  }

  /**
   * Get a specific course by ID
   */
  async getCourseById(id: string, userId: string): Promise<Course> {
    try {
      if (!id?.trim() || !userId?.trim()) {
        throw new Error("Course ID and User ID are required");
      }

      const course = await this.apiClient.get<Course>(
        `/api/courses/${id}?userId=${userId}`
      );

      return course;
    } catch (error) {
      console.error("Failed to fetch course:", error);
      if (error instanceof Error) {
        if (error.message.includes("404")) {
          throw new Error("Course not found");
        }
        if (error.message.includes("403")) {
          throw new Error("You are not authorized to view this course");
        }
        throw new Error(`Failed to fetch course: ${error.message}`);
      }
      throw new Error("Failed to fetch course due to an unexpected error");
    }
  }

  /**
   * Create a new course
   */
  async createCourse(data: CreateCourseData): Promise<Course> {
    try {
      this.validateCourseData(data);

      const course = await this.apiClient.post<Course>("/api/courses", data);

      return course;
    } catch (error) {
      console.error("Failed to create course:", error);
      if (error instanceof Error) {
        if (
          error.message.includes("409") ||
          error.message.includes("conflict")
        ) {
          throw new Error(
            `Course code "${data.code}" already exists. Please choose a different code.`
          );
        }
        if (error.message.includes("400")) {
          throw new Error(`Invalid course data: ${error.message}`);
        }
        throw new Error(`Failed to create course: ${error.message}`);
      }
      throw new Error("Failed to create course due to an unexpected error");
    }
  }

  /**
   * Update an existing course
   */
  async updateCourse(id: string, data: UpdateCourseData): Promise<Course> {
    try {
      if (!id?.trim()) {
        throw new Error("Course ID is required for update");
      }
      if (!data.userId?.trim()) {
        throw new Error("User ID is required for authorization");
      }

      this.validateUpdateData(data);

      const course = await this.apiClient.put<Course>(
        `/api/courses/${id}`,
        data
      );

      return course;
    } catch (error) {
      console.error("Failed to update course:", error);
      if (error instanceof Error) {
        if (error.message.includes("404")) {
          throw new Error("Course not found");
        }
        if (error.message.includes("403")) {
          throw new Error("You are not authorized to update this course");
        }
        if (
          error.message.includes("409") ||
          error.message.includes("conflict")
        ) {
          throw new Error(
            "Course code already exists. Please choose a different code."
          );
        }
        throw new Error(`Failed to update course: ${error.message}`);
      }
      throw new Error("Failed to update course due to an unexpected error");
    }
  }

  /**
   * Delete a course
   */
  async deleteCourse(id: string, userId: string): Promise<void> {
    try {
      if (!id?.trim() || !userId?.trim()) {
        throw new Error("Course ID and User ID are required for deletion");
      }

      await this.apiClient.delete(`/api/courses/${id}`, {
        data: { userId },
      });
    } catch (error) {
      console.error("Failed to delete course:", error);
      if (error instanceof Error) {
        if (error.message.includes("404")) {
          throw new Error("Course not found");
        }
        if (error.message.includes("403")) {
          throw new Error("You are not authorized to delete this course");
        }
        throw new Error(`Failed to delete course: ${error.message}`);
      }
      throw new Error("Failed to delete course due to an unexpected error");
    }
  }

  /**
   * Validate course creation data
   */
  private validateCourseData(data: CreateCourseData): void {
    const errors: string[] = [];

    if (!data.name?.trim()) {
      errors.push("Course name is required");
    }
    if (!data.code?.trim()) {
      errors.push("Course code is required");
    }
    if (!data.instructor?.trim()) {
      errors.push("Instructor name is required");
    }
    if (!data.userId?.trim()) {
      errors.push("User ID is required");
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }

  /**
   * Validate course update data
   */
  private validateUpdateData(data: UpdateCourseData): void {
    const errors: string[] = [];

    if (data.name !== undefined && !data.name?.trim()) {
      errors.push("Course name cannot be empty");
    }
    if (data.code !== undefined && !data.code?.trim()) {
      errors.push("Course code cannot be empty");
    }
    if (data.instructor !== undefined && !data.instructor?.trim()) {
      errors.push("Instructor name cannot be empty");
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }
}
