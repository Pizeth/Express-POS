-- CreateTable
CREATE TABLE "AuditTrail" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "ip_address" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "AuditTrail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AuditTrailToCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AuditTrailToCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AuditTrailToCategory_B_index" ON "_AuditTrailToCategory"("B");

-- AddForeignKey
ALTER TABLE "AuditTrail" ADD CONSTRAINT "AuditTrail_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuditTrailToCategory" ADD CONSTRAINT "_AuditTrailToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "AuditTrail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuditTrailToCategory" ADD CONSTRAINT "_AuditTrailToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "categories"("short_name") ON DELETE CASCADE ON UPDATE CASCADE;
