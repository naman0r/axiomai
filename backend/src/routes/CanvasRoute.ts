import { Router } from "express";
import { CanvasController } from "../controllers/CanvasController";
import { CanvasService } from "../services/CanvasService";
import { CourseService } from "../services/CourseService";
import { EncryptionService } from "../services/EncryptionService";
import { CourseRepository } from "../repositories/CourseRepository";
import { ICourseService } from "../interfaces/services/ICourseService";
import { IEncryptionService } from "../interfaces/services/IEncryptionService";
import { prisma } from "../lib/prisma";

// Dependency injection - create service instances
const courseRepository = new CourseRepository(prisma);
const courseService: ICourseService = new CourseService(courseRepository);
const encryptionService: IEncryptionService = new EncryptionService();
const canvasService = new CanvasService(courseService, encryptionService);
const canvasController = new CanvasController(canvasService);

const router = Router();

router.post("/connect", (req, res) => canvasController.connectCanvas(req, res));

router.delete("/disconnect", (req, res) =>
  canvasController.disconnectCanvas(req, res)
);
router.get("/courses", (req, res) =>
  canvasController.getCanvasCourses(req, res)
);
router.post("/import-courses", (req, res) =>
  canvasController.importCourses(req, res)
);

router.get("/is-connected", (req, res) =>
  canvasController.isConnected(req, res)
);

export default router;
