/*
  Warnings:

  - A unique constraint covering the columns `[technicianId,date]` on the table `availability` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "availability_technicianId_date_key" ON "availability"("technicianId", "date");
