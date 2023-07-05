-- CreateEnum
CREATE TYPE "Institution" AS ENUM ('NUBANK', 'ITAU', 'BRADESCO', 'SANTANDER', 'BANCO_DO_BRASIL', 'CAIXA', 'INTER', 'SICOOB', 'SICREDI', 'OTHER');

-- CreateEnum
CREATE TYPE "Flag" AS ENUM ('VISA', 'MASTERCARD', 'ELO', 'AMERICAN_EXPRESS', 'HIPERCARD', 'DINERS_CLUB', 'DISCOVER', 'JCB', 'AURA', 'OTHER');

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "institution" "Institution" NOT NULL DEFAULT 'OTHER';

-- CreateTable
CREATE TABLE "CreditCard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "limit" DOUBLE PRECISION NOT NULL,
    "flag" "Flag" NOT NULL DEFAULT 'OTHER',
    "closingDay" INTEGER NOT NULL,
    "dueDay" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreditCard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
