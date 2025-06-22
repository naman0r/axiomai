import { Router } from "express";
import { CourseRepository } from "../repositories/CourseRepository";
import { CourseService } from "../services/CourseService";
import { CourseController } from "../controllers/CourseController";
import { ICourseRepository } from "../interfaces/repositories/ICourseRepository";
import { ICourseService } from "../interfaces/services/ICourseService";
import { ICourseController } from "../interfaces/controllers/ICourseController";
import {
  validateCourseCreation,
  validateCourseUpdate,
  validateGetCourses,
  validateGetCourseById,
  validateCourseDelete,
} from "../validation/CourseValidation";
import { prisma } from "../lib/prisma";

const router = Router();

// Dependency injection with interfaces
const courseRepository: ICourseRepository = new CourseRepository(prisma);
const courseService: ICourseService = new CourseService(courseRepository);
const courseController: ICourseController = new CourseController(courseService);

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
