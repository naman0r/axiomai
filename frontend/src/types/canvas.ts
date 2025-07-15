// Canvas integration API types
export interface CanvasConnection {
  isConnected: boolean;
  domain?: string;
  lastSynced?: string; // ISO string timestamp
}

export interface CanvasCourse {
  id: number; // Canvas API returns numbers
  name: string;
  course_code: string;
  enrollment_state: string;
  // Additional fields that might be useful
  term?: {
    name: string;
  };
  start_at?: string;
  end_at?: string;
}

export interface ConnectCanvasData {
  domain: string; // Should be normalized (no protocol, no trailing slash)
  accessToken: string; // Canvas personal access token
  actualUserId?: string; // Clerk user ID to ensure correct user context
}

export interface ImportCanvasCoursesData {
  courseIds: number[]; // Array of Canvas course IDs
  actualUserId?: string; // Clerk user ID to ensure correct user context
}

// Response types for API calls
export interface CanvasConnectionResponse {
  message: string;
  isConnected: boolean;
  domain?: string;
}

export interface CanvasCoursesResponse {
  courses: CanvasCourse[];
  totalCount: number;
}

// Error types for Canvas API
export interface CanvasError {
  message: string;
  status?: number;
  details?: string;
}
