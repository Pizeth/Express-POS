/*
  Warnings:

  - You are about to drop the column `loginPassword` on the `Cashier` table. All the data in the column will be lost.
  - You are about to drop the column `loginUser` on the `Cashier` table. All the data in the column will be lost.
  - You are about to drop the column `partyId` on the `Cashier` table. All the data in the column will be lost.
  - You are about to alter the column `description` on the `Cashier` table. The data in that column could be lost. The data in that column will be cast from `VarChar(4000)` to `VarChar(255)`.
  - The `enabledFlag` column on the `Cashier` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `endDate` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Invoice` table. All the data in the column will be lost.
  - You are about to alter the column `description` on the `Invoice` table. The data in that column could be lost. The data in that column will be cast from `VarChar(4000)` to `VarChar(255)`.
  - The `enabledFlag` column on the `Invoice` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `customerId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `giftwrapFlag` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `giftwrapMessage` on the `Order` table. All the data in the column will be lost.
  - You are about to alter the column `description` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(2000)` to `VarChar(255)`.
  - The `enabledFlag` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `endDate` on the `OrderLine` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `OrderLine` table. All the data in the column will be lost.
  - You are about to alter the column `description` on the `OrderLine` table. The data in that column could be lost. The data in that column will be cast from `VarChar(4000)` to `VarChar(255)`.
  - You are about to drop the column `endDate` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Payment` table. All the data in the column will be lost.
  - You are about to alter the column `description` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(4000)` to `VarChar(255)`.
  - You are about to alter the column `description` on the `PaymentMethod` table. The data in that column could be lost. The data in that column will be cast from `VarChar(4000)` to `VarChar(255)`.
  - The `enabledFlag` column on the `PaymentMethod` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `shortDescription` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(2000)` to `VarChar(255)`.
  - You are about to alter the column `longDescription` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(4000)` to `VarChar(500)`.
  - You are about to alter the column `description` on the `ProductTransaction` table. The data in that column could be lost. The data in that column will be cast from `VarChar(4000)` to `VarChar(255)`.
  - You are about to drop the column `parentId` on the `Warehouse` table. All the data in the column will be lost.
  - You are about to drop the `manufacturer` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[profileId]` on the table `Cashier` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profileId` to the `Cashier` table without a default value. This is not possible if the table is not empty.
  - Made the column `cashierNumber` on table `Cashier` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `cashierType` on the `Cashier` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `productTypeId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creationDate` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastUpdateDate` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastUpdatedBy` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `objectVersionId` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creationDate` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastUpdateDate` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastUpdatedBy` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `objectVersionId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Quantity` to the `Warehouse` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CashierType" AS ENUM ('STAFF', 'MANAGER', 'OWNER');

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_promotionId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_cashierId_fkey";

-- DropForeignKey
ALTER TABLE "OrderLine" DROP CONSTRAINT "OrderLine_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderLine" DROP CONSTRAINT "OrderLine_productId_fkey";

-- DropForeignKey
ALTER TABLE "PromoDetail" DROP CONSTRAINT "PromoDetail_productId_fkey";

-- DropForeignKey
ALTER TABLE "PromoDetail" DROP CONSTRAINT "PromoDetail_promotionId_fkey";

-- DropForeignKey
ALTER TABLE "SubCategory" DROP CONSTRAINT "SubCategory_categoryId_fkey";

-- DropIndex
DROP INDEX "Cashier_loginUser_key";

-- AlterTable
ALTER TABLE "Cashier" DROP COLUMN "loginPassword",
DROP COLUMN "loginUser",
DROP COLUMN "partyId",
ADD COLUMN     "profileId" INTEGER NOT NULL,
ALTER COLUMN "cashierNumber" SET NOT NULL,
ALTER COLUMN "cashierNumber" SET DATA TYPE TEXT,
DROP COLUMN "cashierType",
ADD COLUMN     "cashierType" "CashierType" NOT NULL,
ALTER COLUMN "description" SET DATA TYPE VARCHAR(255),
DROP COLUMN "enabledFlag",
ADD COLUMN     "enabledFlag" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ALTER COLUMN "description" SET DATA TYPE VARCHAR(255),
DROP COLUMN "enabledFlag",
ADD COLUMN     "enabledFlag" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "customerId",
DROP COLUMN "giftwrapFlag",
DROP COLUMN "giftwrapMessage",
ALTER COLUMN "description" SET DATA TYPE VARCHAR(255),
DROP COLUMN "enabledFlag",
ADD COLUMN     "enabledFlag" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "OrderLine" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ALTER COLUMN "description" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ALTER COLUMN "description" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "PaymentMethod" ALTER COLUMN "description" SET DATA TYPE VARCHAR(255),
DROP COLUMN "enabledFlag",
ADD COLUMN     "enabledFlag" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "productTypeId" INTEGER NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ALTER COLUMN "shortDescription" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "longDescription" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "ProductTransaction" ALTER COLUMN "description" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "createdBy" INTEGER NOT NULL,
ADD COLUMN     "creationDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "enabledFlag" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "holdFlag" VARCHAR(1),
ADD COLUMN     "lastUpdateDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "lastUpdatedBy" INTEGER NOT NULL,
ADD COLUMN     "objectVersionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdBy" INTEGER NOT NULL,
ADD COLUMN     "creationDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "lastUpdateDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "lastUpdatedBy" INTEGER NOT NULL,
ADD COLUMN     "objectVersionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Warehouse" DROP COLUMN "parentId",
ADD COLUMN     "Quantity" INTEGER NOT NULL;

-- DropTable
DROP TABLE "manufacturer";

-- CreateTable
CREATE TABLE "Manufacturer" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "image" VARCHAR(255),
    "phone" VARCHAR(255),
    "enabledFlag" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" INTEGER NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedBy" INTEGER NOT NULL,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,
    "objectVersionId" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Manufacturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductType" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "image" VARCHAR(255),
    "enabledFlag" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" INTEGER NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedBy" INTEGER NOT NULL,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,
    "objectVersionId" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ProductType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Store" (
    "id" SERIAL NOT NULL,
    "countryCode" VARCHAR(3) NOT NULL,
    "shortName" VARCHAR(30) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" VARCHAR(255),
    "enabledFlag" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" INTEGER NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "lastUpdatedBy" INTEGER NOT NULL,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,
    "objectVersionId" INTEGER NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreBranch" (
    "id" SERIAL NOT NULL,
    "storeId" INTEGER NOT NULL,
    "shortName" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "parentId" INTEGER,
    "managerId" INTEGER,
    "enabledFlag" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" INTEGER NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "lastUpdatedBy" INTEGER NOT NULL,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,
    "objectVersionId" INTEGER NOT NULL,

    CONSTRAINT "StoreBranch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Store_shortName_key" ON "Store"("shortName");

-- CreateIndex
CREATE UNIQUE INDEX "Store_name_key" ON "Store"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StoreBranch_shortName_key" ON "StoreBranch"("shortName");

-- CreateIndex
CREATE UNIQUE INDEX "StoreBranch_name_key" ON "StoreBranch"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Cashier_profileId_key" ON "Cashier"("profileId");

-- AddForeignKey
ALTER TABLE "Cashier" ADD CONSTRAINT "Cashier_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "ProductType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PromoDetail" ADD CONSTRAINT "PromoDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PromoDetail" ADD CONSTRAINT "PromoDetail_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "StoreBranch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StoreBranch" ADD CONSTRAINT "StoreBranch_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "StoreBranch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "Cashier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OrderLine" ADD CONSTRAINT "OrderLine_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OrderLine" ADD CONSTRAINT "OrderLine_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
