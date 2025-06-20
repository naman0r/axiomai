-- AlterTable
ALTER TABLE "users" ADD COLUMN     "academicYear" INTEGER,
ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 20,
ADD COLUMN     "school" TEXT;
