import { Request, Response } from "express";
import { ICanvasService } from "../interfaces/services/ICanvasService";

export class CanvasController {
  constructor(private canvasService: ICanvasService) {}

  async connectCanvas(req: Request, res: Response): Promise<void> {
    try {
      const { domain, accessToken } = req.body;
      const userId = req.user?.id; // Clerk authentication

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      await this.canvasService.connectCanvas(userId, domain, accessToken);

      res.json({ message: "Canvas connected successfully" });
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Failed to connect Canvas",
      });
    }
  }

  async getCanvasCourses(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id; // Clerk authentication

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const courses = await this.canvasService.fetchCanvasCourses(userId);
      res.json(courses);
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch Canvas courses",
      });
    }
  }

  async importCourses(req: Request, res: Response): Promise<void> {
    try {
      const { courseIds } = req.body;
      const userId = req.user?.id; // Clerk authentication

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      // Ensure courseIds are numbers
      const numericCourseIds = courseIds.map((id: any) =>
        parseInt(id.toString(), 10)
      );

      const courses = await this.canvasService.importCanvasCourses(
        userId,
        numericCourseIds
      );
      res.json(courses);
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Failed to import courses",
      });
    }
  }

  async disconnectCanvas(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id; // Clerk authentication

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      await this.canvasService.disconnectCanvas(userId); // this is cool, just calling the service, and dont have to do any
      // of the logic here. Controller should be kept bare. Interracting between Service and Route. Service is liek the model, and
      // route is like the view (not a perfect analogy, but in relation to MVC like we learned in OOD)
      res.json({ message: "Canvas disconnected successfully" });
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to disconnect Canvas",
      });
    }
  }
}
