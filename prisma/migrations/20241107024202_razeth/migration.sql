/*
  Warnings:

  - You are about to drop the column `endDate` on the `ProductCategory` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `ProductCategory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductCategory" DROP COLUMN "endDate",
DROP COLUMN "startDate";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "enabledFlag" BOOLEAN NOT NULL DEFAULT true;
