-- Extend team authorization for sales, procurement, warehouse, and finance workflows.
ALTER TYPE "UserRole" ADD VALUE 'SALES';
ALTER TYPE "UserRole" ADD VALUE 'PROCUREMENT';
ALTER TYPE "UserRole" ADD VALUE 'WAREHOUSE';
ALTER TYPE "UserRole" ADD VALUE 'FINANCE';
