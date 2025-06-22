import { PrismaClient } from "@prisma/client";
import { Course } from "../models/CourseModel";
import { ICourseRepository } from "../interfaces/repositories/ICourseRepository";

export class CourseRepository implements ICourseRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Course | null> {
    const data = await this.prisma.course.findUnique({
      where: { id },
    });
    return data ? Course.fromPrisma(data) : null;
  }

  async findByUserId(userId: string): Promise<Course[]> {
    const courses = await this.prisma.course.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return courses.map(Course.fromPrisma);
  }

  async findByCodeAndUser(
    code: string,
    userId: string
  ): Promise<Course | null> {
    const data = await this.prisma.course.findFirst({
      where: {
        code: code,
        userId: userId,
      },
    });
    return data ? Course.fromPrisma(data) : null;
  }

  async create(course: Course): Promise<Course> {
    course.validate();
    const data = await this.prisma.course.create({
      data: course.toPrisma(),
    });
    return Course.fromPrisma(data);
  }

  async update(id: string, updates: Partial<Course>): Promise<Course> {
    const data = await this.prisma.course.update({
      where: { id },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    });
    return Course.fromPrisma(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.course.delete({
      where: { id },
    });
  }
}
