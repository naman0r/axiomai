import { Request, Response, NextFunction } from "express";

export const validateCourseCreation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, code, instructor, userId } = req.body;
  const errors: string[] = [];

  if (!name || typeof name !== "string" || !name.trim()) {
    errors.push("Course name is required");
  }

  if (!code || typeof code !== "string" || !code.trim()) {
    errors.push("Course code is required");
  }

  if (!instructor || typeof instructor !== "string" || !instructor.trim()) {
    errors.push("Instructor name is required");
  }

  if (!userId || typeof userId !== "string" || !userId.trim()) {
    errors.push("User ID is required");
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
    return;
  }

  next();
};

export const validateCourseUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, code, instructor, description, userId } = req.body;
  const errors: string[] = [];

  if (!userId || typeof userId !== "string" || !userId.trim()) {
    errors.push("User ID is required");
  }

  if (name !== undefined && (typeof name !== "string" || !name.trim())) {
    errors.push("Course name must be a non-empty string");
  }

  if (code !== undefined && (typeof code !== "string" || !code.trim())) {
    errors.push("Course code must be a non-empty string");
  }

  if (
    instructor !== undefined &&
    (typeof instructor !== "string" || !instructor.trim())
  ) {
    errors.push("Instructor name must be a non-empty string");
  }

  if (description !== undefined && typeof description !== "string") {
    errors.push("Description must be a string");
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
    return;
  }

  next();
};

export const validateGetCourses = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.query;
  const errors: string[] = [];

  if (!userId || typeof userId !== "string" || !userId.trim()) {
    errors.push("User ID is required as query parameter");
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
    return;
  }

  next();
};

export const validateGetCourseById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.query;
  const errors: string[] = [];

  if (!userId || typeof userId !== "string" || !userId.trim()) {
    errors.push("User ID is required as query parameter");
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
    return;
  }

  next();
};

export const validateCourseDelete = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.body;
  const errors: string[] = [];

  if (!userId || typeof userId !== "string" || !userId.trim()) {
    errors.push("User ID is required");
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
    return;
  }

  next();
};
