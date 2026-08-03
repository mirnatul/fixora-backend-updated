/*
  Warnings:

  - You are about to drop the column `slot` on the `availability` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "availability" DROP COLUMN "slot",
ADD COLUMN     "bookedSlot" INTEGER[];
