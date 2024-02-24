/*
  Warnings:

  - You are about to drop the column `end_date` on the `recurring_transactions` table. All the data in the column will be lost.
  - Added the required column `repeat_amount` to the `recurring_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recurring_transactions" DROP COLUMN "end_date",
ADD COLUMN     "repeat_amount" INTEGER NOT NULL;
