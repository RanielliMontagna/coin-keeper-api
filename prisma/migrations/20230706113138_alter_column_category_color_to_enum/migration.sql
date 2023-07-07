/*
  Warnings:

  - The `color` column on the `categories` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Color" AS ENUM ('RED', 'PINK', 'PURPLE', 'DEEP_PURPLE', 'INDIGO', 'BLUE', 'LIGHT_BLUE', 'CYAN', 'TEAL', 'GREEN', 'LIGHT_GREEN', 'LIME', 'YELLOW', 'AMBER', 'ORANGE', 'DEEP_ORANGE', 'BROWN', 'GREY', 'BLUE_GREY', 'BLACK');

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "color",
ADD COLUMN     "color" "Color" NOT NULL DEFAULT 'BLUE_GREY';
