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

    const response = await fetch(
      `${credentials.domain}/api/v1/courses?enrollment_state=active`,
      {
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Canvas API error: ${response.status}`);
    }

    return (await response.json()) as CanvasCourse[];
  }

  async importCanvasCourses(
    userId: string,
    courseIds: number[]
  ): Promise<ICourse[]> {
    const canvasCourses = await this.fetchCanvasCourses(userId);
    const coursesToImport = canvasCourses.filter((course) =>
      courseIds.includes(course.id)
    );

    const importedCourses = [];
    for (const canvasCourse of coursesToImport) {
      const courseData = {
        name: canvasCourse.name,
        code: canvasCourse.course_code,
        instructor: "Canvas Import", // We'd need to fetch instructor from Canvas
        userId,
        canvasCourseId: canvasCourse.id.toString(), // Convert Canvas ID to string
        isFromCanvas: true,
      };

      const course = await this.courseService.createCourse(courseData);
      importedCourses.push(course);
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
