#My Fantasic Design (focus: canvas integration, Course creation, DESIGN)

- made a models/ folder,
- made a repositories folder, with an interfaces subfolder.
- made User.ts (model)
- made IUserRepository.ts (interface, in repos/interfaces)

```bash
┌─────────────────┐
│   Controllers   │ ← HTTP handling only
├─────────────────┤
│    Services     │ ← Business logic
├─────────────────┤
│  Repositories   │ ← Data access only
├─────────────────┤
│    Database     │ ← Data storage
└─────────────────┘

```

### Steps:

```bash
1: create canvas domain models (models/canvas/CanvasIntegration.ts and CanvasCourse.ts)

2: Create canvas Repositories layer:
    - backend/src/repositories/interfaces/ICanvasRepo.ts
    - backend/src/repositories/PrismaCanvasRepo.ts

3: Create a Canvas service layer (services/CanvasService.ts - business logic)
    - backend/src/services/external/CanvasAPIService.ts (External API communicator and calls. )

4. Update database Schema (Prisma schema definitions and Prisma migrations)

5. create Canvas API routes (backend/src/routes/canvasRoutes.ts)


-- PHASE 2:

6. Create a FRONTEND canvas service layer (frontend/src/services/canvasService.ts)

7. Create Canvas custom Hooks (useCanvasConnection.tsx, useCourses.tsx)

8. create a canvas context provider (frontend/src/context/CanvasContext.tsx)

9. ?? create canvas component factory (frontend/src/components/canvas/CanvasComponentFactory.ts)

10. create canvas Pages and Components
-  frontend/src/app/(landing)/connect/canvas/page.tsx
- frontend/src/components/canvas/CanvasConnectionForm.tsx
- frontend/src/components/canvas/CanvasCourseList.tsx
        * just like in EduGenie

```
