-- Backward-compatible CRM foundation: existing business-type values are mapped
-- to the supported domain enum before the column is converted.
CREATE TYPE "BusinessType" AS ENUM ('RESTAURANT', 'HOTEL', 'CAFE', 'CATERER', 'CLOUD_KITCHEN', 'DISTRIBUTOR', 'INSTITUTION', 'RETAILER', 'OTHER');
CREATE TYPE "ContactRole" AS ENUM ('OWNER', 'PROCUREMENT', 'PURCHASE_MANAGER', 'CHEF', 'ACCOUNTS', 'OPERATIONS', 'OTHER');
CREATE TYPE "AddressType" AS ENUM ('BILLING', 'DELIVERY', 'WAREHOUSE', 'OFFICE', 'OTHER');
CREATE TYPE "CrmActivityType" AS ENUM ('CALL', 'WHATSAPP', 'EMAIL', 'MEETING', 'SAMPLE_DISCUSSION', 'PRICE_DISCUSSION', 'FOLLOW_UP', 'NOTE');

ALTER TABLE "BusinessProfile"
  ALTER COLUMN "businessType" TYPE "BusinessType"
  USING (
    CASE lower("businessType")
      WHEN 'restaurant' THEN 'RESTAURANT'
      WHEN 'hotel' THEN 'HOTEL'
      WHEN 'cafe' THEN 'CAFE'
      WHEN 'caterer' THEN 'CATERER'
      WHEN 'cloud kitchen' THEN 'CLOUD_KITCHEN'
      WHEN 'cloud_kitchen' THEN 'CLOUD_KITCHEN'
      WHEN 'distributor' THEN 'DISTRIBUTOR'
      WHEN 'wholesaler' THEN 'DISTRIBUTOR'
      WHEN 'institution' THEN 'INSTITUTION'
      WHEN 'retailer' THEN 'RETAILER'
      ELSE 'OTHER'
    END
  )::"BusinessType";

ALTER TABLE "BusinessProfile"
  ADD COLUMN "tradingName" TEXT,
  ADD COLUMN "registrationNumber" TEXT,
  ADD COLUMN "website" TEXT,
  ADD COLUMN "phone" TEXT,
  ADD COLUMN "email" TEXT,
  ADD COLUMN "currentSupplier" TEXT,
  ADD COLUMN "monthlyRiceConsumption" TEXT,
  ADD COLUMN "monthlyFoodProcurement" TEXT,
  ADD COLUMN "preferredPackSize" TEXT,
  ADD COLUMN "paymentTerms" TEXT,
  ADD COLUMN "deliveryRequirements" TEXT,
  ADD COLUMN "deliveryFrequency" TEXT,
  ADD COLUMN "categoriesOfInterest" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

CREATE UNIQUE INDEX "BusinessProfile_registrationNumber_key" ON "BusinessProfile"("registrationNumber");

ALTER TABLE "Address"
  ADD COLUMN "type" "AddressType" NOT NULL DEFAULT 'DELIVERY',
  ADD COLUMN "phone" TEXT,
  ADD COLUMN "isDefault" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "Address_customerId_isDefault_idx" ON "Address"("customerId", "isDefault");

CREATE TABLE "CustomerContact" (
  "id" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "designation" TEXT,
  "role" "ContactRole" NOT NULL DEFAULT 'OTHER',
  "phone" TEXT,
  "email" TEXT,
  "isPrimary" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CustomerContact_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CrmActivity" (
  "id" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "contactId" TEXT,
  "type" "CrmActivityType" NOT NULL,
  "subject" TEXT NOT NULL,
  "details" TEXT,
  "createdById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CrmActivity_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CustomerContact_customerId_isPrimary_idx" ON "CustomerContact"("customerId", "isPrimary");
CREATE INDEX "CrmActivity_customerId_createdAt_idx" ON "CrmActivity"("customerId", "createdAt");
CREATE INDEX "CrmActivity_contactId_idx" ON "CrmActivity"("contactId");

ALTER TABLE "CustomerContact" ADD CONSTRAINT "CustomerContact_customerId_fkey"
  FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CrmActivity" ADD CONSTRAINT "CrmActivity_customerId_fkey"
  FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CrmActivity" ADD CONSTRAINT "CrmActivity_contactId_fkey"
  FOREIGN KEY ("contactId") REFERENCES "CustomerContact"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CrmActivity" ADD CONSTRAINT "CrmActivity_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
