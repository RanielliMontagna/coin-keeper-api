/*
  Warnings:

  - You are about to drop the column `accountId` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `CreditCard` table. All the data in the column will be lost.
  - Added the required column `account_id` to the `CreditCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `CreditCard` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CreditCard" DROP CONSTRAINT "CreditCard_accountId_fkey";

-- DropForeignKey
ALTER TABLE "CreditCard" DROP CONSTRAINT "CreditCard_userId_fkey";

-- AlterTable
ALTER TABLE "CreditCard" DROP COLUMN "accountId",
DROP COLUMN "userId",
ADD COLUMN     "account_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
