/*
  Warnings:

  - You are about to alter the column `hourlyRate` on the `TechnicianProfile` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `averageRating` on the `TechnicianProfile` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - Made the column `averageRating` on table `TechnicianProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalReviews` on table `TechnicianProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TechnicianProfile" ALTER COLUMN "hourlyRate" SET DATA TYPE INTEGER,
ALTER COLUMN "averageRating" SET NOT NULL,
ALTER COLUMN "averageRating" SET DEFAULT 0,
ALTER COLUMN "averageRating" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "totalReviews" SET NOT NULL,
ALTER COLUMN "totalReviews" SET DEFAULT 0,
ALTER COLUMN "isAvailable" SET DEFAULT true;
