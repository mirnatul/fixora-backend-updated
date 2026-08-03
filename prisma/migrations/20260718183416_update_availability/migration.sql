/*
  Warnings:

  - Added the required column `date` to the `availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookingDate` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notes` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slot` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'ACCEPTED', 'CANCELLED', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "availability" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "slot" INTEGER[];

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "bookingDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "notes" TEXT NOT NULL,
ADD COLUMN     "slot" INTEGER NOT NULL,
ADD COLUMN     "status" "BookingStatus" NOT NULL,
ADD COLUMN     "totalAmount" INTEGER NOT NULL;
