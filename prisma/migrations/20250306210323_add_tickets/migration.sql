-- CreateEnum
CREATE TYPE "TicketsStatus" AS ENUM ('opened', 'rejected', 'resolved');

-- CreateTable
CREATE TABLE "Tickets" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "TicketsStatus" NOT NULL,
    "transcript_data" TEXT NOT NULL,

    CONSTRAINT "Tickets_pkey" PRIMARY KEY ("id")
);
