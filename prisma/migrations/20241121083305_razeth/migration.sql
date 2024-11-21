/*
  Warnings:

  - You are about to drop the column `currencyCode` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `shortDescription` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortName]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortName` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Product_productName_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "currencyCode",
DROP COLUMN "productName",
DROP COLUMN "shortDescription",
ADD COLUMN     "description" VARCHAR(255),
ADD COLUMN     "name" VARCHAR(200) NOT NULL,
ADD COLUMN     "shortName" VARCHAR(200) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_shortName_key" ON "Product"("shortName");
