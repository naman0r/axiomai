-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "canvasCourseId" TEXT,
ADD COLUMN     "isFromCanvas" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "accessTokenHash" TEXT,
ADD COLUMN     "canvasDomain" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3),
    "pointsPossible" DOUBLE PRECISION,
    "courseId" TEXT NOT NULL,
    "canvasAssignmentId" TEXT,
    "canvasHtmlUrl" TEXT,
    "isFromCanvas" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
