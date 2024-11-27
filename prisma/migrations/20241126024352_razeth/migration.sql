/*
  Warnings:

  - You are about to drop the column `qantity` on the `Stock` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "qantity",
ADD COLUMN     "quantity" INTEGER NOT NULL;
