import { Router } from "express";
import { CourseService } from "../services/CourseService";
import { CourseController } from "../controllers/CourseController";
import {
  validateCourseCreation,
  validateCourseUpdate,
  validateGetCourses,
  validateGetCourseById,
  validateCourseDelete,
} from "../validation/CourseValidation";
import { prisma } from "../lib/prisma";

const router = Router();

// Simplified dependency injection
const courseService = new CourseService(prisma);
const courseController = new CourseController(courseService);

router.post("/", validateCourseCreation, (req, res) =>
  courseController.createCourse(req, res)
);
router.get("/", validateGetCourses, (req, res) =>
  courseController.getCourses(req, res)
);
router.get("/:id", validateGetCourseById, (req, res) =>
  courseController.getCourseById(req, res)
);
router.put("/:id", validateCourseUpdate, (req, res) =>
  courseController.updateCourse(req, res)
);
router.delete("/:id", validateCourseDelete, (req, res) =>
  courseController.deleteCourse(req, res)
);

export default router;
