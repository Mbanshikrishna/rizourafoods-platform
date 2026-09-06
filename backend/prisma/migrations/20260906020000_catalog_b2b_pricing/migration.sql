ALTER TYPE "PriceTier" ADD VALUE IF NOT EXISTS 'HORECA';

CREATE TABLE "ProductCategory" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ProductCategory_code_key" ON "ProductCategory"("code");
CREATE INDEX "ProductCategory_isActive_name_idx" ON "ProductCategory"("isActive", "name");

ALTER TABLE "Product"
  ADD COLUMN "categoryId" TEXT,
  ADD COLUMN "sku" TEXT,
  ADD COLUMN "brand" TEXT,
  ADD COLUMN "baseUnit" TEXT,
  ADD COLUMN "packSize" DECIMAL(12,2),
  ADD COLUMN "packUnit" TEXT,
  ADD COLUMN "hsnCode" TEXT;
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
CREATE INDEX "Product_categoryId_status_idx" ON "Product"("categoryId", "status");
CREATE INDEX "Product_sku_idx" ON "Product"("sku");
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ProductPrice"
  ADD COLUMN "customerId" TEXT,
  ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "createdById" TEXT,
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
CREATE INDEX "ProductPrice_productId_tier_active_validFrom_idx" ON "ProductPrice"("productId", "tier", "active", "validFrom");
CREATE INDEX "ProductPrice_customerId_productId_active_idx" ON "ProductPrice"("customerId", "productId", "active");
ALTER TABLE "ProductPrice" ADD CONSTRAINT "ProductPrice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductPrice" ADD CONSTRAINT "ProductPrice_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
