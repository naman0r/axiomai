import { ICourse } from "../interfaces/models/ICourse";
import {
  CanvasAssignment,
  CanvasCourse,
  ICanvasService,
} from "../interfaces/services/ICanvasService";
import { ICourseService } from "../interfaces/services/ICourseService";
import { IEncryptionService } from "../interfaces/services/IEncryptionService";
import { prisma } from "../lib/prisma";
import { NotFoundError } from "../models/CourseModel";

export class CanvasService implements ICanvasService {
  constructor(
    private courseService: ICourseService,
    private encryptionService: IEncryptionService
  ) {}

  async connectCanvas(
    userId: string,
    domain: string,
    accessToken: string
  ): Promise<void> {
    // Normalize domain
    const normalizedDomain = this.normalizeDomain(domain);

    // Test the connection first
    await this.testCanvasConnection(normalizedDomain, accessToken);

    // Encrypt the access token
    const encryptedToken = this.encryptionService.encrypt(accessToken);

    // Store credentials
    await prisma.user.update({
      where: { id: userId },
      data: {
        canvasDomain: normalizedDomain,
        accessTokenHash: encryptedToken,
      },
    });
  }

  async disconnectCanvas(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        canvasDomain: null,
        accessTokenHash: null, // just removing the creds from the database....
      },
    });
  }

  async fetchCanvasCourses(userId: string): Promise<CanvasCourse[]> {
    const credentials = await this.getCanvasCredentials(userId);

    let url: string | null = `${credentials.domain}/api/v1/courses`;
    let params: any = {
      enrollment_state: "active",
    };

    const courses: CanvasCourse[] = [];

    while (url) {
      try {
        const queryString = params
          ? new URLSearchParams(params).toString()
          : "";
        const fullUrl = params ? `${url}?${queryString}` : url;

        const response = await fetch(fullUrl, {
          headers: {
            Authorization: `Bearer ${credentials.accessToken}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Canvas API error ${response.status}: ${errorText}`);
          throw new Error(`Canvas API error: ${response.status}`);
        }

        const data = (await response.json()) as CanvasCourse[];
        courses.push(...data);

        // Handle pagination using RFC-5988 Link headers (like Flask code)
        const nextUrl = this.parseNextLinkFromHeader(
          response.headers.get("link")
        );
        url = nextUrl; // Will be null if no next page
        params = null; // Critical: set to null after first iteration like Flask code
      } catch (error) {
        console.error("Error fetching Canvas courses:", error);
        throw new NotFoundError(
          `Failed to fetch Canvas courses: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    return courses;
  }

  // Helper method to parse RFC-5988 Link header for pagination
  private parseNextLinkFromHeader(linkHeader: string | null): string | null {
    if (!linkHeader) return null;

    // Link header format: <https://canvas.example.com/api/v1/courses?page=2>; rel="next"
    const links = linkHeader.split(",");
    for (const link of links) {
      const [url, rel] = link.trim().split(";");
      if (rel && rel.includes('rel="next"')) {
        return url.trim().slice(1, -1); // Remove < and > brackets
      }
    }
    return null;
  }

  async importCanvasCourses(
    userId: string,
    courseIds: number[]
  ): Promise<ICourse[]> {
    const canvasCourses = await this.fetchCanvasCourses(userId);
    const coursesToImport = canvasCourses.filter((course) =>
      courseIds.includes(course.id)
    );

    // Get existing courses to check for duplicates
    const existingCourses = await this.courseService.getUserCourses(userId);
    const existingCanvasIds = new Set(
      existingCourses
        .filter((course) => course.canvasCourseId)
        .map((course) => course.canvasCourseId)
    );

    const importedCourses = [];
    const skippedCourses = [];
    const errors = [];

    for (const canvasCourse of coursesToImport) {
      const canvasIdString = canvasCourse.id.toString();

      // Check if course is already imported
      if (existingCanvasIds.has(canvasIdString)) {
        skippedCourses.push({
          name: canvasCourse.name,
          code: canvasCourse.course_code,
          reason: "Already imported",
        });
        continue;
      }

      try {
        const courseData = {
          name: canvasCourse.name,
          code: canvasCourse.course_code,
          instructor: "Canvas Import", // We'd need to fetch instructor from Canvas
          userId,
          canvasCourseId: canvasIdString,
          isFromCanvas: true,
        };

        const course = await this.courseService.createCourse(courseData);
        importedCourses.push(course);
      } catch (error) {
        console.error(`Failed to import course ${canvasCourse.name}:`, error);
        errors.push({
          name: canvasCourse.name,
          code: canvasCourse.course_code,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // If we have skipped courses or errors, include that information
    if (skippedCourses.length > 0 || errors.length > 0) {
      const message = [];
      if (importedCourses.length > 0) {
        message.push(
          `Successfully imported ${importedCourses.length} course${
            importedCourses.length !== 1 ? "s" : ""
          }.`
        );
      }
      if (skippedCourses.length > 0) {
        message.push(
          `Skipped ${skippedCourses.length} already imported course${
            skippedCourses.length !== 1 ? "s" : ""
          }.`
        );
      }
      if (errors.length > 0) {
        message.push(
          `Failed to import ${errors.length} course${
            errors.length !== 1 ? "s" : ""
          }.`
        );
      }

      // Throw an error with details if there were issues, but don't fail completely
      if (importedCourses.length === 0) {
        throw new Error(message.join(" ") + " No new courses were imported.");
      }
    }

    return importedCourses;
  }

  async fetchCourseAssignments(
    userId: string,
    canvasCourseId: string
  ): Promise<CanvasAssignment[]> {
    const credentials = await this.getCanvasCredentials(userId);

    const response = await fetch(
      `${credentials.domain}/api/v1/courses/${canvasCourseId}/assignments?bucket=upcoming`,
      {
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Canvas API error: ${response.status}`);
    }

    return (await response.json()) as CanvasAssignment[];
  }

  async importAssignments(
    userId: string,
    courseId: string,
    assignmentIds: string[]
  ): Promise<CanvasAssignment[]> {
    // This would need to be implemented based on your assignment model
    // For now, just return the assignments without importing
    throw new Error("Assignment import not implemented yet");
  }

  private normalizeDomain(domain: string): string {
    let normalized = domain.trim();
    if (normalized.startsWith("http://")) {
      normalized = normalized.slice(7);
    } else if (normalized.startsWith("https://")) {
      normalized = normalized.slice(8);
    }
    normalized = normalized.replace(/\/$/, "");
    return `https://${normalized}`;
  }

  private async testCanvasConnection(
    domain: string,
    accessToken: string
  ): Promise<void> {
    const response = await fetch(`${domain}/api/v1/users/self`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Invalid Canvas credentials");
    }
  }

  private async getCanvasCredentials(
    userId: string
  ): Promise<{ domain: string; accessToken: string }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { canvasDomain: true, accessTokenHash: true },
    });

    if (!user?.canvasDomain || !user?.accessTokenHash) {
      throw new NotFoundError("Canvas credentials not found");
    }

    const accessToken = this.encryptionService.decrypt(user.accessTokenHash);

    return {
      domain: user.canvasDomain,
      accessToken,
    };
  }
}
