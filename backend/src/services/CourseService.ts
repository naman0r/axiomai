import { Course, ConflictError, NotFoundError } from "../models/CourseModel";
import { ICourseService } from "../interfaces/services/ICourseService";
import { ICourseRepository } from "../interfaces/repositories/ICourseRepository";
import {
  ICourse,
  CreateCourseData,
  UpdateCourseData,
} from "../interfaces/models/ICourse";

export class CourseService implements ICourseService {
  constructor(private courseRepository: ICourseRepository) {}

  async createCourse(data: CreateCourseData): Promise<ICourse> {
    // Check for duplicate course code for the same user
    const existing = await this.courseRepository.findByCodeAndUser(
      data.code,
      data.userId
    );
    if (existing) {
      throw new ConflictError(
        `Course code ${data.code} already exists for this user`
      );
    }

    const course = Course.create(data);
    return await this.courseRepository.create(course);
  }

  async getUserCourses(userId: string): Promise<ICourse[]> {
    return await this.courseRepository.findByUserId(userId);
  }

  async getCourseById(id: string, userId: string): Promise<ICourse> {
    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw new NotFoundError("Course not found");
    }

    if (!course.belongsToUser(userId)) {
      throw new Error("Not authorized to access this course");
    }

    return course;
  }

  async updateCourse(
    id: string,
    userId: string,
    updates: UpdateCourseData
  ): Promise<ICourse> {
    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw new NotFoundError("Course not found");
    }

    if (!course.belongsToUser(userId)) {
      throw new Error("Not authorized to update this course");
    }

    // If updating code, check for duplicates
    if (updates.code && updates.code !== course.code) {
      const existing = await this.courseRepository.findByCodeAndUser(
        updates.code,
        userId
      );
      if (existing) {
        throw new ConflictError(
          `Course code ${updates.code} already exists for this user`
        );
      }
    }

    course.updateDetails(updates);
    return await this.courseRepository.update(id, course.toPrisma());
  }

  async deleteCourse(id: string, userId: string): Promise<void> {
    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw new NotFoundError("Course not found");
    }

    if (!course.belongsToUser(userId)) {
      throw new Error("Not authorized to delete this course");
    }

    await this.courseRepository.delete(id);
  }
}
