/*
  Warnings:

  - The `experience` column on the `profiles` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "experience",
ADD COLUMN     "experience" INTEGER;
