-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('opened', 'rejected', 'resolved');

-- CreateTable
CREATE TABLE "Complaint" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "type" "ComplaintStatus" NOT NULL,
    "assistant_data" TEXT NOT NULL,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);
