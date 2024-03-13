/*
  Warnings:

  - You are about to drop the `invoice_transactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "invoice_transactions" DROP CONSTRAINT "invoice_transactions_invoice_id_fkey";

-- DropForeignKey
ALTER TABLE "invoice_transactions" DROP CONSTRAINT "invoice_transactions_recurring_transaction_id_fkey";

-- DropTable
DROP TABLE "invoice_transactions";

-- CreateTable
CREATE TABLE "invoice_expenses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "amount" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "invoice_id" TEXT NOT NULL,
    "recurring_transaction_id" TEXT,

    CONSTRAINT "invoice_expenses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "invoice_expenses" ADD CONSTRAINT "invoice_expenses_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_expenses" ADD CONSTRAINT "invoice_expenses_recurring_transaction_id_fkey" FOREIGN KEY ("recurring_transaction_id") REFERENCES "recurring_transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
