/*
  Warnings:

  - Added the required column `staff_id` to the `Tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tickets" ADD COLUMN     "staff_id" TEXT NOT NULL;
