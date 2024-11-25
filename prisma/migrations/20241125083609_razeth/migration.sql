/*
  Warnings:

  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `salePrice` on the `Product` table. All the data in the column will be lost.
  - Added the required column `importedDate` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qrCode` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "price",
DROP COLUMN "salePrice";

-- AlterTable
ALTER TABLE "Stock" ADD COLUMN     "importedDate" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "price" DECIMAL(7,3) NOT NULL,
ADD COLUMN     "qrCode" VARCHAR(255) NOT NULL,
ADD COLUMN     "salePrice" DECIMAL(7,3);
