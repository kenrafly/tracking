-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'PENDING_CONFIRMATION';

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "adminNotes" TEXT,
ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "confirmedBy" TEXT,
ADD COLUMN     "requiresConfirmation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "salesRepId" TEXT;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_salesRepId_fkey" FOREIGN KEY ("salesRepId") REFERENCES "sales_representatives"("id") ON DELETE SET NULL ON UPDATE CASCADE;
