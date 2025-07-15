import {
  CanvasConnection,
  CanvasCourse,
  ConnectCanvasData,
  ImportCanvasCoursesData,
  CanvasConnectionResponse,
} from "@/types/canvas";
import { Course } from "@/types/course";

export interface ICanvasService {
  connectCanvas(data: ConnectCanvasData): Promise<CanvasConnectionResponse>;
  disconnectCanvas(): Promise<void>;
  fetchCanvasCourses(): Promise<CanvasCourse[]>;
  importCanvasCourses(data: ImportCanvasCoursesData): Promise<Course[]>;
  getCanvasStatus(): Promise<CanvasConnection>;
}
