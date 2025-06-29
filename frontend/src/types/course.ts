// Course entity interface matching backend
export interface Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Data transfer objects for API communication
export interface CreateCourseData {
  name: string;
  code: string;
  instructor: string;
  description?: string;
  userId: string;
}

export interface UpdateCourseData {
  name?: string;
  code?: string;
  instructor?: string;
  description?: string;
  userId: string; // Required for authorization
}
