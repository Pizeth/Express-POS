/*
  Warnings:

  - You are about to drop the `Cashier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Invoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Manufacturer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderLine` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentMethod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductTransaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PromoDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Promotion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Stock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Store` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StoreBranch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Warehouse` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "sex_enum" AS ENUM ('Male', 'Female', 'Bi');

-- CreateEnum
CREATE TYPE "role_enum" AS ENUM ('USER', 'CASHIER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "cashier_type_enum" AS ENUM ('STAFF', 'MANAGER', 'OWNER');

-- DropForeignKey
ALTER TABLE "Cashier" DROP CONSTRAINT "Cashier_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_promotionId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_branchId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_cashierId_fkey";

-- DropForeignKey
ALTER TABLE "OrderLine" DROP CONSTRAINT "OrderLine_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderLine" DROP CONSTRAINT "OrderLine_productId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_payMethodId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_manufacturerId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_productTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_subCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductTransaction" DROP CONSTRAINT "ProductTransaction_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductTransaction" DROP CONSTRAINT "ProductTransaction_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "PromoDetail" DROP CONSTRAINT "PromoDetail_productId_fkey";

-- DropForeignKey
ALTER TABLE "PromoDetail" DROP CONSTRAINT "PromoDetail_promotionId_fkey";

-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_productId_fkey";

-- DropForeignKey
ALTER TABLE "StoreBranch" DROP CONSTRAINT "StoreBranch_storeId_fkey";

-- DropForeignKey
ALTER TABLE "SubCategory" DROP CONSTRAINT "SubCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Warehouse" DROP CONSTRAINT "Warehouse_branchId_fkey";

-- DropTable
DROP TABLE "Cashier";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Invoice";

-- DropTable
DROP TABLE "Manufacturer";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "OrderLine";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "PaymentMethod";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "ProductTransaction";

-- DropTable
DROP TABLE "ProductType";

-- DropTable
DROP TABLE "Profile";

-- DropTable
DROP TABLE "PromoDetail";

-- DropTable
DROP TABLE "Promotion";

-- DropTable
DROP TABLE "Stock";

-- DropTable
DROP TABLE "Store";

-- DropTable
DROP TABLE "StoreBranch";

-- DropTable
DROP TABLE "SubCategory";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "Warehouse";

-- DropEnum
DROP TYPE "CashierType";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "Sex";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" VARCHAR(255),
    "is_ban" BOOLEAN NOT NULL DEFAULT false,
    "enabled_flag" BOOLEAN NOT NULL DEFAULT true,
    "role" "role_enum" NOT NULL DEFAULT 'USER',
    "created_by" INTEGER NOT NULL,
    "creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,
    "last_updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object_version_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "sex" "sex_enum" NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "pob" VARCHAR(50),
    "address" VARCHAR(255),
    "phone" VARCHAR(255),
    "married" BOOLEAN NOT NULL,
    "bio" TEXT,
    "user_id" INTEGER NOT NULL,
    "enabled_flag" BOOLEAN NOT NULL DEFAULT true,
    "hold_flag" VARCHAR(1),
    "created_by" INTEGER NOT NULL,
    "creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,
    "last_updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object_version_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cashiers" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "cashier_number" TEXT NOT NULL,
    "cashier_type" "cashier_type_enum" NOT NULL,
    "description" VARCHAR(255),
    "enabled_flag" BOOLEAN NOT NULL DEFAULT true,
    "hold_flag" VARCHAR(1),
    "created_by" INTEGER NOT NULL,
    "creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,
    "last_updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object_version_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "cashiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "short_name" SERIAL NOT NULL,
    "shortName" VARCHAR(30) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" VARCHAR(255),
    "image" VARCHAR(255),
    "enabled_flag" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,
    "last_updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object_version_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("short_name")
);

-- CreateTable
CREATE TABLE "sub_categories" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "short_name" VARCHAR(30) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "image" VARCHAR(255),
    "enabled_flag" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,
    "last_updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object_version_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "sub_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manufacturers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "image" VARCHAR(255),
    "phone" VARCHAR(255),
    "enabled_flag" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,
    "last_updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object_version_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "manufacturers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "image" VARCHAR(255),
    "enabled_flag" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,
    "last_updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object_version_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "product_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "sub_category_id" INTEGER NOT NULL,
    "manufacturer_id" INTEGER NOT NULL,
    "product_type_id" INTEGER NOT NULL,
    "product_code" VARCHAR(30),
    "name" VARCHAR(200) NOT NULL,
    "short_name" VARCHAR(200) NOT NULL,
    "description" VARCHAR(255),
    "long_description" VARCHAR(500),
    "barcode" VARCHAR(30),
    "quantity" INTEGER NOT NULL,
    "reference_number" VARCHAR(30),
    "image" VARCHAR(255),
    "enabled_flag" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,
    "last_updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object_version_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stocks" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(7,3) NOT NULL,
    "sale_price" DECIMAL(7,3),
    "imported_date" TIMESTAMP(6) NOT NULL,
    "expired_date" TIMESTAMP(6),
    "qr_code" VARCHAR(255) NOT NULL,
    "enabled_flag" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,
    "last_updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object_version_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "stocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_details" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "promotion_id" INTEGER NOT NULL,
    "enabled_flag" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,
    "last_updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object_version_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "promotion_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotions" (
    "id" SERIAL NOT NULL,
    "promo_code" VARCHAR(70) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "enabled_flag" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,
    "last_updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object_version_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_transactions" (
    "id" SERIAL NOT NULL,
    "warehouse_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "trx_number" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "type" VARCHAR(1) NOT NULL,
    "quantity" INTEGER,
    "cancel_flag" VARCHAR(1),
    "canceled_by" INTEGER,
    "cancel_reason" VARCHAR(1000),
    "enabled_flag" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,
    "last_updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object_version_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "product_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouses" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "short_name" VARCHAR(30) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "enabled_flag" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,
    "last_updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object_version_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stores" (
    "id" SERIAL NOT NULL,
    "country_code" VARCHAR(3) NOT NULL,
    "short_name" VARCHAR(30) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" VARCHAR(255),
    "enabled_flag" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,
    "last_updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object_version_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_branches" (
    "id" SERIAL NOT NULL,
    "store_id" INTEGER NOT NULL,
    "short_name" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "parent_id" INTEGER,
    "manager_id" INTEGER,
    "enabled_flag" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,
    "last_updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object_version_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "store_branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "cashier_id" INTEGER NOT NULL,
    "order_type" VARCHAR(1) NOT NULL,
    "order_number" VARCHAR(30) NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL,
    "status" VARCHAR(30) NOT NULL,
    "description" VARCHAR(255),
    "hold_flag" VARCHAR(1),
    "enabled_flag" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,
    "last_updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object_version_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_lines" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "line_num" INTEGER NOT NULL,
    "lineType" VARCHAR(1) NOT NULL,
    "product_id" INTEGER NOT NULL,
    "service_id" INTEGER,
    "price" DECIMAL(7,3),
    "quantity" INTEGER,
    "amount" DECIMAL(7,3),
    "description" VARCHAR(255),
    "cancel_flag" VARCHAR(1),
    "canceled_by" INTEGER,
    "cancel_reason" VARCHAR(1000),
    "enabled_flag" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,
    "last_updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object_version_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "order_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "pay_method_id" INTEGER NOT NULL,
    "invoice_id" INTEGER NOT NULL,
    "payment_type" VARCHAR(1) NOT NULL,
    "payment_number" VARCHAR(30) NOT NULL,
    "description" VARCHAR(255),
    "payment_date" TIMESTAMP(3) NOT NULL,
    "payment_currency" VARCHAR(3) NOT NULL,
    "amount" DECIMAL(7,3) NOT NULL,
    "status" VARCHAR(1) NOT NULL,
    "enabled_flag" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,
    "last_updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object_version_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" SERIAL NOT NULL,
    "sjort_name" VARCHAR(30),
    "method_name" VARCHAR(100) NOT NULL,
    "method_type" VARCHAR(1),
    "description" VARCHAR(255),
    "cash_flag" VARCHAR(1),
    "default_flag" VARCHAR(1),
    "hold_flag" VARCHAR(1),
    "enabled_flag" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,
    "last_updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object_version_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "promotion_id" INTEGER,
    "invoice_number" VARCHAR(30) NOT NULL,
    "description" VARCHAR(255),
    "amount" DECIMAL(7,3) NOT NULL,
    "currency_code" VARCHAR(3) NOT NULL,
    "enabled_flag" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,
    "last_updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object_version_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "cashiers_profile_id_key" ON "cashiers"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "cashiers_cashier_number_key" ON "cashiers"("cashier_number");

-- CreateIndex
CREATE UNIQUE INDEX "categories_shortName_key" ON "categories"("shortName");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sub_categories_short_name_key" ON "sub_categories"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "sub_categories_name_key" ON "sub_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "products_product_code_key" ON "products"("product_code");

-- CreateIndex
CREATE UNIQUE INDEX "products_name_key" ON "products"("name");

-- CreateIndex
CREATE UNIQUE INDEX "products_short_name_key" ON "products"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "products_barcode_key" ON "products"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "products_reference_number_key" ON "products"("reference_number");

-- CreateIndex
CREATE UNIQUE INDEX "product_transactions_trx_number_key" ON "product_transactions"("trx_number");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_short_name_key" ON "warehouses"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_name_key" ON "warehouses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "stores_short_name_key" ON "stores"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "stores_name_key" ON "stores"("name");

-- CreateIndex
CREATE UNIQUE INDEX "store_branches_store_id_key" ON "store_branches"("store_id");

-- CreateIndex
CREATE UNIQUE INDEX "store_branches_short_name_key" ON "store_branches"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "store_branches_name_key" ON "store_branches"("name");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_number_key" ON "invoices"("invoice_number");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cashiers" ADD CONSTRAINT "cashiers_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sub_categories" ADD CONSTRAINT "sub_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("short_name") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_sub_category_id_fkey" FOREIGN KEY ("sub_category_id") REFERENCES "sub_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_manufacturer_id_fkey" FOREIGN KEY ("manufacturer_id") REFERENCES "manufacturers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_product_type_id_fkey" FOREIGN KEY ("product_type_id") REFERENCES "product_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "promotion_details" ADD CONSTRAINT "promotion_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "promotion_details" ADD CONSTRAINT "promotion_details_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_transactions" ADD CONSTRAINT "product_transactions_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_transactions" ADD CONSTRAINT "product_transactions_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "store_branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "store_branches" ADD CONSTRAINT "store_branches_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "store_branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_cashier_id_fkey" FOREIGN KEY ("cashier_id") REFERENCES "cashiers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_lines" ADD CONSTRAINT "order_lines_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_lines" ADD CONSTRAINT "order_lines_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_pay_method_id_fkey" FOREIGN KEY ("pay_method_id") REFERENCES "payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
