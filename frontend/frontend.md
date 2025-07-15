# Frontend Architecture Plan - AxiomAI

## Overview

Building a scalable, object-oriented frontend architecture using the **Full Service Layer Pattern** to complement the backend's interface-driven design.

## Architecture Pattern: Full Service Layer

### Data Flow

```
React Components (UI)
    ↓ (calls)
Custom Hooks (React Integration)
    ↓ (uses)
Service Layer (Business Logic)
    ↓ (communicates with)
API Client (HTTP Communication)
    ↓ (sends requests to)
Backend API
```

### Core Principles

- **Separation of Concerns**: UI, business logic, and data access are separate
- **Interface-Driven**: All services implement contracts (like backend)
- **Type Safety**: End-to-end TypeScript from frontend to backend
- **Testability**: Each layer can be tested independently
- **Reusability**: Services shared across components

## Tech Stack

### Core Libraries

- **@tanstack/react-query** - Server state management and caching
- **React State** - Component-level UI state management
- **axios** - HTTP client for API communication
- **zod** - Runtime validation and type safety

### State Management Strategy

```
React Query: Server state (API data, caching, synchronization)
React State: Component state (UI state, form data, local component state)
```

## File Structure

```
src/
├── lib/
│   ├── api-client.ts          # HTTP client configuration
│   ├── query-client.ts        # React Query setup
│   └── utils.ts              # Utility functions
├── types/
│   ├── api.ts                # API response types
│   ├── course.ts             # Course-related types
│   └── common.ts             # Shared types
├── services/
│   ├── interfaces/
│   │   ├── ICourseService.ts  # Course service contract
│   │   └── IApiClient.ts      # API client contract
│   ├── CourseService.ts       # Course service implementation
│   └── index.ts              # Service exports
├── hooks/
│   ├── useCourses.ts          # Course-related hooks
│   └── index.ts              # Hook exports
├── components/
│   ├── ui/                   # Reusable UI components
│   └── courses/              # Course-specific components
│       ├── CourseList.tsx
│       ├── CourseForm.tsx
│       ├── CourseCard.tsx
│       └── CourseActions.tsx
├── features/
│   └── courses/              # Feature-based organization
│       ├── components/
│       ├── hooks/
│       ├── types/
│       └── index.ts
└── utils/
    ├── validation.ts         # Form validation helpers
    └── formatting.ts         # Data formatting utilities
```

## Implementation Phases

### Phase 1: Core Infrastructure

#### 1.1 API Client

```typescript
// lib/api-client.ts
interface IApiClient {
  get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  post<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>>;
  put<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>>;
  delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>>;
}

class ApiClient implements IApiClient {
  // HTTP communication layer
  // Handles: Authentication, base URLs, error handling, request/response transformation
}
```

#### 1.2 Base Types

```typescript
// types/api.ts
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
}
```

#### 1.3 Error Handling

```typescript
// lib/errors.ts
class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
  }
}

class ValidationError extends ApiError {}
class NotFoundError extends ApiError {}
class UnauthorizedError extends ApiError {}
```

### Phase 2: Domain Services

#### 2.1 Course Types

```typescript
// types/course.ts
interface Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateCourseData {
  name: string;
  code: string;
  instructor: string;
  description?: string;
  userId: string;
}

interface UpdateCourseData {
  name?: string;
  code?: string;
  instructor?: string;
  description?: string;
  userId: string;
}
```

#### 2.2 Course Service Interface

```typescript
// services/interfaces/ICourseService.ts
interface ICourseService {
  getCourses(userId: string): Promise<Course[]>;
  getCourseById(id: string, userId: string): Promise<Course>;
  createCourse(data: CreateCourseData): Promise<Course>;
  updateCourse(id: string, data: UpdateCourseData): Promise<Course>;
  deleteCourse(id: string, userId: string): Promise<void>;
}
```

#### 2.3 Course Service Implementation

```typescript
// services/CourseService.ts
class CourseService implements ICourseService {
  constructor(private apiClient: IApiClient) {}

  async getCourses(userId: string): Promise<Course[]> {
    // Business logic: validation, API call, data transformation
  }

  async createCourse(data: CreateCourseData): Promise<Course> {
    // Business logic: validation, API call, error handling
  }

  // ... other methods
}
```

### Phase 3: React Integration

#### 3.1 Custom Hooks

```typescript
// hooks/useCourses.ts
export function useCourses(userId: string) {
  return useQuery({
    queryKey: ["courses", userId],
    queryFn: () => courseService.getCourses(userId),
    enabled: !!userId,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseData) => courseService.createCourse(data),
    onSuccess: (newCourse) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      // Optimistic updates
    },
  });
}
```

#### 3.2 React State Management

```typescript
// Component-level state management
const CourseManagement = () => {
  // Simple React state for UI management
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // State handlers
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    setEditingCourse(null);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // ... rest of component
};
  openCreateModal: () => void;
  closeCreateModal: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedCourseId: null,
  isCreateModalOpen: false,

  setSelectedCourse: (id) => set({ selectedCourseId: id }),
  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),
}));
```

### Phase 4: CRUD Components

#### 4.1 Course List (Read)

```typescript
// components/courses/CourseList.tsx
export function CourseList({ userId }: { userId: string }) {
  const { data: courses, isLoading, error } = useCourses(userId);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="course-grid">
      {courses?.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
```

#### 4.2 Course Form (Create/Update)

```typescript
// components/courses/CourseForm.tsx
export function CourseForm({ course, onSubmit, onCancel }: CourseFormProps) {
  const { mutate: createCourse, isPending } = useCreateCourse();
  const { mutate: updateCourse } = useUpdateCourse();

  const handleSubmit = (data: CreateCourseData | UpdateCourseData) => {
    if (course) {
      updateCourse({ id: course.id, ...data });
    } else {
      createCourse(data);
    }
  };

  // Form UI with validation
}
```

#### 4.3 Course Actions (Delete)

```typescript
// components/courses/CourseActions.tsx
export function CourseActions({ course }: { course: Course }) {
  const { mutate: deleteCourse } = useDeleteCourse();

  const handleDelete = () => {
    if (confirm("Are you sure?")) {
      deleteCourse({ id: course.id, userId: course.userId });
    }
  };

  return (
    <div className="course-actions">
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
```

## Benefits of This Architecture

### 🏗️ Solid Foundation

- **Interface-driven development** - Matches backend architecture
- **Type-safe end-to-end** - Compile-time error checking
- **Easy to test and mock** - Each layer isolated

### 📈 Scalable Architecture

- **Add new domains easily** - Assignments, Quizzes, Users follow same pattern
- **Team-friendly** - Multiple developers can work independently
- **Enterprise-ready patterns** - Industry standard practices

### 🔧 Developer Experience

- **Excellent IntelliSense** - Full TypeScript support
- **Consistent patterns** - Same structure across all features
- **Clear separation of concerns** - Easy to find and modify code

### ⚡ Performance

- **Intelligent caching** - React Query handles data synchronization
- **Optimistic updates** - UI updates immediately, syncs with server
- **Background synchronization** - Data stays fresh automatically

## Data Flow Example: Creating a Course

1. **User clicks "Create Course"** in `CourseList` component
2. **Component opens modal** using React state setter
3. **User fills form** in `CourseForm` component
4. **Form validation** using Zod schemas
5. **Form submission** triggers `useCreateCourse` hook
6. **Hook calls** `CourseService.createCourse()`
7. **Service validates** data and calls API client
8. **API client** sends HTTP POST to `/api/courses`
9. **Backend responds** with created course
10. **React Query** updates cache and invalidates related queries
11. **UI updates automatically** with new course in list
12. **Modal closes** and success message shows

## Next Steps

### Immediate Implementation

1. **Install dependencies** - React Query, Axios, Zod
2. **Set up API client** - Base HTTP communication layer
3. **Create Course types** - TypeScript interfaces
4. **Build Course service** - Business logic layer
5. **Implement hooks** - React Query integration
6. **Create components** - CRUD UI components

### Future Expansion

- **Assignment domain** - Follow same pattern
- **User management** - Profile, settings
- **Authentication** - Enhanced auth service
- **File uploads** - Document management
- **Real-time features** - WebSocket integration

This architecture provides a robust foundation that will scale with your educational platform while maintaining clean, maintainable code that follows industry best practices.
