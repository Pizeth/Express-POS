-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "qantity" INTEGER NOT NULL,
    "expiredDate" TIMESTAMP(6) NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "creationDate" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedBy" INTEGER NOT NULL,
    "lastUpdateDate" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "objectVersionId" INTEGER NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
