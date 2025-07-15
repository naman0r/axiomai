# AxiomAI Backend API Documentation

This document provides comprehensive documentation for all available API routes in the AxiomAI backend.

**Base URL:** `http://localhost:8000` (development) | `axiomai-production-d57b.up.railway.app` (production)

## Table of Contents

<!-- - [Authentication](#authentication)
- [Course Management Routes](#course-management-routes)
- [Canvas Integration Routes](#canvas-integration-routes)
- [User Management Routes](#user-management-routes)
- [Utility Routes](#utility-routes)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
 -->

---

## Authentication

All routes marked with 🔒 require authentication via Clerk. The user object is available in `req.user` after authentication middleware.

---

## Course Management Routes

**Base Path:** `/api/courses`

### 1. Create Course

- **Endpoint:** `POST /api/courses`
- **Purpose:** Create a new course for a user
- **Validation:** `validateCourseCreation` middleware
- **Authentication:** Not required (uses userId from body)

**Request Body:**

```json
{
  "name": "string (required)",
  "code": "string (required)",
  "instructor": "string (required)",
  "description": "string (optional)",
  "userId": "string (required)",
  "canvasCourseId": "string (optional)",
  "isFromCanvas": "boolean (optional, default: false)"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "code": "string",
    "instructor": "string",
    "description": "string | null",
    "userId": "string",
    "createdAt": "ISO string",
    "updatedAt": "ISO string",
    "canvasCourseId": "string | null",
    "isFromCanvas": "boolean"
  }
}
```

**Error Responses:**

- `400`: Validation errors
- `409`: Course code already exists for user
- `500`: Internal server error

---

### 2. Get User Courses

- **Endpoint:** `GET /api/courses?userId={userId}`
- **Purpose:** Retrieve all courses for a specific user
- **Validation:** `validateGetCourses` middleware
- **Authentication:** Not required

**Query Parameters:**

- `userId`: string (required) - The user ID to fetch courses for

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "code": "string",
      "instructor": "string",
      "description": "string | null",
      "userId": "string",
      "createdAt": "ISO string",
      "updatedAt": "ISO string",
      "canvasCourseId": "string | null",
      "isFromCanvas": "boolean"
    }
  ]
}
```

---

### 3. Get Course by ID

- **Endpoint:** `GET /api/courses/:id?userId={userId}`
- **Purpose:** Retrieve a specific course by ID
- **Validation:** `validateGetCourseById` middleware
- **Authentication:** Not required

**Path Parameters:**

- `id`: string (required) - Course ID

**Query Parameters:**

- `userId`: string (required) - User ID for authorization

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "code": "string",
    "instructor": "string",
    "description": "string | null",
    "userId": "string",
    "createdAt": "ISO string",
    "updatedAt": "ISO string",
    "canvasCourseId": "string | null",
    "isFromCanvas": "boolean"
  }
}
```

**Error Responses:**

- `404`: Course not found
- `403`: Not authorized to access this course

---

### 4. Update Course

- **Endpoint:** `PUT /api/courses/:id`
- **Purpose:** Update an existing course
- **Validation:** `validateCourseUpdate` middleware
- **Authentication:** Not required (uses userId from body)

**Path Parameters:**

- `id`: string (required) - Course ID

**Request Body:**

```json
{
  "name": "string (optional)",
  "code": "string (optional)",
  "instructor": "string (optional)",
  "description": "string (optional)",
  "userId": "string (required)",
  "canvasCourseId": "string (optional)",
  "isFromCanvas": "boolean (optional)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "code": "string",
    "instructor": "string",
    "description": "string | null",
    "userId": "string",
    "createdAt": "ISO string",
    "updatedAt": "ISO string",
    "canvasCourseId": "string | null",
    "isFromCanvas": "boolean"
  }
}
```

**Error Responses:**

- `404`: Course not found
- `403`: Not authorized to update this course
- `409`: Course code already exists for user

---

### 5. Delete Course

- **Endpoint:** `DELETE /api/courses/:id`
- **Purpose:** Delete a course
- **Validation:** `validateCourseDelete` middleware
- **Authentication:** Not required (uses userId from body)

**Path Parameters:**

- `id`: string (required) - Course ID

**Request Body:**

```json
{
  "userId": "string (required)"
}
```

**Success Response (204):**

```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

**Error Responses:**

- `404`: Course not found
- `403`: Not authorized to delete this course

---

## Canvas Integration Routes

**Base Path:** `/api/canvas`

### 1. Connect Canvas Account 🔒

- **Endpoint:** `POST /api/canvas/connect`
- **Purpose:** Connect user's Canvas account for integration
- **Authentication:** Required (Clerk)

**Request Body:**

```json
{
  "domain": "string (required)", // e.g., "school.instructure.com"
  "accessToken": "string (required)" // Canvas API token
}
```

**Success Response (200):**

```json
{
  "message": "Canvas connected successfully"
}
```

**Error Responses:**

- `401`: Unauthorized (no user)
- `500`: Invalid Canvas credentials or connection failed

---

### 2. Disconnect Canvas Account 🔒

- **Endpoint:** `DELETE /api/canvas/disconnect`
- **Purpose:** Remove Canvas integration for user
- **Authentication:** Required (Clerk)

**Success Response (200):**

```json
{
  "message": "Canvas disconnected successfully"
}
```

**Error Responses:**

- `401`: Unauthorized (no user)
- `500`: Failed to disconnect Canvas

---

### 3. Get Canvas Courses 🔒

- **Endpoint:** `GET /api/canvas/courses`
- **Purpose:** Fetch all active courses from user's Canvas account
- **Authentication:** Required (Clerk)

**Success Response (200):**

```json
[
  {
    "id": "string",
    "name": "string",
    "course_code": "string",
    "enrollment_state": "string"
  }
]
```

**Error Responses:**

- `401`: Unauthorized (no user)
- `404`: Canvas credentials not found
- `500`: Canvas API error

---

### 4. Import Canvas Courses 🔒

- **Endpoint:** `POST /api/canvas/import-courses`
- **Purpose:** Import selected Canvas courses into AxiomAI
- **Authentication:** Required (Clerk)

**Request Body:**

```json
{
  "courseIds": ["string"] // Array of Canvas course IDs to import
}
```

**Success Response (200):**

```json
[
  {
    "id": "string",
    "name": "string",
    "code": "string",
    "instructor": "Canvas Import",
    "description": "string | null",
    "userId": "string",
    "createdAt": "ISO string",
    "updatedAt": "ISO string",
    "canvasCourseId": "string",
    "isFromCanvas": true
  }
]
```

**Error Responses:**

- `401`: Unauthorized (no user)
- `404`: Canvas credentials not found
- `500`: Import failed or Canvas API error

---

## User Management Routes

**Base Path:** `/api/users`

### 1. Get All Users

- **Endpoint:** `GET /api/users`
- **Purpose:** Retrieve all users (public endpoint for testing)
- **Authentication:** Not required

**Success Response (200):**

```json
[
  {
    "id": "string",
    "email": "string",
    "name": "string | null",
    "firstName": "string | null",
    "lastName": "string | null",
    "academicYear": "number | null",
    "school": "string | null",
    "credits": "number",
    "createdAt": "ISO string",
    "canvasDomain": "string | null",
    "accessTokenHash": "string | null",
    "isActive": "boolean",
    "updatedAt": "ISO string"
  }
]
```

---

### 2. Sync User

- **Endpoint:** `POST /api/users/sync`
- **Purpose:** Create or update user information (typically from Clerk webhook)
- **Authentication:** Not required

**Request Body:**

```json
{
  "id": "string (required)", // Clerk user ID
  "email": "string (required)",
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "name": "string (optional)"
}
```

**Success Response (200):**

```json
{
  "message": "User synced successfully",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

**Error Responses:**

- `400`: User ID and email are required
- `500`: Failed to sync user

---

## Utility Routes

### 1. Health Check

- **Endpoint:** `GET /api/health`
- **Purpose:** Check database connectivity and API health
- **Authentication:** Not required

**Success Response (200):**

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "ISO string"
}
```

**Error Response (500):**

```json
{
  "status": "error",
  "database": "disconnected",
  "error": "string"
}
```

---

### 2. Network Test

- **Endpoint:** `GET /api/network-test`
- **Purpose:** Test connectivity to Supabase
- **Authentication:** Not required

**Success Response (200):**

```json
{
  "status": "network_ok",
  "supabaseReachable": true,
  "statusCode": "number",
  "timestamp": "ISO string"
}
```

**Error Response (500):**

```json
{
  "status": "network_error",
  "supabaseReachable": false,
  "error": "string",
  "timestamp": "ISO string"
}
```

---

### 3. Debug Info

- **Endpoint:** `GET /api/debug`
- **Purpose:** Get environment and configuration information
- **Authentication:** Not required

**Success Response (200):**

```json
{
  "nodeEnv": "string",
  "port": "string",
  "corsOrigin": "string",
  "databaseUrl": "SET (hidden for security)" | "NOT SET",
  "directUrl": "SET (hidden for security)" | "NOT SET",
  "supabaseUrl": "SET" | "NOT SET",
  "timestamp": "ISO string"
}
```

---

### 4. Protected Route Test

- **Endpoint:** `GET /api/protected`
- **Purpose:** Test protected route functionality
- **Authentication:** Not implemented yet

**Success Response (200):**

```json
{
  "message": "This will be a protected route!",
  "note": "Install Clerk packages first"
}
```

---

## Data Models

### User Model

```typescript
{
  id: string // Clerk user ID
  email: string
  name?: string
  firstName?: string
  lastName?: string
  academicYear?: number
  school?: string
  courses: Course[] // Relation
  credits: number // Default: 20
  createdAt: Date
  canvasDomain?: string // Canvas instance domain
  accessTokenHash?: string // Encrypted Canvas token
  isActive: boolean // Default: false
  updatedAt: Date
}
```

### Course Model

```typescript
{
  id: string // CUID
  name: string
  description?: string
  code: string
  instructor: string
  userId: string // Foreign key to User
  user: User // Relation
  createdAt: Date
  updatedAt: Date
  canvasCourseId?: string // Canvas course ID
  isFromCanvas: boolean // Default: false
  Tasks: Tasks[] // Relation
}
```

### Tasks Model

```typescript
{
  id: string // CUID
  title: string
  description?: string
  dueDate?: Date
  pointsPossible?: number
  courseId: string // Foreign key to Course
  course: Course // Relation
  canvasAssignmentId?: string // Canvas assignment ID
  canvasHtmlUrl?: string // Direct Canvas link
  isFromCanvas: boolean // Default: false
  createdAt: Date
  updatedAt: Date
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "message": "string",
  "errors": ["string"] // Optional array for validation errors
}
```

### HTTP Status Codes Used

- `200`: Success
- `201`: Created successfully
- `204`: Success with no content
- `400`: Bad request / Validation error
- `401`: Unauthorized
- `403`: Forbidden / Not authorized
- `404`: Not found
- `409`: Conflict (duplicate resource)
- `500`: Internal server error

### Error Types

- **ValidationError**: Input validation failed
- **NotFoundError**: Resource not found
- **ConflictError**: Resource already exists
- **Unauthorized**: Authentication required
- **Forbidden**: User not authorized for resource

---

## Architecture Notes

- **Service Layer**: Business logic is handled in service classes
- **Repository Pattern**: Data access is abstracted through repositories
- **Controller Layer**: Handles HTTP requests/responses and validation
- **Middleware**: Input validation is handled through dedicated middleware functions
- **Dependency Injection**: Services are injected into controllers for testability
- **Type Safety**: Full TypeScript implementation with interfaces for all layers

---

## Development Setup

1. Install dependencies: `npm install`
2. Set up environment variables in `.env`
3. Run migrations: `npx prisma migrate dev`
4. Generate Prisma client: `npx prisma generate`
5. Start development server: `npm run dev`
6. Build for production: `npm run build`
7. Start production server: `npm start`
