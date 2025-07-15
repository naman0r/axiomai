// canvas integfation api stuff
export interface CanvasConnection {
  isConnected: boolean;
  domain?: string;
  lastSynced?: string; // can make it a DateTime later
}

export interface CanvasCourse {
  id: number;
  name: string;
  course_code: string;
  enrollment_state: string;
}

export interface ConnectCanvasData {
  domain: string;
  accessToken: string;
}

export interface ImportCanvasCoursesData {
  courseIds: number[];
}
