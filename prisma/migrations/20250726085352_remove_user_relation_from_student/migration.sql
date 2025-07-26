/*
  Warnings:

  - You are about to drop the column `user_id` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `studentid` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_studentid_fkey";

-- DropIndex
DROP INDEX "students_user_id_key";

-- DropIndex
DROP INDEX "user_studentid_key";

-- AlterTable
ALTER TABLE "students" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "studentid";
