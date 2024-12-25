/*
  Warnings:

  - You are about to drop the column `creation_date` on the `cashiers` table. All the data in the column will be lost.
  - You are about to drop the column `creation_date` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `creation_date` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `creation_date` on the `manufacturers` table. All the data in the column will be lost.
  - You are about to drop the column `creation_date` on the `order_lines` table. All the data in the column will be lost.
  - You are about to drop the column `creation_date` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `creation_date` on the `payment_methods` table. All the data in the column will be lost.
  - You are about to drop the column `creation_date` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `creation_date` on the `product_specific_unit_hierarchies` table. All the data in the column will be lost.
  - You are about to drop the column `creation_date` on the `product_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `creation_date` on the `product_types` table. All the data in the column will be lost.
  - You are about to drop the column `creation_date` on the `product_unit` table. All the data in the column will be lost.
  - You are about to drop the column `creation_date` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `creation_date` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `creation_date` on the `promotion_details` table. All the data in the column will be lost.
  - You are about to drop the column `creation_date` on the `promotions` table. All the data in the column will be lost.
  - You are about to drop the column `creation_date` on the `stocks` table. All the data in the column will be lost.
  - You are about to drop the column `creation_date` on the `store_branches` table. All the data in the column will be lost.
  - You are about to drop the column `creation_date` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `creation_date` on the `sub_categories` table. All the data in the column will be lost.
  - You are about to drop the column `creation_date` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `creation_date` on the `warehouses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cashiers" DROP COLUMN "creation_date",
ADD COLUMN     "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "creation_date",
ADD COLUMN     "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "creation_date",
ADD COLUMN     "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "manufacturers" DROP COLUMN "creation_date",
ADD COLUMN     "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "order_lines" DROP COLUMN "creation_date",
ADD COLUMN     "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "creation_date",
ADD COLUMN     "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "payment_methods" DROP COLUMN "creation_date",
ADD COLUMN     "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "creation_date",
ADD COLUMN     "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "product_specific_unit_hierarchies" DROP COLUMN "creation_date",
ADD COLUMN     "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "product_transactions" DROP COLUMN "creation_date",
ADD COLUMN     "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "product_types" DROP COLUMN "creation_date",
ADD COLUMN     "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "product_unit" DROP COLUMN "creation_date",
ADD COLUMN     "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "creation_date",
ADD COLUMN     "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "creation_date",
ADD COLUMN     "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "promotion_details" DROP COLUMN "creation_date",
ADD COLUMN     "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "promotions" DROP COLUMN "creation_date",
ADD COLUMN     "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "stocks" DROP COLUMN "creation_date",
ADD COLUMN     "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "store_branches" DROP COLUMN "creation_date",
ADD COLUMN     "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "stores" DROP COLUMN "creation_date",
ADD COLUMN     "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sub_categories" DROP COLUMN "creation_date",
ADD COLUMN     "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "creation_date",
ADD COLUMN     "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "warehouses" DROP COLUMN "creation_date",
ADD COLUMN     "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;
