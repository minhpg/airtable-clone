/*
  Warnings:

  - Added the required column `tableId` to the `TableCell` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."TableCell" ADD COLUMN     "tableId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."TableCell" ADD CONSTRAINT "TableCell_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "public"."Table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
