import { Course as PrismaCourse } from "@prisma/client";

export interface CreateCourseData {
  name: string;
  code: string;
  instructor: string;
  description?: string;
  userId: string;
}

export interface UpdateCourseData {
  name?: string;
  code?: string;
  instructor?: string;
  description?: string;
  userId: string; // Required for authorization
}

// Keep validation logic but simplify the model
export function validateCourse(data: Partial<PrismaCourse>): void {
  const errors: string[] = [];

  if (
    data.name !== undefined &&
    (!data.name?.trim() || data.name.length > 100)
  ) {
    errors.push("Course name is required and must be 100 characters or less");
  }

  if (
    data.code !== undefined &&
    (!data.code?.trim() || data.code.length > 20)
  ) {
    errors.push("Course code is required and must be 20 characters or less");
  }

  if (data.instructor !== undefined && !data.instructor?.trim()) {
    errors.push("Instructor name is required");
  }

  if (data.description && data.description.length > 500) {
    errors.push("Description must be 500 characters or less");
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
}

// Keep the error classes - they're useful
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
