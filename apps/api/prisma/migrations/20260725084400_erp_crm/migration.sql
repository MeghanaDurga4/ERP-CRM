-- CreateTable
CREATE TABLE "ChallanSequence" (
    "yearMonth" TEXT NOT NULL,
    "lastValue" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ChallanSequence_pkey" PRIMARY KEY ("yearMonth")
);
