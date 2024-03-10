/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `invoice_expenses` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `invoice_expenses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "invoice_expenses" DROP COLUMN "deleted_at",
DROP COLUMN "status",
ADD COLUMN     "canceled_at" TIMESTAMP(3);
