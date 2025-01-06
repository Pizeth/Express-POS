/*
  Warnings:

  - Added the required column `start_date` to the `cashiers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cashiers" ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "customerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "warehouses" ADD COLUMN     "parentId" INTEGER;

-- CreateTable
CREATE TABLE "suppliers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255),
    "description" VARCHAR(255),
    "enabled_flag" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,
    "last_updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object_version_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cocktail" (
    "id" SERIAL NOT NULL,
    "cocktail_code" VARCHAR(30),
    "name" VARCHAR(200) NOT NULL,
    "short_name" VARCHAR(200) NOT NULL,
    "description" VARCHAR(500),
    "image" VARCHAR(255),
    "enabled_flag" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,
    "last_updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object_version_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Cocktail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cocktail_details" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "cocktailId" INTEGER NOT NULL,
    "quantity" DECIMAL(10,2),
    "enabled_flag" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,
    "last_updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object_version_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "cocktail_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "customerNumber" VARCHAR(30) NOT NULL,
    "mobileNumber" VARCHAR(30) NOT NULL,
    "gender" VARCHAR(1),
    "identifyType" VARCHAR(1),
    "identifyNumber" VARCHAR(100),
    "description" VARCHAR(255),
    "registeredDate" TIMESTAMP(3),
    "enabledFlag" VARCHAR(1) NOT NULL,
    "holdFlag" VARCHAR(1),
    "phoneNumber" VARCHAR(30),
    "address" VARCHAR(200),
    "created_by" INTEGER NOT NULL,
    "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,
    "last_updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object_version_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_name_key" ON "suppliers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_email_key" ON "suppliers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_phone_key" ON "suppliers"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Cocktail_cocktail_code_key" ON "Cocktail"("cocktail_code");

-- CreateIndex
CREATE UNIQUE INDEX "Cocktail_name_key" ON "Cocktail"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Cocktail_short_name_key" ON "Cocktail"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customerNumber_key" ON "Customer"("customerNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_mobileNumber_key" ON "Customer"("mobileNumber");

-- AddForeignKey
ALTER TABLE "cocktail_details" ADD CONSTRAINT "cocktail_details_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cocktail_details" ADD CONSTRAINT "cocktail_details_cocktailId_fkey" FOREIGN KEY ("cocktailId") REFERENCES "Cocktail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
