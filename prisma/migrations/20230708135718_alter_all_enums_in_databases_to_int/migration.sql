/*
  Warnings:

  - The `flag` column on the `CreditCard` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `institution` column on the `accounts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `color` column on the `categories` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type` column on the `transactions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "CreditCard" DROP COLUMN "flag",
ADD COLUMN     "flag" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "balance" SET DEFAULT 0,
DROP COLUMN "institution",
ADD COLUMN     "institution" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "color",
ADD COLUMN     "color" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "type",
ADD COLUMN     "type" INTEGER NOT NULL DEFAULT 0;

-- DropEnum
DROP TYPE "Color";

-- DropEnum
DROP TYPE "Flag";

-- DropEnum
DROP TYPE "Institution";

-- DropEnum
DROP TYPE "TransactionType";
