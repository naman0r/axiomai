import { Request, Response } from "express";
import { ICanvasService } from "../interfaces/services/ICanvasService";
import { prisma } from "../lib/prisma";

export class CanvasController {
  constructor(private canvasService: ICanvasService) {}

  async connectCanvas(req: Request, res: Response): Promise<void> {
    try {
      const { domain, accessToken, actualUserId } = req.body;
      console.log("Canvas connection attempt:", {
        domain,
        hasToken: !!accessToken,
        actualUserId,
      });

      // TODO: Add proper Clerk authentication middleware
      const fallbackUserId = req.user?.id || "test-user-123";
      const targetUserId = actualUserId || fallbackUserId;
      console.log("Using target userId:", targetUserId);

      // Create user if they don't exist (for both test and real users)
      if (targetUserId) {
        await this.ensureUserExists(targetUserId);
      }

      console.log("Connecting to Canvas...");
      await this.canvasService.connectCanvas(targetUserId, domain, accessToken);

      console.log("Canvas connected successfully!");
      res.json({ message: "Canvas connected successfully" });
    } catch (error) {
      console.error("Canvas connection error:", error);
      console.error("Error stack:", error);
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Failed to connect Canvas",
      });
    }
  }

  async getCanvasCourses(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Add proper Clerk authentication middleware
      const userId = req.user?.id || "test-user-123";

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
      console.log("\n🚀 === IMPORT CONTROLLER START ===");
      const { courseIds, actualUserId } = req.body;
      console.log("Request body:", {
        courseIds: courseIds?.length,
        actualUserId,
      });

      // TODO: Add proper Clerk authentication middleware
      const fallbackUserId = req.user?.id || "test-user-123";
      const targetUserId = actualUserId || fallbackUserId;
      console.log("Target user ID:", targetUserId);

      if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
        console.log("❌ No course IDs provided");
        res.status(400).json({ error: "No course IDs provided" });
        return;
      }

      // Ensure courseIds are numbers
      const numericCourseIds = courseIds.map((id: any) =>
        parseInt(id.toString(), 10)
      );
      console.log("Numeric course IDs:", numericCourseIds);

      // Ensure user exists before import
      console.log("📝 Ensuring user exists...");
      await this.ensureUserExists(targetUserId);
      console.log("✅ User exists/created");

      console.log("🎯 Starting Canvas service import...");
      const courses = await this.canvasService.importCanvasCourses(
        targetUserId,
        numericCourseIds
      );

      console.log("🎉 Import successful! Imported courses:", courses.length);
      console.log("📤 Sending success response...");
      res.json(courses);
    } catch (error) {
      console.error("\n💥 === IMPORT CONTROLLER ERROR ===");
      console.error("Error type:", error?.constructor?.name);
      console.error(
        "Error message:",
        error instanceof Error ? error.message : error
      );
      console.error("Full error:", error);
      console.error(
        "Stack trace:",
        error instanceof Error ? error.stack : "No stack"
      );

      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Failed to import courses",
      });
    }
  }

  async disconnectCanvas(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Add proper Clerk authentication middleware
      const userId = req.user?.id || "test-user-123";

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

  /**
   * Ensures any user exists in the database
   */
  private async ensureUserExists(userId: string): Promise<void> {
    try {
      // Check if user exists first
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        // Only create if user doesn't exist
        const isTestUser = userId === "test-user-123";
        await prisma.user.create({
          data: {
            id: userId,
            email: isTestUser
              ? `test-canvas-${Date.now()}@axiom.dev`
              : `user-${userId}@temp.dev`,
            name: isTestUser ? "Canvas Test User" : "Canvas User",
          },
        });
        console.log(`User ${userId} created successfully`);
      } else {
        console.log(`User ${userId} already exists`);
      }
    } catch (error) {
      console.log(
        `User creation error for ${userId} (continuing anyway):`,
        error instanceof Error ? error.message : "unknown"
      );
    }
  }

  /**
   * Ensures the test user exists in the database for development
   * @deprecated Use ensureUserExists instead
   */
  private async ensureTestUserExists(): Promise<void> {
    return this.ensureUserExists("test-user-123");
  }
}
