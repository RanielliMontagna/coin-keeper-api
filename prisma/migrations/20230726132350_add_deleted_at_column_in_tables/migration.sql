-- AlterTable
ALTER TABLE "CreditCard" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "deleted_at" TIMESTAMP(3);
