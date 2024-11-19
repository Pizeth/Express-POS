/*
  Warnings:

  - Added the required column `salePrice` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "salePrice" DECIMAL(7,3) NOT NULL;
