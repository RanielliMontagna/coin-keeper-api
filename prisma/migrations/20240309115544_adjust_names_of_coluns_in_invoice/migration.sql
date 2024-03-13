/*
  Warnings:

  - You are about to drop the column `creditCard_id` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `creditCard_id` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `credit_card_id` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_creditCard_id_fkey";

-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "creditCard_id",
ADD COLUMN     "credit_card_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "creditCard_id",
ADD COLUMN     "credit_card_id" TEXT;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_credit_card_id_fkey" FOREIGN KEY ("credit_card_id") REFERENCES "credit_cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_credit_card_id_fkey" FOREIGN KEY ("credit_card_id") REFERENCES "credit_cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
