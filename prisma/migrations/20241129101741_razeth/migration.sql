/*
  Warnings:

  - You are about to drop the column `quantity` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `stocks` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username,email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `base_unit_id` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `base_unit_quantity` to the `stocks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_id` to the `stocks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_quantity` to the `stocks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "quantity",
ADD COLUMN     "base_unit_id" INTEGER NOT NULL,
ADD COLUMN     "base_unit_quantity" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "stocks" DROP COLUMN "quantity",
ADD COLUMN     "base_unit_quantity" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "unit_id" INTEGER NOT NULL,
ADD COLUMN     "unit_quantity" DECIMAL(10,2) NOT NULL;

-- CreateTable
CREATE TABLE "product_unit" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "symbol" VARCHAR(10),
    "base_unit_id" INTEGER,
    "base_unit_ratio" DECIMAL(10,2),
    "enabled_flag" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,
    "last_updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object_version_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "product_unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_specific_unit_hierarchies" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "parent_unit_id" INTEGER NOT NULL,
    "child_unit_id" INTEGER NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "enabled_flag" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,
    "last_updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "objectVersionId" INTEGER NOT NULL,

    CONSTRAINT "product_specific_unit_hierarchies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_unit_name_key" ON "product_unit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "product_specific_unit_hierarchies_product_id_parent_unit_id_key" ON "product_specific_unit_hierarchies"("product_id", "parent_unit_id", "child_unit_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_email_key" ON "users"("username", "email");

-- AddForeignKey
ALTER TABLE "product_unit" ADD CONSTRAINT "product_unit_base_unit_id_fkey" FOREIGN KEY ("base_unit_id") REFERENCES "product_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_specific_unit_hierarchies" ADD CONSTRAINT "product_specific_unit_hierarchies_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_specific_unit_hierarchies" ADD CONSTRAINT "product_specific_unit_hierarchies_parent_unit_id_fkey" FOREIGN KEY ("parent_unit_id") REFERENCES "product_unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_specific_unit_hierarchies" ADD CONSTRAINT "product_specific_unit_hierarchies_child_unit_id_fkey" FOREIGN KEY ("child_unit_id") REFERENCES "product_unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_base_unit_id_fkey" FOREIGN KEY ("base_unit_id") REFERENCES "product_unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "product_unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
