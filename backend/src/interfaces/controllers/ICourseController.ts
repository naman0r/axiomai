import { Request, Response } from "express";

/**
 * Controller interface for Course HTTP request handling
 * Defines the contract for handling course-related HTTP endpoints
 * All methods should handle errors gracefully and return appropriate HTTP status codes
 */
export interface ICourseController {
  /**
   * Handles HTTP POST requests to create a new course
   * Expected request body: CreateCourseData with userId, name, code, instructor, and optional description
   * @param req - Express request object containing course data in body
   * @param res - Express response object for sending HTTP response
   * @returns Promise that resolves when response is sent
   *
   * Success Response: 201 Created with course data
   * Error Responses:
   * - 400 Bad Request: Invalid or missing required fields
   * - 409 Conflict: Course code already exists for user
   * - 500 Internal Server Error: Unexpected server error
   */
  createCourse(req: Request, res: Response): Promise<void>;

  /**
   * Handles HTTP GET requests to retrieve user's courses
   * Expected query parameter: userId
   * @param req - Express request object containing userId in query params
   * @param res - Express response object for sending HTTP response
   * @returns Promise that resolves when response is sent
   *
   * Success Response: 200 OK with array of course data
   * Error Responses:
   * - 400 Bad Request: Missing or invalid userId parameter
   * - 500 Internal Server Error: Unexpected server error
   */
  getCourses(req: Request, res: Response): Promise<void>;

  /**
   * Handles HTTP GET requests to retrieve a specific course by ID
   * Expected URL parameter: id (course ID)
   * Expected query parameter: userId
   * @param req - Express request object containing course ID in params and userId in query
   * @param res - Express response object for sending HTTP response
   * @returns Promise that resolves when response is sent
   *
   * Success Response: 200 OK with course data
   * Error Responses:
   * - 400 Bad Request: Missing or invalid userId parameter
   * - 403 Forbidden: User doesn't own the course
   * - 404 Not Found: Course with given ID doesn't exist
   * - 500 Internal Server Error: Unexpected server error
   */
  getCourseById(req: Request, res: Response): Promise<void>;

  /**
   * Handles HTTP PUT requests to update an existing course
   * Expected URL parameter: id (course ID)
   * Expected request body: UpdateCourseData with userId and optional fields to update
   * @param req - Express request object containing course ID in params and update data in body
   * @param res - Express response object for sending HTTP response
   * @returns Promise that resolves when response is sent
   *
   * Success Response: 200 OK with updated course data
   * Error Responses:
   * - 400 Bad Request: Invalid update data or missing userId
   * - 403 Forbidden: User doesn't own the course
   * - 404 Not Found: Course with given ID doesn't exist
   * - 409 Conflict: Updated course code conflicts with existing course
   * - 500 Internal Server Error: Unexpected server error
   */
  updateCourse(req: Request, res: Response): Promise<void>;

  /**
   * Handles HTTP DELETE requests to delete a course
   * Expected URL parameter: id (course ID)
   * Expected request body: { userId: string }
   * @param req - Express request object containing course ID in params and userId in body
   * @param res - Express response object for sending HTTP response
   * @returns Promise that resolves when response is sent
   *
   * Success Response: 204 No Content
   * Error Responses:
   * - 400 Bad Request: Missing userId in request body
   * - 403 Forbidden: User doesn't own the course
   * - 404 Not Found: Course with given ID doesn't exist
   * - 500 Internal Server Error: Unexpected server error
   */
  deleteCourse(req: Request, res: Response): Promise<void>;
}
