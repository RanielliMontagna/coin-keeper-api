/*
  Warnings:

  - Added the required column `google_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "google_id" TEXT NOT NULL;
