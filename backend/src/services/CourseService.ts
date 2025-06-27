import { PrismaClient, Course } from "@prisma/client";
import {
  ConflictError,
  NotFoundError,
  CreateCourseData,
  UpdateCourseData,
  validateCourse,
} from "../models/CourseModel";

export class CourseService {
  constructor(private prisma: PrismaClient) {}

  async createCourse(data: CreateCourseData): Promise<Course> {
    // Validate the input data
    validateCourse(data);

    // Check for duplicate course code for the same user
    const existing = await this.prisma.course.findFirst({
      where: {
        code: data.code,
        userId: data.userId,
      },
    });

    if (existing) {
      throw new ConflictError(
        `Course code ${data.code} already exists for this user`
      );
    }

    return await this.prisma.course.create({
      data: {
        name: data.name,
        code: data.code,
        instructor: data.instructor,
        description: data.description || null,
        userId: data.userId,
      },
    });
  }

  async getUserCourses(userId: string): Promise<Course[]> {
    return await this.prisma.course.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getCourseById(id: string, userId: string): Promise<Course> {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundError("Course not found");
    }

    if (course.userId !== userId) {
      throw new Error("Not authorized to access this course");
    }

    return course;
  }

  async updateCourse(
    id: string,
    userId: string,
    updates: UpdateCourseData
  ): Promise<Course> {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundError("Course not found");
    }

    if (course.userId !== userId) {
      throw new Error("Not authorized to update this course");
    }

    // If updating code, check for duplicates
    if (updates.code && updates.code !== course.code) {
      const existing = await this.prisma.course.findFirst({
        where: {
          code: updates.code,
          userId: userId,
        },
      });
      if (existing) {
        throw new ConflictError(
          `Course code ${updates.code} already exists for this user`
        );
      }
    }

    // Validate updates
    const updateData = {
      name: updates.name || course.name,
      code: updates.code || course.code,
      instructor: updates.instructor || course.instructor,
      description:
        updates.description !== undefined
          ? updates.description
          : course.description,
    };

    validateCourse(updateData);

    return await this.prisma.course.update({
      where: { id },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    });
  }

  async deleteCourse(id: string, userId: string): Promise<void> {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundError("Course not found");
    }

    if (course.userId !== userId) {
      throw new Error("Not authorized to delete this course");
    }

    await this.prisma.course.delete({
      where: { id },
    });
  }
}
