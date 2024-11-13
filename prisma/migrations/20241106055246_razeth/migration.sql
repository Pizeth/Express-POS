-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('Male', 'Female', 'Bi');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'CASHIER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" TEXT NOT NULL,
    "Avatar" VARCHAR(255),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isBan" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "sex" "Sex" NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "pob" VARCHAR(50),
    "address" VARCHAR(255),
    "phone" VARCHAR(255),
    "married" BOOLEAN NOT NULL,
    "bio" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" SERIAL NOT NULL,
    "shortName" VARCHAR(30) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" VARCHAR(255),
    "image" VARCHAR(255),
    "enabledFlag" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdBy" INTEGER NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "lastUpdatedBy" INTEGER NOT NULL,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,
    "objectVersionId" INTEGER NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductSubCategory" (
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

    CONSTRAINT "ProductSubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manufacturer" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "enabledFlag" BOOLEAN NOT NULL DEFAULT true,
    "image" VARCHAR(255),
    "phone" VARCHAR(255),
    "createdBy" INTEGER NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedBy" INTEGER NOT NULL,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,
    "objectVersionId" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "manufacturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductPromoDetail" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "promotionId" INTEGER NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "lastUpdatedBy" INTEGER NOT NULL,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,
    "objectVersionId" INTEGER NOT NULL,

    CONSTRAINT "ProductPromoDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductPromotion" (
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

    CONSTRAINT "ProductPromotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "subCategoryId" INTEGER NOT NULL,
    "manufacturerId" INTEGER NOT NULL,
    "productCode" VARCHAR(30) NOT NULL,
    "productName" VARCHAR(200) NOT NULL,
    "shortDescription" VARCHAR(2000),
    "longDescription" VARCHAR(4000),
    "barCode" VARCHAR(30),
    "referenceNumber" VARCHAR(30),
    "price" DECIMAL(7,3) NOT NULL,
    "currencyCode" VARCHAR(30) NOT NULL,
    "image" VARCHAR(255) NOT NULL,
    "enabledFlag" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" INTEGER NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "lastUpdatedBy" INTEGER NOT NULL,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,
    "objectVersionId" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductTransaction" (
    "id" SERIAL NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "trxNumber" VARCHAR(100) NOT NULL,
    "description" VARCHAR(4000),
    "type" VARCHAR(1) NOT NULL,
    "quantity" INTEGER,
    "cancelFlag" VARCHAR(1),
    "canceledBy" INTEGER,
    "cancelReason" VARCHAR(1000),
    "createdBy" INTEGER NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "lastUpdatedBy" INTEGER NOT NULL,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,
    "objectVersionId" INTEGER NOT NULL,

    CONSTRAINT "ProductTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warehouse" (
    "id" SERIAL NOT NULL,
    "branchId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "shortName" VARCHAR(30) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "enabledFlag" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" INTEGER NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "lastUpdatedBy" INTEGER NOT NULL,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,
    "objectVersionId" INTEGER NOT NULL,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "payMethodId" INTEGER NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "paymentType" VARCHAR(1) NOT NULL,
    "paymentNumber" VARCHAR(30) NOT NULL,
    "description" VARCHAR(4000),
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "paymentCurrency" VARCHAR(3) NOT NULL,
    "amount" DECIMAL(7,3) NOT NULL,
    "status" VARCHAR(1) NOT NULL,
    "enabledFlag" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdBy" VARCHAR(60) NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "lastUpdatedBy" VARCHAR(60) NOT NULL,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,
    "objectVersionId" INTEGER NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "promotionId" INTEGER,
    "invoiceNumber" VARCHAR(30) NOT NULL,
    "description" VARCHAR(4000),
    "amount" DECIMAL(7,3) NOT NULL,
    "currencyCode" VARCHAR(3) NOT NULL,
    "enabledFlag" VARCHAR(1) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdBy" INTEGER NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "lastUpdatedBy" INTEGER NOT NULL,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,
    "objectVersionId" INTEGER NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" SERIAL NOT NULL,
    "shortName" VARCHAR(30),
    "methodName" VARCHAR(100) NOT NULL,
    "methodType" VARCHAR(1),
    "description" VARCHAR(4000),
    "cashFlag" VARCHAR(1),
    "defaultFlag" VARCHAR(1),
    "enabledFlag" VARCHAR(1) NOT NULL,
    "holdFlag" VARCHAR(1),
    "createdBy" INTEGER NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "lastUpdatedBy" INTEGER NOT NULL,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,
    "objectVersionId" INTEGER NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cashier" (
    "id" SERIAL NOT NULL,
    "partyId" INTEGER NOT NULL,
    "cashierNumber" INTEGER,
    "cashierType" VARCHAR(1) NOT NULL,
    "description" VARCHAR(4000),
    "loginUser" VARCHAR(20),
    "loginPassword" VARCHAR(100),
    "enabledFlag" VARCHAR(1) NOT NULL,
    "holdFlag" VARCHAR(1),
    "createdBy" INTEGER NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "lastUpdatedBy" INTEGER NOT NULL,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,
    "objectVersionId" INTEGER NOT NULL,

    CONSTRAINT "Cashier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "branchId" INTEGER NOT NULL,
    "cashierId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "orderType" VARCHAR(1) NOT NULL,
    "orderNumber" VARCHAR(30) NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "status" VARCHAR(30) NOT NULL,
    "description" VARCHAR(2000),
    "enabledFlag" VARCHAR(1) NOT NULL,
    "holdFlag" VARCHAR(1),
    "giftwrapFlag" VARCHAR(1),
    "giftwrapMessage" VARCHAR(2000),
    "createdBy" INTEGER NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "lastUpdatedBy" INTEGER NOT NULL,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,
    "objectVersionId" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderLine" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "lineNum" INTEGER NOT NULL,
    "lineType" VARCHAR(1) NOT NULL,
    "productId" INTEGER NOT NULL,
    "serviceId" INTEGER,
    "price" DECIMAL(7,3),
    "quantity" INTEGER,
    "amount" DECIMAL(7,3),
    "description" VARCHAR(4000),
    "cancelFlag" VARCHAR(1),
    "canceledBy" INTEGER,
    "cancelReason" VARCHAR(1000),
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdBy" INTEGER NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "lastUpdatedBy" INTEGER NOT NULL,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,
    "objectVersionId" INTEGER NOT NULL,

    CONSTRAINT "OrderLine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_shortName_key" ON "ProductCategory"("shortName");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_name_key" ON "ProductCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductSubCategory_shortName_key" ON "ProductSubCategory"("shortName");

-- CreateIndex
CREATE UNIQUE INDEX "ProductSubCategory_name_key" ON "ProductSubCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_productCode_key" ON "Product"("productCode");

-- CreateIndex
CREATE UNIQUE INDEX "Product_productName_key" ON "Product"("productName");

-- CreateIndex
CREATE UNIQUE INDEX "Product_barCode_key" ON "Product"("barCode");

-- CreateIndex
CREATE UNIQUE INDEX "Product_referenceNumber_key" ON "Product"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ProductTransaction_trxNumber_key" ON "ProductTransaction"("trxNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_shortName_key" ON "Warehouse"("shortName");

-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_name_key" ON "Warehouse"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Cashier_cashierNumber_key" ON "Cashier"("cashierNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Cashier_loginUser_key" ON "Cashier"("loginUser");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProductSubCategory" ADD CONSTRAINT "ProductSubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPromoDetail" ADD CONSTRAINT "ProductPromoDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPromoDetail" ADD CONSTRAINT "ProductPromoDetail_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "ProductPromotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "ProductSubCategory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProductTransaction" ADD CONSTRAINT "ProductTransaction_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProductTransaction" ADD CONSTRAINT "ProductTransaction_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_payMethodId_fkey" FOREIGN KEY ("payMethodId") REFERENCES "PaymentMethod"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "ProductPromotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "Cashier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderLine" ADD CONSTRAINT "OrderLine_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderLine" ADD CONSTRAINT "OrderLine_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
