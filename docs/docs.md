## how to add something to this codebase (following CLEAN and OOD principles):

```javascript
1: update prisma schema @backend/prisma/schema.prisma
run npx prisma migrate dev name add_new_feature



2: interface layer:

/backend/src/interfaces/models/I{Entity}.ts      // Domain model interface
/backend/src/interfaces/repositories/I{Entity}Repository.ts  // Repository interface
/backend/src/interfaces/services/I{Entity}Service.ts         // Service interface
/backend/src/interfaces/controllers/I{Entity}Controller.ts   // Controller interface



3:

// Implement the domain model with business logic
/backend/src/models/{Entity}Model.ts -> implement the IEntity model

Include validate(), toJSON(), toPrisma() methods



4: Repository Layer:

// Data access layer
/backend/src/repositories/{Entity}Repository.ts



5: Service layer:

// Business logic layer
/backend/src/services/{Entity}Service.ts


6: Controller layer:

// HTTP request handling
/backend/src/controllers/{Entity}Controller.ts


7: Validation:

// Request validation middleware
/backend/src/validation/{Entity}Validation.ts
        // follow the exact structure of CourseValidation.ts


8: Routes:

// API routing
/backend/src/routes/{Entity}Route.ts



9: Register the routes

// update main server file


```

```javascript
Frontend (Next.js + TypeScript + React Query)


1: Type Definitions (can move this into a shared folder somehow, need to do research)

// Type definitions
/frontend/src/types/{entity}.ts


2: Frontend Service later:

// API communication
/frontend/src/services/{Entity}Service.ts


3: service interface:

// Service contract
/frontend/src/services/interfaces/I{Entity}Service.ts



4: Query Client setup

// Update query keys
/frontend/src/lib/query-client.ts


5: React Hooks:
// Data fetching and state management
/frontend/src/hooks/use{Entity}s.ts

use{Entity}s(userId) - Get all entities
use{Entity}(id, userId) - Get single entity
useCreate{Entity}() - Create with optimistic updates
useUpdate{Entity}() - Update with optimistic updates
useDelete{Entity}() - Delete with cache invalidation
usePrefetch{Entity}() - Prefetching

```
