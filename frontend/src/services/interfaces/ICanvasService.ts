import {
  CanvasConnection,
  CanvasCourse,
  ConnectCanvasData,
  ImportCanvasCoursesData,
} from "@/types/canvas";
import { Course } from "@/types/course";

export interface ICanvasService {
  connectCanvas(data: ConnectCanvasData): Promise<void>;
  disconnectCanvas(): Promise<void>;
  fetchCanvasCourses(): Promise<CanvasCourse[]>;
  importCanvasCourses(data: ImportCanvasCoursesData): Promise<Course[]>;
  getCanvasStatus(): Promise<CanvasConnection>;
}
