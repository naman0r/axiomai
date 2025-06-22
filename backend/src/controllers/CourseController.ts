import { Request, Response } from "express";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
} from "../models/CourseModel";
import { ICourseController } from "../interfaces/controllers/ICourseController";
import { ICourseService } from "../interfaces/services/ICourseService";

export class CourseController implements ICourseController {
  constructor(private courseService: ICourseService) {}

  async createCourse(req: Request, res: Response): Promise<void> {
    try {
      const course = await this.courseService.createCourse({
        ...req.body,
        userId: req.body.userId,
      });

      res.status(201).json({
        success: true,
        data: course.toJSON(),
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getCourses(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.query.userId as string;

      const courses = await this.courseService.getUserCourses(userId);

      res.status(200).json({
        success: true,
        data: courses.map((course) => course.toJSON()),
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getCourseById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.query.userId as string;
      const courseId = req.params.id;

      const course = await this.courseService.getCourseById(courseId, userId);

      res.status(200).json({
        success: true,
        data: course.toJSON(),
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async updateCourse(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.body.userId;
      const course = await this.courseService.updateCourse(
        req.params.id,
        userId,
        req.body
      );

      res.status(200).json({
        success: true,
        data: course.toJSON(),
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async deleteCourse(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.body.userId;
      await this.courseService.deleteCourse(req.params.id, userId);

      res.status(204).json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private handleError(error: unknown, res: Response): void {
    console.error("Controller error:", error);

    if (error instanceof ValidationError) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      });
    } else if (error instanceof ConflictError) {
      res.status(409).json({
        success: false,
        message: error.message,
      });
    } else if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    } else if (error instanceof Error) {
      if (error.message.includes("Not authorized")) {
        res.status(403).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: "Unknown error occurred",
      });
    }
  }
}
