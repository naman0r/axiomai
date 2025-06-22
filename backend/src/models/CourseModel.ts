import { Course as PrismaCourse } from "@prisma/client";
import {
  ICourse,
  CreateCourseData,
  UpdateCourseData,
} from "../interfaces/models/ICourse";

export class Course implements ICourse {
  id!: string;
  name!: string;
  code!: string;
  instructor!: string;
  description!: string | null;
  userId!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: PrismaCourse) {
    Object.assign(this, data);
  }

  static create(data: CreateCourseData): Course {
    return new Course({
      id: crypto.randomUUID(),
      name: data.name,
      code: data.code,
      instructor: data.instructor,
      description: data.description || null,
      userId: data.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPrisma(data: PrismaCourse): Course {
    return new Course(data);
  }

  validate(): void {
    const errors: string[] = [];

    if (!this.name?.trim()) {
      errors.push("Course name is required");
    }
    if (this.name && this.name.length > 100) {
      errors.push("Course name must be 100 characters or less");
    }

    if (!this.code?.trim()) {
      errors.push("Course code is required");
    }
    if (this.code && this.code.length > 20) {
      errors.push("Course code must be 20 characters or less");
    }

    if (!this.instructor?.trim()) {
      errors.push("Instructor name is required");
    }

    if (this.description && this.description.length > 500) {
      errors.push("Description must be 500 characters or less");
    }

    if (errors.length > 0) {
      throw new ValidationError(errors);
    }
  }

  belongsToUser(userId: string): boolean {
    return this.userId === userId;
  }

  updateDetails(updates: UpdateCourseData): void {
    if (updates.name) this.name = updates.name;
    if (updates.code) this.code = updates.code;
    if (updates.instructor) this.instructor = updates.instructor;
    if (updates.description !== undefined)
      this.description = updates.description;
    this.updatedAt = new Date();
  }

  toPrisma(): PrismaCourse {
    return {
      id: this.id,
      name: this.name,
      code: this.code,
      instructor: this.instructor,
      description: this.description,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      code: this.code,
      instructor: this.instructor,
      description: this.description,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export class ValidationError extends Error {
  constructor(public errors: string[]) {
    super(errors.join(", "));
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}
