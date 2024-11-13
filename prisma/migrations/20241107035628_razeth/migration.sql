/*
  Warnings:

  - You are about to drop the `ProductCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductPromoDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductPromotion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductSubCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_promotionId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_subCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductPromoDetail" DROP CONSTRAINT "ProductPromoDetail_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductPromoDetail" DROP CONSTRAINT "ProductPromoDetail_promotionId_fkey";

-- DropForeignKey
ALTER TABLE "ProductSubCategory" DROP CONSTRAINT "ProductSubCategory_categoryId_fkey";

-- DropTable
DROP TABLE "ProductCategory";

-- DropTable
DROP TABLE "ProductPromoDetail";

-- DropTable
DROP TABLE "ProductPromotion";

-- DropTable
DROP TABLE "ProductSubCategory";

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "shortName" VARCHAR(30) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" VARCHAR(255),
    "image" VARCHAR(255),
    "enabledFlag" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" INTEGER NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "lastUpdatedBy" INTEGER NOT NULL,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,
    "objectVersionId" INTEGER NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubCategory" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "shortName" VARCHAR(30) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "image" VARCHAR(255),
    "enabledFlag" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" INTEGER NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "lastUpdatedBy" INTEGER NOT NULL,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,
    "objectVersionId" INTEGER NOT NULL,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromoDetail" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "promotionId" INTEGER NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "lastUpdatedBy" INTEGER NOT NULL,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,
    "objectVersionId" INTEGER NOT NULL,

    CONSTRAINT "PromoDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" SERIAL NOT NULL,
    "promoCode" VARCHAR(60) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "enabledFlag" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" INTEGER NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "lastUpdatedBy" INTEGER NOT NULL,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,
    "objectVersionId" INTEGER NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_shortName_key" ON "Category"("shortName");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_shortName_key" ON "SubCategory"("shortName");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_name_key" ON "SubCategory"("name");

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromoDetail" ADD CONSTRAINT "PromoDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromoDetail" ADD CONSTRAINT "PromoDetail_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
