/*
  Warnings:

  - You are about to alter the column `limit` on the `CreditCard` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `balance` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `expense` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `income` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `amount` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "CreditCard" ALTER COLUMN "limit" SET DEFAULT 0,
ALTER COLUMN "limit" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "balance" SET DEFAULT 0,
ALTER COLUMN "balance" SET DATA TYPE INTEGER,
ALTER COLUMN "expense" SET DEFAULT 0,
ALTER COLUMN "expense" SET DATA TYPE INTEGER,
ALTER COLUMN "income" SET DEFAULT 0,
ALTER COLUMN "income" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "amount" SET DATA TYPE INTEGER;
